import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { db } from '@reddit-monitor/db'
import { auth } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

const mockDb = db as unknown as {
  keyword: {
    findMany: ReturnType<typeof vi.fn>
    count: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
  }
}

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const session = { user: { id: 'user-1', email: 'test@example.com', plan: 'FREE' } }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/keywords', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 200 with the user keywords', async () => {
    mockAuth.mockResolvedValue(session)
    mockDb.keyword.findMany.mockResolvedValue([
      { id: 'kw-1', text: 'rust', enabled: true, dailyHits: 0, createdAt: new Date() },
    ])
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toHaveLength(1)
    expect(body[0].text).toBe('rust')
  })
})

describe('POST /api/keywords', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await POST(makePost({ text: 'rust' }))
    expect(res.status).toBe(401)
  })

  it('creates a keyword and returns 201', async () => {
    mockAuth.mockResolvedValue(session)
    mockDb.keyword.count.mockResolvedValue(0)
    mockDb.keyword.create.mockResolvedValue({ id: 'kw-1', text: 'rust', enabled: true })
    const res = await POST(makePost({ text: 'rust' }))
    const body = await res.json()
    expect(res.status).toBe(201)
    expect(body.text).toBe('rust')
    expect(mockDb.keyword.create).toHaveBeenCalledOnce()
  })

  it('returns 400 for empty text', async () => {
    mockAuth.mockResolvedValue(session)
    const res = await POST(makePost({ text: '   ' }))
    expect(res.status).toBe(400)
    expect(mockDb.keyword.create).not.toHaveBeenCalled()
  })

  it('returns 400 for text longer than 100 chars', async () => {
    mockAuth.mockResolvedValue(session)
    const res = await POST(makePost({ text: 'a'.repeat(101) }))
    expect(res.status).toBe(400)
    expect(mockDb.keyword.create).not.toHaveBeenCalled()
  })

  it('returns 429 when FREE plan is at the 3-keyword limit', async () => {
    mockAuth.mockResolvedValue(session)
    mockDb.keyword.count.mockResolvedValue(3)
    const res = await POST(makePost({ text: 'rust' }))
    expect(res.status).toBe(429)
    expect(mockDb.keyword.create).not.toHaveBeenCalled()
  })
})
