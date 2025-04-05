import { google } from '@ai-sdk/google';
import { createVectorQueryTool } from '@mastra/rag';

const queryTool = createVectorQueryTool({
  vectorStoreName: 'pinecone',
  indexName: 'docs',
  model: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
});

export const executeQuery = async (
  query: string,
  params: Record<string, unknown>,
): Promise<unknown> => {
  if (!queryTool?.execute) {
    throw new Error('Vector query tool execute function is not available.');
  }
  const result = await queryTool.execute({ context: { query, ...params } });
  return result;
};

export const executeQueryWithParams = async (
  query: string,
  params: Record<string, unknown>,
): Promise<unknown> => {
  if (!queryTool?.execute) {
    throw new Error('Vector query tool execute function is not available.');
  }
  const result = await queryTool.execute({ context: { query, ...params } });
  return result;
};

export default queryTool;
