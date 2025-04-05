import { createDocumentChunkerTool, MDocument } from '@mastra/rag';

const document = new MDocument({
  docs: [{ // Wrap document content in the 'docs' array
    text: 'Your document content here...',
    metadata: { source: 'user-manual' },
  }],
  type: 'text', // Add the required 'type' property
});

const chunker = createDocumentChunkerTool({
  doc: document,
  params: {
    strategy: 'recursive',
    size: 512,
    overlap: 50,
    separator: '\n',
  },
});

/**
 * Executes the document chunker tool.
 * @returns A promise that resolves with the document chunks.
 * @throws Error if the chunker execute function is not available.
 */
async function runChunker(): Promise<unknown> {
  if (!chunker?.execute) {
    throw new Error('Chunker execute function is not available.');
  }
  const chunks = await chunker.execute({ context: {} });
  console.log('Document chunks:', chunks); // Example usage
  return chunks;
}

// Invoke the async function
runChunker().catch((error) => {
  console.error('Error running chunker:', error);
  process.exit(1); // Exit with error code if chunking fails
});
