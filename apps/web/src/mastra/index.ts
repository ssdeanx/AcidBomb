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
/**
 * This file (`apps/web/src/mastra/index.ts`) configures Mastra for the web frontend. It correctly re-exports the `useAgent` hook, which is used to communicate with agents defined on your backend API (like in `#document:/c:/Users/dm/Documents/Deanmachines/packages/api/src/mastra/index.ts`). Agent definitions are not needed in this frontend configuration file. The `useAgent` hook handles the API calls to interact with those backend agents. No changes are required here.
 */
