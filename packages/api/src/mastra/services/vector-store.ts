import { PineconeVector } from '@mastra/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEnvVar } from '../../utils/env';
const pc = new Pinecone({
  apiKey: getEnvVar('PINECONE_API_KEY'),
});
const index = pc.index('quickstart');

const store = new PineconeVector(process.env.PINECONE_API_KEY);
await store.createIndex({
  indexName: 'db',
  dimension: 2048,
  metadata: { description: 'My vector collection' },
});
await index.namespace('ns1').upsert([
  {
    id: 'vec1',
    values: [1.0, 1.5],
    metadata: { genre: 'drama' },
  },
  {
    id: 'vec2',
    values: [2.0, 1.0],
    metadata: { genre: 'action' },
  },
  {
    id: 'vec3',
    values: [0.1, 0.3],
    metadata: { genre: 'drama' },
  },
  {
    id: 'vec4',
    values: [1.0, -2.5],
    metadata: { genre: 'action' },
  },
]);
// Define the embeddings array (vector data)
const embeddings = [
  { id: '1', values: [0.1, 0.2, 0.3, 0.4, 0.5] }, // Example vector embedding
  { id: '2', values: [0.6, 0.7, 0.8, 0.9, 1.0] },
  { id: '3', values: [0.2, 0.3, 0.4, 0.5, 0.6] },
  { id: '4', values: [0.7, 0.8, 0.9, 1.0, 1.1] },
];

// Define the chunks if not already defined
const chunks = [
  // Add your text chunks here
  // Example: { text: 'Some text content' }
];

await store.upsert({
  indexName: 'db',
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
});
const response = await index.namespace('ns1').query({
  topK: 2,
  vector: [0.1, 0.3],
  includeValues: true,
  includeMetadata: true,
  filter: { genre: { $eq: 'action' } },
});

console.log(response);
