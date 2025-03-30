import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv'; // Import dotenv

// Define a type for the global object including the prisma instance
interface GlobalWithPrisma extends NodeJS.Global {
    prisma?: PrismaClient;
}

// Cast the global object to the custom type
const globalWithPrisma = global as GlobalWithPrisma;


dotenv.config(); // Call config correctly

export const prisma = globalWithPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prisma;
}
