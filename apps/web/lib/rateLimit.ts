import { redis } from './redis'
import { NextRequest, NextResponse } from 'next/server'

export async function rateLimit(
  req: NextRequest,
  { key, max, windowSeconds }: { key: string; max: number; windowSeconds: number },
): Promise<NextResponse | null> {
  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? ''
  // Only accept valid IPv4/IPv6 to prevent attacker-controlled key flooding
  const ip = /^[0-9a-fA-F.:]{2,45}$/.test(rawIp) ? rawIp : 'unknown'
  const redisKey = `${key}:${ip}`

  // Atomic: increment and set TTL only on first request within the window
  const count = (await redis.eval(
    `local c = redis.call('INCR', KEYS[1])
     if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
     return c`,
    1,
    redisKey,
    String(windowSeconds),
  )) as number

  if (count > max) {
    const minutes = Math.ceil(windowSeconds / 60)
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minutes.` },
      { status: 429 },
    )
  }

  return null
}
