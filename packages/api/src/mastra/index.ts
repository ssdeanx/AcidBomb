/**
 * Main Mastra configuration for the API package.
 * Configures Mastra with Gemini models, Pinecone for vector storage, and Upstash Redis for cache/storage.
 * Initializes core clients, memory providers, and the main Mastra instance.
 *
 * @module packages/api/src/mastra/index
 */

// --- Core Mastra Imports ---
import { Mastra, createLogger, LogLevel, Logger } from '@mastra/core';
import { Memory } from '@mastra/memory';
import { UpstashStore } from '@mastra/upstash'; // Upstash adapter for KV Store (Redis Cache)
import { PineconeVector } from '@mastra/pinecone'; // <--- Import Pinecone Adapter for Vectors

// --- AI Model Provider ---
import { google } from '@ai-sdk/google';

// --- Upstash Client (Raw Redis ONLY) ---
import { Redis as UpstashRedisClient } from '@upstash/redis';

// --- Local Modules ---
import { agents } from './agents';
import { initializeVectorSearchTool } from './tools'; // Ensure this tool works generically or adapt it
import { getEnvVar } from '../utils/env';

// --- Environment Variables ---
// Upstash Redis (for Cache/Storage)
const upstashRedisUrl = getEnvVar('UPSTASH_REDIS_URL');
const upstashRedisToken = getEnvVar('UPSTASH_REDIS_TOKEN');

// Pinecone (for Vector storage)
const pineconeApiKey = getEnvVar('PINECONE_API_KEY');
const pineconeEnv = getEnvVar('PINECONE_ENV');
const pineconeHost = getEnvVar('PINECONE_HOST');
const pineconeIndexName = getEnvVar('PINECONE_INDEX_NAME'); // Get Pinecone index name from env

// Model & Other Configs
const generationModelName = getEnvVar('MODEL', 'gemini-1.5-flash-latest')
  .split(',')[0]
  .trim();
const modelTemperature = parseFloat(getEnvVar('MODEL_TEMPERATURE', '0.2'));
const modelMaxTokens = parseInt(getEnvVar('MODEL_MAX_TOKENS', '8192'), 10);

// --- Initialize Logger ---
const logger: Logger = createLogger({
  name: 'MastraApp',
  level: LogLevel.INFO, // Adjust log level as needed
});

// --- Initialize Raw Upstash Redis Client (Optional, for direct cache/metadata access) ---
logger.info('Initializing raw Upstash Redis client...');
const rawRedisClient = new UpstashRedisClient({
  url: upstashRedisUrl,
  token: upstashRedisToken,
});
logger.info('Raw Upstash Redis client initialized.');

// --- Initialize AI Models ---
logger.info('Initializing AI models...');
const embeddingModelId = 'embedding-001'; // Make sure this model's dimension matches your Pinecone index dimension
const embeddingModel = google.embedding(embeddingModelId);
logger.info(`Embedding model initialized (${embeddingModelId})`);

const geminiModel = google(generationModelName);
logger.info(`Generation model initialized (${generationModelName})`);

// --- Create Mastra Adapters ---

logger.info('Creating Mastra PineconeVector adapter...');
// Instantiate PineconeVector adapter based on documentation and likely requirements
// @ts-ignore - Assuming type definition issue, constructor expects an object
const vectorStoreAdapter = new PineconeVector({
  apiKey: pineconeApiKey,
  environment: pineconeEnv, // Required by Mastra docs
  host: pineconeHost, // Your specific index endpoint - likely needed by underlying client
  indexName: pineconeIndexName, // Essential for the adapter to target the correct index
  logger: logger, // Pass logger for internal logging
  // namespace: 'your-pinecone-namespace' // Optional: Add if you use Pinecone namespaces within your index
});
logger.info(
  `Mastra PineconeVector adapter created for index '${pineconeIndexName}'.`,
);

logger.info(
  'Creating Mastra UpstashStore adapter instance (for Redis cache/storage)...',
);
// Keep UpstashStore for key-value storage / caching
const storageAdapter = new UpstashStore({
  url: upstashRedisUrl,
  token: upstashRedisToken,
});
logger.info('Mastra UpstashStore adapter created.');

// --- Create Mastra Memory Provider ---
logger.info('Creating Mastra Memory provider...');
const memoryProvider = new Memory({
  storage: storageAdapter, // Use UpstashStore (Redis) for storing conversation history, metadata etc.
  vector: vectorStoreAdapter, // Use PineconeVector for semantic recall (vector search) <--- Updated
  embedder: embeddingModel, // Embedder used for creating vectors before storing/querying
  logger: logger,
  options: {
    namespace: 'mastra:memory', // Namespace for keys in Redis (UpstashStore)
    lastMessages: 20, // How many recent messages to keep readily available
    semanticRecall: {
      // Configuration for vector search recall
      topK: 3, // Number of similar messages/chunks to retrieve
      messageRange: { before: 2, after: 1 }, // Context window around retrieved messages
      // filter: { userId: 'some-user-id' } // Example: Optional metadata filter for vector search
    },
    workingMemory: { enabled: true },
  },
});
logger.info(
  'Mastra Memory provider initialized (Storage: Upstash Redis, Vector: Pinecone).',
);

// --- Initialize Tools ---
// Pass embedder and the Pinecone index name as a string.
// Verify initializeVectorSearchTool is compatible or adapt it.
// Tools might need the index name to perform vector operations like query().
logger.info('Initializing tools, ensuring compatibility with Pinecone...');
const initializedTools = initializeVectorSearchTool(
  embeddingModel,
  pineconeIndexName, // Pass the index name as a string instead of the adapter instance
);
logger.info('Tools initialized, including vector search using Pinecone.');

// --- LangSmith Tracing (Optional - No changes needed here) ---
if (getEnvVar('LANGSMITH_TRACING', 'false') === 'true') {
  // ... (LangSmith setup remains the same)
}

// --- Export FireCrawl Key (If used - No changes needed here) ---
export const fireCrawlKey = getEnvVar('FIRECRAWL_KEY', ''); // Provide default if optional

// --- Create Main Mastra Instance ---
logger.info('Creating main Mastra instance...');
export const mastra = new Mastra({
  agents: agents,
  tools: initializedTools,
  vectors: {
    // Register the Pinecone vector adapter instance under a key name
    pinecone: vectorStoreAdapter, // <--- Use 'pinecone' or another descriptive key
  },
  storage: storageAdapter, // Pass the storage adapter directly
  // Use storageAdapter directly as the storage provider
  workflows: {}, // Define workflows if any
  logger: logger,
});
logger.info('Mastra instance created successfully.');

// --- Conversation Helper (Uses Raw Redis Client for Metadata - No changes needed here) ---
export const createConversation = async (
  agentId: string,
  userId: string,
): Promise<string> => {
  const conversationId = `conv_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 7)}`;
  // Store metadata directly in Redis using the raw client
  const metadataKey = `mastra:conversation:${conversationId}:metadata`;
  try {
    await rawRedisClient.hset(metadataKey, {
      agentId,
      userId,
      createdAt: new Date().toISOString(),
    });
    logger.info(`Created conversation ${conversationId} metadata in Redis.`);
  } catch (error) {
    logger.error(
      `Failed to create conversation metadata in Redis for ${conversationId}:`,
      error,
    );
    throw new Error('Failed to initialize conversation metadata.');
  }
  return conversationId;
};

// --- Exports ---
export {
  memoryProvider,
  vectorStoreAdapter as pineconeVectorStore, // Alias vector adapter
  storageAdapter as upstashStorage, // Alias storage adapter
  embeddingModel,
  geminiModel,
  rawRedisClient as redis, // Export raw Redis client
  modelTemperature,
  modelMaxTokens,
  logger,
  pineconeIndexName, // Export the Pinecone index name
};

console.log(
  'Mastra core setup initialized (Vector: Pinecone, Storage/Cache: Upstash Redis).',
);
