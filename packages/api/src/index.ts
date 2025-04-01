import { Link } from './links/entities/link.entity';

import { CreateLinkDto } from './links/dto/create-link.dto';
import { UpdateLinkDto } from './links/dto/update-link.dto';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEnvVar } from './utils/env';

const pineconeApiKey = getEnvVar('PINECONE_API_KEY');
const pc = new Pinecone({
  apiKey: pineconeApiKey,
});
const index = pc.index('quickstart');
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
const response = await index.namespace('ns1').query({
  topK: 2,
  vector: [0.1, 0.3],
  includeValues: true,
  includeMetadata: true,
  filter: { genre: { $eq: 'action' } },
});

console.log(response);
export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
  },
};
