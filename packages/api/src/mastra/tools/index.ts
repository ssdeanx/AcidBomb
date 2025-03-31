/**
 * Mastra tools implementation.
 * Provides specialized tools for agents including web search and vector retrieval.
 *
 * @module packages/api/src/mastra/tools
 */

import { createTool } from '@mastra/core';
import { createVectorQueryTool } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { fireCrawlKey, vectorStore } from '../index';

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
  execute: async ({ context }) => {
    try {
      const { query, numResults } = context;

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
 * Vector search tool using Upstash Vector Store.
 * Allows agents to search through embedded document vectors.
 */
export const vectorSearchTool = createVectorQueryTool({
  vectorStoreName: 'upstash',
  indexName: 'documents',
  model: google.embedding('embedding-001'),
  description:
    'Search through knowledge base documents to find relevant information',
});

/**
 * Export tools for use in the main Mastra instance
 */
export const tools = {
  webSearch: webSearchTool,
  vectorSearch: vectorSearchTool,
};
