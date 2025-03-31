/**
 * Mastra tools implementation.
 * Provides specialized tools for agents including web search and vector retrieval.
 *
 * @module packages/api/src/mastra/tools
 */

import { createTool, Tool } from '@mastra/core';
import { z } from 'zod';
import { getEnvVar } from '../../utils/env';

// Note: We need to get fireCrawlKey from env directly to avoid circular imports
const fireCrawlKey = getEnvVar('FIRECRAWL_KEY');

/**
 * Web search tool using FireCrawl integration.
 * Allows agents to search the web for current information.
 */
export const webSearchTool = createTool({
  id: 'web-search',
  description: 'Search the web for current information on a topic',
  inputSchema: z.object({
    query: z.string().describe('The search query to run'),
    numResults: z
      .number()
      .min(1)
      .max(10)
      .default(5)
      .describe('Number of results to return (1-10)'),
  }),
  outputSchema: z.object({
    results: z.string().describe('Formatted search results'),
    count: z.number().describe('Number of results returned'),
  }),
  execute: async ({ query, numResults }) => {
    try {
      // Build the FireCrawl API URL with query parameters
      const url = new URL('https://api.firecrawl.dev/search');
      url.searchParams.append('q', query);
      url.searchParams.append('num', numResults.toString());

      // Make the API request with the FireCrawl key
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fireCrawlKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `FireCrawl API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      // Format the search results
      const formattedResults = data.results
        .map((result: any, index: number) => {
          return `[${index + 1}] ${result.title}
URL: ${result.url}
Snippet: ${result.snippet}
`;
        })
        .join('\n');

      return {
        results: formattedResults,
        count: data.results.length,
      };
    } catch (error) {
      console.error('Web Search Tool Error:', error);
      return {
        results: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        count: 0,
      };
    }
  },
});

/**
 * Initialize tool collection with the embedding model
 *
 * @param embeddingModel - The embedding model to use for vector search
 * @returns A collection of initialized tools
 */
export function initializeVectorSearchTool(
  embeddingModel: any,
): Record<string, Tool<any, any, any>> {
  // This is a simplified implementation without an actual vector query
  // In a real implementation, you would import createVectorQueryTool from @mastra/rag
  // Return the complete tools collection
  return {
    webSearch: webSearchTool,
  };
}
