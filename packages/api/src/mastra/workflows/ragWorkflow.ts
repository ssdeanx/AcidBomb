import { Workflow, Step } from '@mastra/core';
import { z } from 'zod';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import queryTool from '../tools/vectorquery';
import { summarizeTool } from '../tools/summarizer';
import { mastraDb } from '../services/database';

/**
 * RAG workflow that retrieves relevant documents and generates a response
 * based on those documents along with a summary
 */
const ragWorkflow = new Workflow({
  name: 'rag-query-workflow',
  triggerSchema: z.object({
    query: z.string().describe('The user query to process'),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe('Maximum number of results to retrieve'),
    generateSummary: z
      .boolean()
      .optional()
      .default(true)
      .describe('Whether to generate a summary'),
    userId: z
      .string()
      .optional()
      .describe('User ID for tracking and personalization'),
  }),
});

// Step 1: Query the vector database
const queryVectorStore = new Step({
  id: 'query-vector-store',
  outputSchema: z.object({
    results: z.array(z.any()).describe('Vector query results'),
    count: z.number().describe('Number of results found'),
    query: z.string().describe('Original query'),
  }),
  execute: async ({ context }) => {
    const { query, maxResults = 5 } = context.triggerData;
    console.log(`[RAG Workflow] Executing vector query for: "${query}"`);

    try {
      // Use the query tool to search for relevant documents
      const results = await queryTool.execute(query, { topK: maxResults });

      return {
        results: results || [],
        count: results?.length || 0,
        query,
      };
    } catch (error) {
      console.error('[RAG Workflow] Vector query error:', error);
      return {
        results: [],
        count: 0,
        query,
      };
    }
  },
  // Add retry configuration for network issues
  retryConfig: {
    attempts: 2,
    delay: 1000,
  },
});

// Step 2: Generate a response based on query and retrieved documents
const generateResponse = new Step({
  id: 'generate-response',
  outputSchema: z.object({
    response: z
      .string()
      .describe('Generated response based on query and documents'),
    sourcesUsed: z.number().describe('Number of sources used in response'),
    sources: z
      .array(
        z.object({
          content: z.string().optional(),
          source: z.string(),
          score: z.number().optional(),
        }),
      )
      .optional()
      .describe('Source document metadata'),
  }),
  execute: async ({ context }) => {
    // Get the previous step result safely
    const queryStepResult = context.steps['query-vector-store'];

    // Check if the previous step was successful
    if (queryStepResult.status !== 'success') {
      return {
        response:
          'I encountered an issue while searching for relevant information.',
        sourcesUsed: 0,
        sources: [],
      };
    }

    // We can safely access the output now that we've verified the status
    const { results, count, query } = queryStepResult.output;

    console.log(`[RAG Workflow] Generating response with ${count} documents`);

    if (count === 0) {
      return {
        response:
          "I couldn't find any relevant information to answer your query.",
        sourcesUsed: 0,
        sources: [],
      };
    }

    // Extract text content from results
    const sources = results.map((result) => {
      return {
        content: result.text || result.metadata?.text || '',
        source: result.metadata?.source || 'unknown',
        score: result.score || 0,
      };
    });

    // Format documents for context
    const documentContext = sources
      .map((doc, i) => `Document ${i + 1} [${doc.source}]:\n${doc.content}\n`)
      .join('\n');

    try {
      // Build prompt with proper context
      const prompt = `Answer the following question based on the provided context documents.
If the documents don't contain relevant information, explain that you don't have enough information.
Include specific information from the documents to support your answer.

Question: ${query}

Context Documents:
${documentContext}

Answer:`;

      // Use generateText with Gemini for response generation
      const { text: responseText } = await generateText({
        model: google('models/gemini-2.0-flash-latest'),
        prompt: prompt,
        maxTokens: 800,
      });

      const response =
        responseText ||
        'Failed to generate response based on the available information.';

      return {
        response,
        sourcesUsed: count,
        sources: sources.map((source) => ({
          source: source.source,
          score: source.score,
          content:
            source.content.length > 100
              ? source.content.substring(0, 100) + '...'
              : source.content,
        })),
      };
    } catch (error) {
      console.error('[RAG Workflow] Response generation error:', error);
      return {
        response:
          'I encountered an error while processing your query with the available information.',
        sourcesUsed: count,
        sources: [],
      };
    }
  },
});

// Step 3: Generate summary (conditional)
const generateSummary = new Step({
  id: 'generate-summary',
  outputSchema: z.object({
    summary: z.string().describe('Summary of the response'),
  }),
  execute: async ({ context }) => {
    // Get the generate-response step result safely
    const responseStepResult = context.steps['generate-response'];

    // Check if the previous step was successful
    if (responseStepResult.status !== 'success') {
      return {
        summary:
          'Cannot generate summary due to issues in response generation.',
      };
    }

    // Access the response from the successful step
    const { response } = responseStepResult.output;

    try {
      console.log('[RAG Workflow] Generating summary of response');

      // Define the expected shape of the summarize tool's result
      interface SummarizeResult {
        summary?: string;
        error?: string;
        // Include other potential fields if necessary
      }

      // CORRECT: Need to pass parameters as the context object
      const result = (await summarizeTool.execute({
        context: {
          text: response,
          maxLength: 100,
          style: 'concise',
        },
      })) as SummarizeResult; // Assert the type here

      return {
        summary: result.summary || 'No summary available.',
      };
    } catch (error) {
      console.error('[RAG Workflow] Summary generation error:', error);
      return {
        summary: 'Failed to generate summary.',
      };
    }
  },
});

// Step 4: Combine results
const combineResults = new Step({
  id: 'combine-results',
  outputSchema: z.object({
    finalResponse: z.string().describe('Final combined response'),
    summary: z.string().optional().describe('Generated summary if requested'),
    sourcesCount: z.number().describe('Number of sources used'),
    sources: z
      .array(
        z.object({
          source: z.string(),
          score: z.number().optional(),
          content: z.string().optional(),
        }),
      )
      .optional()
      .describe('Source references'),
  }),
  execute: async ({ context }) => {
    // Safely access the response step
    const responseStepResult = context.steps['generate-response'];
    const summaryStepResult = context.steps['generate-summary'];

    // Default values in case steps weren't successful
    let response = 'Unable to generate a response.';
    let sourcesUsed = 0;
    let sources = [];
    let summary = '';

    // Extract response information if available
    if (responseStepResult.status === 'success') {
      const responseOutput = responseStepResult.output;
      response = responseOutput.response;
      sourcesUsed = responseOutput.sourcesUsed;
      sources = responseOutput.sources || [];
    }

    // Extract summary if available and requested
    const generateSummaryOption = context.triggerData.generateSummary;
    if (generateSummaryOption && summaryStepResult?.status === 'success') {
      summary = summaryStepResult.output.summary;
    }

    // Optional: Store usage data for the user
    const userId = context.triggerData.userId;
    if (userId) {
      try {
        await mastraDb
          .storeConversation(userId, 'rag-workflow', [
            { role: 'user', content: context.triggerData.query },
            { role: 'assistant', content: response },
          ])
          .catch((err) => {
            // Log but don't interrupt workflow
            console.error('[RAG Workflow] Failed to store conversation:', err);
          });
      } catch (err) {
        // Non-critical error, just log
        console.error('[RAG Workflow] Error in storeConversation:', err);
      }
    }

    return {
      finalResponse: response,
      summary: summary || undefined,
      sourcesCount: sourcesUsed,
      sources: sources.length > 0 ? sources : undefined,
    };
  },
});

// Define workflow sequence
ragWorkflow
  .step(queryVectorStore)
  .then(generateResponse)
  .step(generateSummary, {
    when: async ({ context }) => context.triggerData.generateSummary === true,
  })
  .step(combineResults);

// Commit the workflow
ragWorkflow.commit();

export { ragWorkflow };
