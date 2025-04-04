import { createTool } from '@mastra/core';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Tool to summarize documents or text of any length
 * Uses the Gemini model to create concise summaries
 */
export const summarizeTool = createTool({
  id: 'Summarize Document',
  inputSchema: z.object({
    text: z.string().describe('The text content to summarize'),
    maxLength: z
      .number()
      .optional()
      .describe('Maximum length of the summary in words'),
    style: z
      .enum(['concise', 'bullet', 'detailed'])
      .optional()
      .describe('Style of summary: concise, bullet points, or detailed'),
  }),
  description:
    'Summarizes documents or text of any length into a concise format',
  execute: async ({ context }) => {
    const { text, maxLength = 200, style = 'concise' } = context;

    if (!text || text.trim().length < 50) {
      return {
        summary: text,
        message: 'Text too short to summarize',
      };
    }

    // Log the summarization request
    console.log(
      `Summarizing text (${text.length} chars) using style: ${style}`,
    );

    try {
      // Configure prompt based on style
      let prompt = '';
      switch (style) {
        case 'bullet':
          prompt = `Summarize the following text in bullet point format with maximum ${maxLength} words:\n\n${text}`;
          break;
        case 'detailed':
          prompt = `Create a detailed summary of the following text with maximum ${maxLength} words, preserving key information and insights:\n\n${text}`;
          break;
        case 'concise':
        default:
          prompt = `Create a concise summary of the following text with maximum ${maxLength} words:\n\n${text}`;
      }

      // Generate summary using Gemini model via generateText
      const { text: summaryText } = await generateText({
        model: google('models/gemini-2.0-flash-latest'), // Use the correct model ID format
        prompt: prompt,
      });

      const summary = summaryText || 'Failed to generate summary';

      return {
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
        style,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Error generating summary:', errorMessage);

      return {
        summary: 'Failed to generate summary',
        error: errorMessage,
      };
    }
  },
});

export default summarizeTool;
