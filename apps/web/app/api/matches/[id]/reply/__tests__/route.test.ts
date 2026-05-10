import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))
vi.mock('@anthropic-ai/sdk', () => ({ default: vi.fn() }))
vi.mock('@/lib/redis', () => ({
  redis: { incr: vi.fn(), expire: vi.fn() },
}))

import Anthropic from '@anthropic-ai/sdk'
import { redis } from '@/lib/redis'

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const mockIncr = redis.incr as unknown as ReturnType<typeof vi.fn>
const mockExpire = redis.expire as unknown as ReturnType<typeof vi.fn>
const mockMatchFindUnique = db.match.findUnique as unknown as ReturnType<typeof vi.fn>
const mockMatchUpdate = db.match.update as unknown as ReturnType<typeof vi.fn>
const mockUserFindUnique = db.user.findUnique as unknown as ReturnType<typeof vi.fn>
const mockUserUpdate = db.user.update as unknown as ReturnType<typeof vi.fn>

const PRO_SESSION = { user: { id: 'user-1', email: 'u@example.com', plan: 'PRO' } }
const FREE_SESSION = { user: { id: 'user-1', email: 'u@example.com', plan: 'FREE' } }

const MATCH = {
  id: 'match-1',
  title: 'Best project management tool?',
  snippet: 'Looking for something lightweight for a 5-person team',
  url: 'https://reddit.com/r/productivity/match-1',
  keyword: { userId: 'user-1' },
}

function makeRequest(body: unknown = {}) {
  return new NextRequest('http://localhost/api/matches/match-1/reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function mockAnthropic(draft: string) {
  vi.mocked(Anthropic).mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: draft }],
      }),
    },
  }) as never)
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.ANTHROPIC_API_KEY = 'test-key'
  mockIncr.mockResolvedValue(1)
  mockExpire.mockResolvedValue(1)
  mockMatchUpdate.mockResolvedValue({})
  mockUserUpdate.mockResolvedValue({})
})

describe('POST /api/matches/[id]/reply', () => {
  it('generates draft, saves to DB, and returns it', async () => {
    mockAuth.mockResolvedValue(PRO_SESSION)
    mockMatchFindUnique.mockResolvedValue(MATCH)
    mockAnthropic('This sounds like a common pain point. You might want to check out Linear.')

    const res = await POST(
      makeRequest({ productDescription: 'Linear — issue tracker for modern teams' }),
      { params: { id: 'match-1' } },
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.draft).toContain('Linear')

    expect(mockMatchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'match-1' },
        data: expect.objectContaining({ aiReplyDraft: expect.any(String) }),
      }),
    )
    expect(mockUserUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { productDescription: 'Linear — issue tracker for modern teams' },
      }),
    )
  })

  it('returns 403 for FREE user', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)

    const res = await POST(makeRequest(), { params: { id: 'match-1' } })

    expect(res.status).toBe(403)
    expect(vi.mocked(Anthropic)).not.toHaveBeenCalled()
  })

  it('returns 429 when rate limit exceeded', async () => {
    mockAuth.mockResolvedValue(PRO_SESSION)
    mockIncr.mockResolvedValue(21) // already at 21 — over the 20 limit

    const res = await POST(makeRequest(), { params: { id: 'match-1' } })

    expect(res.status).toBe(429)
    expect(vi.mocked(Anthropic)).not.toHaveBeenCalled()
  })

  it('saves productDescription to user profile', async () => {
    mockAuth.mockResolvedValue(PRO_SESSION)
    mockMatchFindUnique.mockResolvedValue(MATCH)
    mockAnthropic('Sounds frustrating. Tools like Acme can help here.')

    await POST(
      makeRequest({ productDescription: 'Acme — async standup for remote teams' }),
      { params: { id: 'match-1' } },
    )

    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { productDescription: 'Acme — async standup for remote teams' },
    })
  })
})
