/**
 * NestJS controller for Mastra agents.
 * Exposes Mastra agents as REST endpoints with proper authentication.
 *
 * @module packages/api/src/controllers/agents
 */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createId } from '@paralleldrive/cuid2';
import { mastra, createConversation } from '../../mastra';
import { SupabaseAuthGuard } from '../../supabase/supabase-auth.guard';

// Define the allowed agent names based on the Mastra configuration
type AgentName = 'chat' | 'search' | 'codeAssistant';
const allowedAgentNames: AgentName[] = ['chat', 'search', 'codeAssistant'];

interface MessageRequest {
  messages: Array<{ role: string; content: string }>;
  threadId?: string;
  stream?: boolean;
}

/**
 * Controller for interacting with Mastra agents
 */
@Controller('agents')
export class AgentController {
  /**
   * Generate a response from a specific agent
   *
   * @param agentName - The name of the agent to use
   * @param body - The message request body
   * @param req - The request object containing user information
   * @param res - The response object for streaming responses
   * @returns The agent's response
   * @throws HttpException if the agent is not found or other errors occur
   */
  @UseGuards(SupabaseAuthGuard)
  @Post(':agentName/generate')
  async generateResponse(
    @Param('agentName') agentName: string,
    @Body() body: MessageRequest,
    @Req() req: Request,
      const userId = req.user?.id || 'anonymous';

      // Validate agent name
      if (!allowedAgentNames.includes(agentName as AgentName)) {
        throw new HttpException(
          `Invalid agent name: ${agentName}. Allowed names are: ${allowedAgentNames.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get the requested agent (cast is now safe)
      const agent = mastra.getAgent(agentName as AgentName);

      if (!agent) {
        // This case might be redundant if mastra.getAgent handles unknown names,
        // but kept for robustness.
        throw new HttpException(
      const agent = mastra.getAgent(agentName);

      if (!agent) {
        throw new HttpException(
          `Agent ${agentName} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Handle streaming response if requested
      if (body.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Get or create thread ID for conversation
        let threadId = body.threadId;
        if (!threadId) {
          threadId = await createConversation(agentName, userId);
        }

        // Stream the response
        const stream = await agent.stream(body.messages, {
          threadId,
          resourceId: userId,
        });

        // Send the thread ID to the client
        res.write(`data: ${JSON.stringify({ threadId })}\n\n`);

        // Stream each text chunk as it's generated
        for await (const chunk of stream.textStream) {
          if (res.closed) break;
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }

      // Handle non-streaming response
      let threadId = body.threadId;
      if (!threadId) {
        threadId = await createConversation(agentName, userId);
      }

      const response = await agent.generate(body.messages, {
        threadId,
        resourceId: userId,
      });

      return {
        text: response.text,
        threadId,
      };
    } catch (error) {
      console.error('Agent generation error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to generate response';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  /**
   * Create a new conversation thread for an agent
      const userId = req.user?.id || 'anonymous';

      // Validate agent name
      if (!allowedAgentNames.includes(agentName as AgentName)) {
        throw new HttpException(
          `Invalid agent name: ${agentName}. Allowed names are: ${allowedAgentNames.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the agent exists (cast is now safe)
      const agent = mastra.getAgent(agentName as AgentName);
      if (!agent) {
        // This case might be redundant if mastra.getAgent handles unknown names,
        // but kept for robustness.
        throw new HttpException(
          `Agent ${agentName} not found`,
  @Post(':agentName/conversation')
  async createAgentConversation(
    @Param('agentName') agentName: string,
    @Req() req: Request,
  ) {
    try {
      // Get user ID from authenticated session
      const userId = req.user?.id || 'anonymous';

      // Check if the agent exists
      const agent = mastra.getAgent(agentName);
      if (!agent) {
        throw new HttpException(
          `Agent ${agentName} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      console.error('Conversation creation error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create conversation';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
      throw new HttpException(
        error.message || 'Failed to create conversation',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
