import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

// In development, reuse across HMR reloads to avoid exhausting connections.
// In production (serverless), each instance is short-lived — set
// ?connection_limit=1 in DATABASE_URL when using a connection pooler (e.g.
// Supabase pgbouncer port 6543).
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export * from '@prisma/client'
export * from './plans'
