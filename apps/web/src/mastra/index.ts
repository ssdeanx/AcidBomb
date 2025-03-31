/**
 * Main Mastra configuration for the web frontend.
 * Re-exports hooks and utilities for agent communication.
 */
import { Mastra } from '@mastra/core';
import { google } from '@ai-sdk/google';

// Export hooks for using Mastra agents
export { useAgent } from './hooks/useAgent';
export type { Message } from './hooks/useAgent';

// Main Mastra instance with client-side configuration
export const mastra: Mastra = new Mastra({
  // Client-side configuration will be minimal
  // Most functionality will be accessed through API calls
});

// Re-export other components as they are implemented
// export * from './agents';
// export * from './tools';
// export * from './workflows';
