import { Mastra, Tool } from '@mastra/core';
import { agents } from './agents';
import { createLogger } from '@mastra/core';
import { getEnvVar } from '../utils/env';

export const mastra = new Mastra({
  agents: { ...agents },
  logger: createLogger({
    name: 'DeanMachines',
    level: 'info',
  }),
  vectors: {},
});

export const tools = {
  ...agents,
  ...{
    // TODO: add tools here
  },
};
