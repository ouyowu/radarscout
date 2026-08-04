import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

function requestWithJson(body: unknown): Request {
  return new Request('http://localhost/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/events', () => {
  it('records the safe partner handoff source and intent without accepting a full outbound URL', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const response = await POST(new Request('http://localhost/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'booking_partner_handoff_clicked',
        provider: 'viator',
        placement: 'tour_detail_primary',
        city: 'Chiang Mai',
        productId: 'viator_12345p1',
        attributionSource: 'viator_affiliate',
        targetHost: 'www.viator.com',
        hasDates: true,
        hasGroupSize: true,
        hasOccupancy: true,
        travelerType: 'family',
        recommendationSource: 'planner',
        reasonCode: 'interest_match',
        durationDays: 3,
        pace: 'moderate',
        href: 'https://www.viator.com/private?pid=secret',
        commissionPercent: 12,
      }),
    }))

    expect(response.status).toBe(204)
    expect(log).toHaveBeenCalledWith(JSON.stringify({
      tag: 'funnel_event',
      event: 'booking_partner_handoff_clicked',
      provider: 'viator',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      productId: 'viator_12345p1',
      attributionSource: 'viator_affiliate',
      targetHost: 'www.viator.com',
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
      recommendationSource: 'planner',
      reasonCode: 'interest_match',
      durationDays: 3,
      pace: 'moderate',
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs only the approved funnel event dimensions', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const response = await POST(
      requestWithJson({
        event: 'booking_partner_handoff_clicked',
        provider: 'viator',
        placement: 'tour_detail_primary',
        city: 'Chiang Mai',
        productId: 'viator_6467bkknight',
        hasDates: true,
        prompt: 'private trip prompt',
        email: 'traveler@example.com',
        url: 'https://example.com/private',
        price: 99,
      }),
    )

    expect(response.status).toBe(204)
    expect(log).toHaveBeenCalledTimes(1)
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual({
      tag: 'funnel_event',
      event: 'booking_partner_handoff_clicked',
      provider: 'viator',
      placement: 'tour_detail_primary',
      city: 'Chiang Mai',
      productId: 'viator_6467bkknight',
      hasDates: true,
    })
  })

  it('rejects unknown events without logging', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const response = await POST(requestWithJson({ event: 'unknown_event', provider: 'viator' }))

    expect(response.status).toBe(400)
    expect(log).not.toHaveBeenCalled()
  })

  it('rejects malformed JSON without logging', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    const request = new Request('http://localhost/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(log).not.toHaveBeenCalled()
  })

  it('drops invalid optional dimensions instead of logging unsafe values', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const response = await POST(
      requestWithJson({
        event: 'affiliate_partner_handoff_clicked',
        provider: 'unapproved-provider',
        placement: 'unknown-placement',
        city: 'traveler@example.com',
        productId: 'https://example.com/product',
        hasDates: 'yes',
        prompt: 'private trip prompt',
        recommendationSource: 'private prompt source',
        reasonCode: 'because the user said something private',
        durationDays: 365,
        pace: 'extreme',
      }),
    )

    expect(response.status).toBe(204)
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual({
      tag: 'funnel_event',
      event: 'affiliate_partner_handoff_clicked',
    })
  })

  it('records a safe recommendation impression without raw user text', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const response = await POST(requestWithJson({
      event: 'finder_recommendations_rendered',
      provider: 'viator',
      placement: 'planner_filtered_matches',
      city: 'Phuket',
      productId: 'viator_123p1',
      recommendationSource: 'planner',
      reasonCode: 'interest_match',
      durationDays: 4,
      pace: 'relaxed',
      travelerType: 'couple',
      prompt: 'private free-form request',
    }))

    expect(response.status).toBe(204)
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toEqual({
      tag: 'funnel_event',
      event: 'finder_recommendations_rendered',
      provider: 'viator',
      placement: 'planner_filtered_matches',
      city: 'Phuket',
      productId: 'viator_123p1',
      recommendationSource: 'planner',
      reasonCode: 'interest_match',
      durationDays: 4,
      pace: 'relaxed',
      travelerType: 'couple',
    })
  })
})
