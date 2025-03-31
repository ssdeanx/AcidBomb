/**
 * Database exports for the API package.
 * Provides centralized access to all database functionality.
 */

// Export Supabase client and types
export * from './supabase';

// Export Upstash clients and operations
export {
  redis,
  vectorStore,
  vectorOperations,
  redisOperations,
  type VectorMetadata,
  type VectorDocument,
} from './upstash';

// Export database client
export { DatabaseClient } from './client';

// Create and export singleton database client instance
import { DatabaseClient } from './client';
import { redis, vectorStore } from './upstash';
export const db = new DatabaseClient();

// Re-export common database types and utilities
export interface DatabaseError extends Error {
  code?: string;
  details?: unknown;
}

/**
 * Common error handler for database operations
 */
export const handleDatabaseError = (error: unknown): DatabaseError => {
  if (error instanceof Error) {
    return {
      name: 'DatabaseError',
      message: error.message,
      code: 'DB_ERROR',
      cause: error,
    };
  }
  return {
    name: 'DatabaseError',
    message: 'Unknown database error',
    code: 'UNKNOWN_ERROR',
    details: error,
  };
};

/**
 * Database health check utility
 */
export const checkDatabaseConnections = async () => {
  const results: Record<string, boolean> = {};

  try {
    // Check Supabase connection
    const { data, error } = await db.getUserPreferences('health-check');
    results.supabase = !error;
  } catch {
    results.supabase = false;
  }

  try {
    // Check Redis connection
    await redis.ping();
    results.redis = true;
  } catch {
    results.redis = false;
  }

  try {
    // Check Vector store connection
    const testQuery = await vectorStore.query({
      vector: Array(1536).fill(0),
      topK: 1,
    });
    results.vectorStore = true;
  } catch {
    results.vectorStore = false;
  }

  return results;
};
