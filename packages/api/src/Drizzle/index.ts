/**
 * Drizzle ORM database client setup for Postgres.
 * Provides a type-safe database interface with connection management
 * and proper error handling.
 *
 * @module packages/api/src/Drizzle/index.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getEnvVar } from '../utils/env';
import { sql } from 'drizzle-orm';

/**
 * Database connection configuration options
 */
interface DatabaseConfig {
  /** Maximum number of concurrent connections */
  maxConnections?: number;
  /** Connection idle timeout in seconds */
  idleTimeout?: number;
  /** Whether to use SSL for connection */
  ssl?: boolean;
  /** Debug mode for logging queries */
  debug?: boolean;
}

/**
 * Default database configuration
 */
const defaultConfig: DatabaseConfig = {
  maxConnections: 10,
  idleTimeout: 30,
  ssl: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Create a PostgreSQL client with the specified configuration
 *
 * @param connectionString - Database connection string
 * @param config - Database connection configuration
 * @returns Configured Postgres client
 */
export const createPostgresClient = (
  connectionString: string,
  config: DatabaseConfig = {},
): postgres.Sql => {
  const { maxConnections, idleTimeout, ssl, debug } = {
    ...defaultConfig,
    ...config,
  };

  try {
    return postgres(connectionString, {
      prepare: false, // Disable prepare for Supabase compatibility
      max: maxConnections,
      idle_timeout: idleTimeout,
      ssl: ssl,
      debug: debug,
      onnotice: () => {}, // Suppress notice messages
    });
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error('Failed to create database client');
    console.error('Database connection error:', error.message);
    throw error;
  }
};

/**
 * Create a Drizzle ORM instance with the schema
 *
 * @param client - Postgres client
 * @returns Drizzle ORM instance
 */
export const createDrizzle = (
  client: postgres.Sql,
): PostgresJsDatabase<typeof schema> => {
  return drizzle(client, { schema });
};

// Get database connection string from environment variables
const connectionString = getEnvVar('DATABASE_URL');

// Create the database client
const postgresClient = createPostgresClient(connectionString);

// Create the Drizzle ORM instance with our schema
const db = createDrizzle(postgresClient);

/**
 * Check database connection health
 *
 * @returns Object containing connection status and optional error
 */
export const checkDatabaseHealth = async (): Promise<{
  isHealthy: boolean;
  error?: string;
}> => {
  try {
    // Simple query to check connectivity
    await db.execute(sql`SELECT 1`);
    return { isHealthy: true };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown database error';
    return { isHealthy: false, error: errorMessage };
  }
};

// Export DB client and schema
export { db, schema };
export type DrizzleSchema = typeof schema;
export type { PostgresJsDatabase };

// Export a helper for transactions
export const transaction = async <T>(
  callback: (tx: PostgresJsDatabase<typeof schema>) => Promise<T>,
): Promise<T> => {
  return db.transaction(callback);
};

// Export sql tag for raw queries
export { sql };
