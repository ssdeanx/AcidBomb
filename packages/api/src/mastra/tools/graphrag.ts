import { google } from '@ai-sdk/google';
import { createGraphRAGTool } from '@mastra/rag';

const graphTool = createGraphRAGTool({
  vectorStoreName: 'pinecone',
  indexName: 'docs',
  model: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
  graphOptions: {
    dimension: 1536,
    threshold: 0.7,
    randomWalkSteps: 100,
    restartProb: 0.15,
  },
});


export const getGraphDataWithParams = async (
  query: string,
  params: Record<string, unknown>,
): Promise<unknown> => {
  if (!graphTool?.execute) {
    throw new Error('Graph tool execute function is not available.');
  }
  const data = await graphTool.execute({ context: { query, ...params } });
  return data;
};

export const getGraphData = async (query: string): Promise<unknown> => {
  if (!graphTool?.execute) {
    throw new Error('Graph tool execute function is not available.');
  }
  const data = await graphTool.execute({ context: { query } });
  return data;
};

export default graphTool;
