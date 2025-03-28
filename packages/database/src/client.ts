import { PrismaClient } from '@prisma/client';
import { DotenvConfigOutput } from "dotenv";
declare global {
  var prisma: PrismaClient | undefined;
}

dotenv.config();

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
