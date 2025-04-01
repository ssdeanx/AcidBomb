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

const chunks = await chunker.execute();
