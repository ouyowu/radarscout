import { Redis } from 'ioredis'
import { RedditClient } from './reddit.js'
import { startWorker } from './worker.js'

// Fail fast with a clear message if any required env var is missing
const required = [
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET',
  'REDDIT_USER_AGENT',
  'INTERNAL_API_URL',
  'INTERNAL_API_SECRET',
] as const

const missing = required.filter(k => !process.env[k])
if (missing.length > 0) {
  console.error('[leadpulse] missing required env vars:', missing.join(', '))
  process.exit(1)
}

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_USER_AGENT,
  REDIS_URL,
} = process.env as Record<string, string>

const connection = new Redis(REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // required by BullMQ
  enableReadyCheck: false,
})

connection.on('error', err => console.error('[redis]', err.message))

const redditClient = new RedditClient(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT)

console.log('[leadpulse] starting...')

startWorker(redditClient, connection)
  .then(shutdown => {
    const stop = async (signal: string) => {
      console.log(`[leadpulse] ${signal} received — shutting down...`)
      await shutdown()
      await connection.quit()
      process.exit(0)
    }
    process.on('SIGTERM', () => stop('SIGTERM'))
    process.on('SIGINT', () => stop('SIGINT'))
  })
  .catch(err => {
    console.error('[leadpulse] fatal:', err)
    process.exit(1)
  })
