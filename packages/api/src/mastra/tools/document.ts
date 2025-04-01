import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { PineconeVector } from '@mastra/pinecone';
import { PINECONE_PROMPT } from "@mastra/rag";
import { MDocument } from '@mastra/rag';
import { vectorStore } from 'database';


// Initialize document
const doc = MDocument.fromText(`
  Climate change poses significant challenges to global agriculture.
  Rising temperatures and changing precipitation patterns affect crop yields.
`);

// Create chunks
const chunks = await doc.chunk({
  strategy: 'recursive',
  size: 256,
  overlap: 50,
});

// Generate embeddings with OpenAI
const { embeddings: openAIEmbeddings } = await embedMany({
  model: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
  values: chunks.map((chunk) => chunk.text),
});



// Store embeddings in your vector database (using OpenAI embeddings as an example)
await vectorStore.upsert(
  openAIEmbeddings.map((embedding, i) => ({
    id: `chunk-${i}`, // Generate an ID based on the index
    vector: embedding,
    metadata: chunks[i].metadata, // Assuming chunks have metadata
  }))
);

// Retrieve similar documents from the vector database
// Retrieve similar documents from the vector database
const similarDocuments = await vectorStore.query({
  vector: openAIEmbeddings[0], // Example: Use the embedding of the first chunk for the query
  topK: 5,
  includeMetadata: true,
});
