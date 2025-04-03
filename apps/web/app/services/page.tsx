import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Stack,
  CardContent,
  alpha,
} from '@mui/material';
import {
  AccountTree,
  Memory,
  FindInPage,
  Build,
  Insights,
} from '@mui/icons-material';
import { Card } from '@repo/ui/Card';
import { Button } from '@repo/ui/Button';
/**
 * Generate SEO metadata for the services page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Platform Services | DeanMachines AI',
    description: 'Explore DeanMachines AI platform services including Mastra orchestration, persistent memory solutions, RAG implementation, custom tool development, and agent evaluation.',
  };
}

/**
 * Services page with detailed descriptions of platform capabilities
 */
export default function ServicesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      {/* Header Section */}
      <Box textAlign="center" mb={10}>
        <Typography variant="h2" component="h1" gutterBottom>
          Platform Services
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "md", mx: "auto" }}
        >
          DeanMachines AI provides enterprise-grade services to power your conversational AI projects.
          Our comprehensive suite of tools and technologies ensures your AI agents are intelligent,
          contextually aware, and seamlessly integrated with your existing systems.
        </Typography>
      </Box>

      {/* Services Section - Restructured without Grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Mastra Orchestration */}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}>
              <AccountTree sx={{ color: 'primary.main', fontSize: 44 }} />
              <Typography variant="h5" component="div" fontWeight={500}>
                AI Orchestration
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              DeanMachines uses Mastra to orchestrate complex conversational agents with state management,
              context handling, and tool integration. Our platform manages the entire agent lifecycle from
              prompt engineering to deployment, allowing you to focus on agent design rather than infrastructure.
              The orchestration layer intelligently routes requests, manages concurrency, handles errors gracefully,
              and provides comprehensive logging for debugging and improvement.
            </Typography>
          </CardContent>
        </Card>

        {/* Memory Solutions */}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            p: 1.5,
            borderRadius: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}>
              <Memory sx={{ color: 'primary.main', fontSize: 44 }} />
              <Typography variant="h5" component="div" fontWeight={500}>
                Persistent Memory
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Our dual-layer memory system combines Pinecone's vector database for long-term semantic
              memory with Redis for fast, short-term conversation context. This architecture enables
              agents to maintain context across sessions, recall previous interactions, and provide
              truly personalized experiences. We handle the complexities of memory management including
              chunking, embedding generation, vector search optimization, and memory pruning to ensure
              your agents remember what matters while maintaining performance.
            </Typography>
          </CardContent>
        </Card>

        {/* RAG Implementation */}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1.5,
            borderRadius: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}>
              <FindInPage sx={{ color: 'primary.main', fontSize: 44 }} />
              <Typography variant="h5" component="div" fontWeight={500}>
                Retrieval-Augmented Generation
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Pinecone powers our advanced RAG capabilities, allowing agents to augment their responses
              with knowledge from your documents, websites, and databases. Our platform includes
              document processing pipelines with intelligent chunking strategies, hybrid search
              capabilities combining semantic and keyword search, automatic metadata filtering, and
              context-aware retrievers that adapt to the conversation flow. This ensures your agents
              deliver accurate, grounded responses based on your proprietary data.
            </Typography>
          </CardContent>
        </Card>

        {/* Custom Tools */}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1.5,
            borderRadius: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}>
              <Build sx={{ color: 'primary.main', fontSize: 44 }} />
              <Typography variant="h5" component="div" fontWeight={500}>
                Custom Tool Integration
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Mastra's flexible tool definition framework allows DeanMachines to seamlessly integrate
              with external APIs, databases, and services. Define custom tools with TypeScript for
              type safety and complete with parameter validation, error handling, and rate limiting.
              Our platform supports synchronous and asynchronous tools, streaming responses, file uploads,
              and complex multi-step reasoning chains. Connect your agents to existing business systems,
              enabling them to perform real actions like looking up customer data, scheduling appointments,
              or processing transactions.
            </Typography>
          </CardContent>
        </Card>

        {/* Evaluation */}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1.5,
            borderRadius: 1,
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}>
              <Insights sx={{ color: 'primary.main', fontSize: 44 }} />
              <Typography variant="h5" component="div" fontWeight={500}>
                Agent Evaluation & Analytics
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Integrated LangSmith provides comprehensive evaluation and testing capabilities for your
              agents. Monitor performance metrics, track conversation success rates, analyze user satisfaction,
              and identify areas for improvement. Our evaluation system includes automated testing against
              predefined test cases, A/B testing of different agent configurations, and AI-powered feedback
              on agent responses. The platform provides detailed dashboards and reporting tools to help you
              continuously refine your agents and ensure they meet your business objectives.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* CTA Section */}
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Ready to leverage these services?
        </Typography>
        <Button
          variant="primary"
          size="lg"
          component={Link}
          href="/pricing"
        >
          Explore Pricing Options
        </Button>
      </Box>
    </Container>
  );
}
