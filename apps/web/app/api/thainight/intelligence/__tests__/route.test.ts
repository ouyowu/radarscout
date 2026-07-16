import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const dbMock = vi.hoisted(() => ({
  match: {
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

vi.mock('@reddit-monitor/matcher', () => ({
  fetchThaiNightVenues: vi.fn(),
  fuzzyMatchVenue: vi.fn(),
}))

import { GET } from '../route'

const originalToken = process.env.THAINIGHT_FEED_TOKEN

function makeRequest(options: { headerToken?: string; queryToken?: string } = {}) {
  const url = new URL('http://localhost/api/thainight/intelligence')
  if (options.queryToken) url.searchParams.set('token', options.queryToken)

  return new NextRequest(url, {
    headers: options.headerToken
      ? { 'x-thainight-token': options.headerToken }
      : undefined,
  })
}

describe('GET /api/thainight/intelligence authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbMock.match.findMany.mockResolvedValue([])
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.THAINIGHT_FEED_TOKEN
    } else {
      process.env.THAINIGHT_FEED_TOKEN = originalToken
    }
  })

  it('fails closed when the feed secret is not configured', async () => {
    delete process.env.THAINIGHT_FEED_TOKEN

    const response = await GET(makeRequest())

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
    expect(dbMock.match.findMany).not.toHaveBeenCalled()
  })

  it('rejects a query-string token because query strings can be logged', async () => {
    process.env.THAINIGHT_FEED_TOKEN = 'thainight-secret'

    const response = await GET(makeRequest({ queryToken: 'thainight-secret' }))

    expect(response.status).toBe(401)
    expect(dbMock.match.findMany).not.toHaveBeenCalled()
  })

  it('allows a correctly authenticated header-only request', async () => {
    process.env.THAINIGHT_FEED_TOKEN = 'thainight-secret'

    const response = await GET(makeRequest({ headerToken: 'thainight-secret' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      source: 'RadarScout',
      partner: 'thainight',
      count: 0,
      items: [],
    })
    expect(dbMock.match.findMany).toHaveBeenCalledOnce()
  })
})
