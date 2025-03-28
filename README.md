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

```mermaid
graph TB
    User((External User))

    subgraph "Frontend Container"
        direction TB
        NextApp["Next.js Web App<br>(Next.js 15.2)"]

        subgraph "Frontend Components"
            direction TB
            ThemeProvider["Theme Provider<br>(MUI)"]
            UIComponents["UI Components<br>(React)"]
            Layout["Root Layout<br>(React)"]
            Pages["Pages Router<br>(Next.js)"]

            subgraph "UI Component Library"
                direction LR
                AppBar["AppBar<br>(React)"]
                Button["Button<br>(React)"]
                Card["Card<br>(React)"]
                Charts["Charts<br>(React)"]
                Chat["Chat Components<br>(React)"]
                Dashboard["Dashboard<br>(React)"]
                Footer["Footer<br>(React)"]
            end
        end
    end

    subgraph "Backend Container"
        direction TB
        NestApp["API Server<br>(NestJS)"]

        subgraph "API Components"
            direction TB
            AppModule["App Module<br>(NestJS)"]
            LinksModule["Links Module<br>(NestJS)"]
            LinksController["Links Controller<br>(NestJS)"]
            LinksService["Links Service<br>(NestJS)"]
        end
    end

    subgraph "Database Container"
        direction TB
        PostgresDB[("PostgreSQL Database<br>(PostgreSQL)")]

        subgraph "Database Components"
            direction TB
            PrismaClient["Prisma Client<br>(Prisma)"]
            UserModel["User Model<br>(Prisma)"]
            PromptModel["Prompt Model<br>(Prisma)"]
            ChatModel["Chat Model<br>(Prisma)"]
        end
    end

    %% Relationships
    User -->|"Uses"| NextApp
    NextApp -->|"API Calls"| NestApp

    %% Frontend Internal
    NextApp -->|"Uses"| ThemeProvider
    NextApp -->|"Uses"| UIComponents
    NextApp -->|"Uses"| Layout
    NextApp -->|"Routes"| Pages
    ThemeProvider -->|"Styles"| UIComponents

    %% Backend Internal
    NestApp -->|"Contains"| AppModule
    AppModule -->|"Imports"| LinksModule
    LinksModule -->|"Contains"| LinksController
    LinksController -->|"Uses"| LinksService

    %% Database Internal
    NestApp -->|"Queries"| PrismaClient
    PrismaClient -->|"Manages"| PostgresDB
    PrismaClient -->|"Maps"| UserModel
    PrismaClient -->|"Maps"| PromptModel
    PrismaClient -->|"Maps"| ChatModel

    %% Component Library
    UIComponents -->|"Contains"| AppBar
    UIComponents -->|"Contains"| Button
    UIComponents -->|"Contains"| Card
    UIComponents -->|"Contains"| Charts
    UIComponents -->|"Contains"| Chat
    UIComponents -->|"Contains"| Dashboard
    UIComponents -->|"Contains"| Footer
```
