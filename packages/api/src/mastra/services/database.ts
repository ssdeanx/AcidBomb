/**
 * Database service for Mastra
 * Provides database access for agents and tools
 */
import { db, vectorOperations, redisOperations } from '../../database';

export class MastraDatabase {
  /**
   * Store a conversation in the database
   */
  async storeConversation(
    userId: string,
    agentId: string,
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  ) {
    // Create conversation
    const conversation = await db.createConversation(
      userId,
      agentId,
      messages[0].content,
    );

    // Add messages
    for (const message of messages) {
      await db.addMessage(conversation.id, message.role, message.content);
    }

    return conversation;
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
