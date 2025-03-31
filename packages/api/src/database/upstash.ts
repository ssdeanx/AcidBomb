/**
 * Upstash configuration for Redis and Vector storage.
 * Provides memory and vector search capabilities for Mastra.
 */
import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';
import { getEnvVar } from '../utils/env';

// Initialize Redis client
const redisUrl = getEnvVar('UPSTASH_REDIS_URL');
const redisToken = getEnvVar('UPSTACK_REDIS_TOKEN');

if (!redisUrl || !redisToken) {
  throw new Error('Missing Upstash Redis environment variables');
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Initialize Vector store client
const vectorUrl = getEnvVar('UPSTASH_VECTOR_REST_URL');
const vectorToken = getEnvVar('UPSTASH_VECTOR_REST_TOKEN');

if (!vectorUrl || !vectorToken) {
  throw new Error('Missing Upstash Vector environment variables');
}

export const vectorStore = new Index({
  url: vectorUrl,
  token: vectorToken,
});

// Export typed helpers for vector operations
export interface VectorMetadata {
  documentId: string;
  title: string;
  source: string;
  type: 'document' | 'conversation' | 'memory';
  userId?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface VectorDocument {
  id: string;
  vector: number[];
  metadata: VectorMetadata;
}

// Helper functions for vector operations
export const vectorOperations = {
  /**
   * Upsert vectors into the store
   */
  async upsert(documents: VectorDocument[]) {
    return vectorStore.upsert(
      documents.map((doc) => ({
        id: doc.id,
        vector: doc.vector,
        metadata: doc.metadata,
      })),
    );
  },

  /**
   * Query vectors by similarity
   */
  async query(
    vector: number[],
    options: {
      topK?: number;
      filter?: string; // Upstash Vector expects a string filter query
    } = {},
  ) {
    return vectorStore.query({
      vector,
      topK: options.topK || 5,
      includeMetadata: true,
      includeVectors: false,
      filter: options.filter,
    });
  },

  /**
   * Delete vectors by ID
   */
  async delete(ids: string[]) {
    return vectorStore.delete(ids);
  },
};

// Helper functions for Redis operations
export const redisOperations = {
  /**
   * Set a key with optional expiry
   */
  async set<T>(key: string, value: T, expirySeconds?: number) {
    if (expirySeconds) {
      return redis.set(key, value, { ex: expirySeconds });
    }
    return redis.set(key, value);
  },

  /**
   * Get a value by key
   */
  async get<T>(key: string) {
    return redis.get<T>(key);
  },

  /**
   * Delete a key
   */
  async delete(key: string) {
    return redis.del(key);
  },

  /**
   * Set multiple hash fields
   */
  async hmset(key: string, values: Record<string, unknown>) {
    return redis.hmset(key, values);
  },

  /**
   * Get multiple hash fields
   */
  async hmget<T extends Record<string, unknown>>(
    key: string,
    fields: string[],
  ) {
    return redis.hmget<T>(key, ...fields);
  },
};
