/**
 * Vector store service for Mastra using Pinecone.
 * Provides utilities for vector database operations including indexing,
 * querying, and management.
 *
 * @module packages/api/src/mastra/services/vector-store
 */
import { PineconeVector } from '@mastra/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEnvVar } from '../../utils/env';
import { createLogger, LogLevel } from '@mastra/core';

// Logger for vector store operations
const logger = createLogger({
  name: 'VectorStoreService',
  level: LogLevel.INFO,
});

/**
 * Vector embedding with metadata
 */
export interface VectorData {
  /** Unique identifier for the vector */
  id: string;

  /** Vector embedding values */
  values: number[];

  /** Associated metadata for the vector */
  metadata?: Record<string, any>;
}

/**
 * Document chunk with text content
 */
export interface DocumentChunk {
  /** Text content of the chunk */
  text: string;

  /** Optional metadata about the document source */
  metadata?: Record<string, any>;
}

/**
 * Configuration for Pinecone index creation
 */
export interface IndexConfig {
  /** Name of the index to create */
  indexName: string;

  /** Dimension of the vectors to store */
  dimension: number;

  /** Optional metadata for the index */
  metadata?: Record<string, any>;
}

/**
 * Service for vector database operations using Pinecone
 */
export class VectorStoreService {
  private pineconeClient: Pinecone;
  private mastraStore: PineconeVector;

  /**
   * Create a new VectorStoreService instance
   */
  constructor() {
    const apiKey = getEnvVar('PINECONE_API_KEY');

    if (!apiKey) {
      logger.error('PINECONE_API_KEY environment variable is not set');
      throw new Error('Pinecone API key is required');
    }

    // Initialize the native Pinecone client
    this.pineconeClient = new Pinecone({
      apiKey,
    });

    // Initialize the Mastra Pinecone adapter
    this.mastraStore = new PineconeVector(apiKey);

    logger.info('VectorStoreService initialized');
  }

  /**
   * Get the raw Pinecone client for direct operations
   * @returns The initialized Pinecone client instance
   */
  getPineconeClient(): Pinecone {
    return this.pineconeClient;
  }

  /**
   * Get the Mastra Pinecone adapter
   * @returns The initialized PineconeVector instance
   */
  getMastraStore(): PineconeVector {
    return this.mastraStore;
  }

  /**
   * Create a new Pinecone index
   * @param config - Configuration for the index
   * @returns Promise resolving when the index is created
   */
  async createIndex(config: IndexConfig): Promise<void> {
    logger.info(
      `Creating index ${config.indexName} with dimension ${config.dimension}`,
    );

    try {
      await this.mastraStore.createIndex({
        indexName: config.indexName,
        dimension: config.dimension,
        metadata: config.metadata,
      });

      logger.info(`Successfully created index ${config.indexName}`);
    } catch (error) {
      logger.error(`Failed to create index ${config.indexName}:`, error);
      throw error;
    }
  }

  /**
   * Insert vectors into a Pinecone index
   * @param indexName - Name of the index to insert into
   * @param vectors - Array of vectors to insert
   * @param metadata - Array of metadata objects corresponding to each vector
   * @param namespace - Optional namespace within the index
   */
  async upsertVectors(
    indexName: string,
    vectors: VectorData[],
    namespace?: string,
  ): Promise<void> {
    logger.info(
      `Upserting ${vectors.length} vectors to index ${indexName}${namespace ? ` in namespace ${namespace}` : ''}`,
    );

    try {
      const index = this.pineconeClient.index(indexName);

      const nsOperation = namespace ? index.namespace(namespace) : index;

      await nsOperation.upsert(vectors);

      logger.info(`Successfully upserted ${vectors.length} vectors`);
    } catch (error) {
      logger.error(`Failed to upsert vectors to ${indexName}:`, error);
      throw error;
    }
  }

  /**
   * Insert document embeddings into a Pinecone index
   * @param indexName - Name of the index to insert into
   * @param embeddings - Array of vector embeddings with IDs
   * @param chunks - Array of document chunks with text content
   */
  async upsertEmbeddings(
    indexName: string,
    embeddings: { id: string; values: number[] }[],
    chunks: DocumentChunk[],
  ): Promise<void> {
    logger.info(
      `Upserting ${embeddings.length} document embeddings to index ${indexName}`,
    );

    if (embeddings.length !== chunks.length) {
      const error = new Error(
        'Number of embeddings must match number of chunks',
      );
      logger.error(error.message);
      throw error;
    }

    try {
      await this.mastraStore.upsert({
        indexName,
        vectors: embeddings,
        metadata: chunks.map((chunk) => ({
          text: chunk.text,
          ...chunk.metadata,
        })),
      });

      logger.info(
        `Successfully upserted ${embeddings.length} document embeddings`,
      );
    } catch (error) {
      logger.error(
        `Failed to upsert document embeddings to ${indexName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Query similar vectors from a Pinecone index
   * @param indexName - Name of the index to query
   * @param queryVector - Vector to find similar vectors for
   * @param topK - Maximum number of results to return
   * @param filter - Optional metadata filter
   * @param namespace - Optional namespace within the index
   */
  async querySimilar(
    indexName: string,
    queryVector: number[],
    topK: number = 5,
    filter?: Record<string, any>,
    namespace?: string,
  ): Promise<any> {
    logger.info(
      `Querying for ${topK} similar vectors in index ${indexName}${namespace ? ` in namespace ${namespace}` : ''}`,
    );

    try {
      const index = this.pineconeClient.index(indexName);

      const nsOperation = namespace ? index.namespace(namespace) : index;

      const response = await nsOperation.query({
        topK,
        vector: queryVector,
        includeValues: true,
        includeMetadata: true,
        filter,
      });

      logger.info(
        `Retrieved ${response.matches?.length || 0} results from query`,
      );
      return response;
    } catch (error) {
      logger.error(`Failed to query similar vectors from ${indexName}:`, error);
      throw error;
    }
  }

  /**
   * Delete vectors from a Pinecone index
   * @param indexName - Name of the index to delete from
   * @param ids - Array of vector IDs to delete
   * @param namespace - Optional namespace within the index
   */
  async deleteVectors(
    indexName: string,
    ids: string[],
    namespace?: string,
  ): Promise<void> {
    logger.info(
      `Deleting ${ids.length} vectors from index ${indexName}${namespace ? ` in namespace ${namespace}` : ''}`,
    );

    try {
      const index = this.pineconeClient.index(indexName);

      const nsOperation = namespace ? index.namespace(namespace) : index;

      await nsOperation.deleteMany(ids);

      logger.info(`Successfully deleted ${ids.length} vectors`);
    } catch (error) {
      logger.error(`Failed to delete vectors from ${indexName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const vectorStore = new VectorStoreService();
