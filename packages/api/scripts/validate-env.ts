import fs from 'fs';
import path from 'path';
import { getEnvVar } from '../src/utils/env';

/**
 * Validates and creates a .env file for Prisma
 * Ensures that required environment variables are set
 *
 * @returns void
 * @throws Error if required environment variables are missing
 */
function validateAndCreateEnv(): void {
  console.log('Validating environment variables for Prisma...');

  // Get DATABASE_URL from environment or utility
  const databaseUrl = getEnvVar('DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Check if the database URL is properly formatted
  try {
    new URL(databaseUrl);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`DATABASE_URL is not a valid URL: ${error.message}`);
    } else {
      throw new Error(`DATABASE_URL is not valid. Encountered an unknown validation error.`);
    }
  }

  console.log('Environment variables validated successfully');

  // Create .env file in the Prisma directory
  const prismaDir = path.resolve(__dirname, '../prisma');
  const envPath = path.join(prismaDir, '.env');

  try {
    fs.writeFileSync(envPath, `DATABASE_URL="${databaseUrl}"\n`);
    console.log(`Created Prisma .env file at: ${envPath}`);
  } catch (error) {
    console.error('Failed to write .env file:', error);
    if (error instanceof Error) {
      throw new Error(`Could not create .env file: ${error.message}`);
    } else {
      throw new Error(`Could not create .env file due to an unknown error.`);
    }
  }
}

// Execute the function
validateAndCreateEnv();
