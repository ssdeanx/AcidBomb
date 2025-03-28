// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
})
export class AppModule {}

// apps/api/src/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@repo/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}

// Example usage in a service
import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/database';

@Injectable()
export class UserService {
  async createUser(data: { email: string; name?: string }) {
    return prisma.user.create({ data });
  }
}
