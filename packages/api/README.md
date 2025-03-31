# API Backend for DeanMachines

## Current Progress (Sprint 1)

### Database Infrastructure
- ✅ Supabase database schema
  - User preferences table
  - Conversations table
  - Messages table
  - Row Level Security (RLS) policies
- ✅ Upstash Integration
  - Redis for memory and caching
  - Vector store for RAG and embeddings
- ✅ Type-safe database client
  - Unified client for Supabase and Upstash
  - Error handling and connection management
  - Health check utilities

### Authentication & Security
- ✅ Supabase auth guard implementation for NestJS
- ✅ Environment variables configuration
- ✅ Row Level Security (RLS) policies
- ✅ API rate limiting with Upstash

### Mastra Integration
- ✅ Basic folder structure setup
- ✅ Gemini model configuration
- ✅ Upstash Redis and Vector store setup
- ✅ LangSmith integration for tracing
- ✅ Database service for Mastra
- ⏳ Agent controller streaming responses

## Current Sprint Tasks (Sprint 2)

### Core Mastra Components
1. **Agent System**
   - Chat agent with Gemini integration
   - Conversation memory with Upstash Redis
   - Streaming response handling
   - Error recovery mechanisms
   - Database persistence

2. **Vector Storage**
   - Upstash Vector store integration
   - Document embedding with Gemini
   - Metadata filtering system
   - Result reranking implementation
   - Conversation history indexing

3. **Memory System**
   - Upstash Redis integration
   - Memory persistence layer
   - Semantic recall functionality
   - Working memory persistence
   - Cross-conversation context

4. **API Controllers**
   - Agent endpoints with streaming
   - Authentication middleware
   - Rate limiting implementation
   - Error handling standardization
   - Conversation management

## Database Schema

### Tables

```sql
-- User preferences with theme and language settings
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  theme TEXT CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Conversations for tracking chat sessions
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ
);

-- Messages within conversations
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ
);
```

### Upstash Configuration

#### Redis Usage
- Session management
- Rate limiting
- Memory storage
- Caching
- Working memory

#### Vector Store Usage
- Document embeddings
- Conversation history
- Semantic search
- RAG implementation
- Memory indexing

## Project Structure
```
packages/api/
├── src/
│   ├── database/
│   │   ├── migrations/    # SQL migrations
│   │   ├── client.ts     # Type-safe database client
│   │   ├── supabase.ts   # Supabase configuration
│   │   ├── upstash.ts    # Upstash configuration
│   │   └── index.ts      # Database exports
│   ├── mastra/
│   │   ├── agents/       # Gemini-powered agents
│   │   ├── evaluation/   # LangSmith integration
│   │   ├── services/     # Database services
│   │   ├── tools/        # RAG and utility tools
│   │   ├── workflows/    # Complex operation flows
│   │   └── index.ts      # Main Mastra configuration
│   ├── controllers/
│   │   └── agents/       # API endpoints
│   ├── supabase/
│   │   └── guard.ts      # Auth middleware
│   └── main.ts           # NestJS entry point
└── package.json
```

## Environment Requirements
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
DATABASE_URL=<supabase_connection_string>

# Upstash Configuration
UPSTASH_VECTOR_REST_URL=<vector_store_url>
UPSTASH_VECTOR_REST_TOKEN=<vector_store_token>
UPSTASH_REDIS_URL=<redis_url>
UPSTACK_REDIS_TOKEN=<redis_token>

# LangSmith Configuration
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=<your_api_key>

# Model Configuration
GEMINI_API_KEY=<your_api_key>
MODEL=gemini-2.0-pro-exp-03-25
MODEL_TEMPERATURE=0.2
MODEL_MAX_TOKENS=8192
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` to `.env` and fill in credentials
4. Run Supabase migrations:
   ```bash
   pnpm supabase db push
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Tracking Progress

### Completed
- Basic Mastra folder structure
- Supabase authentication integration
- Environment configuration
- Initial agent system setup
- Database infrastructure
- Memory system setup

### In Progress
- Agent controller implementation
- Memory system integration
- RAG capabilities setup
- API endpoint development

### Coming Soon
- Advanced RAG features
- Workflow engine
- Third-party integrations
- Observability system
