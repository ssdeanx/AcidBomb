import { Workflow } from '@mastra/core';
import { Step } from '@mastra/core';
import { z } from 'zod';

const workflow = new Workflow({
  name: 'my-workflow',
  triggerSchema: z.object({
    data: z.string(),
  }),
});

/**
 * Defines the expected output shape for step1.
 */
interface Step1Output {
  /** The processed result string. */
  result: string;
}

// Define the step using the Step class or a StepDefinition object
const step1 = new Step({
  id: 'step1',
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ context }): Promise<Step1Output> => {
    // Access trigger data via context.triggerData
    const inputData = context.triggerData as { data: string };
    // Perform some operation
    return { result: `Processed ${inputData.data}` };
  },
});

// Add the step instance to the workflow
workflow.step(step1);

// Commit the workflow definition
workflow.commit();

export { workflow };
