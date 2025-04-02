import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core';

export const mastra: Mastra = new Mastra({
  // ... other config
  telemetry: {
    serviceName: 'deanmachines',
    enabled: true,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
