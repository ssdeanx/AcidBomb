/**
 * Main Mastra configuration for the API package.
 * Configures Mastra with Gemini as the model provider and Upstash for vector storage and memory.
 *
 * @module packages/api/src/mastra/index
 */
import { Mastra } from '@mastra/core';
import { google } from '@ai-sdk/google';
// Import the UpstashVector class constructor
import { UpstashVector } from '@mastra/upstash';
import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector'; // Keep Index if used directly, otherwise remove
// Import the Memory class constructor from @mastra/memory
// Ensure you have installed '@mastra/memory': pnpm install @mastra/memory
import { Memory } from '@mastra/memory';

// Import agents and the tool initializer function
import { agents } from './agents';
// Only import the initializer, as it returns the configured tools object
import { initializeVectorSearchTool } from './tools';
import { getEnvVar } from '../utils/env';

/**
 * Configure Upstash services using environment variables
 */
const upstashVectorUrl = getEnvVar('UPSTASH_VECTOR_REST_URL');
const upstashVectorToken = getEnvVar('UPSTASH_VECTOR_REST_TOKEN');
const upstashRedisUrl = getEnvVar('UPSTASH_REDIS_URL');
// Ensure this matches your .env file exactly (UPSTACK vs UPSTASH)
const upstashRedisToken = getEnvVar('UPSTACK_REDIS_TOKEN');

/**
 * Initialize Upstash Redis client for memory storage
 */
const redis = new Redis({
  url: upstashRedisUrl,
  token: upstashRedisToken,
});

/**
 * Initialize Upstash Vector index client (potentially optional if UpstashVector handles it)
 * Keep this if you need direct access to the index elsewhere.
 */
const vectorIndex = new Index({
  url: upstashVectorUrl,
  token: upstashVectorToken,
});

/**
 * Create Mastra vector store using the UpstashVector class constructor
 */
const vectorStore = new UpstashVector({
  url: upstashVectorUrl,
  token: upstashVectorToken,
  // index: vectorIndex, // Pass the index client if required by UpstashVector constructor
});

/**
 * Initialize embedding model (using a standard Google model ID)
 */
const embeddingModel = google.embedding('embedding-001');

/**
 * Initialize memory provider with Redis using the Memory class constructor
 * Pass vector store and embedder directly to the Memory constructor
 * This allows the Memory class to handle semantic recall internally.
 */
const memoryProvider = new Memory({
  storage: {
    type: 'redis', // Specify storage type (or pass a storage instance)
    redis, // Pass the initialized Redis client
    namespace: 'mastra:memory', // Define a namespace for memory keys
  },
  // Pass vector store and embedder here for semantic recall functionality within Memory
  vector: vectorStore,
  embedder: embeddingModel,
  options: {
    lastMessages: 20, // Number of recent messages to keep readily available
    semanticRecall: {
      // Configuration for recalling relevant past messages
      // These options are used if 'vector' and 'embedder' are provided
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    workingMemory: {
      // Configuration for short-term working memory
      enabled: true,
    },
  },
});

/**
 * Configure Gemini model parameters from environment variables
 */
// Get the first model name if multiple are listed
const modelName = getEnvVar('MODEL', 'gemini-1.5-flash-latest') // Updated default model
  .split(',')[0]
  .trim();
const modelTemperature = parseFloat(getEnvVar('MODEL_TEMPERATURE', '0.2'));
const modelMaxTokens = parseInt(getEnvVar('MODEL_MAX_TOKENS', '8192'), 10);

/**
 * Initialize Gemini model with configured parameters
 * FIX: Reverted - Pass temperature and maxOutputTokens directly.
 * The 'generationConfig' wrapper was incorrect for the google() function settings.
 */
const geminiModel = google(modelName, {
  temperature: modelTemperature,
  maxOutputTokens: modelMaxTokens, // Correct parameter name
  // Add safetySettings if needed, e.g.:
  // safetySettings: [
  //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  //   // ... other categories
  // ]
});

/**
 * Initialize tools by calling the function from tools/index.ts
 * This function returns the complete tools object, including the vector search tool.
 */
const initializedTools = initializeVectorSearchTool(embeddingModel);

/**
 * Set up LangSmith integration if enabled via environment variable
 */
if (getEnvVar('LANGSMITH_TRACING', 'false') === 'true') {
  console.log('LangSmith tracing enabled.');
  // Set environment variables required by LangChain/LangSmith integration
  process.env.LANGCHAIN_TRACING_V2 = 'true';
  process.env.LANGSMITH_ENDPOINT = getEnvVar('LANGSMITH_ENDPOINT');
  process.env.LANGSMITH_API_KEY = getEnvVar('LANGSMITH_API_KEY');
  // Optional: Set project name if desired
  // process.env.LANGCHAIN_PROJECT = getEnvVar('LANGSMITH_PROJECT_NAME', 'DeanMachines API');
}

/**
 * Get FireCrawl API key (used by tools/index.ts)
 * Exported for potential use elsewhere if needed.
 */
export const fireCrawlKey = getEnvVar('FIRECRAWL_KEY');

/**
 * Create and export the main Mastra instance
 * Register agents, tools, workflows, and the vector store.
 * Memory is typically configured per-agent or handled by specific tools/workflows.
 */
export const mastra = new Mastra({
  agents: agents, // The imported agent definitions
  tools: initializedTools, // The initialized tools collection
  vectors: {
    upstash: vectorStore, // Register the Upstash vector store
  },
  workflows: {
    // Define workflows here as they are implemented
  },
});

/**
 * Helper function to create a new conversation.
 * Uses manual ID generation and Redis storage.
 *
 * @param agentId - The ID of the agent associated with the conversation.
 * @param userId - The user ID initiating the conversation.
 * @returns The unique conversation ID.
 */
export const createConversation = async (
  agentId: string,
  userId: string,
): Promise<string> => {
  // Generate a simple unique ID (consider using UUIDs for production)
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const metadataKey = `mastra:conversation:${conversationId}:metadata`;

  try {
    // Store initial conversation metadata directly in Redis
    await redis.hset(metadataKey, {
      agentId,
      userId,
      createdAt: new Date().toISOString(),
    });
    console.log(`Created conversation ${conversationId} metadata in Redis.`);
  } catch (error) {
    console.error(
      `Failed to create conversation metadata in Redis for ${conversationId}:`,
      error,
    );
    // Handle error appropriately - maybe throw or return an error indicator
    throw new Error('Failed to initialize conversation metadata.');
  }

  return conversationId;
};

/**
 * Export necessary components for use in other modules (e.g., controllers)
 */
export {
  memoryProvider, // Export the configured Memory instance
  vectorStore, // Export the vector store instance
  vectorIndex, // Export if needed directly elsewhere
  embeddingModel,
  geminiModel,
  redis, // Export Redis client if needed directly elsewhere
  modelTemperature,
  modelMaxTokens,
};
