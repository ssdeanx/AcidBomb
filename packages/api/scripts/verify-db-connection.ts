import { Client, QueryResult } from 'pg';
import { getEnvVar } from '../src/utils/env';

/**
 * Interface representing database version query result
 */
interface VersionResult {
  version: string;
}

/**
 * Verifies connection to the PostgreSQL database
 * This helps diagnose connection issues before running Prisma commands
 *
 * @throws Error if connection fails or if required extensions are missing
 */
async function verifyDatabaseConnection(): Promise<void> {
  console.log('Attempting to verify database connection...');

  const databaseUrl = getEnvVar('DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = new Client({
    connectionString: databaseUrl,
    // Set a reasonable timeout to avoid hanging indefinitely
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Successfully connected to database!');

    // Test a simple query
    const result: QueryResult<VersionResult> = await client.query('SELECT version();');
    // Safely access the version using optional chaining
    const version = result.rows?.[0]?.version;
    if (version) {
      console.log('Database version:', version);
    } else {
      console.warn('Could not retrieve database version.');
    }

    // Check if uuid-generate-v4 extension is available
    try {
      await client.query('SELECT uuid_generate_v4();');
      console.log('uuid_generate_v4 function is available');
    } catch (error) {
      console.warn('WARNING: uuid_generate_v4 function is not available. You may need to enable the extension.');
      if (error instanceof Error) {
        console.warn('Error details:', error.message);
      } else {
        console.warn('Error details:', String(error));
      }
    }

    // Check for extensions.uuid_generate_v4
    try {
      await client.query('SELECT extensions.uuid_generate_v4();');
      console.log('extensions.uuid_generate_v4 function is available');
    } catch (error) {
      console.warn('WARNING: extensions.uuid_generate_v4 function is not available.');
      console.warn('You need to enable the uuid-ossp extension in the correct schema.');
      if (error instanceof Error) {
        console.warn('Error details:', error.message);
      } else {
        console.warn('Error details:', String(error));
      }
    }

  } catch (error) {
    console.error('Failed to connect to database:');
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', String(error));
      throw new Error('Database connection failed with an unknown error');
    }
  } finally {
    try {
      await client.end();
      console.log('Database connection closed');
    } catch (finallyError) {
      // In case ending the connection also throws an error
      console.warn('Warning: Error while closing database connection:',
        finallyError instanceof Error ? finallyError.message : String(finallyError));
    }
  }
}

/**
 * Script entry point - executes the verification function
 * and handles process exit codes appropriately
 */
verifyDatabaseConnection()
  .then(() => {
    console.log('Database verification completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database verification failed:', error.message);
    process.exit(1);
  });
