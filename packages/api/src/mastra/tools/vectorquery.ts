import { google } from '@ai-sdk/google';
import { createVectorQueryTool } from '@mastra/rag';

const queryTool = createVectorQueryTool({
  vectorStoreName: 'pinecone',
  indexName: 'docs',
  model: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
});

export const executeQuery = async (query, params) => {
  const result = await queryTool.execute(query, params);
  return result;
};

export const executeQueryWithParams = async (query, params) => {
  const result = await queryTool.execute(query, params);
  return result;
};

export default queryTool;
