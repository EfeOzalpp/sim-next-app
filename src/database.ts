import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Initialize PostgreSQL connection pool and Prisma adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Maintain a global Prisma client instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Export the Prisma client instance
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
