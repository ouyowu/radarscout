import { vi } from 'vitest'

// Mock @reddit-monitor/db so tests don't need a live DB connection
vi.mock('@reddit-monitor/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    keyword: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))
