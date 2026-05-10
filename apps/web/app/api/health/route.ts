import { NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { redis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ts = new Date().toISOString()
  let dbStatus = 'ok'
  let redisStatus = 'ok'
  let crawlerLastPoll: string | null = null

  try {
    await db.$queryRaw`SELECT 1`
  } catch {
    dbStatus = 'unreachable'
  }

  try {
    await redis.ping()
    crawlerLastPoll = await redis.get('lp:crawler:lastpoll')
  } catch {
    redisStatus = 'unreachable'
  }

  const healthy = dbStatus === 'ok' && redisStatus === 'ok'

  return NextResponse.json(
    { status: healthy ? 'ok' : 'error', db: dbStatus, redis: redisStatus, crawlerLastPoll, ts },
    { status: healthy ? 200 : 503 },
  )
}
