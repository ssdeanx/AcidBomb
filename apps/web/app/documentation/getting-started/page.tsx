import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  Divider,
  Alert,
  alpha,
} from '@mui/material';
import { Code } from '@repo/ui/Code';

/**
 * Generate SEO metadata for the getting started page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Getting Started | DeanMachines AI Documentation',
    description: 'Learn how to get started with DeanMachines AI platform. Set up your environment, configure your project, and build your first AI agent.',
  };
}

/**
 * Getting Started documentation page
 * Provides step-by-step instructions for setting up and configuring DeanMachines AI
 */
export default function GettingStartedPage() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Getting Started with DeanMachines AI
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This guide will walk you through the process of setting up your environment,
          installing the necessary dependencies, and creating your first AI agent with
          DeanMachines AI platform.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Prerequisites Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Prerequisites
        </Typography>
        <Typography variant="body1" paragraph>
          Before getting started, make sure you have the following installed:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              Node.js (v18.0.0 or higher)
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              pnpm (v8.0.0 or higher)
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              A Supabase account for authentication and database
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              A Pinecone account for vector storage
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              An Upstash Redis account for memory management
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Installation Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Installation
        </Typography>
        <Typography variant="body1" paragraph>
          Clone the repository and install dependencies:
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
{`# Clone the repository
git clone https://github.com/deanmachines/deanmachines-ai.git
cd deanmachines-ai

# Install dependencies
pnpm install

# Build packages
pnpm build`}
          </Code>
        </Paper>
      </Box>

      {/* Environment Configuration Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Environment Configuration
        </Typography>
        <Typography variant="body1" paragraph>
          Create a <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}><Code variant="inline">.env</Code></Box> file in the root directory
          of your project and add the following environment variables:
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Never commit your .env file to version control. Always add it to .gitignore.
        </Alert>
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mb: 4, overflowX: 'auto' }}>
          <Table size="small" aria-label="environment variables">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Environment Variable</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">NEXT_PUBLIC_SUPABASE_URL</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Supabase project URL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">NEXT_PUBLIC_SUPABASE_ANON_KEY</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Supabase anonymous key</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">NEXT_PUBLIC_API_URL</Code>
                  </Box>
                </TableCell>
                <TableCell>URL for the API server (default: http://localhost:3001)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">PINECONE_API_KEY</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Pinecone API key</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">PINECONE_ENVIRONMENT</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Pinecone environment (e.g., us-west1-gcp)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">UPSTASH_REDIS_REST_URL</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Upstash Redis REST URL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">UPSTASH_REDIS_REST_TOKEN</Code>
                  </Box>
                </TableCell>
                <TableCell>Your Upstash Redis REST token</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Running the Application Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Running the Application
        </Typography>
        <Typography variant="body1" paragraph>
          Start the development servers:
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
{`# Start the API server
pnpm dev --filter api

# In a separate terminal, start the web application
pnpm dev --filter web`}
          </Code>
        </Paper>
        <Typography variant="body1">
          The web application will be available at <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}><Code variant="inline">http://localhost:3000</Code></Box> and
          the API at <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}><Code variant="inline">http://localhost:3001</Code></Box>.
        </Typography>
      </Box>

      {/* Creating Your First Agent Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Creating Your First Agent
        </Typography>
        <Typography variant="body1" paragraph>
          Once you've set up your environment, you can create your first AI agent:
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h3" gutterBottom>
              1. Define Your Agent
            </Typography>
            <Typography variant="body1" paragraph>
              Create a new file <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}><Code variant="inline">src/agents/myFirstAgent.ts</Code></Box> with the following content:
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

export const myFirstAgent = createAgent({
  name: "MyFirstAgent",
  description: "A simple conversational agent",
  systemMessage: \`
    You are a helpful AI assistant named MyFirstAgent.
    You provide friendly, concise, and accurate responses.
    If you don't know the answer, admit it rather than making something up.
  \`,
  model: "gemini-pro", // Or another supported model
});`}
              </Code>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h4" component="h3" gutterBottom>
              2. Configure Memory (Optional)
            </Typography>
            <Typography variant="body1" paragraph>
              Add memory to your agent to enable context retention:
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

export const myFirstAgent = createAgent({
  name: "MyFirstAgent",
  description: "A conversational agent with memory",
  systemMessage: \`
    You are a helpful AI assistant with memory.
    You can remember previous parts of the conversation.
  \`,
  model: "gemini-pro",
  memory: new PineconeMemory({
    sessionId: "user-123", // Replace with actual user ID
    namespace: "agent-conversations"
  })
});`}
              </Code>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h4" component="h3" gutterBottom>
              3. Register and Use Your Agent
            </Typography>
            <Typography variant="body1" paragraph>
              Register your agent in your API module:
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
{`import { Module } from '@nestjs/common';
import { myFirstAgent } from './agents/myFirstAgent';
import { MastraCoreModule } from './mastra-core/mastra-core.module';

@Module({
  imports: [
    MastraCoreModule.forRoot({
      agents: [myFirstAgent]
    }),
  ],
})
export class AppModule {}`}
              </Code>
            </Paper>
          </Box>
        </Stack>
      </Box>

      {/* Next Steps Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body1" paragraph>
          Now that you have your first agent running, explore these next steps:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              Learn about <MuiLink component={Link} href="/documentation/core-concepts">Core Concepts</MuiLink> of the DeanMachines AI platform
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              Explore the <MuiLink component={Link} href="/documentation/architecture">Architecture</MuiLink> to understand how components work together
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              Add custom tools to your agent using the <MuiLink component={Link} href="/documentation/api-reference">API Reference</MuiLink>
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              Check out practical <MuiLink component={Link} href="/documentation/examples">Examples</MuiLink> of advanced agent implementations
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
