// src/services/store-embeddings.ts

import { PineconeVector } from '@mastra/pinecone'; // Correct package import
import { getEnvVar } from '../../utils/env';

// Add Document interface above the existing interfaces in the file

/**
 * Document structure for storing and retrieving text content with metadata
 */
export interface Document {
  text: string;
  metadata?: Record<string, any>;
}

// Interfaces for data structures (can be refined based on actual query results)
export interface EmbeddingData {
  id: string;
  vector: number[];
  metadata?: Record<string, any>;
}

export type QueryFilter = Record<string, any>;

// Define a structure for query results based on documentation/common patterns
// Adjust based on what @mastra/pinecone actually returns
export interface QueryResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
  vector?: number[];
}

// Add this near the top of the file with other interfaces
/**
 * Interface for the embedding model that converts text to vector embeddings
 */
export interface EmbeddingModelInterface<T> {
  embed(text: string): Promise<T>;
}

// --- Configuration (Load from environment variables) ---
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME;
const embeddingDimensionStr = process.env.EMBEDDING_MODEL_DIMENSION;

// --- Strict Validation ---
if (!pineconeApiKey) {
  throw new Error('Missing environment variable: PINECONE_API_KEY');
}
if (!pineconeEnvironment) {
  throw new Error('Missing environment variable: PINECONE_ENVIRONMENT');
}
if (!pineconeIndexName) {
  throw new Error('Missing environment variable: PINECONE_INDEX_NAME');
}
if (!embeddingDimensionStr) {
  throw new Error('Missing environment variable: EMBEDDING_MODEL_DIMENSION');
}

const embeddingDimension = parseInt(embeddingDimensionStr, 10);
if (isNaN(embeddingDimension) || embeddingDimension <= 0) {
  throw new Error(
    'Invalid environment variable: EMBEDDING_MODEL_DIMENSION must be a positive integer.',
  );
}

console.log(
  `Pinecone Service: Index=${pineconeIndexName}, Env=${pineconeEnvironment}, Dim=${embeddingDimension}`,
);

// --- Pinecone Embedding Store Service ---
export class EmbeddingStoreService {
  [x: string]: any;
  private pineconeStore: PineconeVector;
  public isInitialized: boolean = false;
  public readonly indexName: string;
  public readonly dimension: number;
  private embeddingModel: EmbeddingModelInterface<number[]> | null = null;
  private embeddingModelName: string;

  constructor() {
    // Config validated above
    // Assuming PineconeVector constructor from '@mastra/pinecone' expects only the API key string
    // based on the compile error. Adjust if the library's API is different.
    this.pineconeStore = new PineconeVector(pineconeApiKey!);
    this.indexName = pineconeIndexName!;
    this.dimension = embeddingDimension;
    this.embeddingModelName = process.env.PINECONE_MODEL || 'llama-text-embed-v2';
    console.log(`Using embedding model: ${this.embeddingModelName}`);
    console.log(
      `EmbeddingStoreService instance created for Pinecone index: ${this.indexName}`,
    );
  }

  /**
   * Sets the embedding model to use for text-to-vector conversion
   * @param model The embedding model that converts text to vectors
   */
  setEmbeddingModel(model: EmbeddingModelInterface<number[]>): void {
    this.embeddingModel = model;
    console.log(`[${this.indexName}] Embedding model set to ${this.embeddingModelName}`);
  }

  /**
   * Generates an embedding vector from text using the configured model
   * @param text Text to convert to an embedding vector
   * @returns Promise resolving to a numeric vector
   * @throws Error if no embedding model is set
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.embeddingModel) {
      throw new Error(`[${this.indexName}] No embedding model set. Call setEmbeddingModel() first.`);
    }

    try {
      const embedding = await this.embeddingModel.embed(text);
      if (embedding.length !== this.dimension) {
        console.warn(
          `[${this.indexName}] Embedding dimension mismatch: got ${embedding.length}, expected ${this.dimension}`,
        );
      }
      return embedding;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${this.indexName}] Failed to generate embedding: ${message}`);
      throw error;
    }
  }

  /**
   * Initializes connection and verifies/creates the Pinecone index.
   * MUST be called before other methods.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log(
        `Pinecone service for index "${this.indexName}" already initialized.`,
      );
      return;
    }

    console.log(`Initializing Pinecone index "${this.indexName}"...`);
    try {
      const existingIndexes = await this.pineconeStore.listIndexes();
      console.log('Available Pinecone indexes:', existingIndexes);

      if (!existingIndexes.includes(this.indexName)) {
        console.log(
          `Index "${this.indexName}" not found. Creating (Dim: ${this.dimension}, Metric: cosine)...`,
        );
        await this.pineconeStore.createIndex({
          indexName: this.indexName,
          dimension: this.dimension,
          metric: 'cosine', // Default, change if needed
        });
        console.log(`Index "${this.indexName}" created. Waiting briefly...`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Allow time for index readiness
      } else {
        console.log(`Index "${this.indexName}" exists. Verifying dimension...`);
        // Pass index name directly as a string
        const stats = await this.pineconeStore.describeIndex(this.indexName);
        if (stats.dimension !== this.dimension) {
          throw new Error(
            `CRITICAL: Pinecone index "${this.indexName}" dimension (${stats.dimension}) does not match configured dimension (${this.dimension}).`,
          );
        }
        console.log(
          `Index "${this.indexName}" dimension verified (${this.dimension}).`,
        );
      }
      this.isInitialized = true;
      console.log(
        `Pinecone service initialized successfully for index "${this.indexName}".`,
      );
    } catch (error: unknown) {
      // Catch 'unknown' and check type for safe error handling
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(
        `FATAL: Failed to initialize Pinecone service for index "${this.indexName}": ${message}`,
      );
      if (stack) {
        console.error('Stack:', stack);
      }
      // Re-throw to prevent application start/use in bad state
      throw error;
    }
  }

  /** Ensures the service was initialized */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(
        `Pinecone service for index "${this.indexName}" has not been initialized. Call initialize() first.`,
      );
    }
  }

  /**
   * Upserts (adds or updates) embedding vectors into the Pinecone index.
   * @param embeddings Array of EmbeddingData objects.
   * @param namespace Optional Pinecone namespace.
   */
  async upsertEmbeddings(
    embeddings: EmbeddingData[],
    namespace?: string,
  ): Promise<void> {
    this.ensureInitialized();
    if (!embeddings || embeddings.length === 0) {
      console.warn(`[${this.indexName}] No embeddings provided for upsert.`);
      return;
    }

    // Validate dimensions before sending batch
    for (const emb of embeddings) {
      if (emb.vector.length !== this.dimension) {
        throw new Error(
          `[${this.indexName}] Vector dimension mismatch for id "${emb.id}". Expected ${this.dimension}, got ${emb.vector.length}.`,
        );
      }
    }

    const nsInfo = namespace ? ` in namespace "${namespace}"` : '';
    console.log(
      `[${this.indexName}] Upserting ${embeddings.length} embeddings${nsInfo}...`,
    );
    try {
      await this.pineconeStore.upsert({
        indexName: this.indexName,
        vectors: embeddings.map((e) => e.vector),
        ids: embeddings.map((e) => e.id),
        metadata: embeddings.map((e) => e.metadata || {}), // Ensure metadata is at least {}
        namespace: namespace,
      });
      console.log(
        `[${this.indexName}] Successfully upserted ${embeddings.length} embeddings${nsInfo}.`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(
        `[${this.indexName}] Failed to upsert embeddings${nsInfo}: ${message}`,
      );
      if (stack) {
        console.error('Stack:', stack);
      }
      throw error; // Re-throw
    }
  }

  /**
   * Queries the Pinecone index for vectors similar to the queryVector.
   * @param queryVector The vector to search with.
   * @param topK Number of results to return.
   * @param filter Optional metadata filter.
   * @param namespace Optional namespace to query within.
   * @param includeVector Whether to include the vector data in results (default: false).
   * @returns Array of QueryResult objects.
   */
  async queryEmbeddings(
    queryVector: number[],
    topK: number = 10,
    filter?: QueryFilter,
    namespace?: string,
    includeVector: boolean = false, // Metadata is typically included by default
  ): Promise<QueryResult[]> {
    this.ensureInitialized();

    if (queryVector.length !== this.dimension) {
      throw new Error(
        `[${this.indexName}] Query vector dimension mismatch. Expected ${this.dimension}, got ${queryVector.length}.`,
      );
    }

    const nsInfo = namespace ? ` in namespace "${namespace}"` : '';
    const filterInfo = filter ? ` with filter` : '';
    console.log(
      `[${this.indexName}] Querying (top ${topK})${nsInfo}${filterInfo}...`,
    );
    try {
      const results = await this.pineconeStore.query({
        indexName: this.indexName,
        vector: queryVector,
        topK: topK,
        filter: filter,
        namespace: namespace,
        includeVector: includeVector,
        // includeMetadata: true // Usually implied/default, pass if explicitly needed by API
      });
      console.log(
        `[${this.indexName}] Query returned ${results.length} results.`,
      );
      return results as QueryResult[]; // Cast to defined interface (adjust if needed)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(
        `[${this.indexName}] Failed to query embeddings${nsInfo}: ${message}`,
      );
      if (stack) {
        console.error('Stack:', stack);
      }
      throw error; // Re-throw
    }
  }

  /**
   * Deletes vectors by their IDs from the Pinecone index.
   * Note: Uses iterative delete based on documented `deleteIndexById`. Check for batch methods if performance is critical.
   * @param ids Array of vector IDs to delete.
   * @param namespace Optional namespace to delete from.
   */
  async deleteEmbeddingsById(ids: string[], namespace?: string): Promise<void> {
    this.ensureInitialized();
    if (!ids || ids.length === 0) {
      console.warn(`[${this.indexName}] No vector IDs provided for deletion.`);
      return;
    }

    const nsInfo = namespace ? ` from namespace "${namespace}"` : '';
    console.log(
      `[${this.indexName}] Deleting ${ids.length} vectors by ID${nsInfo} (iteratively)...`,
    );
    let deletedCount = 0;
    let failedCount = 0;

    // Delete one by one as per documented method `deleteIndexById`
    for (const id of ids) {
      try {
        // Pass indexName and id as separate arguments
        await this.pineconeStore.deleteIndexById(this.indexName, id);
        // Note: Namespace might need to be handled differently if supported,
        // e.g., via a different method or if the signature is (indexName, id, namespace)
        deletedCount++;
      } catch (error: unknown) {
        failedCount++;
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        console.error(
          `[${this.indexName}] Failed to delete vector with ID "${id}"${nsInfo}: ${message}`,
        );
        if (stack) {
          console.error(
            `[${this.indexName}] Stack trace for ID "${id}":`,
            stack,
          );
        }
        // Decide: continue deleting others or throw immediately?
        // For now, continue and report summary.
      }
    }

    console.log(
      `[${this.indexName}] Deletion summary: ${deletedCount} successful, ${failedCount} failed.`,
    );
    if (failedCount > 0) {
      // Throw an aggregate error or just log depending on requirements
      throw new Error(
        `[${this.indexName}] Failed to delete ${failedCount} out of ${ids.length} vectors.`,
      );
    }
  }

  /**
   * Fetches statistics about the index.
   */
  async describeIndex(): Promise<{
    dimension: number;
    count: number;
    metric: string;
  }> {
    this.ensureInitialized();
    console.log(`[${this.indexName}] Describing index...`);
    try {
      // Pass index name directly as a string
      const stats = await this.pineconeStore.describeIndex(this.indexName);
      console.log(`[${this.indexName}] Stats:`, stats);
      // Adjust type assertion if the actual return type differs slightly
      return stats as { dimension: number; count: number; metric: string };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(`[${this.indexName}] Failed to describe index: ${message}`);
      if (stack) {
        console.error('Stack:', stack);
      }
      throw error; // Re-throw the error after logging
    }
  }

  // Add updateIndexById if needed, using similar error handling

  /**
   * Process and store a document by converting its text to embeddings
   * @param document Document to process and store
   * @returns Array of chunk IDs created from the document
   */
  async processAndStoreDocument(document: Document): Promise<string[]> {
    this.ensureInitialized();

    if (!document.text || document.text.trim() === '') {
      console.warn(`[${this.indexName}] Document has no text content.`);
      return [];
    }

    console.log(`[${this.indexName}] Processing document for storage...`);

    try {
      // Create a unique ID for this document chunk
      const id = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Generate embedding vector from text
      let embedding: number[];

      if (this.embeddingModel) {
        // Use the configured embedding model
        embedding = await this.generateEmbedding(document.text);
        console.log(`[${this.indexName}] Generated embedding with dimension: ${embedding.length}`);
      } else {
        // Fallback to placeholder if no model is available
        console.warn(`[${this.indexName}] No embedding model set, using placeholder vector`);
        embedding = new Array(this.dimension).fill(0);
      }

      // Create embedding data object
      const embeddingData: EmbeddingData = {
        id,
        vector: embedding,
        metadata: {
          ...document.metadata,
          // Store a preview of the text in metadata
          text: document.text.length > 100
            ? document.text.substring(0, 100) + '...'
            : document.text,
          fullTextLength: document.text.length,
          timestamp: new Date().toISOString(),
        }
      };

      // Store the embedding in Pinecone
      await this.upsertEmbeddings([embeddingData]);

      console.log(`[${this.indexName}] Document processed and stored with ID: ${id}`);
      return [id];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(`[${this.indexName}] Failed to process and store document: ${message}`);
      if (stack) {
        console.error('Stack:', stack);
      }
      throw error;
    }
  }

  /**
   * Query for documents similar to the given text query
   * @param query Text query to search for
   * @param topK Number of results to return
   * @param filter Optional metadata filter
   * @returns Array of similar document results
   */
  async querySimilarDocuments(
    query: string,
    topK: number = 10,
    filter?: QueryFilter,
  ): Promise<
    Array<{
      id: string;
      score: number;
      text: string;
      metadata: Record<string, any>;
    }>
  > {
    this.ensureInitialized();

    if (!query || query.trim() === '') {
      console.warn(`[${this.indexName}] Empty query provided.`);
      return [];
    }

    console.log(
      `[${this.indexName}] Searching for documents similar to query...`,
    );

    try {
      // Generate embedding for query text
      let queryVector: number[];

      if (this.embeddingModel) {
        // Use the configured embedding model
        queryVector = await this.generateEmbedding(query);
        console.log(`[${this.indexName}] Generated query embedding with dimension: ${queryVector.length}`);
      } else {
        // Fallback to placeholder if no model is available
        console.warn(`[${this.indexName}] No embedding model set, using placeholder vector for query`);
        queryVector = new Array(this.dimension).fill(0);
      }

      // Query the vector store using the generated embedding
      const results = await this.queryEmbeddings(queryVector, topK, filter);

      // Format results
      return results.map(result => ({
        id: result.id,
        score: result.score,
        text: result.metadata?.text || '',
        metadata: result.metadata || {},
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(`[${this.indexName}] Failed to query similar documents: ${message}`);
      if (stack) {
        console.error('Stack:', stack);
      }
      // Return empty results rather than throwing
      return [];
    }
  }
}

// --- Singleton Instance Accessor ---
// Ensures only one instance of the service is created.
let serviceInstance: EmbeddingStoreService | null = null;

export function getEmbeddingStoreService(): EmbeddingStoreService {
  if (!serviceInstance) {
    serviceInstance = new EmbeddingStoreService();
  }
  return serviceInstance;
}

// --- Optional: Function to initialize the service globally ---
// Call this during your application's startup sequence.
export async function initializeGlobalEmbeddingStore(): Promise<EmbeddingStoreService> {
  const service = getEmbeddingStoreService();
  if (!service.isInitialized) {
    await service.initialize();
  }
  return service;
}
