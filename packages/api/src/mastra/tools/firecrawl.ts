import { createTool } from '@mastra/core';
import { z } from 'zod';
import Firecrawl from '@mastra/firecrawl'; // Use default import
import { getEnvVar } from '../../utils/env';

/**
 * Configuration for the Firecrawl tool.
 * Requires the FIRECRAWL_API_KEY environment variable to be set.
 */
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

if (!firecrawlApiKey) {
  console.warn(
    'FIRECRAWL_API_KEY environment variable not set. Firecrawl tool will not function.',
  );
}

/**
 * Mastra tool for scraping web content using the Firecrawl API.
 *
 * @throws {Error} If the FIRECRAWL_API_KEY environment variable is not set.
 * @throws {Error} If the Firecrawl API request fails.
 */
export const firecrawlTool = createTool({
  id: 'Firecrawl Web Scraper',
  description:
    'Scrapes a given URL using Firecrawl and returns the content, typically in Markdown format.',
  inputSchema: z.object({
    url: z.string().url({ message: 'Invalid URL provided.' }),
    // Add other Firecrawl parameters as needed, e.g., pageOptions, crawlerOptions
    // See Firecrawl documentation for available options:
    // https://docs.firecrawl.dev/api-reference/scrape-url
    params: z
      .object({
        pageOptions: z
          .object({
            screenshot: z.boolean().optional(),
            onlyMainContent: z.boolean().optional(),
          })
          .optional(),
        extractorOptions: z
          .object({
            mode: z.enum(['markdown', 'llm-extraction']).optional(),
            // Use z.object for specific schemas
            extractionPrompt: z.string().optional(),
            })
            .optional(),
          crawlerOptions: z
            .object({
            includes: z.array(z.string()).optional(),
            excludes: z.array(z.string()).optional(),
            maxDepth: z.number().int().positive().optional(),
            limit: z.number().int().positive().optional(),
            returnOnlyUrls: z.boolean().optional(),
            })
            .optional(),
          })
          .optional(),
        }),
  /**
   * Executes the Firecrawl scrape operation.
   * @param context - The input context containing the URL and optional parameters.
   * @param context.url - The URL of the website to scrape.
   * @param context.params - Optional parameters for the Firecrawl scrape/crawl operation.
   * @returns A promise resolving to the scraped data object.
   * @throws {Error} If the API key is missing or the API call fails.
   */
  execute: async ({ context: { url, params } }): Promise<unknown> => {
    if (!firecrawlApiKey) {
      throw new Error(
        'Firecrawl API key is not configured. Set the FIRECRAWL_API_KEY environment variable.',
      );
    }

    console.log(`Using Firecrawl tool for URL: ${url}`);
    const apiKey = getEnvVar('FIRECRAWL_API_KEY');
    if (!apiKey) {
      // Throw error immediately if the key is missing, preventing client instantiation
      throw new Error(
      'Firecrawl API key is not configured. Set the FIRECRAWL_API_KEY environment variable.',
      );
    }
    const client = new Firecrawl({ apiKey: apiKey });
    // Safely destructure potential parameters
    const { pageOptions, extractorOptions, crawlerOptions } = params ?? {};

    try {
      // Determine if it's a crawl or scrape based on crawlerOptions
      if (crawlerOptions) {
        console.log('Performing Firecrawl crawl operation...');
        // Construct parameters specifically for crawlUrl
        // Note: Check Firecrawl documentation for exact expected structure for crawlUrl params
        const crawlParams = {
            pageOptions, // crawlUrl might accept pageOptions
            crawlerOptions,
        };
        const crawlResult = await client.crawlUrl(url, crawlParams, {
          timeout: 300000, // 5 minutes
        });
        // Ensure crawlResult is serializable (check for non-serializable types if necessary)
        return crawlResult; // Adjust based on expected structure.
      } else {
        console.log('Performing Firecrawl scrape operation...');
        // Construct parameters specifically for scrapeUrl
        const scrapeParams = {
            pageOptions,
            extractorOptions,
        };
        const scrapeResult = await client.scrapeUrl(url, scrapeParams);
        // Ensure scrapeResult is serializable
        return scrapeResult;
      }
    } catch (error) {
      console.error('Firecrawl API request failed:', error);
      // Throw a more specific error or handle it based on application needs
      throw new Error(`Failed to scrape ${url} using Firecrawl.`);
    }
  },
});
