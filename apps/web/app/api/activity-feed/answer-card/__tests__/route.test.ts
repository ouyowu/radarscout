import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'

import { loadActivityFeedV1 } from '@/lib/activityFeed/activityFeedV1'
import { GET } from '../route'

function request(url: string): NextRequest {
  return new NextRequest(`http://localhost${url}`)
}

describe('GET /api/activity-feed/answer-card', () => {
  it('returns a reviewed Activity Feed answer card', async () => {
    const item = loadActivityFeedV1({ take: 1 })[0]
    const response = await GET(request(`/api/activity-feed/answer-card?id=${item.id}`))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ ok: true, answerCard: item })
    expect(JSON.stringify(body)).not.toMatch(
      /"(?:price|inventory|commission|supplier|rating|reviewCount|raw)"\s*:/i,
    )
  })

  it('fails closed for missing or unknown products', async () => {
    const missing = await GET(request('/api/activity-feed/answer-card'))
    expect(missing.status).toBe(400)
    expect(await missing.json()).toEqual({ ok: false, error: 'product_id_required' })

    const unknown = await GET(request('/api/activity-feed/answer-card?id=viator_not_reviewed'))
    expect(unknown.status).toBe(404)
    expect(await unknown.json()).toEqual({ ok: false, error: 'product_not_found' })
  })
})
