import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { db } from '@reddit-monitor/db'
import { auth } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const mockCampaign = db.campaign as unknown as {
  findMany: ReturnType<typeof vi.fn>
  count: ReturnType<typeof vi.fn>
  create: ReturnType<typeof vi.fn>
}

const FREE_SESSION = { user: { id: 'user-1', email: 'u@example.com', plan: 'FREE' } }
const PRO_SESSION  = { user: { id: 'user-1', email: 'u@example.com', plan: 'PRO'  } }

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const CAMPAIGN = {
  id: 'camp-1',
  name: 'CRM leads',
  description: null,
  industry: 'SaaS',
  targetCustomer: null,
  status: 'active',
  createdAt: new Date(),
  _count: { keywords: 2, competitors: 1 },
}

beforeEach(() => vi.clearAllMocks())

describe('GET /api/campaigns', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 200 with campaigns list', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)
    mockCampaign.findMany.mockResolvedValue([CAMPAIGN])
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('CRM leads')
    expect(body[0]._count.keywords).toBe(2)
  })
})

describe('POST /api/campaigns', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await POST(makePost({ name: 'Test' }))
    expect(res.status).toBe(401)
  })

  it('creates a campaign and returns 201', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)
    mockCampaign.count.mockResolvedValue(0)
    mockCampaign.create.mockResolvedValue({ ...CAMPAIGN, _count: undefined })
    const res = await POST(makePost({ name: 'CRM leads', industry: 'SaaS' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.name).toBe('CRM leads')
    expect(mockCampaign.create).toHaveBeenCalledOnce()
  })

  it('returns 400 for missing name', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)
    const res = await POST(makePost({ name: '   ' }))
    expect(res.status).toBe(400)
    expect(mockCampaign.create).not.toHaveBeenCalled()
  })

  it('returns 400 for name longer than 100 chars', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)
    const res = await POST(makePost({ name: 'a'.repeat(101) }))
    expect(res.status).toBe(400)
    expect(mockCampaign.create).not.toHaveBeenCalled()
  })

  it('returns 429 when FREE plan is at the 1-campaign limit', async () => {
    mockAuth.mockResolvedValue(FREE_SESSION)
    mockCampaign.count.mockResolvedValue(1)
    const res = await POST(makePost({ name: 'Second Campaign' }))
    expect(res.status).toBe(429)
    expect(mockCampaign.create).not.toHaveBeenCalled()
  })

  it('allows PRO user to create up to 10 campaigns', async () => {
    mockAuth.mockResolvedValue(PRO_SESSION)
    mockCampaign.count.mockResolvedValue(9)
    mockCampaign.create.mockResolvedValue({ ...CAMPAIGN, _count: undefined })
    const res = await POST(makePost({ name: 'Tenth Campaign' }))
    expect(res.status).toBe(201)
  })

  it('returns 429 when PRO plan is at the 10-campaign limit', async () => {
    mockAuth.mockResolvedValue(PRO_SESSION)
    mockCampaign.count.mockResolvedValue(10)
    const res = await POST(makePost({ name: 'Eleventh Campaign' }))
    expect(res.status).toBe(429)
  })
})
