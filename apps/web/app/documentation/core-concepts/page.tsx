import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Link as MuiLink,
  Divider,
  alpha,
} from '@mui/material';
import { Code } from '@repo/ui/Code';

/**
 * Generate SEO metadata for the core concepts page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Core Concepts | DeanMachines AI Documentation',
    description: 'Learn about the fundamental concepts of DeanMachines AI platform including agents, memory, reasoning, RAG, and tools.',
  };
}

/**
 * Core Concepts documentation page
 * Explains the fundamental concepts that power the DeanMachines AI platform
 */
export default function CoreConceptsPage() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Core Concepts
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This guide explores the fundamental concepts that power the DeanMachines AI platform.
          Understanding these concepts will help you build more effective AI applications.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Agents Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Agents
        </Typography>
        <Typography variant="body1" paragraph>
          In DeanMachines, an agent is an AI entity that can understand natural language,
          maintain context through conversations, use tools, and generate responses.
          Agents are built on top of large language models (LLMs) like Google's Gemini
          but with additional capabilities:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              System Messages
            </Typography>
            <Typography variant="body1" paragraph>
              Each agent has a system message that defines its personality, capabilities, and constraints.
              This is the foundation of the agent's behavior and sets the tone for all interactions.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Models
            </Typography>
            <Typography variant="body1" paragraph>
              DeanMachines supports various LLMs including Google's Gemini models. Each model
              has different capabilities and pricing, allowing you to choose the right balance
              for your use case.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Agent Chain
            </Typography>
            <Typography variant="body1" paragraph>
              The agent chain is the sequential processing flow that handles user inputs,
              retrieves relevant context, performs reasoning, uses tools, and generates responses.
              This structured approach enables complex reasoning and tool use.
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                borderRadius: 1,
                overflowX: 'auto',
                my: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Code variant="block" highlight={true}>
{`import { createAgent } from '@mastra/core';

const customerSupportAgent = createAgent({
  name: "CustomerSupport",
  description: "A helpful customer support agent",
  systemMessage: \`
    You are CustomerSupport, an AI assistant specializing in technical support.
    Always be polite, helpful, and provide clear step-by-step instructions.
    When you don't know the answer, direct the user to human support.
  \`,
  model: "gemini-pro",
});`}
              </Code>
            </Paper>
          </Box>
        </Stack>
      </Box>

      {/* Memory Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Memory
        </Typography>
        <Typography variant="body1" paragraph>
          Memory allows agents to retain information across turns in a conversation and even
          across different sessions. DeanMachines implements a dual-layer memory system:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Short-term Memory (Redis)
            </Typography>
            <Typography variant="body1" paragraph>
              Short-term memory uses Redis to store recent conversation turns with high
              efficiency. This enables fluid back-and-forth conversations where the agent
              remembers what was just discussed without reprocessing the entire history.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Long-term Memory (Pinecone)
            </Typography>
            <Typography variant="body1" paragraph>
              Long-term memory uses Pinecone's vector database to store conversation
              history as embeddings. This enables semantic search across past interactions,
              allowing the agent to recall relevant information from much earlier in the
              conversation or from previous sessions.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Memory Management
            </Typography>
            <Typography variant="body1" paragraph>
              The platform handles complex memory management including chunking (breaking down
              conversations into digestible pieces), embedding generation (converting text into
              vector representations), retrieval (finding relevant memories), and pruning
              (removing irrelevant or outdated information).
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                borderRadius: 1,
                overflowX: 'auto',
                my: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Code variant="block" highlight={true}>
{`import { createAgent } from '@mastra/core';
import { PineconeMemory } from '@mastra/pinecone';
import { RedisMemory } from '@mastra/redis';

const agentWithMemory = createAgent({
  name: "MemoryAgent",
  description: "An agent with dual-layer memory",
  systemMessage: "You have perfect recall of past conversations...",
  model: "gemini-pro",
  memory: {
    longTerm: new PineconeMemory({
      sessionId: "user-123",
      namespace: "conversations",
      ttl: 30 * 24 * 60 * 60, // 30 days
    }),
    shortTerm: new RedisMemory({
      sessionId: "user-123",
      ttl: 24 * 60 * 60, // 1 day
    })
  }
});`}
              </Code>
            </Paper>
          </Box>
        </Stack>
      </Box>

      {/* RAG (Retrieval-Augmented Generation) Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          RAG (Retrieval-Augmented Generation)
        </Typography>
        <Typography variant="body1" paragraph>
          RAG combines retrieval systems with generative AI to provide responses grounded
          in specific knowledge bases. This allows agents to access and utilize information
          not included in their training data.
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Document Processing
            </Typography>
            <Typography variant="body1" paragraph>
              The platform processes documents (PDF, text, HTML, etc.) by chunking them
              into smaller pieces, generating embeddings using models like OpenAI's text-embedding
              models, and storing these embeddings in Pinecone.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Semantic Search
            </Typography>
            <Typography variant="body1" paragraph>
              When a user query comes in, it's converted to an embedding and used to search
              the vector database for semantically similar content. This allows the agent
              to find relevant information even when the exact words don't match.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Context Integration
            </Typography>
            <Typography variant="body1" paragraph>
              Retrieved relevant content is incorporated into the agent's prompt, allowing
              the LLM to generate responses grounded in specific knowledge rather than just
              its general training data.
            </Typography>
          </Box>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              overflowX: 'auto',
              my: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Code variant="block" highlight={true}>
{`import { createAgent } from '@mastra/core';
import { PineconeRetriever } from '@mastra/pinecone';

const knowledgeBaseAgent = createAgent({
  name: "ProductExpert",
  description: "Product documentation expert",
  systemMessage: "Answer questions based on the product documentation...",
  model: "gemini-pro",
  retriever: new PineconeRetriever({
    index: "product-docs",
    namespace: "user-manuals",
    topK: 3,
    minRelevanceScore: 0.75
  })
});`}
            </Code>
          </Paper>
        </Stack>
      </Box>

      {/* Tools Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Tools
        </Typography>
        <Typography variant="body1" paragraph>
          Tools allow agents to perform actions beyond just generating text. They can query APIs,
          access databases, execute code, and interact with external systems. DeanMachines provides
          a flexible tool definition framework built on Mastra.
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Tool Definition
            </Typography>
            <Typography variant="body1" paragraph>
              Tools are defined with a name, description, parameter schema (using JSON Schema),
              and a handler function that executes the actual functionality. The parameter schema
              ensures proper validation of inputs.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Tool Execution
            </Typography>
            <Typography variant="body1" paragraph>
              When an agent determines a tool should be used, it generates a structured call
              including the tool name and parameters. The platform validates these parameters,
              executes the tool handler, and returns the result to the agent for incorporation
              into its response.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Custom Tools
            </Typography>
            <Typography variant="body1" paragraph>
              You can create custom tools that integrate with your existing systems and APIs,
              allowing agents to perform domain-specific tasks like querying your database,
              creating support tickets, or checking inventory levels.
            </Typography>
          </Box>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              borderRadius: 1,
              overflowX: 'auto',
              my: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Code variant="block" highlight={true}>
{`import { definePluginTool } from '@mastra/core';

export const weatherTool = definePluginTool({
  name: "weather",
  description: "Get current weather data for a location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name, e.g. 'New York'",
      },
      units: {
        type: "string",
        enum: ["metric", "imperial"],
        description: "Units for the temperature",
        default: "metric"
      },
    },
    required: ["location"],
  },
  handler: async ({ location, units = "metric" }) => {
    // Implementation of weather API call
    return {
      temperature: 22.5,
      conditions: "Partly cloudy",
      humidity: 65,
      wind: 12,
      location: "New York, US",
      units: "°C"
    };
  },
});`}
            </Code>
          </Paper>
        </Stack>
      </Box>

      {/* Evaluation Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Evaluation
        </Typography>
        <Typography variant="body1" paragraph>
          DeanMachines integrates with LangSmith to provide comprehensive evaluation and testing
          capabilities for your agents. This helps ensure your agents are performing as expected
          and identifies areas for improvement.
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Typography variant="body1" paragraph>
              Monitor key metrics like response time, success rate, token usage, and user satisfaction
              to ensure your agents are meeting performance targets.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Automated Testing
            </Typography>
            <Typography variant="body1" paragraph>
              Create test suites with predefined inputs and expected outputs to validate agent behavior
              across a range of scenarios. This is particularly useful for regression testing when
              modifying agents.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              A/B Testing
            </Typography>
            <Typography variant="body1" paragraph>
              Compare different agent configurations (system messages, models, memory settings, etc.)
              to identify which performs best for your specific use case.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Next Steps Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body1" paragraph>
          Now that you understand the core concepts, you can explore:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/architecture">Platform Architecture</MuiLink> to understand how these concepts are implemented
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/api-reference">API Reference</MuiLink> for detailed technical specifications
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/guides">Implementation Guides</MuiLink> for step-by-step tutorials
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
