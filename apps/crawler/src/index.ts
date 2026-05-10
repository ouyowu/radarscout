import { Redis } from 'ioredis'
import { startEngine } from './engine.js'

const required = ['INTERNAL_API_URL', 'INTERNAL_API_SECRET'] as const

const missing = required.filter(k => !process.env[k])
if (missing.length > 0) {
  console.error('[radarscout] missing required env vars:', missing.join(', '))
  process.exit(1)
}

const { INTERNAL_API_URL, INTERNAL_API_SECRET, REDIS_URL } = process.env as Record<string, string>

const redis = new Redis(REDIS_URL ?? 'redis://localhost:6379', {
  enableReadyCheck: false,
})

redis.on('error', err => console.error('[redis]', err.message))

console.log('[radarscout] starting RSS-first crawler...')

startEngine(redis, { apiUrl: INTERNAL_API_URL, apiSecret: INTERNAL_API_SECRET })
  .then(shutdown => {
    const stop = async (signal: string) => {
      console.log(`[radarscout] ${signal} received — shutting down...`)
      shutdown()
      await redis.quit()
      process.exit(0)
    }
    process.on('SIGTERM', () => stop('SIGTERM'))
    process.on('SIGINT', () => stop('SIGINT'))
  })
  .catch(err => {
    console.error('[radarscout] fatal:', err)
    process.exit(1)
  })
