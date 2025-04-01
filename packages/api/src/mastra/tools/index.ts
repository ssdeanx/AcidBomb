/**
 * Mastra tools implementation.
 * Provides specialized tools for agents including web search and vector retrieval.
 *
 * @module packages/api/src/mastra/tools
 */

import { createTool, Tool } from '@mastra/core';
import { createVectorQueryTool } from '@mastra/rag'; // RAG helper for vector search
import { z } from 'zod';
import { getEnvVar } from '../../utils/env'; // Utility for environment variables
import { EmbeddingModel } from '@ai-sdk/provider'; // Import specific type if available

// --- Environment Variables ---
// Fetch required API keys directly within this module
const fireCrawlKey = getEnvVar('FIRECRAWL_KEY');
const googleApiKey = getEnvVar('GOOGLE_API_KEY'); // Ensure this is set in your .env
const googleCx = getEnvVar('GOOGLE_CX'); // Your Programmable Search Engine ID

// --- Web Search Tool (FireCrawl) ---
// [ Keep the webSearchTool implementation as it was - it looks good ]
export const webSearchTool = createTool({
  id: 'web-search-firecrawl',
  description:
    'Search the web using FireCrawl for current information on a topic. Use for general web searches.',
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
    results: z.string().describe('Formatted search results as a single string'),
    count: z.number().describe('Number of results returned'),
  }),
  execute: async (input) => {
    const { query, numResults } = input;
    if (!fireCrawlKey) {
      console.warn(
        `FireCrawl API key is not configured. Cannot perform search for query: "${query}"`,
      );
      return {
        results: 'Search tool (FireCrawl) is not configured.',
        count: 0,
      };
    }
    try {
      const url = new URL('https://api.firecrawl.dev/search');
      url.searchParams.append('q', query);
      url.searchParams.append(
        'pageOptions[fetchOptions][num]',
        numResults.toString(),
      ); // Correct parameter for num results

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fireCrawlKey}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`FireCrawl API Error (${response.status}): ${errorBody}`);
        throw new Error(
          `FireCrawl API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      interface FireCrawlResult {
        title?: string;
        url?: string; // Firecrawl might use 'link' or 'url', check API response
        snippet?: string; // Firecrawl might use 'content' or 'snippet'
        score?: number; // Firecrawl often includes a relevance score
      }

      // Adjust mapping based on actual Firecrawl /search response structure
      const formattedResults = (data.data as FireCrawlResult[]) // Check if results are under 'data' key
        ?.map((result, index) => {
          const title = result.title || 'No Title';
          const url = result.url || 'No URL';
          const snippet = result.snippet || 'No Snippet available.';
          return `[${index + 1}] ${title}\nURL: ${url}\nSnippet: ${snippet}\n`;
        })
        .join('\n');

      return {
        results: formattedResults || 'No results found.',
        count: data.data?.length || 0,
      };
    } catch (error) {
      console.error('Web Search Tool (FireCrawl) Execution Error:', error);
      return {
        results: `Search failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        count: 0,
      };
    }
  },
});

// --- Google Search Tool (Custom Search API) ---
// [ Keep the googleSearchTool implementation as it was - it looks good ]
export const googleSearchTool = createTool({
  id: 'web-search-google',
  description:
    'Search the web using Google Custom Search for current information on a topic. Use for targeted searches if FireCrawl fails or for specific Google searches.',
  inputSchema: z.object({
    query: z.string().describe('The search query to run'),
    numResults: z
      .number()
      .min(1)
      .max(10) // Google Custom Search API max results per page is 10
      .default(5)
      .describe('Number of results to return (1-10)'),
  }),
  outputSchema: z.object({
    results: z.string().describe('Formatted search results as a single string'),
    count: z.number().describe('Number of results returned'),
  }),
  execute: async (input) => {
    const { query, numResults } = input;
    if (!googleApiKey || !googleCx) {
      console.warn(
        `Google API Key or Search Engine ID (CX) is not configured. Cannot perform search for query: "${query}"`,
      );
      return {
        results: 'Search tool (Google) is not configured.',
        count: 0,
      };
    }
    try {
      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('key', googleApiKey);
      url.searchParams.append('cx', googleCx);
      url.searchParams.append('q', query);
      url.searchParams.append('num', numResults.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `Google Custom Search API Error (${response.status}): ${errorBody}`,
        );
        throw new Error(
          `Google Custom Search API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return { results: 'No results found.', count: 0 };
      }

      interface GoogleSearchResult {
        title?: string;
        link?: string;
        snippet?: string;
      }

      const formattedResults = (data.items as GoogleSearchResult[])
        .map((item, index) => {
          const title = item.title || 'No Title';
          const url = item.link || 'No URL';
          const snippet = item.snippet || 'No Snippet';
          return `[${index + 1}] ${title}\nURL: ${url}\nSnippet: ${snippet}\n`;
        })
        .join('\n');

      return {
        results: formattedResults,
        count: data.items.length,
      };
    } catch (error) {
      console.error('Google Search Tool Execution Error:', error);
      return {
        results: `Search failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        count: 0,
      };
    }
  },
});

// --- Vector Search Tool Factory ---
/**
 * Helper function to create the vector search tool using Mastra RAG.
 * @param model - The embedding model instance (e.g., from @ai-sdk/google).
 * @param indexName - The specific Upstash Vector index name to target.
 * @returns The configured vector query tool.
 */
const createVectorSearchToolInstance = (
  model: EmbeddingModel, // Use a more specific type if possible
  indexName: string,
) =>
  createVectorQueryTool({
    // CRITICAL: This name *must* match the key used in `mastra.vectors` registration (index.ts)
    vectorStoreName: 'upstash',
    // CRITICAL: This name *must* match the actual index in Upstash Vector service
    indexName: indexName, // Use the passed index name
    model, // The embedding model for querying
    description:
      'Search through internal knowledge base documents (e.g., project docs, notes, past conversations) to find relevant information based on semantic meaning. Use for questions about internal details or past context.',
    // Optional: Configure topK results, metadata filters, etc.
    // topK: 5,
    // filter: { /* metadata filter object */ }
  });

// --- Tool Exports ---
/**
 * Static collection of tools (excluding dynamically created ones).
 */
export const staticTools: Record<string, Tool<any, any, any>> = {
  webSearchFirecrawl: webSearchTool,
  googleSearch: googleSearchTool,
};

/**
 * Initializes the vector search tool and merges it with static tools.
 * Called from `index.ts` after models are ready.
 * @param embeddingModel - The initialized embedding model instance.
 * @param vectorIndexName - The name of the Upstash index to use for vector search.
 * @returns The complete collection of tools.
 */
export const initializeVectorSearchTool = (
  embeddingModel: EmbeddingModel, // Use specific type
  vectorIndexName: string,
): Record<string, Tool<any, any, any>> => {
  // Create the vector search tool instance dynamically
  const vectorSearchToolInstance = createVectorSearchToolInstance(
    embeddingModel,
    vectorIndexName, // Pass the index name from config
  );

  // Return a new object containing all tools
  return {
    ...staticTools,
    vectorSearch: vectorSearchToolInstance, // Add the dynamic tool
  };
};
