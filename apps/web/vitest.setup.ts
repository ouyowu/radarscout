import { vi } from 'vitest'

// Mock @reddit-monitor/db so tests don't need a live DB connection
// Use importOriginal so real exports (PLAN_LIMITS, etc.) are available in tests
vi.mock('@reddit-monitor/db', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@reddit-monitor/db')>()
  return {
    ...mod,
    db: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      keyword: {
        findMany: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        deleteMany: vi.fn(),
      },
      match: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
  }
})
