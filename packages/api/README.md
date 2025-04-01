# API Backend for DeanMachines

## Current Progress (Sprint 2)

### Database Infrastructure
-  Supabase database schema
  - User preferences table
  - Conversations table
  - Messages table
  - Row Level Security (RLS) policies
  - Vector embeddings tracking
  - Document storage table
  - User activity logging
-  Drizzle ORM schema implementation
  - Type-safe table definitions
  - PostgreSQL-specific features
  - Proper relation definitions
  - Enum types for theme and roles

- Upstash Redis integration
  - Redis for memory and caching
- ✅ Type-safe database client
  - Unified client for Supabase and Upstash
  - Error handling and connection management
  - Health check utilities

- Pinecone Configuration
  - Vector store for embeddings
  - Semantic search capabilities
  - Metadata filtering and indexing
  - Conversation history and memory
  - ⏳ Testing vector storage with Pinecone
- ⏳ Integration with agent memory system

### Authentication & Security
- ✅ Supabase auth guard implementation for NestJS
- ✅ Environment variables configuration
- ✅ Row Level Security (RLS) policies
- ✅ API rate limiting with Upstash

### Mastra Integration
- ✅ Basic folder structure setup
- ✅ Gemini model configuration
-  Vector store implementation with Pinecone
-  Store embeddings service implementation
-  Document chunking and embedding utilities
- ⏳ Main Mastra instance configuration
- ⏳ Agent controller streaming responses

## Active Backend Tasks

### Vector Store & Embeddings
- ✅ Fixed EmbeddingModel<number[]> generic type in all files
-  Implemented PineconeVector adapter with proper configuration
- ✅ Created EmbeddingService for document processing
-  Added document chunking capabilities
- ⏳ Testing vector storage with Pinecone
- ⏳ Integration with agent memory system

### Agent System
-  Agent controller for NestJS has not been implemented
-  Basic agent definitions
-  Streaming response implementation
- ⏳ Memory system integration
- ⏳ Tool integration

### Main Mastra Configuration
- ⏳ Connect agents, memory, and vector store
- ⏳ Initialize with proper environment variables
- ⏳ Integrate with Upstash and Pinecone
- ⏳ Implement conversation helper functions

## Database Schema

### Schema Generation
To generate the database schema from the Drizzle ORM definitions:

```bash
# Generate SQL migration
pnpm drizzle-kit generate --schema=src/Drizzle/schema.tsx

# Push schema changes to the database
pnpm drizzle-kit push --schema=src/Drizzle/schema.tsx
```

For development, you can also use the introspection tool:

```bash
# Introspect existing database
pnpm drizzle-kit introspect --schema=src/Drizzle/schema.tsx
```

### Tables

#### Schema Overview
- **users**: Base user information (linked to Supabase Auth)
- **user_preferences**: User-specific settings
- **conversations**: Chat sessions with agents
- **messages**: Individual messages within conversations
- **vector_embeddings**: Tracking for Pinecone vector store records
- **documents**: RAG sources and conversation exports
- **user_activities**: User interaction logs for analytics

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
  last_message_at TIMESTAMPTZ,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE
);

-- Messages within conversations
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  is_error BOOLEAN DEFAULT FALSE,
  is_processing BOOLEAN DEFAULT FALSE,
  token_count JSONB
);

-- Vector embeddings tracking
CREATE TABLE vector_embeddings (
  id UUID PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  object_type TEXT NOT NULL,
  object_id UUID NOT NULL,
  created_at TIMESTAMPTZ,
  metadata JSONB,
  namespace TEXT
);

-- Documents for RAG
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  metadata JSONB,
  is_indexed BOOLEAN DEFAULT FALSE
);
```

### Vector Store Configuration

#### Pinecone Configuration
- Document embeddings storage
- Semantic search implementation
- Metadata filtering capabilities
- Vector indexing for RAG
- Conversation history and memory

## Environment Requirements
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
DATABASE_URL=<supabase_connection_string>

# Pinecone Configuration
PINECONE_API_KEY=<your_api_key>
PINECONE_ENV=<environment>
PINECONE_HOST=<host>
PINECONE_INDEX_NAME=<index_name>
PINECONE_MODEL=llama-text-embed-v2
PINECONE_DIMENSION=2048
PINECONE_METRIC=cosine
PINECONE_NAMESPACE=Default

# Upstash Configuration (for Redis)
UPSTASH_REDIS_URL=<redis_url>
UPSTASH_REDIS_TOKEN=<redis_token>

# LangSmith Configuration
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=<your_api_key>

# Model Configuration
GEMINI_API_KEY=<your_api_key>
MODEL=gemini-pro
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
   pnpm drizzle-kit push:pg
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Progress Notes

### April 1, 2025 Updates
- Enhanced database schema with proper Drizzle ORM integration
- Added document and vector embedding tracking tables
- Implemented enum types for theme and message roles
- Fixed EmbeddingModel generic type errors in multiple files
- Implemented proper Pinecone vector store integration
- Created document chunking and embedding service
- Addressed TypeScript strict mode compliance issues
- Added proper error handling for vector operations
- Updated environment variable management
