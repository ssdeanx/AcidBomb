import { Mastra, Tool, createLogger, MastraMemory } from '@mastra/core';
import { agents, initializeAgents } from './agents';
import { getEnvVar } from '../utils/env';
import { PineconeVector } from '@mastra/pinecone';
import { google } from '@ai-sdk/google';
import { weatherInfo } from './tools/weatherInfo';
import graphTool from './tools/graphrag';
import queryTool from './tools/vectorquery';
import { mastraDb } from './services/database';
import { summarizeTool } from './tools/summarizer';

// Initialize embedding model
const embeddingModel = google.textEmbeddingModel('gemini-embedding-exp-03-07');

// Initialize Pinecone vector store
const pineconeApiKey = getEnvVar('PINECONE_API_KEY', '');
const pineconeIndex = getEnvVar('PINECONE_INDEX_NAME', 'docs');

// Initialize Pinecone vector store
const vectorStore = new PineconeVector(pineconeApiKey, pineconeIndex);

// Initialize memory provider
const memoryProvider = {
  get: async (key: string) => mastraDb.getMemory(key),
  set: async (key: string, value: unknown) => mastraDb.storeMemory(key, value),
  delete: async (key: string) => mastraDb.deleteMemory(key),
};

// Define tools before Mastra initialization
export const tools = {
  weatherInfo,
  queryDocuments: queryTool,
  graphSearch: graphTool,
  summarize: summarizeTool,
};

// Initialize Mastra instance with proper configuration
export const mastra = new Mastra({
  logger: createLogger({
    name: 'DeanMachines',
    level: 'info',
  }),
  vectors: {
    // Fix: Remove the incorrect import and type cast
  },
});

// Initialize agents with model, memory and tools
const initializedAgents = initializeAgents(
  // Fix: Use the proper method for creating a Gemini model
  google('gemini-2.0-flash'),
  memoryProvider,
  tools,
);

// Initialize embedding service with model
mastraDb.initEmbeddingService(
  google.textEmbeddingModel('gemini-embedding-exp-03-07'),
);

// Export agents for use in API routes
export { initializedAgents as agents };
