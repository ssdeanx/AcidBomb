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
import { createMemory } from '@mastra/memory';

// Import agents and tools
import { agents } from './agents';
import { tools } from './tools';

/**
 * Safely access environment variables with fallbacks to prevent runtime errors
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  if (!value && defaultValue === '') {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue;
};

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
const memoryProvider = createMemory({
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
 * Initialize vector store with Upstash for RAG capabilities
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
const geminiModel = google(modelName);

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
  memory: memoryProvider,
  agents,
});

/**
 * Helper function to create a new conversation with a specific agent
 *
 * @param agentId - The ID of the agent to create a conversation with
 * @param userId - The user ID for the conversation
  agents: agents,
  tools: tools,
  workflows: {
    // Will be populated as workflows are implemented
  },
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
  const conversationId = await memoryProvider.createConversation({
    agentId,
    metadata: {
      userId,
      createdAt: new Date().toISOString(),
    },
  });

  return conversationId;
};

/**
 * Export necessary components for use in other modules
 */
export { memoryProvider, vectorStore, geminiModel, redis, fireCrawlKey };
