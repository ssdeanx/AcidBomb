import { defineConfig } from 'drizzle-kit';
import { getEnvVar } from './src/utils/env';

export default defineConfig({
  schema: './src/Drizzle/schema.tsx',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnvVar('DATABASE_URL'),
  },
  verbose: true,
  strict: true,
});
