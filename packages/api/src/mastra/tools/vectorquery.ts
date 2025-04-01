import { google } from '@ai-sdk/google';
import { createVectorQueryTool } from '@mastra/rag';

const queryTool = createVectorQueryTool({
  vectorStoreName: 'pinecone',
  indexName: 'docs',
  model: google.embedding('text-embedding-3-small'),
});

export const executeQuery = async (query) => {
  const result = await queryTool.execute(query);
  return result;
};

export default queryTool;
