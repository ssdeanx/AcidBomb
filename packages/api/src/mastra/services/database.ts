/**
 * Database service for Mastra
 * Provides database access for agents and tools
 *
 * @module packages/api/src/mastra/services/database
 */

import { createLogger, LogLevel } from '@mastra/core';
import { createId } from '@paralleldrive/cuid2';
import { EmbeddingModel } from 'ai';
import { EmbeddingStoreService, Document } from './store-embeddings';
import { getEnvVar } from '../../utils/env';
import { db, vectorOperations, redisOperations } from '../../database';

// Logger for database operations
const logger = createLogger({
  name: 'MastraDatabase',
  level: LogLevel.INFO,
});

/**
 * Message format for storing conversations
 */
export interface MessageData {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Database service for Mastra agents
 */
export class MastraDatabase {
  private embeddingService: EmbeddingStoreService | null = null;
  private indexName: string;

  constructor() {
    this.indexName = getEnvVar('PINECONE_INDEX_NAME', 'default-index');
    logger.info(`MastraDatabase initialized with index ${this.indexName}`);
  }

  /**
   * Initialize the embedding service with a model
   * Called after models are available
   *
   * @param embeddingModel - The embedding model to use
   */
  initEmbeddingService(embeddingModel: EmbeddingModel<number[]>): void {
    if (!this.embeddingService) {
      // TODO: Refactor EmbeddingStoreService to accept model/indexName
      // potentially in constructor or a dedicated setup method before initialize.
      // For now, assuming EmbeddingStoreService configures itself internally.
      this.embeddingService = new EmbeddingStoreService();
      // The embeddingModel might need to be stored or passed differently
      // depending on how EmbeddingStoreService uses it.
      this.embeddingService.initialize();
      logger.info('Embedding service initialized');
    }
  }

  /**
   * Store a conversation in the database
   *
   * @param userId - User ID for the conversation
   * @param agentId - Agent ID that handled the conversation
   * @param messages - Array of messages in the conversation
   * @returns The conversation ID
   */
  async storeConversation(
    userId: string,
    agentId: string,
    messages: MessageData[],
  ): Promise<string> {
    const conversationId = createId();

    try {
      // Create conversation metadata (could store in Redis/Supabase)
      const metadata = {
        userId,
        agentId,
        messageCount: messages.length,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Log the conversation storage
      logger.info(
        `Storing conversation ${conversationId} for user ${userId} with agent ${agentId}`,
      );

      // TODO: Implement actual storage in database
      // This would typically use Supabase or another database client

      // Also store the conversation content in vector store for semantic search
      await this.storeConversationEmbeddings(
        conversationId,
        userId,
        agentId,
        messages,
      );

      return conversationId;
    } catch (error) {
      logger.error(`Failed to store conversation for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Store conversation messages as embeddings in the vector store
   *
   * @param conversationId - ID of the conversation
   * @param userId - User ID associated with the conversation
   * @param agentId - Agent ID that handled the conversation
   * @param messages - Array of messages to store
   */
  async storeConversationEmbeddings(
    conversationId: string,
    userId: string,
    agentId: string,
    messages: MessageData[],
  ): Promise<void> {
    // Skip if embedding service isn't initialized
    if (!this.embeddingService) {
      logger.warn(
        'Embedding service not initialized, skipping conversation embedding storage',
      );
      return;
    }

    try {
      // Prepare documents for embedding
      const documents: Document[] = messages.map((message, index) => ({
        text: message.content,
        metadata: {
          conversationId,
          userId,
          agentId,
          messageIndex: index,
          role: message.role,
          timestamp: new Date().toISOString(),
          ...message.metadata,
        },
      }));

      // Process and store each document individually
      // TODO: Consider batching if EmbeddingStoreService supports it for efficiency
      let storedCount = 0;
      for (const doc of documents) {
        try {
          // Assuming processAndStoreDocument exists and handles chunking internally
          // Pass chunk options if the method accepts them, otherwise remove them.
          // Adjust based on the actual signature of processAndStoreDocument.
          await this.embeddingService.processAndStoreDocument(
            doc /*, { chunkSize: 500, chunkOverlap: 100 } */,
          );
          storedCount++;
        } catch (docError) {
          logger.error(
            `Failed to store embedding for one message in conversation ${conversationId}:`,
            docError,
          );
          // Decide whether to continue or stop on partial failure
        }
      }

      logger.info(
        `Stored ${storedCount} out of ${messages.length} conversation messages as embeddings for conversation ${conversationId}`,
      );
    } catch (error) {
      logger.error(
        `Failed to store conversation embeddings for ${conversationId}:`,
        error,
      );
      // Don't throw, just log - this is a non-critical operation
    }
  }

  /**
   * Store document embeddings in vector store
   *
   * @param userId - User ID associated with the document
   * @param document - Document content and metadata
   * @returns ID of the stored document
   */
  async storeDocument(userId: string, document: Document): Promise<string[]> {
    // Skip if embedding service isn't initialized
    if (!this.embeddingService) {
      logger.warn(
        'Embedding service not initialized, skipping document embedding storage',
      );
      throw new Error('Embedding service not initialized');
    }

    try {
      // Add user ID to metadata
      const documentWithUser: Document = {
        ...document,
        metadata: {
          ...document.metadata,
          userId,
          timestamp: new Date().toISOString(),
        },
      };

      // Process and store the document
      const chunkIds =
        await this.embeddingService.processAndStoreDocument(documentWithUser);

      logger.info(
        `Stored document with ${chunkIds.length} chunks for user ${userId}`,
      );

      return chunkIds;
    } catch (error) {
      logger.error(`Failed to store document for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Search for similar content in the vector store
   *
   * @param query - Query text to find similar content
   * @param userId - Optional user ID to filter results
   * @param topK - Maximum number of results to return
   * @returns Array of similar document chunks
   */
  async searchSimilarContent(
    query: string,
    userId?: string,
    topK: number = 5,
  ): Promise<any[]> {
    // Skip if embedding service isn't initialized
    if (!this.embeddingService) {
      logger.warn(
        'Embedding service not initialized, skipping similar content search',
      );
      return [];
    }

    try {
      // Build filter for the query
      const filter = userId ? { userId } : undefined;

      // Query the vector store
      const results = await this.embeddingService.querySimilarDocuments(
        query,
        topK,
        filter,
      );

      logger.info(`Found ${results.length} similar content items for query`);

      return results;
    } catch (error) {
      logger.error('Failed to search for similar content:', error);
      return []; // Return empty array on error, don't break the flow
    }
  }

  /**
   * Store embeddings in vector store
   */
  async storeEmbeddings(
    documents: Array<{
      id: string;
      vector: number[];
      metadata: {
        documentId: string;
        title: string;
        source: string;
        type: 'document' | 'conversation' | 'memory';
        userId?: string;
        createdAt: string;
      };
    }>,
  ) {
    return vectorOperations.upsert(documents);
  }

  /**
   * Query similar embeddings
   */
  async querySimilar(vector: number[], topK = 5) {
    return vectorOperations.query(vector, { topK });
  }

  /**
   * Store memory in Redis
   */
  async storeMemory(key: string, memory: unknown, ttlSeconds?: number) {
    return redisOperations.set(key, memory, ttlSeconds);
  }

  /**
   * Retrieve memory from Redis
   */
  async getMemory<T>(key: string): Promise<T | null> {
    return redisOperations.get<T>(key);
  }

  /**
   * Delete memory from Redis
   */
  async deleteMemory(key: string) {
    return redisOperations.delete(key);
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string) {
    return db.getUserPreferences(userId);
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId: string, limit = 10) {
    return db.getUserConversations(userId, limit);
  }
}

// Export singleton instance
export const mastraDb = new MastraDatabase();
