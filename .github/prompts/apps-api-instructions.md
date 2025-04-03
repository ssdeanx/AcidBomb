# GitHub Copilot Instructions: Implement Mastra Backend API (`apps/api`) - v2.1 (Detailed + Troubleshooting)

**ID:** BACKEND_IMPL_V2.1

## ⭐ Copilot Guidance: Your Role & Core Directives ⭐

* **Your Role:** Senior TypeScript/NestJS Engineer tasked with building the API layer in `apps/api` that exposes the Mastra AI functionality defined in the shared `packages/api` library. #NestJS #TypeScript #Backend
* **Primary Goal:** Create NestJS Modules, Services, and Controllers within the `apps/api` project to handle chat requests (both single response and streaming via SSE), authenticate users, and interact with the pre-defined Mastra agents and services located in `packages/api`. #Mastra #API #Integration
* **Core Directives:**
  * **Consume Shared Logic:** Import and **strictly use** agents, services (`MastraDatabase`, `EmbeddingStoreService`, etc.), tools, DTOs, entities, and the `SupabaseAuthGuard` from the `packages/api` library. **DO NOT** duplicate logic here. Use correct import paths (e.g., `@repo/api/...`). #Monorepo #CodeReuse
  * **Implement in `apps/api`:** All new NestJS components (Modules, Services, Controllers) belong within the `apps/api` source directory (e.g., `apps/api/src/`). #ProjectStructure
  * **NestJS Best Practices:** Employ Dependency Injection (DI), Modules (`@Module`), Services (`@Injectable`), Controllers (`@Controller`), Guards (`@UseGuards`), Pipes (`ValidationPipe`), Filters (`ExceptionFilter`) consistently. #NestJS #BestPractices #DI
  * **Mastra Agent Initialization:** Ensure agents from `packages/api` are initialized **once** during `apps/api` startup and made injectable via dedicated providers. #Mastra #Initialization #DI
  * **Authentication:** Protect **all** chat interaction endpoints using the imported `SupabaseAuthGuard`. Access user info via the `@Req()` object within protected routes. #Authentication #Security #Supabase
  * **API Endpoints:**
    * Implement a `POST /chat/:agentName` endpoint for single agent responses (using `agent.generate`). #API #REST #Mastra
    * Implement a `GET /chat/stream/:agentName` endpoint using Server-Sent Events (SSE) for streaming responses (using `agent.stream`). #API #Streaming #SSE #Mastra
  * **Error Handling:** Implement a NestJS Global Exception Filter to catch errors (especially `ServiceError` from `packages/api`) and map them to appropriate `HttpException` responses with structured details. #ErrorHandling #Resilience
  * **Streaming:** Use NestJS `@Sse()` decorator and RxJS observables to handle the async iterator from `agent.stream()` and format data as SSE `MessageEvent`s. Handle stream errors and completion gracefully. #Streaming #SSE #RxJS
  * **Configuration:** Assume `apps/api` has access to all necessary environment variables via `process.env`. Use `@nestjs/config` if more advanced config management is needed later. #Configuration #Environment
  * **Type Safety:** Use TypeScript rigorously, leveraging types imported from `@repo/api`, `@mastra/core`, NestJS, etc. Avoid `any` where possible. #TypeScript #TypeSafety
  * **Validation:** Use `class-validator` DTOs and the global `ValidationPipe` for robust request input validation. #Validation #Security
  * **Logging:** Implement detailed logging using `@nestjs/common` `Logger` within services, controllers, modules, and filters for better traceability. #Logging #Debugging

## Project Context Recap

* **Runnable Backend:** `apps/api` (NestJS) #NestJS
* **Shared Logic Library:** `packages/api` (Mastra agents, services, tools, guard, types) #Monorepo #Mastra
* **Frontend Target:** `apps/web` using `useAgent` hook calling endpoints defined here. #Frontend

---

## Implementation Steps (`apps/api`)

**Objective:** Build the NestJS API layer that connects HTTP requests to the Mastra logic from `packages/api`.

**Step 1: Verify Environment Variables** `#Configuration` `#Setup`

* **ID:** BACKEND_IMPL_V2.1_STEP1
* **Context:** `packages/api` services and agents rely heavily on environment variables (Supabase, Gemini, Pinecone, Redis, LangSmith keys/URLs). The `apps/api` runtime needs access to these.
* **Action:** Manually verify that the `.env` file used when running `apps/api` (or the deployment environment variables) contains **all** required variables as defined in the root `.env.example`. Missing variables will cause runtime failures, likely during initialization or service calls.
* **COPILOT:** Remind the developer to perform this manual check. No code generation needed for this step.

**Step 2: Create Core Mastra Provider Module (`apps/api/src/mastra-core/mastra-core.module.ts`)** `#DI` `#Initialization` `#Mastra` `#Module`

* **ID:** BACKEND_IMPL_V2.1_STEP2
* **Goal:** Centralize Mastra agent initialization and provide injectable instances of agents and core services (like `MastraDatabase`, `EmbeddingStoreService`) using NestJS Dependency Injection. This ensures components are initialized correctly and only once.
* **Action:**
  * Create directory `apps/api/src/mastra-core`.
  * Create file `apps/api/src/mastra-core/mastra-core.module.ts`.
  * Define `MastraCoreModule` using `@Module` and mark it `@Global()` for app-wide provider availability.
  * Define unique, exported string constants for **Injection Tokens** (e.g., `MASTRA_AGENTS_TOKEN`).
  * Implement **factory providers** (`useFactory`) for each component needing initialization or dependencies (agents, database service, embedding service).
    * The agent factory should `async` call `initializeAgents` from `packages/api` and return the populated agent object reference. Handle initialization errors robustly (log and throw).
    * The database/embedding service factories should instantiate the respective classes from `packages/api`. Handle their initialization (like `initializeGlobalEmbeddingStore`) within the factory. Inject dependencies between factories if needed (e.g., embedding service into database service factory).
  * Use NestJS `Logger` within factories for traceability.
  * Export the Injection Tokens from the module.
  * Implement `OnModuleInit` in the module to log confirmation or perform post-init checks. Inject the providers into the module's constructor to ensure the factories execute during NestJS bootstrap.
* **COPILOT:** Generate `MastraCoreModule` with `@Global()`, define and export injection tokens, implement factory providers for `MASTRA_AGENTS_TOKEN`, `MASTRA_DATABASE_TOKEN`, `EMBEDDING_STORE_SERVICE_TOKEN` using the logic from `packages/api`. Include logging and error handling in factories. Implement `OnModuleInit`.

```typescript
// apps/api/src/mastra-core/mastra-core.module.ts
import { Module, Global, OnModuleInit, Inject, Logger } from '@nestjs/common';

// COPILOT: Import necessary components from the shared 'packages/api'
import { initializeAgents, agents as mastraAgentsObjectRef } from '@repo/api/mastra/agents'; // Adjust path
import { Agent } from '@mastra/core'; // For typing
import { MastraDatabase } from '@repo/api/mastra/services/database'; // Adjust path
import { EmbeddingStoreService, initializeGlobalEmbeddingStore } from '@repo/api/mastra/services/store-embeddings'; // Adjust path
// COPILOT: Import model, memory, tools if initializeAgents needs them explicitly passed
// Example: import { model } from '@repo/api/mastra';

// COPILOT: Define unique Injection Tokens
export const MASTRA_AGENTS_TOKEN = 'MASTRA_AGENTS';
export const MASTRA_DATABASE_TOKEN = 'MASTRA_DATABASE';
export const EMBEDDING_STORE_SERVICE_TOKEN = 'EMBEDDING_STORE_SERVICE';

@Global() // Make these providers available globally in the NestJS app
@Module({
  providers: [
    // --- Provider for Mastra Agents ---
    {
      provide: MASTRA_AGENTS_TOKEN,
      useFactory: async (/* Inject dependencies for init if needed */) => {
        Logger.log('Factory: Initializing Mastra Agents...', 'MastraCoreModule');
        // Fetch/initialize dependencies for initializeAgents if required
        // const model = ...; const memory = ...; const tools = ...;
        try {
          // COPILOT: Call the initialization function from packages/api
          await initializeAgents(/* model, memory, tools */); // Pass dependencies if needed
          Logger.log(`Factory: Mastra Agents Initialized. Available: ${Object.keys(mastraAgentsObjectRef).join(', ')}`, 'MastraCoreModule');
          return mastraAgentsObjectRef; // Return the initialized object reference
        } catch (error) {
          Logger.error('Factory: Failed to initialize Mastra Agents', error, 'MastraCoreModule');
          throw new Error('Mastra Agent initialization failed'); // Prevent app start on failure
        }
      },
      // inject: [/* List injected dependencies here */],
    },

    // --- Provider for MastraDatabase Service ---
    {
      provide: MASTRA_DATABASE_TOKEN,
      useFactory: async (embeddingService: EmbeddingStoreService) => {
        Logger.log('Factory: Creating MastraDatabase instance...', 'MastraCoreModule');
        const dbInstance = new MastraDatabase();
        // COPILOT: Example - If MastraDatabase needs the embedding model, initialize it here
        // It depends on how you've structured embedding model creation/injection
        // Example: Assuming embeddingService has a way to get the model, or you inject the model provider separately
        // const embeddingModel = embeddingService.getEmbeddingModel(); // Hypothetical method
        // if (embeddingModel) {
        //   dbInstance.initEmbeddingService(embeddingModel);
        // } else {
        //   Logger.warn('Embedding model not available for MastraDatabase init', 'MastraCoreModule');
        // }
        return dbInstance;
      },
      inject: [EMBEDDING_STORE_SERVICE_TOKEN], // Inject EmbeddingStoreService if needed for init
    },

    // --- Provider for EmbeddingStoreService ---
    {
       provide: EMBEDDING_STORE_SERVICE_TOKEN,
       useFactory: async () => {
         Logger.log('Factory: Initializing global EmbeddingStoreService...', 'MastraCoreModule');
         // This uses the singleton pattern from the store-embeddings file
         const service = await initializeGlobalEmbeddingStore();
         // COPILOT: Configure the embedding model here if not done elsewhere
         // service.setEmbeddingModel(...)
         Logger.log('Factory: EmbeddingStoreService Initialized.', 'MastraCoreModule');
         return service;
       },
    },
  ],
  exports: [
    MASTRA_AGENTS_TOKEN,
    MASTRA_DATABASE_TOKEN,
    EMBEDDING_STORE_SERVICE_TOKEN,
  ], // Export tokens for injection in other modules
})
export class MastraCoreModule implements OnModuleInit {
  // Inject providers to ensure factories run during bootstrap
  constructor(
    @Inject(MASTRA_AGENTS_TOKEN) private agents: any,
    @Inject(MASTRA_DATABASE_TOKEN) private mastraDb: MastraDatabase,
    @Inject(EMBEDDING_STORE_SERVICE_TOKEN) private embeddingService: EmbeddingStoreService,
  ) {}

  onModuleInit() {
    Logger.log('MastraCoreModule Initialized - Providers should be ready.', 'MastraCoreModule');
    // Optional: Perform further async setup if needed after injection
  }
}
```

* [ ] **Developer Check:** Verify generated import paths from `@repo/api` are correct. Confirm dependencies passed to `initializeAgents` if required.

**Step 3: Create Chat Service (`apps/api/src/chat/chat.service.ts`)** `#Service` `#Mastra` `#BusinessLogic`

* **ID:** BACKEND_IMPL_V2.1_STEP3
* **Goal:** Encapsulate the core logic for handling chat requests, interacting with the correct Mastra agent instance obtained via DI.
* **Action:**
  * Create directory `apps/api/src/chat`.
  * Create file `apps/api/src/chat/chat.service.ts`.
  * Define `ChatService` using `@Injectable()`.
  * Inject the initialized agents using `@Inject(MASTRA_AGENTS_TOKEN)` and type the injected property (e.g., `private readonly agents: MastraAgents`).
  * Optionally inject `MastraDatabase` using `@Inject(MASTRA_DATABASE_TOKEN)` if needed for logging or context enrichment.
  * Implement a private `getAgent(agentName: string): Agent` helper method that retrieves the agent from the injected object or throws a `NotFoundException` if not found (include good logging).
  * Implement `async processMessage(...)` method: Takes `agentName`, `prompt`, `threadId?`, `resourceId?`. Calls `this.getAgent()`. Calls `agent.generate()`. Includes `try...catch` block with detailed logging and throws `InternalServerErrorException` on failure.
  * Implement `async streamMessage(...)` method: Takes similar arguments. Calls `this.getAgent()`. Calls `agent.stream()`. Returns the `StreamTextResult` containing the async iterator. Includes `try...catch` for initiation errors.
* **COPILOT:** Generate the `ChatService` class, inject dependencies using the defined tokens, implement `getAgent`, `processMessage`, and `streamMessage` methods with detailed logging and try/catch blocks.

```typescript
// apps/api/src/chat/chat.service.ts
import { Injectable, Inject, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Agent, GenerateTextResult, StreamTextResult } from '@mastra/core'; // Assuming types
import { MASTRA_AGENTS_TOKEN, MASTRA_DATABASE_TOKEN } from '../mastra-core/mastra-core.module'; // Use tokens
import { MastraDatabase } from '@repo/api/mastra/services/database'; // Adjust path

// COPILOT: Define a type for the injected agents object for better type safety
type MastraAgents = { [key: string]: Agent };

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    // COPILOT: Inject agents using the token
    @Inject(MASTRA_AGENTS_TOKEN) private readonly agents: MastraAgents,
    // COPILOT: Inject database service using the token (optional, if needed)
    // @Inject(MASTRA_DATABASE_TOKEN) private readonly mastraDb: MastraDatabase,
  ) {}

  // COPILOT: Helper to get agent instance or throw NotFoundException
  private getAgent(agentName: string): Agent {
    const agent = this.agents[agentName];
    if (!agent) {
      this.logger.error(`Agent '${agentName}' not found in initialized agents.`);
      throw new NotFoundException(`Agent '${agentName}' not found.`);
    }
    this.logger.debug(`Retrieved agent instance for: ${agentName}`);
    return agent;
  }

  // COPILOT: Implement method for single response generation
  async processMessage(
    agentName: string,
    prompt: string,
    threadId?: string,
    resourceId?: string, // Often userId for context/memory/auth
  ): Promise<GenerateTextResult> { // Or a more specific return type if needed
    const agent = this.getAgent(agentName);
    this.logger.log(`Processing message for agent: ${agentName}, thread: ${threadId}, resource: ${resourceId}`);
    try {
      const result = await agent.generate(prompt, { threadId, resourceId });
      this.logger.log(`Agent ${agentName} generated response successfully.`);
      // Add any post-processing or application-specific DB saving logic here
      // e.g., await this.mastraDb.logInteraction(...)
      return result;
    } catch (error: any) {
      this.logger.error(`Error during agent generation (${agentName}): ${error.message}`, error.stack);
      // COPILOT: Add more specific error handling if needed (e.g., catch ServiceError)
      throw new InternalServerErrorException(`Agent processing failed: ${error.message}`);
    }
  }

  // COPILOT: Implement method for initiating a streaming response
  async streamMessage(
    agentName: string,
    prompt: string,
    threadId?: string,
    resourceId?: string,
  ): Promise<StreamTextResult> { // Return the object containing the stream iterator
    const agent = this.getAgent(agentName);
    this.logger.log(`Initiating stream for agent: ${agentName}, thread: ${threadId}, resource: ${resourceId}`);
    try {
      const streamResult = await agent.stream(prompt, { threadId, resourceId });
      this.logger.log(`Agent ${agentName} stream initiated successfully.`);
      // No post-processing here, the controller handles the stream
      return streamResult;
    } catch (error: any) {
      this.logger.error(`Error initiating agent stream (${agentName}): ${error.message}`, error.stack);
       // COPILOT: Add more specific error handling
      throw new InternalServerErrorException(`Agent stream initiation failed: ${error.message}`);
    }
  }
}
```

* [ ] **Developer Check:** Verify method signatures match expected inputs. Confirm `getAgent` correctly handles missing agents.

**Step 4: Create Chat Controller (`apps/api/src/chat/chat.controller.ts`)** `#Controller` `#API` `#REST` `#SSE` `#Authentication` `#Validation`

* **ID:** BACKEND_IMPL_V2.1_STEP4
* **Goal:** Define the HTTP endpoints, apply authentication and validation, handle request/response flow, and delegate core logic to `ChatService`. Implement both standard JSON and SSE streaming endpoints.
* **Action:**
  * Create file `apps/api/src/chat/chat.controller.ts`.
  * Define `ChatController` using `@Controller('chat')`.
  * Apply the `SupabaseAuthGuard` globally to the controller using `@UseGuards(SupabaseAuthGuard)`. Import the guard from `@repo/api`.
  * Inject the `ChatService`.
  * Define a DTO class (`ChatRequestDto`) using `class-validator` decorators for the POST request body (`prompt`, optional `threadId`).
  * Implement the `POST /:agentName` endpoint:
    * Use `@Post(':agentName')`, `@HttpCode(HttpStatus.OK)`.
    * Use `@Param('agentName')`.
    * Use `@Body(new ValidationPipe()) body: ChatRequestDto` to enforce validation.
    * Use `@Req() req: RequestWithUser` to access the user object populated by the guard. Extract `userId`.
    * Call `chatService.processMessage`, passing parameters including `userId` as `resourceId`.
    * Format the `GenerateTextResult` before returning (e.g., omit raw response).
  * Implement the `GET /stream/:agentName` endpoint:
    * Use `@Sse('stream/:agentName')`. (SSE typically uses GET).
    * Use `@Param('agentName')`.
    * Use `@Query()` decorator to get `prompt` and optional `threadId`. Add validation check for required `prompt`.
    * Use `@Req()` for the user object. Extract `userId`.
    * Call `chatService.streamMessage`.
    * Implement the RxJS pipeline:
      * `from(serviceCall)`: Start the observable from the promise returned by the service.
      * `switchMap((streamResult: StreamTextResult) => from(streamResult.stream))`: Get the async iterator and convert it into an observable stream of deltas.
      * `map((delta: any): MessageEvent => ({ data: JSON.stringify(delta) }))`: Format each delta as an SSE `MessageEvent`.
      * `catchError((err) => ...)`: Catch errors *within* the stream pipeline. Log the error and return an observable emitting a single SSE error event (`{ data: JSON.stringify({ error: ... }), type: 'error' }`).
      * `finalize(() => ...)`: Log when the stream completes or errors.
  * Include detailed logging (`this.logger`) for request handling and stream events.
* **COPILOT:** Generate the `ChatController`, including the DTO, `SupabaseAuthGuard` usage, POST endpoint implementation, and the SSE endpoint implementation with the correct RxJS pipeline for handling the async iterator and errors.

```typescript
// apps/api/src/chat/chat.controller.ts
import {
  Controller, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus, Sse,
  MessageEvent, Logger, Query, Get, // Added Get and Query for potential SSE via GET
  ValidationPipe // For DTO validation
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SupabaseAuthGuard } from '@repo/api/supabase'; // Adjust path
import { Observable, from, map, catchError, throwError, switchMap, mergeMap, finalize } from 'rxjs';
import { StreamTextResult } from '@mastra/core'; // Assuming type

// COPILOT: Define a simple DTO for request body validation
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
export class ChatRequestDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  threadId?: string;

  // Add other fields like attachments if needed
}

// Define a type for the request object after guard adds user
interface RequestWithUser extends Request {
  user: { id: string; [key: string]: any }; // Adjust based on your guard's user object
}

@Controller('chat')
@UseGuards(SupabaseAuthGuard) // Apply guard to the whole controller
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  // --- Endpoint for Single Response (Generate) ---
  @Post(':agentName')
  @HttpCode(HttpStatus.OK)
  async handleChatMessage(
    @Param('agentName') agentName: string,
    @Body(new ValidationPipe()) body: ChatRequestDto, // Use DTO with validation
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
    return result; // Consider filtering sensitive data before returning
  }

  // --- Endpoint for Streaming Response (Stream via SSE) ---
  // Option 1: Using GET with Query Parameters (more conventional for SSE)
  @Sse('stream/:agentName') // Defines SSE endpoint
  handleChatStreamGet(
    @Param('agentName') agentName: string,
    @Query('prompt') prompt: string, // Get params from query
    @Query('threadId') threadId: string | undefined,
    @Req() req: RequestWithUser,
  ): Observable<MessageEvent> {
     const userId = req.user.id;
     this.logger.log(`SSE /chat/stream/${agentName} from user ${userId}`);
     if (!prompt) {
       // Handle missing prompt for GET request
       this.logger.warn('SSE request missing prompt query parameter');
       // Immediately complete the observable or throw an error event
       return from([{ data: JSON.stringify({ event: 'error', data: 'Prompt is required' }) }]);
     }
     return this.createSseObservable(agentName, prompt, threadId, userId);
  }

  // Option 2: Using POST with Body (if complex input needed)
  // @Post('stream/:agentName') // Use Post decorator
  // @Sse() // Apply Sse decorator here too
  // handleChatStreamPost(
  //   @Param('agentName') agentName: string,
  //   @Body(new ValidationPipe()) body: ChatRequestDto,
  //   @Req() req: RequestWithUser,
  // ): Observable<MessageEvent> {
  //    const userId = req.user.id;
  //    this.logger.log(`SSE POST /chat/stream/${agentName} from user ${userId}`);
  //    return this.createSseObservable(agentName, body.prompt, body.threadId, userId);
  // }

  // --- Helper function to create the SSE Observable ---
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
      userId, // resourceId
    )).pipe(
      // streamResult is the object containing the async iterator
      switchMap((streamResult: StreamTextResult) => {
        this.logger.debug(`Agent ${agentName} stream acquired, processing iterator...`);
        // Create an Observable FROM the async iterator
        return from(streamResult.stream); // RxJS 'from' can handle async iterators
      }),
      // Map each yielded delta from the iterator to an SSE MessageEvent
      map((delta: any): MessageEvent => { // Use 'any' or the specific delta type from Mastra/AI SDK
        // COPILOT: Format the delta based on what the frontend expects.
        // Simple approach: send the whole delta object as JSON data.
        return { data: JSON.stringify(delta) };
        // Example of sending specific types:
        // if (delta.type === 'text-delta') return { data: delta.textDelta, event: 'text' };
        // if (delta.type === 'tool-call') return { data: JSON.stringify(delta), event: 'tool_call' };
        // return { data: JSON.stringify(delta) }; // Fallback
      }),
      catchError((err) => {
        this.logger.error(`Error during SSE stream pipeline for ${agentName}: ${err.message}`, err.stack);
        // Send an error event to the client
        const errorEvent: MessageEvent = {
          data: JSON.stringify({ error: `Streaming error: ${err.message}` }),
          type: 'error', // Standard SSE error event type
        };
        // Emit the error event then complete the observable to close connection
        // return of(errorEvent); // 'of' creates an observable that emits the value then completes
        // Alternatively, rethrow to be caught by a global filter, but that might terminate the connection abruptly.
        // Sending an error event is often preferred for SSE.
        return from([errorEvent]); // Emit error event and complete
      }),
      // Optional: Log when the stream completes
      finalize(() => {
        this.logger.log(`SSE stream completed for agent ${agentName}, user ${userId}.`);
      })
    );
  }
}
```

* [ ] **Developer Check:** Verify route paths and HTTP methods. Confirm guard application. Check DTO validation setup. Review RxJS pipeline logic for correctness, especially error handling and async iterator conversion (`switchMap(from(...))`).

**Step 5: Implement Global Exception Filter (`apps/api/src/common/filters/http-exception.filter.ts`)** `#ErrorHandling` `#Filter` `#Resilience`

* **ID:** BACKEND_IMPL_V2.1_STEP5
* **Goal:** Create a global filter to catch all unhandled exceptions, ensuring consistent, structured error responses for the API.
* **Action:**
  * Create directory `apps/api/src/common/filters` if it doesn't exist.
  * Create/Update file `apps/api/src/common/filters/http-exception.filter.ts`.
  * Define `GlobalHttpExceptionFilter` implementing `ExceptionFilter` and using `@Catch()`.
  * Inject `HttpAdapterHost`.
  * Implement the `catch` method:
    * Get HTTP context, request, response objects.
    * Check exception type: `HttpException`, `ServiceError` (use helper `isServiceError` or check `error.name`), generic `Error`.
    * Determine appropriate `HttpStatus` (use helper `mapActionCodeToHttpStatus` for `ServiceError`).
    * Extract/construct error message and an `errorCode` string.
    * Log the error details using NestJS `Logger`.
    * Construct a standardized JSON `responseBody` (`statusCode`, `timestamp`, `path`, `errorCode`, `message`).
    * Use `httpAdapter.reply()` to send the response, checking `response.headersSent` first.
  * Register the filter globally in `apps/api/src/main.ts` using `app.useGlobalFilters()`.
  * Ensure the global `ValidationPipe` is also registered in `main.ts`.
* **COPILOT:** Generate/update the `GlobalHttpExceptionFilter` class with type checking, status mapping, logging, and standard response format. Show registration in `main.ts` along with `ValidationPipe`.

```typescript

// apps/api/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// COPILOT: Import your custom ServiceError and ActionErrorCode if defined in packages/api
// Assuming ServiceError has a 'code' property corresponding to ActionErrorCode
// import { ServiceError, ActionErrorCode } from '@repo/api/path/to/types'; // Adjust path

// Helper to check if an object is like our ServiceError (if direct import isn't feasible)
function isServiceError(error: any): error is { message: string; code: string; name: string } {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error && error.name === 'ServiceError';
}

// Helper to map your ActionErrorCode (string) to HttpStatus (number)
function mapActionCodeToHttpStatus(code: string /* ActionErrorCode */): HttpStatus {
  switch (code /* as ActionErrorCode */) {
    case 'AUTH_UNAUTHORIZED': return HttpStatus.UNAUTHORIZED;
    case 'AUTH_FORBIDDEN': return HttpStatus.FORBIDDEN;
    case 'VALIDATION_ERROR': return HttpStatus.BAD_REQUEST;
    case 'DB_NOT_FOUND': return HttpStatus.NOT_FOUND;
    case 'DB_CONFLICT': return HttpStatus.CONFLICT;
    case 'LLM_RATE_LIMIT': return HttpStatus.TOO_MANY_REQUESTS;
    case 'SERVICE_UNAVAILABLE': return HttpStatus.SERVICE_UNAVAILABLE;
    // Add mappings for other ActionErrorCodes
    case 'DB_ERROR':
    case 'AGENT_EXECUTION_FAILED':
    case 'AGENT_TOOL_FAILED':
    case 'LLM_ERROR':
    case 'TOOL_NETWORK_ERROR':
    case 'TOOL_INPUT_ERROR':
    case 'DB_PRISMA_UNKNOWN':
    case 'UNKNOWN_ERROR':
    default: return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}


@Catch() // Catch all exceptions
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse(); // Don't type response for flexibility

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'UNKNOWN_ERROR'; // Default error code

    if (exception instanceof HttpException) {
      // Handle standard NestJS HTTP exceptions
      status = exception.getStatus();
      const responsePayload = exception.getResponse();
      message = typeof responsePayload === 'string' ? responsePayload : (responsePayload as any)?.message || 'Http Exception';
      code = exception.constructor.name; // Or a custom code if available
      this.logger.warn(`HttpException caught: ${status} ${message}`, exception.stack);
    } else if (isServiceError(exception)) {
      // Handle custom ServiceError from shared package/services
      status = mapActionCodeToHttpStatus(exception.code);
      message = exception.message;
      code = exception.code;
      this.logger.error(`ServiceError caught: ${status} [${code}] ${message}`, (exception as any).stack);
    } else if (exception instanceof Error) {
      // Handle generic JavaScript errors
      message = exception.message;
      code = exception.name || 'Error';
      this.logger.error(`Generic Error caught: ${status} [${code}] ${message}`, exception.stack);
    } else {
       // Handle non-Error exceptions
       this.logger.error(`Unknown exception caught:`, exception);
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      errorCode: code, // Include our mapped or derived error code
      message: message,
    };

    // Ensure response is sent only once
     if (!response.headersSent) {
       httpAdapter.reply(response, responseBody, status);
     } else {
        this.logger.warn('Response headers already sent, cannot send error response.');
     }
  }
}

// --- Register the filter globally in main.ts ---

// apps/api/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost); // Get adapter host

  // COPILOT: Add this line to register the global filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter(httpAdapterHost));

  // Enable validation pipe globally (if not already done)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS if needed for frontend
  app.enableCors(); // Configure origins appropriately for production

  await app.listen(process.env.PORT || 3000); // Use PORT from env if available
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
```

* [ ] **Developer Check:** Verify error type checking logic (`isServiceError`). Ensure `HttpStatus` mapping covers relevant error codes. Confirm filter and pipe registration in `main.ts`.

**Step 6: Update Main AppModule (`apps/api/src/app.module.ts`)** `#Module` `#Configuration`

* **ID:** BACKEND_IMPL_V2.1_STEP6
* **Goal:** Ensure the `ChatModule` and `MastraCoreModule` are imported into the root module so NestJS recognizes them.
* **Action:**
  * Open `apps/api/src/app.module.ts`.
  * Add `ChatModule` to the `imports` array.
  * Add `MastraCoreModule` to the `imports` array.
* **COPILOT:** Modify the `AppModule` imports list.

Step 7: Update AppModule (apps/api/src/app.module.ts)

Goal: Ensure the new ChatModule and the MastraCoreModule (or wherever providers are defined) are imported.

Action:

Add ChatModule to the imports array in AppModule.

Add MastraCoreModule to the imports array if you created it in Step 2.

COPILOT: Modify the AppModule imports to include ChatModule and MastraCoreModule.

```typescript

// apps/api/src/app.module.ts
import { Module /* ... other imports ... */ } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MastraCoreModule } from './mastra-core/mastra-core.module'; // Import the core module
import { ChatModule } from './chat/chat.module'; // Import the chat module
// Import other modules like LinksModule if still needed
// import { LinksModule } from './links/links.module';

@Module({
  imports: [
      MastraCoreModule, // Ensure Mastra components are provided globally
      ChatModule,       // Import your new chat module
      // LinksModule,      // Keep other functional modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} // Remove OnModuleInit if initialization moved to MastraCoreModule
```

* [ ] **Developer Check:** Verify both `ChatModule` and `MastraCoreModule` are present in the `imports` array of `AppModule`.

**Step 7: Testing** `#Testing` `#Validation`

* **ID:** BACKEND_IMPL_V2.1_STEP7
* **Goal:** Verify the functionality, authentication, error handling, and streaming of the newly created API endpoints.
* **Action:**
  * **Manual Testing:**
    * Use Postman/Insomnia/curl to send `POST` requests to `/chat/:agentName`. Test valid inputs, missing inputs (DTO validation), invalid `agentName` (expect 404 from `ChatService`), unauthorized requests (missing/invalid token), and simulate service errors (if possible via mocking or specific inputs). Verify JSON response structure and HTTP status codes.
    * Use a browser's JavaScript console (`new EventSource('/api/chat/stream/...')`) or an SSE client tool to connect to `GET /chat/stream/:agentName`. Test valid inputs (via query params), missing prompt (expect error event), invalid `agentName`, unauthorized requests. Observe the stream of `MessageEvent` data. Check for the finalization/closure of the stream. Test how server errors are propagated (expect an SSE error event).
  * **Automated Testing:**
    * **Integration Tests (`apps/api/src/chat/chat.controller.spec.ts`):** Use `@nestjs/testing` `Test.createTestingModule`. Mock the `ChatService` provider. Test that the controller routes correctly, applies the guard (can mock the guard's `canActivate` return), uses the `ValidationPipe`, calls the correct service methods, and formats responses (mock service return values). For SSE, test that the observable is returned (testing the stream content itself is harder here).
    * **Unit Tests (`apps/api/src/chat/chat.service.spec.ts`):** Use `Test.createTestingModule`. Mock the `MASTRA_AGENTS_TOKEN` provider with mock agent objects (using `vi.spyOn(mockAgent, 'generate').mockResolvedValue(...)` etc.). Test the `getAgent` logic (including `NotFoundException`). Test that `processMessage` and `streamMessage` call the correct agent's methods with the right parameters. Test error handling within the service.
* **COPILOT:** Outline the key test cases for manual testing. Provide basic structure/examples for NestJS integration and unit tests using Vitest/Jest mocking for the `ChatController` and `ChatService`.

### (Add testing outlines/examples here if desired, similar to previous mocking examples but focused on controller/service testing patterns)**

* [ ] **Developer Check:** Perform manual tests. Implement unit and integration tests covering key success and failure paths.

---

## 🩺 Troubleshooting Notes & Checklist 🩺

* [ ] **Check 1: `Mastra Agents not initialized` / `Agent not found` error** #Troubleshooting #Initialization #DI
  * **Verify:** `MastraCoreModule` is imported in `AppModule`.
  * **Verify:** No errors logged during `MastraCoreModule` factory execution (check server startup logs).
  * **Verify:** `initializeAgents` function in `packages/api` is completing successfully. Does it need dependencies (model, etc.) passed into the factory?
  * **Verify:** Correct `MASTRA_AGENTS_TOKEN` is used in `@Inject()` within `ChatService`.
  * **Verify:** `agentName` param in the request URL/body exactly matches a key in the initialized agents object. Check case sensitivity.
* [ ] **Check 2: Cannot call `generate`/`stream` on `undefined`** #Troubleshooting #Service
  * **Verify:** `getAgent` method in `ChatService` is correctly implemented and throws `NotFoundException` *before* trying to access methods on `undefined`.
  * **Verify:** The `agentName` being passed to `getAgent` is correct.
* [ ] **Check 3: NestJS Dependency Injection Errors (`Nest can't resolve dependencies...`)** #Troubleshooting #DI #Module
  * **Verify:** The required token (e.g., `MASTRA_AGENTS_TOKEN`) is correctly defined and **exported** from `MastraCoreModule`.
  * **Verify:** `MastraCoreModule` is marked `@Global()` OR imported directly into the module where the injection is needed (`ChatModule` usually gets it implicitly via `@Global`).
  * **Verify:** Injection token strings match exactly between the provider definition (`provide: ...`) and the consumer (`@Inject(...)`).
  * **Verify:** Check for circular module dependencies (Module A imports B, Module B imports A). Refactor using forwardRef or restructure modules.
* [ ] **Check 4: SSE Stream Issues (No connection, closes early, RxJS errors)** #Troubleshooting #Streaming #SSE #RxJS
  * **Verify:** Frontend is connecting to the correct URL (`GET /chat/stream/:agentName`).
  * **Verify:** `Content-Type` header in the response is `text/event-stream`. NestJS `@Sse` decorator usually handles this.
  * **Verify:** RxJS pipeline correctly handles the async iterator. Use `switchMap((streamResult) => from(streamResult.stream))` to get the deltas.
  * **Verify:** `catchError` is *inside* the `pipe()` to handle errors from the stream iterator and send an SSE error event. Rethrowing inside `catchError` might terminate the connection.
  * **Verify:** `MessageEvent` objects are formatted correctly (`{ data: JSON.stringify(...) }`).
  * **Verify:** No uncaught errors are happening *before* the observable is returned from the controller method.
  * **Check:** Network issues (firewalls, proxies) blocking the persistent SSE connection.
  * **Check:** Server resources (is the connection being dropped due to load or timeouts?).
* [ ] **Check 5: Authentication Guard (`SupabaseAuthGuard`) Issues** #Troubleshooting #Authentication #Security
  * **Verify:** `@UseGuards(SupabaseAuthGuard)` is applied correctly to the `ChatController` or specific routes.
  * **Verify:** Frontend is sending a valid Supabase JWT in the `Authorization: Bearer <token>` header. Inspect network requests.
  * **Verify:** `apps/api` environment has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or service key if needed by guard logic) used by the guard's Supabase client instance.
  * **Verify:** The guard's logic in `packages/api` for token validation is correct.
* [ ] **Check 6: Global Exception Filter Issues** #Troubleshooting #ErrorHandling #Filter
  * **Verify:** Filter is registered correctly in `main.ts` using `app.useGlobalFilters()`.
  * **Verify:** Error type checking (`instanceof HttpException`, `isServiceError` helper) works as expected. Use `console.log(exception.constructor.name, exception.name)` inside the filter to debug.
  * **Verify:** `HttpStatus` mapping is correct.
  * **Verify:** Standardized `responseBody` structure is correct.
  * **Verify:** `response.headersSent` check prevents double sending.
* [ ] **Check 7: DTO Validation Not Working** #Troubleshooting #Validation
  * **Verify:** `ValidationPipe` is registered globally (`app.useGlobalPipes()`) or applied specifically to the controller/route.
  * **Verify:** `class-validator` decorators (`@IsString`, `@IsNotEmpty`, etc.) are correctly applied to DTO properties.
  * **Verify:** The `@Body()` decorator in the controller method includes `new ValidationPipe()` or relies on the global pipe.

---

**Final Action:** Review all generated code for correctness, adherence to directives, import paths, type safety, and error handling. Test endpoints thoroughly using the testing strategy outlined.
