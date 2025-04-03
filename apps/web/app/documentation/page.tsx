import type { Metadata } from 'next';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Link as MuiLink,
  alpha,
} from '@mui/material';
import Link from 'next/link';

/**
 * Generate metadata for documentation overview page
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Documentation | DeanMachines AI',
    description: 'Learn how to build, deploy, and manage advanced conversational AI agents with DeanMachines AI platform documentation',
  };
}

/**
 * Documentation overview page
 * Provides introduction and navigation to key documentation sections
 */
export default function DocumentationOverview() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          DeanMachines AI Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to the official documentation for DeanMachines AI, the integrated platform for building advanced conversational AI agents with persistent memory, RAG, and custom tool integrations.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This documentation will help you understand the platform's architecture, get started with your first agent, and explore advanced features like persistent memory and custom tool integration.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          New to DeanMachines AI? Start with the{' '}
          <MuiLink component={Link} href="/documentation/getting-started">
            Getting Started
          </MuiLink>{' '}
          guide to set up your environment, create your first agent, and deploy it to production.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Core Concepts
        </Typography>
        <Typography variant="body1" component="p" paragraph>
          Learn about the fundamental concepts behind DeanMachines AI like agents, memory, reasoning, and tool use in the{' '}
          <MuiLink component={Link} href="/documentation/core-concepts">
            Core Concepts
          </MuiLink>{' '}
          section.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Technical Architecture
        </Typography>
        <Typography variant="body1" component="p" paragraph>
          Explore the{' '}
          <MuiLink component={Link} href="/documentation/architecture">
            Architecture
          </MuiLink>{' '}
          section to understand how the platform's components work together, from frontend to backend, including our integration with Mastra, Pinecone, Redis, and other technologies.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          API Reference
        </Typography>
        <Typography variant="body1" paragraph>
          Ready to integrate with our APIs? Check out the complete{' '}
          <MuiLink component={Link} href="/documentation/api-reference">
            API Reference
          </MuiLink>{' '}
          for detailed information on endpoints, parameters, and response formats.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Guides & Examples
        </Typography>
        <Typography variant="body1" paragraph>
          Explore our{' '}
          <MuiLink component={Link} href="/documentation/guides">
            Guides
          </MuiLink>{' '}
          and{' '}
          <MuiLink component={Link} href="/documentation/examples">
            Examples
          </MuiLink>{' '}
          to learn best practices and see real-world implementations of DeanMachines AI features.
        </Typography>
      </Box>
    </Stack>
  );
}
