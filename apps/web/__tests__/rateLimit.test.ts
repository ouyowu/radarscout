import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/redis', () => ({
  redis: { eval: vi.fn() },
}))

import { rateLimit } from '../lib/rateLimit'
import { redis } from '../lib/redis'

const mockEval = redis.eval as ReturnType<typeof vi.fn>

function makeReq(xff?: string) {
  return new NextRequest('https://radarscout.io/api/auth/register', {
    method: 'POST',
    headers: xff ? { 'x-forwarded-for': xff } : {},
  })
}

beforeEach(() => vi.clearAllMocks())

const config = { key: 'rl:test', max: 5, windowSeconds: 900 }

describe('rateLimit', () => {
  it('returns null when under the limit', async () => {
    mockEval.mockResolvedValue(3)
    const res = await rateLimit(makeReq('1.2.3.4'), config)
    expect(res).toBeNull()
  })

  it('returns 429 when limit is exceeded', async () => {
    mockEval.mockResolvedValue(6)
    const res = await rateLimit(makeReq('1.2.3.4'), config)
    expect(res?.status).toBe(429)
    const body = await res!.json()
    expect(body.error).toMatch(/15 minutes/)
  })

  it('error message reflects windowSeconds dynamically', async () => {
    mockEval.mockResolvedValue(99)
    const res = await rateLimit(makeReq('1.2.3.4'), { ...config, windowSeconds: 3600 })
    const body = await res!.json()
    expect(body.error).toMatch(/60 minutes/)
  })

  it('uses "unknown" for invalid x-forwarded-for to prevent key flooding', async () => {
    mockEval.mockResolvedValue(1)
    await rateLimit(makeReq('<script>attack</script>, 1.2.3.4'), config)
    const [, , redisKey] = mockEval.mock.calls[0]
    expect(redisKey).toBe('rl:test:unknown')
  })

  it('uses "unknown" when x-forwarded-for is absent', async () => {
    mockEval.mockResolvedValue(1)
    await rateLimit(makeReq(), config)
    const [, , redisKey] = mockEval.mock.calls[0]
    expect(redisKey).toBe('rl:test:unknown')
  })

  it('uses the real IP from x-forwarded-for when valid', async () => {
    mockEval.mockResolvedValue(1)
    await rateLimit(makeReq('203.0.113.42, 10.0.0.1'), config)
    const [, , redisKey] = mockEval.mock.calls[0]
    expect(redisKey).toBe('rl:test:203.0.113.42')
  })
})
