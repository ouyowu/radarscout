import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'
import { db } from '@reddit-monitor/db'

const mockDb = db as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
  }
}

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/auth/register', () => {
  it('creates a user and returns 201 for valid input', async () => {
    mockDb.user.findUnique.mockResolvedValue(null)
    mockDb.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      plan: 'FREE',
    })

    const res = await POST(makeRequest({ email: 'test@example.com', password: 'password123' }))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.email).toBe('test@example.com')
    expect(body.plan).toBe('FREE')
    expect(mockDb.user.create).toHaveBeenCalledOnce()
    // password must be hashed, not stored as-is
    const createArg = mockDb.user.create.mock.calls[0][0].data
    expect(createArg.passwordHash).not.toBe('password123')
  })

  it('returns 409 when email is already in use', async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: 'existing', email: 'taken@example.com' })

    const res = await POST(makeRequest({ email: 'taken@example.com', password: 'password123' }))
    const body = await res.json()

    expect(res.status).toBe(409)
    expect(body.error).toMatch(/already in use/i)
    expect(mockDb.user.create).not.toHaveBeenCalled()
  })

  it('returns 400 when password is shorter than 8 characters', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com', password: 'short' }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toMatch(/8 characters/i)
    expect(mockDb.user.findUnique).not.toHaveBeenCalled()
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: 'password123' }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toMatch(/email/i)
  })

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.error).toMatch(/8 characters/i)
  })
})
