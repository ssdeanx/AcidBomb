import { Injectable, Inject, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Agent } from '@mastra/core';
import { MASTRA_AGENTS_TOKEN, MASTRA_DATABASE_TOKEN } from '../mastra-core/mastra-core.module';
import { MastraDatabase } from '@repo/api/mastra/services/database';
import { GenerateTextResult, StreamTextResult } from 'ai';

// Define a type for the injected agents object for better type safety
type MastraAgents = { [key: string]: Agent };

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject(MASTRA_AGENTS_TOKEN) private readonly agents: MastraAgents,
    // Inject database service if needed for context enrichment or logging
    @Inject(MASTRA_DATABASE_TOKEN) private readonly mastraDb: MastraDatabase,
  ) {}

  // Helper to get agent instance or throw NotFoundException
  private getAgent(agentName: string): Agent {
    const agent = this.agents[agentName];
    if (!agent) {
      this.logger.error(`Agent '${agentName}' not found in initialized agents.`);
      throw new NotFoundException(`Agent '${agentName}' not found.`);
    }
    this.logger.debug(`Retrieved agent instance for: ${agentName}`);
    return agent;
  }

  // Implement method for single response generation
  async processMessage(
    agentName: string,
    prompt: string,
    threadId?: string,
    resourceId?: string, // Often userId for context/memory/auth
  ): Promise<GenerateTextResult<any, unknown>> {
    const agent = this.getAgent(agentName);
    this.logger.log(`Processing message for agent: ${agentName}, thread: ${threadId}, resource: ${resourceId}`);
    try {
      const result = await agent.generate(prompt, { threadId, resourceId });
      this.logger.log(`Agent ${agentName} generated response successfully.`);
      // Add any post-processing or application-specific DB saving logic here
      return result;
    } catch (error: any) {
      this.logger.error(`Error during agent generation (${agentName}): ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Agent processing failed: ${error.message}`);
    }
  }

  // Implement method for initiating a streaming response
  async streamMessage(
    agentName: string,
    prompt: string,
    threadId?: string,
    resourceId?: string,
  ): Promise<StreamTextResult<any, unknown>> {
    const agent = this.getAgent(agentName);
    this.logger.log(`Initiating stream for agent: ${agentName}, thread: ${threadId}, resource: ${resourceId}`);
    try {
      const streamResult = await agent.stream(prompt, { threadId, resourceId });
      this.logger.log(`Agent ${agentName} stream initiated successfully.`);
      return streamResult;
    } catch (error: any) {
      this.logger.error(`Error initiating agent stream (${agentName}): ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Agent stream initiation failed: ${error.message}`);
    }
  }
}
