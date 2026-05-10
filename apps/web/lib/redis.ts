import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var _redis: Redis | undefined
}

function createRedis(): Redis {
  const client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  })
  client.on('error', err => console.error('[redis]', err.message))
  return client
}

// Reuse across hot-reloads in dev; create once in production
export const redis: Redis =
  globalThis._redis ?? (globalThis._redis = createRedis())
