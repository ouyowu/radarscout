import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'
import { auth } from '@/lib/auth'

const stripeMock = vi.hoisted(() => ({
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))
vi.mock('@/lib/stripe', () => ({
  getStripe: () => stripeMock,
}))

import { getStripe } from '@/lib/stripe'

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const mockCreate = getStripe().checkout.sessions.create as unknown as ReturnType<typeof vi.fn>

const session = { user: { id: 'user-1', email: 'test@example.com', plan: 'FREE' } }

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.STRIPE_PRO_PRICE_ID = 'price_pro_test'
  process.env.STRIPE_TEAM_PRICE_ID = 'price_team_test'
  process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
})

describe('POST /api/stripe/checkout', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)

    const res = await POST(makeRequest({ plan: 'PRO' }))

    expect(res.status).toBe(401)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns 400 for an invalid plan', async () => {
    mockAuth.mockResolvedValue(session)

    const res = await POST(makeRequest({ plan: 'ENTERPRISE' }))

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid plan')
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('creates a checkout session for PRO and returns the url', async () => {
    mockAuth.mockResolvedValue(session)
    mockCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/test-session' })

    const res = await POST(makeRequest({ plan: 'PRO' }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toBe('https://checkout.stripe.com/test-session')

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'subscription',
        metadata: expect.objectContaining({ userId: 'user-1', plan: 'PRO' }),
        line_items: [{ price: 'price_pro_test', quantity: 1 }],
      }),
    )
  })
})
