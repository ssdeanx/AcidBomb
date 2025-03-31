# Turborepo starter

This is a community-maintained example. If you experience a problem, please submit a pull request with a fix. GitHub Issues will be closed.

## Using this example

Run the following command:

```bash
npx create-turbo@latest -e with-nestjs
```

## What's inside?

This Turborepo includes the following packages/apps:

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

- **`apps/api`**: A [NestJS](https://nestjs.com/) application that serves as the backend API.
- **`apps/web`**: A [Next.js](https://nextjs.org/) application that serves as the frontend.
- **`packages/@repo/ui`**: A stub React component library that can be used in both the `web` and `api` applications.
- **`packages/@repo/typescript-config`**: A shared `tsconfig.json` file that can be used in all packages and applications.
- **`packages/@repo/jest-config`**: A shared `jest` configuration that can be used in all packages and applications.
- **`packages/@repo/eslint-config`**: A shared `eslint` configuration that can be used in all packages and applications.
- **`packages/@repo/api`**: A shared `NestJS` resources that can be used in all packages and applications.
- **`packages/@repo/tsconfig`**: A shared `tsconfig.json` file that can be used in all packages and applications.

Each package and application are 100% [TypeScript](https://www.typescriptlang.org/) safe.

```mermaid
mindmap
  root((Turbo-Next))
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
          services
          modules
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
      @repo/database
        Models
          User
          Prompt
          Chat
        Migrations
        Seeds
        Client
      @repo/api
        DTOs
        Entities
        Types
      Config Packages
        typescript-config
          base
          react
          next
          nest
        eslint-config
          base
          react
          next
          nest
          prettier
        jest-config
          base
          react
          nest
    Tools
      Package Manager[PNPM]
      Build Tool[Turbo]
      Testing
        Jest
        Playwright
      Linting
        ESLint
        Prettier
        TypeScript
      CI/CD
        Turbo Cache
        Vercel
```

### Utilities

This `Turborepo` has some additional tools already set for you:

- [TypeScript](https://www.typescriptlang.org/) for static type-safety
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://prettier.io) & [Playwright](https://playwright.dev/) for testing

### Commands

This `Turborepo` already configured useful commands for all your apps and packages.

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
    User((User))

    subgraph "Frontend Container"
        WebApp["Web Application<br>(Next.js)"]

        subgraph "Frontend Components"
            ThemeProvider["Theme Provider<br>(React)"]
            AppBar["App Bar<br>(React/MUI)"]
            UIComponents["UI Components<br>(React/MUI)"]
            SupabaseClient["Supabase Client<br>(TypeScript)"]
        end
    end

    subgraph "Backend Container"
        APIServer["API Server<br>(NestJS)"]

        subgraph "API Components"
            AgentController["Agent Controller<br>(NestJS)"]
            LinksModule["Links Module<br>(NestJS)"]
            AuthGuard["Supabase Auth Guard<br>(NestJS)"]
            MastraCore["Mastra Core<br>(TypeScript)"]
        end

        subgraph "Agent Components"
            ChatAgent["Chat Agent<br>(Gemini)"]
            SearchAgent["Search Agent<br>(Gemini)"]
            CodeAssistant["Code Assistant<br>(Gemini)"]
        end
    end

    subgraph "Data Storage Container"
        PostgresDB[("PostgreSQL Database<br>(Prisma)")]
        RedisCache[("Redis Cache<br>(Upstash)")]
        VectorStore[("Vector Store<br>(Upstash)")]
    end

    subgraph "External Services"
        GeminiAI["Gemini AI<br>(Google)"]
        LangSmith["LangSmith<br>(Evaluation)"]
        Supabase["Supabase<br>(Auth/Storage)"]
    end

    %% Frontend Relationships
    User -->|"Accesses"| WebApp
    WebApp -->|"Uses"| ThemeProvider
    WebApp -->|"Uses"| AppBar
    WebApp -->|"Uses"| UIComponents
    WebApp -->|"Authenticates"| SupabaseClient
    SupabaseClient -->|"Authenticates with"| Supabase

    %% Backend Relationships
    WebApp -->|"Makes API calls"| APIServer
    APIServer -->|"Routes requests"| AgentController
    APIServer -->|"Uses"| LinksModule
    APIServer -->|"Validates auth"| AuthGuard
    AuthGuard -->|"Verifies tokens"| Supabase

    %% Agent Relationships
    AgentController -->|"Manages"| MastraCore
    MastraCore -->|"Uses"| ChatAgent
    MastraCore -->|"Uses"| SearchAgent
    MastraCore -->|"Uses"| CodeAssistant
    ChatAgent -->|"Generates responses"| GeminiAI
    SearchAgent -->|"Generates responses"| GeminiAI
    CodeAssistant -->|"Generates responses"| GeminiAI

    %% Data Storage Relationships
    APIServer -->|"Persists data"| PostgresDB
    MastraCore -->|"Caches data"| RedisCache
    MastraCore -->|"Stores vectors"| VectorStore

    %% External Service Relationships
    MastraCore -->|"Evaluates"| LangSmith
```
