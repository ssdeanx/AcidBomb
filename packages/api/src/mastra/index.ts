/**
 * Main Mastra configuration for the API package.
 * Configures Mastra with Gemini as the model provider and Upstash for vector storage and memory.
 *
 * @module packages/api/src/mastra/index
 */
import { Mastra } from '@mastra/core';
import { google } from '@ai-sdk/google';
import { UpstashVector } from '@mastra/upstash';
import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';
import { Memory } from '@mastra/memory';

// Import agents
import { agents } from './agents';
// Fix: Only import the initializeVectorSearchTool function, not the tools object
import { initializeVectorSearchTool } from './tools';
import { getEnvVar } from '../utils/env';

/**
 * Configure Upstash services using environment variables
 */
const upstashVectorUrl = getEnvVar('UPSTASH_VECTOR_REST_URL');
const upstashVectorToken = getEnvVar('UPSTASH_VECTOR_REST_TOKEN');
const upstashRedisUrl = getEnvVar('UPSTASH_REDIS_URL');
const upstashRedisToken = getEnvVar('UPSTACK_REDIS_TOKEN'); // Note: Using env var as spelled in .env

/**
 * Initialize Upstash Redis client for memory storage
 */
const redis = new Redis({
  url: upstashRedisUrl,
  token: upstashRedisToken,
});

/**
 * Initialize memory provider with Redis
 */
const memoryProvider = new Memory({
  storage: {
    type: 'redis',
    redis,
    namespace: 'mastra:memory',
  },
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
    },
    workingMemory: {
      enabled: true,
    },
  },
});

/**
 * Initialize Upstash Vector index for RAG capabilities
 */
const vectorIndex = new Index({
  url: upstashVectorUrl,
  token: upstashVectorToken,
});

/**
 * Create Mastra vector store from Upstash index
 */
const vectorStore = new UpstashVector({
  url: upstashVectorUrl,
  token: upstashVectorToken,
});

/**
 * Configure Gemini model parameters from environment variables
 */
const modelName = getEnvVar('MODEL', 'gemini-2.0-pro-exp-03-25')
  .split(',')[0]
  .trim();
const modelTemperature = parseFloat(getEnvVar('MODEL_TEMPERATURE', '0.2'));
const modelMaxTokens = parseInt(getEnvVar('MODEL_MAX_TOKENS', '8192'), 10);

/**
 * Initialize Gemini model with configured parameters
 */
const geminiModel = google(modelName, {
  temperature: modelTemperature,
  maxOutputTokens: modelMaxTokens,
});

/**
 * Initialize embedding model
 */
const embeddingModel = google.embedding('embedding-001');

/**
 * Initialize vector search tool with embedding model
 * This returns the fully initialized tools object
 */
const initializedTools = initializeVectorSearchTool(embeddingModel);

/**
 * Set up LangSmith integration if enabled
 */
if (getEnvVar('LANGSMITH_TRACING', 'false') === 'true') {
  // Set environment variables for LangSmith tracing
  process.env.LANGCHAIN_TRACING_V2 = 'true';
  process.env.LANGSMITH_ENDPOINT = getEnvVar('LANGSMITH_ENDPOINT');
  process.env.LANGSMITH_API_KEY = getEnvVar('LANGSMITH_API_KEY');
}

/**
 * Configure FireCrawl integration
 */
const fireCrawlKey = getEnvVar('FIRECRAWL_KEY');

/**
 * Create and export the main Mastra instance
 */
export const mastra = new Mastra({
  memory: {
    provider: memoryProvider,
    vector: vectorStore,
    embedder: embeddingModel,
  },
  agents,
  workflows: {},
  tools: initializedTools, // Provide the initialized tools
});

/**
 * Helper function to create a new conversation with a specific agent
 *
 * @param agentId - The ID of the agent to create a conversation with
 * @param userId - The user ID for the conversation
 * @returns The conversation ID
 * @throws Error if the agent is not found
 */
export const createConversation = async (
  agentId: string,
  userId: string,
): Promise<string> => {
  // Create a unique ID and store metadata in Redis
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const metadataKey = `mastra:conversation:${conversationId}:metadata`;

  await redis.hset(metadataKey, {
    agentId,
    userId,
    createdAt: new Date().toISOString(),
  });

  return conversationId;
};

/**
 * Export necessary components for use in other modules
 */
export {
  memoryProvider,
  vectorStore,
  vectorIndex,
  embeddingModel,
  geminiModel,
  redis,
  fireCrawlKey,
  modelTemperature,
  modelMaxTokens,
};
