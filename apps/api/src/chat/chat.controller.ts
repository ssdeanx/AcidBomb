import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
  ValidationPipe,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SupabaseAuthGuard } from '@repo/api/supabase/supabase-auth.guard';
import { Observable, from, map, catchError, finalize, switchMap } from 'rxjs';
import { StreamTextResult } from 'ai'; // Import result type from 'ai'

// Define DTO for request body validation
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ChatRequestDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  threadId?: string;
}

// Define a type for the request object after guard adds user
interface RequestWithUser extends Request {
  user: { id: string; [key: string]: any };
}

@Controller('chat')
@UseGuards(SupabaseAuthGuard) // Apply guard to the whole controller
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  // Endpoint for Single Response (Generate)
  @Post(':agentName')
  @HttpCode(HttpStatus.OK)
  async handleChatMessage(
    @Param('agentName') agentName: string,
    @Body(new ValidationPipe()) body: ChatRequestDto,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const userId = req.user.id;
    this.logger.log(`POST /chat/${agentName} from user ${userId}`);
    const result = await this.chatService.processMessage(
      agentName,
      body.prompt,
      body.threadId,
      userId, // resourceId
    );
    return result;
  }

  // Endpoint for Streaming Response (Stream via SSE)
  @Sse('stream/:agentName')
  handleChatStream(
    @Param('agentName') agentName: string,
    @Query('prompt') prompt: string,
    @Query('threadId') threadId: string | undefined,
    @Req() req: RequestWithUser,
  ): Observable<MessageEvent> {
    const userId = req.user.id;
    this.logger.log(`SSE /chat/stream/${agentName} from user ${userId}`);

    // Validate that prompt is provided
    if (!prompt) {
      this.logger.warn('SSE request missing prompt query parameter');
      return from([{ data: JSON.stringify({ error: 'Prompt is required' }) }]);
    }

    return this.createSseObservable(agentName, prompt, threadId, userId);
  }

  // Helper function to create the SSE Observable
  private createSseObservable(
    agentName: string,
    prompt: string,
    threadId: string | undefined,
    userId: string
  ): Observable<MessageEvent> {
    return from(this.chatService.streamMessage(
      agentName,
      prompt,
      threadId,
      userId,
    )).pipe(
      // Convert the StreamTextResult to an Observable of stream items
      switchMap((streamResult: StreamTextResult<any, unknown>) => {
        this.logger.debug(`Agent ${agentName} stream acquired, processing iterator...`);
        return from(streamResult.textStream); // RxJS 'from' can handle async iterators
      }),
      // Map each delta to an SSE MessageEvent
      map((delta: any): MessageEvent => {
        return { data: JSON.stringify(delta) };
      }),
      catchError((err) => {
        this.logger.error(`Error during SSE stream pipeline for ${agentName}: ${err.message}`, err.stack);
        const errorEvent: MessageEvent = {
          data: JSON.stringify({ error: `Streaming error: ${err.message}` }),
          type: 'error',
        };
        return from([errorEvent]);
      }),
      finalize(() => {
        this.logger.log(`SSE stream completed for agent ${agentName}, user ${userId}.`);
      })
    );
  }
}
