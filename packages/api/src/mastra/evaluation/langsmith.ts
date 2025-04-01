/**
 * LangSmith integration for Mastra agent evaluation and tracing.
 * Provides utilities for monitoring agent performance and debugging complex behaviors
 * using direct LangSmith SDK features (RunTree).
 *
 * @module packages/api/src/mastra/evaluation
 */

// Core LangSmith imports for direct usage
import { RunTree } from 'langsmith'; // RunTree is usually exported from the root
// LogEntry is often not needed directly, log method takes an object. Removed LogEntry import.
// Import 'Client' and alias it
import { Client as LangSmithClient } from 'langsmith/client'; // Import Client and alias it to LangSmithClient
// Utility to get environment variables (ensure this works correctly)
import { getEnvVar } from '../../utils/env';

/**
 * Configuration options for LangSmith integration
 */
interface LangSmithConfig {
  /** Project name for grouping runs (reads LANGSMITH_PROJECT env var by default) */
  projectName?: string;

  /** Custom tags to apply to runs */
  tags?: string[];

  /** Whether tracing is enabled */
  enabled?: boolean;

  /** API Key (reads LANGSMITH_API_KEY env var by default) */
  apiKey?: string;

  /** API Endpoint (reads LANGSMITH_ENDPOINT env var by default) */
  apiUrl?: string;
}

/**
 * Default configuration for LangSmith, primarily reading from environment variables.
 */
const DEFAULT_CONFIG: LangSmithConfig = {
  // Let the client or RunTree constructor handle default project name resolution from env var
  projectName: getEnvVar('LANGSMITH_PROJECT'), // Explicitly read project name if needed here
  tags: ['production'], // Example default tags
  // Use a dedicated env var for enabling, or fallback to LANGCHAIN one if needed for compatibility
  enabled:
    getEnvVar(
      'LANGSMITH_TRACING_ENABLED',
      getEnvVar('LANGCHAIN_TRACING_V2', 'false'),
    ) === 'true',
  apiKey: getEnvVar('LANGSMITH_API_KEY'), // Read API key
  apiUrl: getEnvVar('LANGSMITH_ENDPOINT'), // Read Endpoint
};

/**
 * LangSmith client instance (singleton pattern)
 */
// The type annotation here should now match the alias
let client: LangSmithClient | null = null;

/**
 * Initialize the LangSmith client with the provided configuration.
 * Ensures the client is only initialized once.
 *
 * @param config - Configuration options for the client, defaults to reading env vars.
 * @returns The initialized client instance or null if tracing is disabled or misconfigured.
 */
export function initClient(
  config: LangSmithConfig = DEFAULT_CONFIG,
): LangSmithClient | null {
  // If tracing is explicitly disabled in config, return null
  if (!config.enabled) {
    console.info('LangSmith tracing is disabled via configuration.');
    client = null; // Ensure client is null
    return null;
  }

  // If client already exists, return it (singleton)
  if (client) {
    return client;
  }

  try {
    // Create a new client instance using the alias.
    // The constructor will automatically use LANGSMITH_API_KEY and LANGSMITH_ENDPOINT
    // environment variables if apiKey and apiUrl are not provided in the config object.
    // It should throw an error if API key is missing.
    const potentialClient = new LangSmithClient({
      // Use the alias which points to the imported Client
      apiKey: config.apiKey, // Pass explicitly read key (or undefined)
      apiUrl: config.apiUrl, // Pass explicitly read URL (or undefined)
      // Add any other necessary client options here
    });

    // --- Removed the check for private 'apiKey' ---
    // The constructor should throw if the API key is missing.
    // The try...catch block will handle initialization errors.

    // Store the successfully created client
    client = potentialClient;

    // Log success. Use the configuration values for logging what was intended.
    // Cannot access client.apiUrl directly if it's private.
    console.info(
      `LangSmith client initialized. Configured Project: ${config.projectName ?? 'default/env'}, Configured Endpoint: ${config.apiUrl ?? 'default/env'}.`, // Use config value
    );

    return client;
  } catch (error) {
    // Catch errors during client instantiation (e.g., missing API key)
    console.error('Failed to initialize LangSmith client:', error);
    client = null; // Ensure client is null on error
    return null;
  }
}

/**
 * Get the current LangSmith client instance.
 * Initializes it with default config if it hasn't been initialized yet.
 *
 * @returns The current client instance or null if tracing is disabled or initialization failed.
 */
export function getClient(): LangSmithClient | null {
  // If client doesn't exist, try initializing it with default config
  if (!client) {
    return initClient();
  }
  // Return the existing client instance
  return client;
}

/**
 * Trace a Mastra agent interaction using RunTree for manual control.
 * Creates a new run, logs inputs/outputs/metadata, and posts it to LangSmith.
 *
 * @param agentName - The name of the agent being traced.
 * @param input - The input data provided to the agent.
 * @param output - The output data generated by the agent.
 * @param configOverrides - Optional config overrides for this specific trace (e.g., projectName, tags).
 * @param metadata - Additional metadata specific to this interaction.
 * @returns The RunTree object representing the trace if successful, null otherwise.
 */
export async function traceAgentInteraction(
  agentName: string,
  input: unknown,
  output: unknown,
  configOverrides: Partial<LangSmithConfig> = {}, // Allow overriding config per trace
  metadata: Record<string, unknown> = {},
): Promise<RunTree | null> {
  // Get the initialized LangSmith client
  const currentClient = getClient();

  // If client is not available (disabled or failed init), log a warning and exit
  if (!currentClient) {
    console.warn(
      'LangSmith client not available, skipping trace for agent:',
      agentName,
    );
    return null;
  }

  // Combine default/initialized config with any per-trace overrides provided
  // Note: DEFAULT_CONFIG reads env vars on load, initClient uses those or explicit args.
  // For simplicity here, we mainly care about projectName and tags from overrides.
  const effectiveConfig = { ...DEFAULT_CONFIG, ...configOverrides };

  // Create a new RunTree instance to represent this specific trace
  const runTree = new RunTree({
    client: currentClient, // Associate with our initialized client
    name: `${agentName}-interaction`, // Name of the run in LangSmith UI
    run_type: 'chain', // Or 'agent'. Choose the type that best represents the interaction
    inputs: { input }, // Log the input data
    project_name: effectiveConfig.projectName, // Assign to a project (reads LANGSMITH_PROJECT if not set)
    extra: {
      // Use 'extra' field for tags and metadata
      metadata: {
        ...metadata, // Include any metadata passed to the function
        agent: agentName, // Add agent name to metadata
        timestamp: new Date().toISOString(), // Add timestamp
      },
      tags: effectiveConfig.tags, // Add tags from config/overrides
    },
  });

  try {
    // --- Optional: Log intermediate steps ---
    // If you have intermediate steps or events within the interaction, log them directly as objects:
    // await runTree.log({ status: "Step 1 completed", details: "..." }); // Pass object directly
    // await runTree.log({ latency_ms: 123 }); // Pass object directly

    // Mark the run as ended and log the final output
    // This updates the run state locally.
    await runTree.end({ outputs: { output } });

    // Post the completed run data (including inputs, outputs, metadata, times) to LangSmith
    // This actually sends the information over the network.
    await runTree.postRun();

    console.info(
      `Successfully traced interaction for agent: ${agentName}, Run ID: ${runTree.id}`,
    );
    return runTree; // Return the RunTree object (contains run ID and other details)
  } catch (error: any) {
    console.error(`Error tracing agent interaction for ${agentName}:`, error);
    // Attempt to end the run with the error message and post it for debugging
    try {
      // Check if run already ended to avoid errors
      if (!runTree.end_time) {
        await runTree.end({ error: error.message ?? 'Unknown tracing error' });
      }
      await runTree.postRun(); // Try to post the failed run
    } catch (postError) {
      // Log error during the attempt to post the failed run
      console.error('Error posting failed run details:', postError);
    }
    return null; // Indicate failure
  }
}

/**
 * Export the LangSmith integration functions
 */
export const langsmith = {
  initClient,
  getClient,
  traceAgentInteraction,
};
