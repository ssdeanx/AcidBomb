import { Injectable, Logger } from '@nestjs/common';
import { mastra, agents } from '../index';
import { ragWorkflow } from '../workflows/ragWorkflow';
import { Agent } from '@mastra/core';
import { getEnvVar } from '../../utils/env';
import { mastraDb } from './database';

export interface AgentResponse {
  text: string;
  sources?: Array<{
    title: string;
    url?: string;
    snippet?: string;
  }>;
  metadata?: Record<string, any>;
}

/**
 * Service for interacting with Mastra agents
 */
@Injectable()
export class AgentService {
  [x: string]: any;
  private readonly logger = new Logger(AgentService.name);
  private readonly maxTokenLimit: number;

  constructor() {
    this.maxTokenLimit = parseInt(getEnvVar('MAX_TOKEN_LIMIT', '8000'), 10);
    this.logger.log(
      `AgentService initialized with max token limit: ${this.maxTokenLimit}`,
    );
  }

  /**
   * Get an agent by name
   * @param agentName Name of the agent to retrieve
   * @returns The requested agent or undefined if not found
   */
  getAgent(agentName: string): Agent | undefined {
    if (!agents[agentName]) {
      this.logger.warn(
        `Agent "${agentName}" not found. Available agents: ${Object.keys(agents).join(', ')}`,
      );
      return undefined;
    }
    return agents[agentName];
  }

  /**
   * Generate a response from an agent
   * @param agentName Name of the agent to use
   * @param userId User ID for memory context
   * @param prompt User prompt to process
   * @param sessionId Optional session ID for continuing conversations
   * @returns Generated response
   */
  async generateResponse(
    agentName: string,
    userId: string,
    prompt: string,
    sessionId?: string,
  ): Promise<AgentResponse> {
    try {
      const agent = this.getAgent(agentName);
      if (!agent) {
        throw new Error(`Agent "${agentName}" not found`);
      }

      this.logger.log(
        `Generating response with agent "${agentName}" for user ${userId}`,
      );

      // Generate session ID if not provided
      const conversationId = sessionId || `${userId}-${Date.now()}`;

      // Generate response using agent
      const response = await agent.generate(prompt, {
        maxTokens: this.maxTokenLimit,
        // TODO: Verify how to pass userId and sessionId if needed.
        // The 'metadata' property is not valid here according to AgentGenerateOptions.
      });

      // Store conversation in database
      await mastraDb.storeConversation(userId, agentName, [
        { role: 'user', content: prompt },
        { role: 'assistant', content: response.text },
      ]);

      return {
        text: response.text,
        metadata: {
          // Assuming toolsUsed information is not directly available on the response object
          // based on the type error. Adjust if the structure is different.
          toolsUsed: [],
          sessionId: conversationId,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error generating response with agent "${agentName}": ${errorMessage}`,
      );
      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }

  /**
   * Execute the RAG workflow to answer a query using the document knowledge base
   * @param userId User ID
   * @param query Query to process
   * @param maxResults Maximum number of results to retrieve (default: 5)
   * @returns Workflow execution result
   */
  async executeRagQuery(
    userId: string,
    query: string,
    maxResults: number = 5,
  ): Promise<any> {
    try {
      this.logger.log(`Executing RAG workflow for query: "${query}"`);

      // Execute the workflow
      // TODO: Fix RAG workflow execution - Property 'execute' does not exist on type 'Workflow<any, ZodObject<...>>'.
      // const result = await ragWorkflow.execute({
      //   query,
      //   maxResults,
      //   generateSummary: true,
      //   userId, // Pass the userId for tracing
      // });

      // Placeholder until the workflow execution is fixed
      const result = { message: "RAG workflow execution pending implementation." };

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error executing RAG workflow: ${errorMessage}`);
      throw new Error(`Failed to execute RAG workflow: ${errorMessage}`);
    }
  }
}
