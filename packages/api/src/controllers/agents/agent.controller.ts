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
import { SupabaseAuthGuard } from '../../supabase/guard';
import { CoreMessage } from '@mastra/core'; // Import CoreMessage

// Define the allowed agent names based on the Mastra configuration
const allowedAgentNames = ['chat', 'search', 'codeAssistant'] as const;
type AgentName = (typeof allowedAgentNames)[number];

interface MessageRequest {
  messages: CoreMessage[]; // Use CoreMessage[] type
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
    @Res({ passthrough: true }) res: Response, // Inject Response for streaming
  ) {
    try {
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
        // This check might be redundant if mastra.getAgent throws, but good for robustness.
        throw new HttpException(
          `Agent ${agentName} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Get or create thread ID for conversation
      let threadId = body.threadId;
      if (!threadId) {
        // Create conversation if no threadId is provided
        threadId = await createConversation(agentName as AgentName, userId);
      }

      // Handle streaming response if requested
      if (body.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Send headers immediately

        try {
          // Stream the response
          const stream = await agent.stream(body.messages, {
            threadId,
            resourceId: userId,
          });

          // Send the thread ID to the client as the first event
          res.write(`data: ${JSON.stringify({ threadId })}\n\n`);

          // Stream each text chunk as it's generated
          for await (const chunk of stream.textStream) {
            if (res.writableEnded) break; // Check if connection is closed
            res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          }

          if (!res.writableEnded) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
        } catch (streamError) {
          console.error('Agent streaming error:', streamError);
          if (!res.writableEnded) {
            // Try to send an error event to the client via SSE
            const errorMessage =
              streamError instanceof Error
                ? streamError.message
                : 'Streaming failed';
            res.write(
              `event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`,
            );
            res.end(); // Close the connection after sending the error
          }
          // Since headers are sent, we can't throw HttpException here.
          // The error is logged, and we attempted to notify the client.
        }
        // Return void for streaming responses handled by res.write/end
        return;
      }

      // Handle non-streaming response
      const response = await agent.generate(body.messages, {
        threadId,
        resourceId: userId,
      });

      return {
        text: response.text,
        threadId, // Return threadId for non-streaming too
      };
    } catch (error) {
      console.error('Agent generation error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to generate response';
      const status =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      // Ensure we throw HttpException for NestJS to handle correctly
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(message, status);
      }
    }
  }

  /**
   * Create a new conversation thread for an agent
   *
   * @param agentName - The name of the agent
   * @param req - The request object containing user information
   * @returns An object containing the new thread ID
   * @throws HttpException if the agent is not found or creation fails
   */
  @UseGuards(SupabaseAuthGuard)
  @Post(':agentName/conversation')
  async createAgentConversation(
    @Param('agentName') agentName: string,
    @Req() req: Request,
  ) {
    try {
      const userId = req.user?.id || 'anonymous';

      // Validate agent name
      if (!allowedAgentNames.includes(agentName as AgentName)) {
        throw new HttpException(
          `Invalid agent name: ${agentName}. Allowed names are: ${allowedAgentNames.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the agent exists (cast is now safe)
      // Although createConversation might implicitly do this, explicit check is clearer.
      const agent = mastra.getAgent(agentName as AgentName);
      if (!agent) {
        throw new HttpException(
          `Agent ${agentName} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Create a new conversation thread
      const threadId = await createConversation(agentName as AgentName, userId);

      return { threadId };
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
      // Ensure we throw HttpException for NestJS to handle correctly
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(message, status);
      }
    }
  }
}
