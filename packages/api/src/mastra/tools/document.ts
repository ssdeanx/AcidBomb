import { embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { PineconeVector } from '@mastra/pinecone';
import { PINECONE_PROMPT } from "@mastra/rag";
import { MDocument } from '@mastra/rag';
import { vectorStore } from 'database';

/**
 * Processes a document, chunks it, generates embeddings, stores them,
 * and queries for similar documents.
 */
async function processDocument() {
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

  // Generate embeddings with Google Gemini
  // Note: 'gemini-embedding-exp-03-07' is used based on existing code/env.
  // Refer to official Google documentation for the latest recommended embedding models.
  const { embeddings: geminiEmbeddings } = await embedMany({
    model: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
    values: chunks.map((chunk) => chunk.text),
  });



  // Store embeddings in your vector database
  await vectorStore.upsert(
    geminiEmbeddings.map((embedding, i) => ({
      id: `chunk-${i}`, // Generate an ID based on the index
      vector: embedding,
      metadata: chunks[i]!.metadata, // Assuming chunks have metadata
    }))
  );

  // Retrieve similar documents from the vector database
  let similarDocuments: unknown[] = []; // Initialize with an empty array or appropriate type
  if (geminiEmbeddings.length > 0 && geminiEmbeddings[0]) {
    const queryVector = geminiEmbeddings[0];
    similarDocuments = await vectorStore.query({
      vector: queryVector, // Use the embedding of the first chunk for the query
      topK: 5,
      includeMetadata: true, // Include metadata in the results
    });
  } else {
    console.warn("No embeddings generated, skipping vector store query.");
  }

  console.log("Similar documents:", similarDocuments);
}

// Execute the function
processDocument().catch(console.error);
