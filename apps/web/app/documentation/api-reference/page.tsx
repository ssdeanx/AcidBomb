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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Code } from '@repo/ui/Code';
import { Collapsible } from '@repo/ui/Collapsible';

/**
 * Generate SEO metadata for the API reference page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'API Reference | DeanMachines AI Documentation',
    description: 'Comprehensive API reference for the DeanMachines AI platform. Learn about available endpoints, request formats, response structures, and authentication.',
  };
}

/**
 * API Reference documentation page
 * Provides detailed technical documentation for the platform's APIs
 */
export default function APIReferencePage() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          API Reference
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This reference provides detailed documentation for the DeanMachines AI platform API.
          Use these endpoints to programmatically interact with agents, manage conversations,
          and integrate AI capabilities into your applications.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Authentication Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Authentication
        </Typography>
        <Typography variant="body1" paragraph>
          All API requests require authentication using a JWT token. There are two ways to authenticate:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Bearer Token
            </Typography>
            <Typography variant="body1" paragraph>
              Include an Authorization header with a bearer token:
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
{`Authorization: Bearer YOUR_JWT_TOKEN`}
              </Code>
            </Paper>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              API Key
            </Typography>
            <Typography variant="body1" paragraph>
              Include an API key in the request header:
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
{`X-API-Key: YOUR_API_KEY`}
              </Code>
            </Paper>
            <Typography variant="body1">
              You can generate API keys in your account settings.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Base URL Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Base URL
        </Typography>
        <Typography variant="body1" paragraph>
          All API endpoints are relative to the base URL:
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
{`https://api.deanmachines.ai/v1`}
          </Code>
        </Paper>
        <Typography variant="body1">
          For development environments, use your local API server:
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
{`http://localhost:3001/v1`}
          </Code>
        </Paper>
      </Box>

      {/* Response Format Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Response Format
        </Typography>
        <Typography variant="body1" paragraph>
          All API responses follow a standard format:
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
{`{
  "success": boolean,   // true for successful requests, false for errors
  "data": object|array, // Response data (null if error)
  "error": {            // Only present if success is false
    "code": string,     // Error code
    "message": string,  // Human-readable error message
    "details": object   // Additional error details (optional)
  },
  "meta": {             // Pagination and other metadata (if applicable)
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}`}
          </Code>
        </Paper>
      </Box>

      {/* Errors Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Error Codes
        </Typography>
        <Typography variant="body1" paragraph>
          The API uses standard HTTP status codes and returns detailed error information:
        </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', mb: 4 }}>
          <Table size="small" aria-label="error codes table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Error Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>400</TableCell>
                <TableCell><Code variant="inline">BAD_REQUEST</Code></TableCell>
                <TableCell>Invalid request parameters</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>401</TableCell>
                <TableCell><Code variant="inline">UNAUTHORIZED</Code></TableCell>
                <TableCell>Authentication required or invalid credentials</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>403</TableCell>
                <TableCell><Code variant="inline">FORBIDDEN</Code></TableCell>
                <TableCell>Permission denied for the requested resource</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>404</TableCell>
                <TableCell><Code variant="inline">NOT_FOUND</Code></TableCell>
                <TableCell>Requested resource not found</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>409</TableCell>
                <TableCell><Code variant="inline">CONFLICT</Code></TableCell>
                <TableCell>Resource conflict (e.g., duplicate name)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>429</TableCell>
                <TableCell><Code variant="inline">RATE_LIMITED</Code></TableCell>
                <TableCell>Too many requests, rate limit exceeded</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>500</TableCell>
                <TableCell><Code variant="inline">SERVER_ERROR</Code></TableCell>
                <TableCell>Internal server error</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>503</TableCell>
                <TableCell><Code variant="inline">SERVICE_UNAVAILABLE</Code></TableCell>
                <TableCell>Service temporarily unavailable</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Endpoints Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          API Endpoints
        </Typography>

        {/* Agents Endpoints */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h3" gutterBottom>
            Agents
          </Typography>

          <Stack spacing={2}>
            {/* List Agents Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      GET
                    </Code>
                    /agents
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    List all agents
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Returns a list of all agents available to the authenticated user.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Query Parameters:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Code variant="inline">page</Code></TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Page number (default: 1)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Code variant="inline">limit</Code></TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Results per page (default: 10, max: 100)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": [
    {
      "id": "agent_123abc",
      "name": "CustomerSupport",
      "description": "A helpful customer support agent",
      "model": "gemini-pro",
      "created_at": "2025-02-15T14:30:00Z",
      "updated_at": "2025-03-20T09:15:00Z"
    },
    {
      "id": "agent_456def",
      "name": "ProductExpert",
      "description": "Product documentation expert",
      "model": "gemini-pro",
      "created_at": "2025-03-01T11:00:00Z",
      "updated_at": "2025-03-25T16:45:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}`}
                  </Code>
                </Paper>
              </Box>
            </Collapsible>

            {/* Get Agent Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      GET
                    </Code>
                    /agents/{'{agentId}'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get agent details
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Returns detailed information about a specific agent.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Path Parameters:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Code variant="inline">agentId</Code></TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Unique identifier of the agent</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": {
    "id": "agent_123abc",
    "name": "CustomerSupport",
    "description": "A helpful customer support agent",
    "model": "gemini-pro",
    "systemMessage": "You are CustomerSupport, an AI assistant specializing in technical support...",
    "tools": [
      {
        "name": "searchKnowledgeBase",
        "description": "Search the knowledge base for articles"
      },
      {
        "name": "createTicket",
        "description": "Create a support ticket"
      }
    ],
    "memory": {
      "type": "hybrid",
      "config": {
        "shortTerm": "redis",
        "longTerm": "pinecone"
      }
    },
    "created_at": "2025-02-15T14:30:00Z",
    "updated_at": "2025-03-20T09:15:00Z"
  }
}`}
                  </Code>
                </Paper>
              </Box>
            </Collapsible>

            {/* Create Agent Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      POST
                    </Code>
                    /agents
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Create a new agent
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Creates a new agent with the specified configuration.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Request Body:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "name": "ProductSupport",
  "description": "An agent for product support inquiries",
  "model": "gemini-pro",
  "systemMessage": "You are a product support specialist for Widget Co...",
  "tools": ["searchKnowledgeBase", "createTicket", "checkOrderStatus"],
  "memory": {
    "type": "hybrid",
    "config": {
      "shortTerm": {
        "provider": "redis",
        "ttl": 86400 // 1 day in seconds
      },
      "longTerm": {
        "provider": "pinecone",
        "namespace": "product-support",
        "ttl": 2592000 // 30 days in seconds
      }
    }
  }
}`}
                  </Code>
                </Paper>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": {
    "id": "agent_789ghi",
    "name": "ProductSupport",
    "description": "An agent for product support inquiries",
    "model": "gemini-pro",
    "systemMessage": "You are a product support specialist for Widget Co...",
    "tools": [
      {
        "name": "searchKnowledgeBase",
        "description": "Search the knowledge base for articles"
      },
      {
        "name": "createTicket",
        "description": "Create a support ticket"
      },
      {
        "name": "checkOrderStatus",
        "description": "Check the status of an order"
      }
    ],
    "memory": {
      "type": "hybrid",
      "config": {
        "shortTerm": "redis",
        "longTerm": "pinecone"
      }
    },
    "created_at": "2025-04-03T14:30:00Z",
    "updated_at": "2025-04-03T14:30:00Z"
  }
}`}
                  </Code>
                </Paper>
              </Box>
            </Collapsible>
          </Stack>
        </Box>

        {/* Chat Endpoints */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h3" gutterBottom>
            Chat
          </Typography>

          <Stack spacing={2}>
            {/* Send Message Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      POST
                    </Code>
                    /chat/messages
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Send message to agent
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Sends a message to an agent and returns the agent's response.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Request Body:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "agentId": "agent_123abc",
  "sessionId": "session_456def", // Optional, if omitted a new session will be created
  "message": "How do I reset my password?",
  "attachments": [] // Optional array of file IDs or base64 encoded files
}`}
                  </Code>
                </Paper>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": {
    "id": "msg_789ghi",
    "sessionId": "session_456def",
    "agentId": "agent_123abc",
    "role": "assistant",
    "content": "To reset your password, please follow these steps:\\n\\n1. Go to the login page\\n2. Click on 'Forgot Password'\\n3. Enter your email address\\n4. Check your email for a reset link\\n5. Click the link and create a new password\\n\\nLet me know if you need any further assistance!",
    "toolCalls": [], // If the agent used any tools
    "metadata": {
      "timings": {
        "total_ms": 1245,
        "thinking_ms": 320,
        "embedding_ms": 105,
        "llm_ms": 820
      }
    },
    "created_at": "2025-04-03T14:35:20Z"
  }
}`}
                  </Code>
                </Paper>
              </Box>
            </Collapsible>

            {/* Get Chat History Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      GET
                    </Code>
                    /chat/sessions/{'{sessionId}'}/messages
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get chat history
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Returns the message history for a specific chat session.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Path Parameters:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Code variant="inline">sessionId</Code></TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Unique identifier of the chat session</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Query Parameters:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Code variant="inline">limit</Code></TableCell>
                        <TableCell>number</TableCell>
                        <TableCell>Maximum number of messages to return (default: 50, max: 100)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Code variant="inline">before</Code></TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Message ID to fetch messages before (for pagination)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123abc",
        "sessionId": "session_456def",
        "agentId": "agent_123abc",
        "role": "user",
        "content": "How do I reset my password?",
        "attachments": [],
        "created_at": "2025-04-03T14:35:10Z"
      },
      {
        "id": "msg_789ghi",
        "sessionId": "session_456def",
        "agentId": "agent_123abc",
        "role": "assistant",
        "content": "To reset your password, please follow these steps:\\n\\n1. Go to the login page\\n2. Click on 'Forgot Password'\\n3. Enter your email address\\n4. Check your email for a reset link\\n5. Click the link and create a new password\\n\\nLet me know if you need any further assistance!",
        "toolCalls": [],
        "created_at": "2025-04-03T14:35:20Z"
      }
    ],
    "session": {
      "id": "session_456def",
      "title": "Password Reset Help",
      "agentId": "agent_123abc",
      "created_at": "2025-04-03T14:35:10Z",
      "updated_at": "2025-04-03T14:35:20Z"
    }
  }
}`}
                  </Code>
                </Paper>
              </Box>
            </Collapsible>
          </Stack>
        </Box>

        {/* Documents Endpoints */}
        <Box>
          <Typography variant="h4" component="h3" gutterBottom>
            Documents
          </Typography>

          <Stack spacing={2}>
            {/* Upload Document Endpoint */}
            <Collapsible
              header={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="medium">
                    <Code variant="inline">
                      POST
                    </Code>
                    /documents
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Upload document for RAG
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Uploads a document for processing and indexing in the RAG system.
                </Typography>
                <Typography variant="body2" paragraph>
                  This endpoint expects a multipart form-data request with the file and metadata.
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Form Parameters:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'medium' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Code variant="inline">file</Code></TableCell>
                        <TableCell>file</TableCell>
                        <TableCell>The document file (PDF, DOCX, TXT, etc.)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Code variant="inline">namespace</Code></TableCell>
                        <TableCell>string</TableCell>
                        <TableCell>Namespace for organizing documents (optional)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Code variant="inline">metadata</Code></TableCell>
                        <TableCell>JSON string</TableCell>
                        <TableCell>Additional metadata for the document (optional)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.900',
                    borderRadius: 1,
                    overflowX: 'auto',
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Code variant="block" highlight={true}>
{`{
  "success": true,
  "data": {
    "id": "doc_123abc",
    "filename": "product_manual.pdf",
    "mimeType": "application/pdf",
    "size": 1258947,
    "namespace": "product-docs",
    "metadata": {
      "product": "Widget Pro",
      "version": "2.0",
      "language": "en-US"
    },
    "status": "processing",
    "created_at": "2025-04-03T14:40:00Z"
  }
}`}
                  </Code>
                </Paper>
                <Typography variant="body2" paragraph>
                  Note that document processing happens asynchronously. You can check the processing status using the
                  <Code variant="inline">
                    GET /documents/{'{documentId}'}
                  </Code> endpoint.
                </Typography>
              </Box>
            </Collapsible>

            {/* Additional document endpoints would be documented here */}
          </Stack>
        </Box>
      </Box>

      {/* SDKs Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Client SDKs
        </Typography>
        <Typography variant="body1" paragraph>
          We provide official client libraries to simplify API integration:
        </Typography>
        <Stack spacing={2} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              JavaScript/TypeScript SDK
            </Typography>
            <Typography variant="body1" paragraph>
              Install via npm:
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
{`npm install @deanmachines/sdk`}
              </Code>
            </Paper>
            <Typography variant="body1" paragraph>
              Basic usage:
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
{`import { DeanMachinesClient } from '@deanmachines/sdk';

// Initialize with API key
const client = new DeanMachinesClient({
  apiKey: 'YOUR_API_KEY'
});

// Send a message to an agent
const response = await client.chat.sendMessage({
  agentId: 'agent_123abc',
  message: 'How do I reset my password?'
});

console.log(response.data.content);`}
              </Code>
            </Paper>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Python SDK
            </Typography>
            <Typography variant="body1" paragraph>
              Install via pip:
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
{`pip install deanmachines`}
              </Code>
            </Paper>
            <Typography variant="body1" paragraph>
              Basic usage:
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
{`from deanmachines import DeanMachinesClient

# Initialize with API key
client = DeanMachinesClient(api_key="YOUR_API_KEY")

# Send a message to an agent
response = client.chat.send_message(
  agent_id="agent_123abc",
  message="How do I reset my password?"
)

print(response.data.content)`}
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
          Now that you understand the API, you can explore these related topics:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/guides">Implementation Guides</MuiLink> for step-by-step tutorials
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/examples">Examples</MuiLink> for common integration patterns
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
