import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'

import { loadAiReadyProductCatalogue } from '@/lib/aiProducts/aiReadyProductSchema'

import { GET } from '../route'

function makeRequest(id: string) {
  return new NextRequest(
    `http://localhost/api/activity-decision-cards/${encodeURIComponent(id)}`,
  )
}

function makeParams(id: string) {
  return { params: { id } }
}

describe('GET /api/activity-decision-cards/[id]', () => {
  it('returns the reviewed AI-ready decision card for a reviewed product ID', async () => {
    const product = loadAiReadyProductCatalogue()[0]

    const response = await GET(makeRequest(product.id), makeParams(product.id))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ card: product })
    expect(response.headers.get('cache-control')).toBe(
      'public, max-age=300, stale-while-revalidate=86400',
    )
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('returns 404 for an unknown or unreviewed product ID', async () => {
    const response = await GET(
      makeRequest('viator_not_reviewed'),
      makeParams('viator_not_reviewed'),
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      card: null,
      error: 'ACTIVITY_DECISION_CARD_NOT_FOUND',
    })
  })

  it('does not expose upstream or commercial fields', async () => {
    const product = loadAiReadyProductCatalogue()[0]
    const response = await GET(makeRequest(product.id), makeParams(product.id))
    const body = await response.json()
    const keys: string[] = []

    JSON.stringify(body, (key, value) => {
      if (key) keys.push(key)
      return value
    })

    for (const forbidden of [
      'bookingPartnerHandoff',
      'retailPrice',
      'currency',
      'price',
      'availability',
      'rating',
      'reviews',
      'supplier',
      'commission',
      'raw',
    ]) {
      expect(keys).not.toContain(forbidden)
    }
  })
})
