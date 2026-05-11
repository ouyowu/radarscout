import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'
import { DELETE } from '../[competitorId]/route'
import { db } from '@reddit-monitor/db'
import { auth } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const mockCampaign = db.campaign as unknown as {
  findUnique: ReturnType<typeof vi.fn>
}
const mockCompetitor = db.competitor as unknown as {
  create: ReturnType<typeof vi.fn>
  deleteMany: ReturnType<typeof vi.fn>
}

const SESSION = { user: { id: 'user-1', email: 'u@example.com', plan: 'FREE' } }

const CAMPAIGN_PARAMS = { params: { id: 'camp-1' } }
const COMPETITOR_PARAMS = { params: { id: 'camp-1', competitorId: 'comp-1' } }

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/campaigns/camp-1/competitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => vi.clearAllMocks())

describe('POST /api/campaigns/[id]/competitors', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await POST(makePost({ name: 'HubSpot' }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(401)
  })

  it('returns 404 when campaign not found', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue(null)
    const res = await POST(makePost({ name: 'HubSpot' }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 404 when campaign belongs to another user', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'other-user' })
    const res = await POST(makePost({ name: 'HubSpot' }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 400 for missing name', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    const res = await POST(makePost({ name: '  ' }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(400)
    expect(mockCompetitor.create).not.toHaveBeenCalled()
  })

  it('returns 400 for name longer than 100 chars', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    const res = await POST(makePost({ name: 'a'.repeat(101) }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(400)
    expect(mockCompetitor.create).not.toHaveBeenCalled()
  })

  it('creates competitor and returns 201', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    mockCompetitor.create.mockResolvedValue({
      id: 'comp-1',
      name: 'HubSpot',
      createdAt: new Date(),
    })
    const res = await POST(makePost({ name: 'HubSpot' }), CAMPAIGN_PARAMS)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.name).toBe('HubSpot')
    expect(mockCompetitor.create).toHaveBeenCalledOnce()
  })
})

describe('DELETE /api/campaigns/[id]/competitors/[competitorId]', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await DELETE(
      new NextRequest('http://localhost/api/campaigns/camp-1/competitors/comp-1'),
      COMPETITOR_PARAMS,
    )
    expect(res.status).toBe(401)
  })

  it('returns 404 when campaign belongs to another user', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'other-user' })
    const res = await DELETE(
      new NextRequest('http://localhost/api/campaigns/camp-1/competitors/comp-1'),
      COMPETITOR_PARAMS,
    )
    expect(res.status).toBe(404)
    expect(mockCompetitor.deleteMany).not.toHaveBeenCalled()
  })

  it('returns 404 when competitor not found', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    mockCompetitor.deleteMany.mockResolvedValue({ count: 0 })
    const res = await DELETE(
      new NextRequest('http://localhost/api/campaigns/camp-1/competitors/comp-1'),
      COMPETITOR_PARAMS,
    )
    expect(res.status).toBe(404)
  })

  it('returns 204 on successful delete', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    mockCompetitor.deleteMany.mockResolvedValue({ count: 1 })
    const res = await DELETE(
      new NextRequest('http://localhost/api/campaigns/camp-1/competitors/comp-1'),
      COMPETITOR_PARAMS,
    )
    expect(res.status).toBe(204)
  })
})
