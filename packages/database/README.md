# database

PostgreSQL database package with Prisma ORM integration for the Turborepo monorepo

## Features

- 🏃 Prisma ORM setup
- 📝 Type-safe database schemas
- 🔄 Migration management
- 🌱 Database seeding
- 🔒 Environment configuration

## Setup

1. Install  dependencies

```basg
pnpm install
```
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"

```bash
pnpm db:generate
```

```
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Prompt {
  id          String   @id @default(cuid())
  title       String
  content     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Chat {
  id        String   @id @default(cuid())
  messages  Json[]
  model     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
// In your NestJS service
import { prisma } from '@repo/database';

@Injectable()
export class UsersService {
  async findMany() {
    return prisma.user.findMany();
  }

  async create(data: { email: string; name?: string }) {
    return prisma.user.create({ data });
  }
}
```

```bash
# Create a new migration
pnpm prisma migrate dev --name your_migration_name
```

```bash
# Apply migrations
pnpm prisma migrate deploy
```

```bash
# Run seed script
pnpm db:seed
```

```plaintext
# Directory Structure
packages/database/
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.ts          # Seed script
├── src/
│   ├── index.ts         # Main exports
│   └── client.ts        # Prisma client singleton
├── tests/               # Test files
└── package.json
```
