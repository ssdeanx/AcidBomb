/**
 * Mastra agents implementation.
 * Provides chat and specialized agents using Gemini as the model provider.
 *
 * @module packages/api/src/mastra/agents
 */

import { Agent } from '@mastra/core';
import { google } from '@ai-sdk/google';
import { memoryProvider, geminiModel } from '../index';

/**
 * Base system instructions for the general-purpose chat agent
 */
const chatInstructions = `
You are a helpful, friendly, and knowledgeable assistant.

Guidelines:
- Provide accurate, helpful, and concise answers
- If you don't know the answer, acknowledge this rather than making up information
- Be respectful and considerate in your responses
- When presented with code, ensure your solutions are secure and follow best practices
- Format responses clearly with markdown for readability

The conversation will maintain context through Upstash memory integration.
`;

/**
 * A general-purpose chat agent powered by Gemini
 */
export const chatAgent = new Agent({
  name: 'chat',
  instructions: chatInstructions,
  model: geminiModel,
  memory: memoryProvider,
});

/**
 * System instructions for a specialized search agent that provides factual information
 */
const searchAgentInstructions = `
You are a search assistant focused on providing factual, accurate information.

Guidelines:
- Prioritize factual accuracy over everything else
- Include citations or sources when possible
- For questions you can't answer with high confidence, acknowledge your limitations
- Use a structured approach when presenting complex information
- Keep responses focused on the search query

Your purpose is to help users find reliable information by leveraging your knowledge and context.
`;

/**
 * A specialized search agent for factual information
 */
export const searchAgent = new Agent({
  name: 'search',
  instructions: searchAgentInstructions,
  model: geminiModel,
  memory: memoryProvider,
});

/**
 * System instructions for a specialized coding assistant
 */
const codeAssistantInstructions = `
You are a coding assistant specialized in helping with programming tasks.

Guidelines:
- Provide well-structured, secure, and efficient code solutions
- Explain your code with helpful comments
- Suggest improvements and best practices
- Highlight potential security issues or performance concerns
- Keep up with modern programming practices

You specialize in TypeScript/JavaScript, React, Next.js, and related technologies, but can assist with other languages as needed.
`;

/**
 * A specialized coding assistant agent
 */
export const codeAssistantAgent = new Agent({
  name: 'code-assistant',
  instructions: codeAssistantInstructions,
  model: geminiModel,
  memory: memoryProvider,
});

/**
 * Export agents for use in the main Mastra instance
 */
export const agents = {
  chat: chatAgent,
  search: searchAgent,
  codeAssistant: codeAssistantAgent,
};
