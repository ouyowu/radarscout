import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { loadActivityFeedV1 } from '@/lib/activityFeed/activityFeedV1'
import { POST } from '../route'

function request(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/activity-feed/compare', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/activity-feed/compare', () => {
  it('returns a reviewed comparison from Activity Feed products', async () => {
    const products = loadActivityFeedV1({ take: 20 })
    const sameCity = products.filter(product => product.destination.city === products[0].destination.city)
    const response = await POST(request({ productIds: [sameCity[0].id, sameCity[1].id] }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.comparison.products.map((product: { id: string }) => product.id))
      .toEqual([sameCity[0].id, sameCity[1].id])
    expect(JSON.stringify(body)).not.toMatch(
      /"(?:price|inventory|commission|supplier|rating|reviewCount|raw|winner)"\s*:/i,
    )
  })

  it('rejects malformed and unknown comparison requests', async () => {
    const malformed = await POST(request({ productIds: 'viator_1' }))
    expect(malformed.status).toBe(400)
    expect(await malformed.json()).toEqual({ ok: false, error: 'product_ids_required' })

    const unknown = await POST(request({ productIds: ['viator_not_reviewed', 'viator_other'] }))
    expect(unknown.status).toBe(404)
    expect(await unknown.json()).toEqual({
      ok: false,
      error: 'unknown_product_ids',
      productIds: ['viator_not_reviewed', 'viator_other'],
    })
  })
})
