// apps/api/src/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Module,
} from '@nestjs/common';
import { prisma } from '@repo/database/PrismaClient'; // Adjust the import path as

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}

// apps/api/src/app.module.ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService if it needs to be used in other modules
})
export class AppModule {}

// Example usage in a service
@Injectable()
export class UserService {
  // Assuming PrismaService is injected via constructor
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: { email: string; name?: string }) {
    // Use the injected prisma instance if available through the service,
    // otherwise use the direct import if that's the intended pattern.
    // This example assumes direct import usage based on original code.
    return prisma.user.create({ data });
  }
}
