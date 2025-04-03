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
 * Generate SEO metadata for the architecture page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Architecture | DeanMachines AI Documentation',
    description: 'Understand the technical architecture of DeanMachines AI platform, including frontend, backend, database, and integration components.',
  };
}

/**
 * Architecture documentation page
 * Explains the technical architecture and components of the platform
 */
export default function ArchitecturePage() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Platform Architecture
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This guide provides a detailed overview of the DeanMachines AI platform architecture,
          explaining how the various components work together to provide a seamless experience
          for building advanced conversational agents.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Architecture Overview Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Architecture Overview
        </Typography>
        <Typography variant="body1" paragraph>
          The DeanMachines AI platform is built on a modern, scalable architecture with several key components:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              <strong>Frontend Application:</strong> A Next.js 15 application providing user interfaces for agent management, conversation, and analytics.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>Backend API:</strong> A NestJS application that manages agent orchestration, tool execution, and integrations.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>Database Layer:</strong> Supabase for user authentication and structured data storage.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>Vector Database:</strong> Pinecone for vector embeddings storage and semantic search.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>Memory Cache:</strong> Redis for short-term memory and session management.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>AI Services:</strong> Integration with Mastra, Google Gemini, and other AI services.
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>Evaluation & Observability:</strong> LangSmith for agent evaluation, testing, and monitoring.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Frontend Architecture Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Frontend Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          The frontend is built with Next.js 15 using the App Router architecture, with a focus on
          React Server Components (RSCs) for improved performance and SEO.
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Components
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Public Pages:</strong> Home, About, Documentation, Services, and Pricing pages.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Auth Flow:</strong> Signup, Login, and Password Reset pages integrated with Supabase Auth.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Chat Interface:</strong> Real-time conversation UI with streaming responses, message history, and file attachments.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Dashboard:</strong> Analytics, agent management, and user settings.
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Technology Stack
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Framework:</strong> Next.js 15 with App Router and TypeScript.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>UI Library:</strong> Material UI v7 with custom theme.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>State Management:</strong> React Context for global state and React Query for server state.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>API Communication:</strong> Custom hooks using fetch API with TypeScript types.
                </Typography>
              </Box>
            </Stack>
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
{`// Example of frontend API communication with TypeScript types
import { useMutation } from 'react-query';

interface MessagePayload {
  content: string;
  agentId: string;
  sessionId: string;
  attachments?: File[];
}

interface MessageResponse {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export const useSendMessage = () => {
  return useMutation(
    async (message: MessagePayload): Promise<MessageResponse> => {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    }
  );
};`}
            </Code>
          </Paper>
        </Stack>
      </Box>

      {/* Backend Architecture Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Backend Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          The backend is built with NestJS, providing a modular, scalable API for agent orchestration,
          tool execution, and data management.
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Core Modules
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Mastra Core:</strong> Integration with Mastra AI for agent orchestration.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Auth Module:</strong> User authentication and authorization via Supabase.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Memory Module:</strong> Management of short and long-term memory.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Tool Registry:</strong> Registration and execution of custom tools.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>RAG Pipeline:</strong> Document processing, embedding, and retrieval.
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              API Structure
            </Typography>
            <Typography variant="body1" paragraph>
              The API follows RESTful principles with versioned endpoints. Core endpoints include:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">
                      POST /api/v1/chat/messages
                    </Code>
                  </Box> - Send messages to agents
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">
                      GET /api/v1/chat/sessions/{'{sessionId}'}
                    </Code>
                  </Box> - Get conversation history
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">
                      POST /api/v1/documents
                    </Code>
                  </Box> - Upload documents for RAG
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <Box component="span" sx={{ bgcolor: alpha('#1F2937', 0.1), px: 0.5, borderRadius: 0.5 }}>
                    <Code variant="inline">
                      GET /api/v1/agents
                    </Code>
                  </Box> - List available agents
                </Typography>
              </Box>
            </Stack>
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
{`// Example NestJS Controller for Chat Messages
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @UseGuards(AuthGuard)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: User
  ): Promise<MessageResponseDto> {
    return this.chatService.processMessage({
      ...createMessageDto,
      userId: user.id,
    });
  }
}`}
            </Code>
          </Paper>
        </Stack>
      </Box>

      {/* Data Storage Architecture Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Data Storage Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          The platform utilizes multiple data storage solutions optimized for different types of data:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Supabase PostgreSQL
            </Typography>
            <Typography variant="body1" paragraph>
              Used for structured data including:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  User profiles and authentication
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Agent configurations and metadata
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Session information and conversation metadata
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Tool configurations and usage analytics
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Pinecone Vector Database
            </Typography>
            <Typography variant="body1" paragraph>
              Optimized for vector embeddings storage and similarity search:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Long-term conversation memory as embeddings
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Document embeddings for RAG implementation
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Semantic search capability across embedded content
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Upstash Redis
            </Typography>
            <Typography variant="body1" paragraph>
              High-performance in-memory data store used for:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Short-term conversation memory
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Caching frequently accessed data
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Rate limiting and request throttling
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Session management
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Integration Architecture Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Integration Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          DeanMachines AI integrates with several external services to provide its capabilities:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Mastra AI
            </Typography>
            <Typography variant="body1" paragraph>
              Core AI orchestration framework that provides:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Agent definition and configuration
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Tool framework for extending agent capabilities
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Memory integration interfaces
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Google Gemini
            </Typography>
            <Typography variant="body1" paragraph>
              Advanced language model integration providing:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Natural language understanding and generation
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Multimodal capabilities (text, images)
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Reasoning and tool selection
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              LangSmith
            </Typography>
            <Typography variant="body1" paragraph>
              Evaluation and testing platform providing:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Agent performance monitoring
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Response quality evaluation
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  A/B testing of agent configurations
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Detailed logs and analytics
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Deployment Architecture Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Deployment Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          The platform is designed for scalable, cloud-native deployment:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Frontend Deployment
            </Typography>
            <Typography variant="body1" paragraph>
              The Next.js application is deployed to Vercel with:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Edge runtime for global performance
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Automatic scaling based on traffic
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  ISR (Incremental Static Regeneration) for documentation pages
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Backend Deployment
            </Typography>
            <Typography variant="body1" paragraph>
              The NestJS API is containerized and deployed to Google Cloud Run with:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Automatic scaling based on request volume
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Zero cold-start optimization for production environments
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Secure environment for API keys and secrets
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Developer Experience
            </Typography>
            <Typography variant="body1" paragraph>
              The platform supports both local development and production deployment with:
            </Typography>
            <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
              <Box component="li">
                <Typography variant="body1">
                  Docker-compose for local development with all dependencies
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  CI/CD pipelines for automated testing and deployment
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  Environment-specific configuration for development, staging, and production
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Next Steps Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body1" paragraph>
          Now that you understand the architecture, explore these related topics:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/api-reference">API Reference</MuiLink> for detailed endpoint documentation
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/guides">Implementation Guides</MuiLink> for practical examples
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/examples">Examples</MuiLink> of common implementation patterns
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
