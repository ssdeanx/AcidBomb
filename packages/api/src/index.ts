/**
 * Main entry point for the API package.
 * Re-exports key components for use across the application.
 *
 * @module packages/api/src
 */

// Re-export links module
import { Link } from './links/entities/link.entity';
import { CreateLinkDto } from './links/dto/create-link.dto';
import { UpdateLinkDto } from './links/dto/update-link.dto';

// Export Mastra setup from our main implementation
export * from './mastra';

// Export database clients
export * from './database';

// Export utility functions
export * from './utils/env';

// Export links components
export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
  },
};

// Log successful module initialization
console.log('API package successfully initialized');
