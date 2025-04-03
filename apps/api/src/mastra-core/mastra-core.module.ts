import { Module, Global, OnModuleInit, Inject, Logger } from '@nestjs/common';

// Import necessary components from the shared 'packages/api'
import { initializeAgents, agents as mastraAgentsObjectRef } from '@repo/api/mastra/agents/index';
import { Agent } from '@mastra/core'; // For typing
import { MastraDatabase } from '@repo/api/mastra/services/database';
import { EmbeddingStoreService, initializeGlobalEmbeddingStore } from '@repo/api/mastra/services/store-embeddings';

// Define unique Injection Tokens
export const MASTRA_AGENTS_TOKEN = 'MASTRA_AGENTS';
export const MASTRA_DATABASE_TOKEN = 'MASTRA_DATABASE';
export const EMBEDDING_STORE_SERVICE_TOKEN = 'EMBEDDING_STORE_SERVICE';

@Global() // Make these providers available globally in the NestJS app
@Module({
  providers: [
    // --- Provider for Mastra Agents ---
    {
      provide: MASTRA_AGENTS_TOKEN,
      useFactory: async (
        mastraDb: MastraDatabase,
        embeddingService: EmbeddingStoreService,
      ) => {
        const logger = new Logger('MastraAgentsInit'); // Create a logger instance
        logger.log('Factory: Initializing Mastra Agents...');
        try {
          // Call the initialization function with dependencies
          await initializeAgents(mastraDb, embeddingService, logger);
          logger.log('Factory: Mastra Agents Initialized successfully.');
          return mastraAgentsObjectRef; // Return the initialized agents object
        } catch (error) {
          logger.error('Factory: Mastra Agent initialization failed!', error instanceof Error ? error.stack : String(error));
          // Re-throw the error to prevent the application from starting with uninitialized agents
          throw new Error(`Mastra Agent initialization failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      inject: [MASTRA_DATABASE_TOKEN, EMBEDDING_STORE_SERVICE_TOKEN], // Inject dependencies
    },

    // --- Provider for MastraDatabase Service ---
    {
      provide: MASTRA_DATABASE_TOKEN,
      useFactory: async (embeddingService: EmbeddingStoreService) => {
        Logger.log('Factory: Creating MastraDatabase instance...', 'MastraCoreModule');
        const dbInstance = new MastraDatabase();
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
  }
}
