/**
 * Mastra tools implementation.
 * Provides specialized tools for agents including web search (FireCrawl, Google) and vector retrieval.
 *
 * @module packages/api/src/mastra/tools
 */

import { createTool, Tool } from '@mastra/core'; // Tool type might be needed if used explicitly
import { createVectorQueryTool } from '@mastra/rag'; // Correct import for vector tool
// import { google } from '@ai-sdk/google'; // Removed as it's not used directly in this file now
import { z } from 'zod';
import { getEnvVar } from '../../utils/env'; // Assuming this utility exists and works

// --- Environment Variables ---
// Fetch required API keys directly to avoid circular imports with main mastra/index.ts
const fireCrawlKey = getEnvVar('FIRECRAWL_KEY');
const googleApiKey = getEnvVar('GOOGLE_API_KEY'); // Ensure this is set in your .env
const googleCx = getEnvVar('GOOGLE_CX'); // Your Programmable Search Engine ID from Google Cloud Console

// --- Web Search Tool (FireCrawl) ---
export const webSearchTool = createTool({
  id: 'web-search-firecrawl', // Unique ID for this tool
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
  // Correctly destructure 'query' and 'numResults' from the argument object
  execute: async ({ query, numResults }) => {
    // Check if the API key is configured
    if (!fireCrawlKey) {
      console.warn('FireCrawl API key is not configured.');
      return {
        results: 'Search tool (FireCrawl) is not configured.',
        count: 0,
      };
    }
    try {
      // Construct the API request URL
      const url = new URL('https://api.firecrawl.dev/search');
      url.searchParams.append('q', query);
      url.searchParams.append('num', numResults.toString());

      // Perform the fetch request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${fireCrawlKey}`, // Use the fetched API key
        },
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`FireCrawl API Error (${response.status}): ${errorBody}`);
        throw new Error(
          `FireCrawl API request failed with status ${response.status}`,
        );
      }

      // Parse the JSON response
      const data = await response.json();

      // Define an interface for the expected result structure for type safety
      interface FireCrawlResult {
        title?: string;
        url?: string;
        snippet?: string;
      }

      // Format the results into a single string
      const formattedResults = (data.results as FireCrawlResult[])
        ?.map((result, index) => {
          // Provide defaults for potentially missing fields
          const title = result.title || 'No Title';
          const url = result.url || 'No URL';
          const snippet = result.snippet || 'No Snippet';
          // Format each result clearly
          return `[${index + 1}] ${title}\nURL: ${url}\nSnippet: ${snippet}\n`;
        })
        .join('\n'); // Join results with newlines

      // Return the formatted results and count
      return {
        results: formattedResults || 'No results found.', // Handle empty results
        count: data.results?.length || 0, // Safely get the length
      };
    } catch (error) {
      // Log the error and return a user-friendly error message
      console.error('Web Search Tool (FireCrawl) Execution Error:', error);
      return {
        results: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        count: 0,
      };
    }
  },
});

// --- Google Search Tool (Custom Search API) ---
export const googleSearchTool = createTool({
  id: 'web-search-google', // Unique ID for this tool
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
  // Correctly destructure 'query' and 'numResults'
  execute: async ({ query, numResults }) => {
    // Check if required API keys are configured
    if (!googleApiKey || !googleCx) {
      console.warn(
        'Google API Key or Search Engine ID (CX) is not configured.',
      );
      return {
        results: 'Search tool (Google) is not configured.',
        count: 0,
      };
    }
    try {
      // Construct the Google Custom Search API URL
      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('key', googleApiKey); // API Key
      url.searchParams.append('cx', googleCx); // Search Engine ID
      url.searchParams.append('q', query); // Search query
      url.searchParams.append('num', numResults.toString()); // Number of results

      // Perform the fetch request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `Google Custom Search API Error (${response.status}): ${errorBody}`,
        );
        throw new Error(
          `Google Custom Search API request failed with status ${response.status}`,
        );
      }

      // Parse the JSON response
      const data = await response.json();

      // Handle cases where no items are returned
      if (!data.items || data.items.length === 0) {
        return { results: 'No results found.', count: 0 };
      }

      // Define an interface for the expected result structure
      interface GoogleSearchResult {
        title?: string;
        link?: string; // Google uses 'link' for the URL
        snippet?: string;
      }

      // Format the results into a single string
      const formattedResults = (data.items as GoogleSearchResult[])
        .map((item, index) => {
          // Provide defaults for potentially missing fields
          const title = item.title || 'No Title';
          const url = item.link || 'No URL';
          const snippet = item.snippet || 'No Snippet';
          // Format each result clearly
          return `[${index + 1}] ${title}\nURL: ${url}\nSnippet: ${snippet}\n`;
        })
        .join('\n'); // Join results with newlines

      // Return the formatted results and count
      return {
        results: formattedResults,
        count: data.items.length,
      };
    } catch (error) {
      // Log the error and return a user-friendly error message
      console.error('Google Search Tool Execution Error:', error);
      return {
        results: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        count: 0,
      };
    }
  },
});

// --- Vector Search Tool ---
/**
 * Helper function to create the vector search tool using Mastra RAG.
 * Allows agents to search through embedded document vectors.
 * @param model - The embedding model instance (e.g., from @ai-sdk/google). Type should be specific if known.
 * @returns The configured vector query tool.
 */
const createVectorSearchTool = (
  model: any, // TODO: Replace 'any' with specific model type if possible
) =>
  createVectorQueryTool({
    vectorStoreName: 'upstash', // Must match the name used when configuring the vector store in Mastra
    indexName: 'documents', // Must match the name of your Upstash Vector index
    model, // The embedding model used for querying
    description:
      'Search through internal knowledge base documents (like project documentation, notes, saved conversations, etc.) to find relevant information based on semantic meaning. Use this for questions about internal project details or past information.',
    // Optional: Customize input/output schemas if needed
    // inputSchema: z.object({ ... }),
    // outputSchema: z.object({ ... }),
  });

// --- Tool Exports ---
/**
 * Exported collection of tools available to the Mastra instance.
 * The vectorSearch tool is added dynamically after initialization.
 */
export const tools: Record<string, Tool<any, any, any>> = {
  // Using Record<string, Tool<any, any, any>> for simplicity, specific types are better if known
  webSearchFirecrawl: webSearchTool, // Tool for general web search via FireCrawl
  googleSearch: googleSearchTool, // Tool for web search via Google Custom Search
  // 'vectorSearch' will be added dynamically by the initializer function below
};

/**
 * Initializes the vector search tool and adds it to the exported tools collection.
 * This function should be called from the main Mastra setup (e.g., mastra/index.ts)
 * after the embedding model has been initialized.
 * @param embeddingModel - The initialized embedding model instance. Type should be specific if known.
 * @returns The complete collection of tools including the initialized vector search tool.
 */
export const initializeVectorSearchTool = (embeddingModel: any) => {
  // TODO: Replace 'any' with specific model type
  // Create the vector search tool using the provided embedding model
  const vectorSearchToolInstance = createVectorSearchTool(embeddingModel);
  // Add the initialized tool to the exported 'tools' object
  tools.vectorSearch = vectorSearchToolInstance;
  // Return the mutated 'tools' object containing all tools
  return tools;
};
