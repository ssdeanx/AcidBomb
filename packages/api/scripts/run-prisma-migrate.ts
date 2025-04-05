import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { getEnvVar } from '../src/utils/env';

/**
 * Runs prisma migrate dev command with timeout
 * This helps prevent indefinite hanging on connection issues
 *
 * @param migrationName - Name for the migration
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that resolves when the command completes
 */
function runPrismaMigrate(migrationName: string, timeoutMs = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Setting up environment for Prisma...');

    // Ensure DATABASE_URL is available
    const databaseUrl = getEnvVar('DATABASE_URL');
    if (!databaseUrl) {
      return reject(new Error('DATABASE_URL environment variable is required'));
    }

    // Create temporary .env file for this run if it doesn't exist
    const prismaDir = path.resolve(__dirname, '../prisma');
    const envPath = path.join(prismaDir, '.env');

    if (!fs.existsSync(envPath)) {
      console.log('Creating temporary .env file for Prisma...');
      try {
        fs.writeFileSync(envPath, `DATABASE_URL=${databaseUrl}\n`);
      } catch (error) {
        if (error instanceof Error) {
          return reject(new Error(`Failed to create .env file: ${error.message}`));
        } else {
          return reject(new Error(`Failed to create .env file due to an unknown error.`));
        }
      }
    }

    console.log(`Running: npx prisma migrate dev --name ${migrationName}`);

    // Setup timeout
    const timeout = setTimeout(() => {
      console.error(`Command timed out after ${timeoutMs}ms`);
      process.kill(prismaMigrate.pid as number);
      reject(new Error('Prisma migrate command timed out'));
    }, timeoutMs);

    // Run the command
    const prismaMigrate = spawn('npx', ['prisma', 'migrate', 'dev', '--name', migrationName], {
      stdio: 'inherit',
      shell: true
    });

    prismaMigrate.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('Prisma migration completed successfully');
        resolve();
      } else {
        reject(new Error(`Prisma migrate failed with code ${code}`));
      }
    });

    prismaMigrate.on('error', (error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start Prisma migrate: ${error.message}`));
    });
  });
}

// Get migration name from command line arguments or use default
const migrationName = process.argv[2] || 'init';

// Run the migration
runPrismaMigrate(migrationName)
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
