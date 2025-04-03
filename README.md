<div align="center">

# DeanMachines

### A Modern AI-Powered Application Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

AI-powered application platform with Next.js frontend and NestJS backend for building intelligent, conversational experiences.

</div>

## 🚀 Project Overview

DeanMachines is a modern monorepo application built with Turborepo, featuring:

- **Next.js Frontend** with AI-powered user interfaces
- **NestJS Backend** with robust API architecture
- **Mastra AI Integration** for intelligent agent capabilities
- **Vector Database** for semantic search and embeddings
- **Component Library** for consistent UI/UX
- **Error Handling** for robust vector operations
- **TypeScript Compliance** for improved code quality

## 📂 Repository Structure

### Apps and Packages

```bash
    .
    ├── apps
    │   ├── api                       # NestJS app (https://nestjs.com).
    │   └── web                       # Next.js app (https://nextjs.org).
    └── packages
        ├── @repo/api                 # Shared `NestJS` resources.
        ├── @repo/eslint-config       # `eslint` configurations (includes `prettier`)
        ├── @repo/jest-config         # `jest` configurations
        ├── @repo/typescript-config   # `tsconfig.json`s used throughout the monorepo
        ├── @repo/ui                  # Shareable stub React component library.
        └── @repo/database              # Shareable stub React component library.
```

## ✨ Features

- 🤖 **Mastra AI Framework** - Agent-based AI capabilities
- 🔍 **Vector Search** - Semantic search using Pinecone
- 🔐 **Authentication** - Secure auth with Supabase
- 💾 **Database** - Type-safe database integration
- 🎨 **UI Components** - Shared component library
- 📱 **Responsive Design** - Works on all devices

## 🧠 Mastra AI Backend Progress

### 🛠️ Backend Infrastructure

- ✅ **Database Schema**
  - User preferences, conversations, messages
  - Vector embeddings tracking
  - Document storage
  - Row Level Security (RLS) policies

- ✅ **ORM Implementation**
  - Type-safe table definitions with Drizzle
  - PostgreSQL integration
  - Proper relation definitions
  - Enum types for theme and roles

```mermaid
mindmap
  root((DeanMachines))
    apps
      web
        Next.js App
          pages
            dashboard
            documentation
            about
          components
          tests
            jest
            playwright
      api
        NestJS App
          controllers
            agent.controller
          services
            agent.service
          modules
          DTOs
            create-agent.dto
            update-agent.dto
          tests
    packages
      @repo/ui
        Layout
          appbar
          sidebar
          footer
          hero
        Data Display
          charts[Recharts]
          graphs[Plotly]
          table
          list
        AI/Chat
          chatWindow
          chatMessage
          modelSelector
        Core
          button
          card
          input
          paper
          progress
          switch
          slider
          tooltip
      @repo/api
        mastra
          services
            store-embeddings
            database
          tools
            document
            graphrag
            vectorquery
            weatherInfo
          agents
          index
        DTOs
        Entities
        Types
      @repo/database
        Models
          User
          Conversation
          Message
          Document
          VectorEmbedding
        Migrations
        Seeds
        Client
      Config Packages
        typescript-config
        eslint-config
        jest-config
    Tools
      Package Manager[PNPM]
      Build Tool[Turbo]
      Testing
      Linting
      CI/CD
    Infrastructure
      Database
        Supabase
          PostgreSQL
          Auth
          Storage
      Vector Store
        Pinecone
          Embeddings
          Semantic Search
      Cache
        Upstash Redis
          Memory
          Session State
      AI Services
        Gemini
        LangSmith
```

- **`apps/api`**: A [NestJS](https://nestjs.com/) application that serves as the backend API.
- **`apps/web`**: A [Next.js](https://nextjs.org/) application that serves as the frontend.
- **`packages/@repo/ui`**: A stub React component library that can be used in both the `web` and `api` applications.
- **`packages/@repo/typescript-config`**: A shared `tsconfig.json` file that can be used in all packages and applications.
- **`packages/@repo/jest-config`**: A shared `jest` configuration that can be used in all packages and applications.
- **`packages/@repo/eslint-config`**: A shared `eslint` configuration that can be used in all packages and applications.
- **`packages/@repo/api`**: A shared `NestJS` resources that can be used in all packages and applications.
- **`packages/@repo/tsconfig`**: A shared `tsconfig.json` file that can be used in all packages and applications.

#### Build

```bash
# Will build all the app & packages with the supported `build` script.
pnpm run build
```

#### ℹ️ If you plan to only build apps individually

#### Please make sure you've built the packages first

#### Develop

```bash
# Will run the development server for all the app & packages with the supported `dev` script.
pnpm run dev
```

#### Test

```bash
# Will launch a test suites for all the app & packages with the supported `test` script.
pnpm run test

# You can launch e2e testes with `test:e2e`
pnpm run test:e2e

# See `@repo/jest-config` to customize the behavior.
```

#### Lint

```bash
# Will lint all the app & packages with the supported `lint` script.
# See `@repo/eslint-config` to customize the behavior.
pnpm run lint
```

#### Format

```bash
# Will format all the supported `.ts,.js,json,.tsx,.jsx` files.
# See `@repo/eslint-config/prettier-base.js` to customize the behavior.
pnpm format
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```bash
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
- [GitHub Actions](https://turbo.build/repo/docs/guides/github-actions)
- [Vercel](https://vercel.com/docs/concepts/git)
- [Vercel Remote Cache](https://vercel.com/docs/concepts/remote-cache)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel CLI Commands](https://vercel.com/docs/cli)
- [Vercel CLI Configuration](https://vercel.com/docs/cli/configuration)
- [Vercel CLI Environment Variables](https://vercel.com/docs/cli/environment-variables)

```mermaid
graph TB
    User((External User))

    subgraph "Frontend Container"
        WebApp["Web Application<br>(Next.js)"]

        subgraph "Frontend Components"
            AuthComponent["Authentication<br>(Next Auth)"]
            ChatInterface["Chat Interface<br>(React)"]
            Dashboard["Dashboard<br>(React)"]
            ThemeProvider["Theme Provider<br>(MUI)"]
            AppBar["App Bar<br>(MUI)"]
            SupabaseClient["Supabase Client<br>(Supabase SDK)"]
        end
    end

    subgraph "Backend Container"
        NestAPI["API Server<br>(NestJS)"]

        subgraph "API Components"
            AppController["App Controller<br>(NestJS)"]
            ChatModule["Chat Module<br>(NestJS)"]
            LinksModule["Links Module<br>(NestJS)"]
            MastraCoreModule["Mastra Core Module<br>(NestJS)"]
            HttpExceptionFilter["Exception Filter<br>(NestJS)"]
        end
    end

    subgraph "Database Container"
        SupabaseDB[("Primary Database<br>(Supabase/PostgreSQL)")]
        VectorStore[("Vector Store<br>(Upstash)")]
        RedisCache[("Cache<br>(Redis)")]

        subgraph "Database Components"
            UserPrefs["User Preferences<br>(SQL Table)"]
            Conversations["Conversations<br>(SQL Table)"]
            Messages["Messages<br>(SQL Table)"]
            VectorOps["Vector Operations<br>(Upstash SDK)"]
            RedisOps["Redis Operations<br>(Redis SDK)"]
        end
    end

    subgraph "Mastra Container"
        MastraCore["Mastra Core<br>(TypeScript)"]

        subgraph "Mastra Components"
            AgentController["Agent Controller<br>(NestJS)"]
            AgentService["Agent Service<br>(TypeScript)"]
            EmbeddingService["Embedding Service<br>(TypeScript)"]
            DatabaseService["Database Service<br>(TypeScript)"]
        end
    end

    %% Relationships
    User -->|"Interacts with"| WebApp
    WebApp -->|"API Calls"| NestAPI
    WebApp -->|"Auth/Data"| SupabaseClient

    %% Frontend Component Relationships
    WebApp -->|"Uses"| AuthComponent
    WebApp -->|"Uses"| ChatInterface
    WebApp -->|"Uses"| Dashboard
    WebApp -->|"Uses"| ThemeProvider
    WebApp -->|"Uses"| AppBar

    %% Backend Component Relationships
    NestAPI -->|"Routes to"| AppController
    NestAPI -->|"Uses"| ChatModule
    NestAPI -->|"Uses"| LinksModule
    NestAPI -->|"Uses"| MastraCoreModule
    NestAPI -->|"Error Handling"| HttpExceptionFilter

    %% Database Component Relationships
    SupabaseDB -->|"Stores"| UserPrefs
    SupabaseDB -->|"Stores"| Conversations
    SupabaseDB -->|"Stores"| Messages
    VectorStore -->|"Uses"| VectorOps
    RedisCache -->|"Uses"| RedisOps

    %% Mastra Component Relationships
    MastraCore -->|"Controls"| AgentController
    MastraCore -->|"Uses"| AgentService
    MastraCore -->|"Uses"| EmbeddingService
    MastraCore -->|"Uses"| DatabaseService

    %% Cross-Container Relationships
    NestAPI -->|"Queries"| SupabaseDB
    NestAPI -->|"Vectors"| VectorStore
    NestAPI -->|"Caches"| RedisCache
    MastraCore -->|"Integrates"| NestAPI
    DatabaseService -->|"Manages"| SupabaseDB
    EmbeddingService -->|"Stores"| VectorStore
```
