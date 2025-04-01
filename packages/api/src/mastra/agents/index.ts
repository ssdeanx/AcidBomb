/**
 * Mastra agents implementation.
 * Provides chat and specialized agents using Gemini as the model provider.
 *
 * @module packages/api/src/mastra/agents
 */

import { Agent } from '@mastra/core';
import { createLogger } from '@mastra/core';
import * as tools from "../tools";
// Import model and memory from index after it's initialized there
// We'll import these later since we need to avoid circular dependencies
let memoryProvider;
let geminiModel;
let initializedTools;

/**
 * Base system instructions for the general-purpose chat agent
 */
const chatInstructions = `
You are a helpful, friendly, and knowledgeable assistant.
You provide accurate and balanced information.
You can use tools like search or vector search when you need to find information.
The conversation will maintain context through memory integration.
Always be respectful, honest, and supportive in your interactions.
`;

/**
 * System instructions for a specialized search agent that provides factual information
 */
const searchAgentInstructions = `
You are a search assistant focused on providing factual, accurate information.
You MUST use the available search tools when answering queries about current events, facts, or information you're uncertain about.
You can also search the internal knowledge base using the vectorSearch tool.
Your purpose is to help users find reliable information by leveraging both your knowledge and available tools.
When using search tools, synthesize results into a coherent answer rather than just repeating search results.
`;

/**
 * System instructions for a specialized coding assistant
 */
const codeAssistantInstructions = `
You are a coding assistant specialized in helping with programming tasks.
You provide accurate code examples, explanations, and debugging help.
If asked about recent libraries, APIs, or current best practices, use search tools to verify information.
You specialize in TypeScript/JavaScript, React, Next.js, and related technologies, but can assist with other languages as needed.
Always explain your code and provide context to help the user understand solutions.
`;

/**
 * Initialize agents with model and memory after they are created
 * This avoids circular dependencies between agents and index
 */
export const initializeAgents = (model, memory, tools) => {
  geminiModel = model;
  memoryProvider = memory;
  initializedTools = tools;

  return {
    chat: new Agent({
      name: 'chat',
      instructions: chatInstructions,
      model: geminiModel,
      memory: memoryProvider,
      tools: initializedTools,
    }),

    search: new Agent({
      name: 'search',
      instructions: searchAgentInstructions,
      model: geminiModel,
      memory: memoryProvider,
      tools: initializedTools,
    }),

    codeAssistant: new Agent({
      name: 'codeAssistant',
      instructions: codeAssistantInstructions,
      model: geminiModel,
      memory: memoryProvider,
      tools: initializedTools,
    }),
  };
};

/**
 * Export empty agents object to be populated by initializeAgents
 * This avoids circular dependencies
 */
export let agents = {};
