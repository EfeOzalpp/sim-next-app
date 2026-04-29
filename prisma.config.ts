import { defineConfig } from '@prisma/config';

// Prisma configuration for schema location, database connection, and seeding
export default defineConfig({
  schema: './database/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // Command to run when seeding the database
  migrations: {
    seed: 'ts-node ./database/seed.ts',
  },
});
