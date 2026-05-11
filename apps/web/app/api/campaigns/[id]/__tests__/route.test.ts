import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, PATCH, DELETE } from '../route'
import { db } from '@reddit-monitor/db'
import { auth } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const mockCampaign = db.campaign as unknown as {
  findUnique: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  deleteMany: ReturnType<typeof vi.fn>
}

const SESSION = { user: { id: 'user-1', email: 'u@example.com', plan: 'FREE' } }
const OTHER_SESSION = { user: { id: 'user-2', email: 'other@example.com', plan: 'FREE' } }

const CAMPAIGN = {
  id: 'camp-1',
  userId: 'user-1',
  name: 'CRM leads',
  description: null,
  industry: 'SaaS',
  targetCustomer: null,
  status: 'active',
  createdAt: new Date(),
  keywords: [{ id: 'kw-1', text: 'crm software', enabled: true, dailyHits: 5 }],
  competitors: [{ id: 'comp-1', name: 'HubSpot', createdAt: new Date() }],
}

function makePatch(body: unknown) {
  return new NextRequest('http://localhost/api/campaigns/camp-1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const PARAMS = { params: { id: 'camp-1' } }

beforeEach(() => vi.clearAllMocks())

describe('GET /api/campaigns/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(401)
  })

  it('returns 404 when campaign not found', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue(null)
    const res = await GET(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 404 when campaign belongs to another user', async () => {
    mockAuth.mockResolvedValue(OTHER_SESSION)
    mockCampaign.findUnique.mockResolvedValue(CAMPAIGN)
    const res = await GET(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 200 with campaign, keywords, and competitors', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue(CAMPAIGN)
    const res = await GET(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('CRM leads')
    expect(body.keywords).toHaveLength(1)
    expect(body.competitors).toHaveLength(1)
    expect(body.userId).toBeUndefined()
  })
})

describe('PATCH /api/campaigns/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await PATCH(makePatch({ name: 'Updated' }), PARAMS)
    expect(res.status).toBe(401)
  })

  it('returns 404 when campaign not found or belongs to another user', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue(null)
    const res = await PATCH(makePatch({ name: 'Updated' }), PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 400 for empty name', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    const res = await PATCH(makePatch({ name: '  ' }), PARAMS)
    expect(res.status).toBe(400)
    expect(mockCampaign.update).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid status', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    const res = await PATCH(makePatch({ status: 'archived' }), PARAMS)
    expect(res.status).toBe(400)
    expect(mockCampaign.update).not.toHaveBeenCalled()
  })

  it('updates and returns 200', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.findUnique.mockResolvedValue({ userId: 'user-1' })
    const updated = { ...CAMPAIGN, name: 'Updated', keywords: undefined, competitors: undefined }
    mockCampaign.update.mockResolvedValue(updated)
    const res = await PATCH(makePatch({ name: 'Updated', status: 'paused' }), PARAMS)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.name).toBe('Updated')
  })
})

describe('DELETE /api/campaigns/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await DELETE(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(401)
  })

  it('returns 404 when campaign not found or belongs to another user', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.deleteMany.mockResolvedValue({ count: 0 })
    const res = await DELETE(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 204 on successful delete', async () => {
    mockAuth.mockResolvedValue(SESSION)
    mockCampaign.deleteMany.mockResolvedValue({ count: 1 })
    const res = await DELETE(new NextRequest('http://localhost/api/campaigns/camp-1'), PARAMS)
    expect(res.status).toBe(204)
  })
})
