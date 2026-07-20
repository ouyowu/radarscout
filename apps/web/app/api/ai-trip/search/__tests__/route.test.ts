import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

const contextMock = vi.hoisted(() => ({ buildAiProductContext: vi.fn() }))
const assertMock = vi.hoisted(() => ({ assertAllProductsThailandEligible: vi.fn((candidates: unknown[]) => candidates) }))

vi.mock('@/lib/aiProducts/buildAiProductContext', () => contextMock)
vi.mock('@/lib/aiProducts/assertAllProductsThailandEligible', () => ({
  ...assertMock,
  IneligibleProductInContextError: class IneligibleProductInContextError extends Error {
    violations: unknown[]
    constructor(violations: unknown[]) {
      super('ineligible')
      this.violations = violations
    }
  },
}))

import { POST } from '../route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/ai-trip/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeContextItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 'viator_191442p6',
    title: 'Doi Inthanon, Waterfall+Royal Project from Chiang Mai with Lunch',
    city: 'Chiang Mai',
    summary: 'A Chiang Mai day trip to Doi Inthanon, waterfalls and the Royal Project.',
    tags: ['Nature', 'Waterfalls'],
    detailHref: '/tours/viator_191442p6',
    retailPrice: null,
    currency: null,
    ctaHref: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-191442P6?pid=P00309837',
    ctaLabel: 'Check availability',
    ctaRel: 'nofollow sponsored noopener noreferrer',
    externalHandoff: true,
    ...overrides,
  }
}

function makeHandoffContextItem(overrides: Record<string, unknown> = {}) {
  return makeContextItem({
    ...overrides,
  })
}

function makeDiscoveryOnlyContextItem(overrides: Record<string, unknown> = {}) {
  return makeContextItem({
    ctaHref: null,
    ctaLabel: null,
    ctaRel: null,
    externalHandoff: false,
    ...overrides,
  })
}

describe('POST /api/ai-trip/search — API tests 1–20', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  // Test 1: Empty prompt returns 400 invalid_request
  it('empty prompt returns 400 invalid_request', async () => {
    const res = await POST(makeRequest({ prompt: '' }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
    expect(body.products).toEqual([])
  })

  it('whitespace-only prompt returns 400 invalid_request', async () => {
    const res = await POST(makeRequest({ prompt: '   ' }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  // Test 2: Oversized prompt returns 400 invalid_request (limit = PARSER_PROMPT_LIMIT = 600)
  it('prompt exceeding 600 chars returns 400 invalid_request', async () => {
    const res = await POST(makeRequest({ prompt: 'a'.repeat(601) }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  it('prompt of exactly 600 chars is accepted', async () => {
    const res = await POST(makeRequest({ prompt: 'Bangkok '.repeat(75) })) // 600 chars
    const body = await res.json()
    expect(body.status).not.toBe('invalid_request')
    expect(res.status).not.toBe(400)
  })

  it('oversized prompt (601+ chars) is rejected before product selection', async () => {
    // Thailand in first 600 chars, Singapore appended after char 600 — must be rejected before parsing
    const thaiPart = 'Bangkok 3 days food temples '.repeat(22).slice(0, 600) // exactly 600
    const withForeignSuffix = thaiPart + ' Singapore beaches'
    expect(withForeignSuffix.length).toBeGreaterThan(600)

    const res = await POST(makeRequest({ prompt: withForeignSuffix }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  it('oversized prompt response does not echo prompt contents', async () => {
    const oversized = 'Bangkok '.repeat(100) // 800 chars
    const res = await POST(makeRequest({ prompt: oversized }))
    const body = await res.json()
    const serialized = JSON.stringify(body)

    expect(body.status).toBe('invalid_request')
    // Response must not contain any portion of the raw prompt
    expect(serialized).not.toContain('Bangkok')
  })

  // Test 3: Malformed request returns 400
  it('malformed JSON body returns 400', async () => {
    const req = new NextRequest('http://localhost/api/ai-trip/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  it('missing prompt field returns 400', async () => {
    const res = await POST(makeRequest({ destination: 'Chiang Mai' }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  // Test 4: Chiang Mai prompt returns reviewed Viator candidates.
  it('Chiang Mai prompt returns reviewed Viator products', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Chiang Mai')
    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('viator_191442p6')
    expect(body.products[0].ctaHref).toMatch(/^https:\/\/www\.viator\.com\//)
    expect(body.products[0].retailPrice).toBeNull()
    expect(body.products[0].currency).toBeNull()
    expect(body.itinerary).toMatchObject({
      tripSpec: {
        destination: 'Chiang Mai',
        durationDays: 3,
      },
      unfilledDayCount: 2,
    })
    expect(body.itinerary.days).toHaveLength(1)
    expect(body.itinerary.days[0].experience.productId).toBe('viator_191442p6')
    expect(JSON.stringify(body.products)).not.toMatch(/hotel|flight/i)
  })

  it('applies user-confirmed trip context without changing product selection', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({
      prompt: 'Chiang Mai 3 days elephants',
      tripContext: {
        startDate: '2026-12-10',
        groupSize: 4,
      },
    }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.itinerary.tripSpec.groupSize).toBe(4)
    expect(body.products).toHaveLength(1)
    expect(body.products[0].id).toBe('viator_191442p6')
  })

  it('exposes only the approved trip context fields in the public intent response', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({
      prompt: 'Chiang Mai 3 days family elephants',
      tripContext: {
        startDate: '2026-12-10',
        groupSize: 4,
      },
    }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.intent).toEqual({
      destination: 'Chiang Mai',
      days: 3,
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      groupSize: 4,
      travelerType: 'family',
      interests: ['elephants'],
    })
    expect(Object.keys(body.intent).sort()).toEqual([
      'days',
      'destination',
      'endDate',
      'groupSize',
      'interests',
      'startDate',
      'travelerType',
    ])
    expect(body.intent).not.toHaveProperty('confidence')
    expect(body.intent).not.toHaveProperty('missingFields')
    expect(body.intent).not.toHaveProperty('warnings')
    expect(body.intent).not.toHaveProperty('pace')
    expect(body.intent).not.toHaveProperty('budget')
  })

  it('keeps optional public trip context fields null when the traveler did not confirm them', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.intent).toMatchObject({
      startDate: null,
      endDate: null,
      groupSize: null,
      travelerType: 'unspecified',
    })
  })

  it.each([
    { startDate: 'December 10', groupSize: 2 },
    { startDate: '2026-12-10', groupSize: 0 },
    { startDate: '2026-12-10', groupSize: 11 },
    { startDate: '2026-12-10', groupSize: 2, endDate: '2026-12-13' },
  ])('rejects invalid trip context before product selection: %j', async tripContext => {
    const res = await POST(makeRequest({
      prompt: 'Chiang Mai 3 days elephants',
      tripContext,
    }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  it('normalizes a common Chiang Mai spelling error before selecting products', async () => {
    contextMock.buildAiProductContext.mockImplementation(async candidates => ({
      status: 'ok',
      items: candidates.map(() => makeContextItem()),
    }))

    const res = await POST(makeRequest({ prompt: 'chaingmai 3 days elephants' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Chiang Mai')
    expect(body.itinerary.tripSpec).toMatchObject({
      destination: 'Chiang Mai',
      durationDays: 3,
    })
    expect(body.products.every((product: { city: string }) => product.city === 'Chiang Mai')).toBe(true)
  })

  it('Chiang Mai prompt exposes only reviewed Viator handoffs', async () => {
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<Record<string, unknown>>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
        city: candidate.city,
        summary: candidate.summary,
        tags: candidate.suggestedTags,
        detailHref: candidate.detailHref,
        retailPrice: candidate.retailPrice,
        currency: candidate.currency,
        ctaHref: candidate.ctaHref,
        ctaLabel: candidate.ctaLabel,
        ctaRel: candidate.ctaRel,
        externalHandoff: candidate.externalHandoff,
      })),
    }))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.products).not.toHaveLength(0)
    expect(body.products.every((product: { id: string }) => product.id.startsWith('viator_'))).toBe(true)
    expect(body.products.every((product: { ctaHref: string }) => product.ctaHref.startsWith('https://www.viator.com/'))).toBe(true)
    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })

  it('Ko Lanta prompt reaches the newly reviewed Viator catalog', async () => {
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<Record<string, unknown>>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
        city: candidate.city,
        summary: candidate.summary,
        tags: candidate.suggestedTags,
        detailHref: candidate.detailHref,
        retailPrice: candidate.retailPrice,
        currency: candidate.currency,
        ctaHref: candidate.ctaHref,
        ctaLabel: candidate.ctaLabel,
        ctaRel: candidate.ctaRel,
        externalHandoff: candidate.externalHandoff,
      })),
    }))

    const res = await POST(makeRequest({ prompt: '1 day in Ko Lanta with a Thai cooking class' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Ko Lanta')
    expect(body.products).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'viator_110534p380',
        ctaLabel: 'Check availability',
        externalHandoff: true,
      }),
    ]))
  })

  it('returns only reviewed handoff-ready products in the primary result set', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [
        makeDiscoveryOnlyContextItem({ id: 'discovery_only' }),
        makeHandoffContextItem(),
      ],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai elephants' }))
    const body = await res.json()

    expect(body.status).toBe('ok')
    expect(body.products).toEqual([expect.objectContaining({
      id: 'viator_191442p6',
      externalHandoff: true,
      ctaLabel: 'Check availability',
      ctaRel: 'nofollow sponsored noopener noreferrer',
    })])
    expect(body.products[0].ctaHref).toMatch(/^https:\/\/www\.viator\.com\//)
  })

  it('returns an honest no-match when eligible discovery products have no reviewed handoff', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeDiscoveryOnlyContextItem({ city: 'Bangkok' })],
    })

    const res = await POST(makeRequest({ prompt: 'Bangkok temples and street food' }))
    const body = await res.json()

    expect(body.status).toBe('no_match')
    expect(body.products).toEqual([])
    expect(body.message).toBe('No reviewed booking partner match is available for this trip idea yet.')
  })

  it.each([
    ['non-HTTPS affiliate URL', { ctaHref: 'http://www.viator.com/tours/Chiang-Mai/example/d5267-191442P6?pid=P00309837' }],
    ['lookalike affiliate host', { ctaHref: 'https://www.viator.com.example.com/tours/Chiang-Mai/example/d5267-191442P6?pid=P00309837' }],
    ['missing affiliate id', { ctaHref: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-191442P6' }],
    ['wrong CTA label', { ctaLabel: 'Book now' }],
    ['missing sponsored rel', { ctaRel: 'noopener noreferrer' }],
  ])('rejects %s from the primary result set', async (_label, overrides) => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeHandoffContextItem(overrides)],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai elephants' }))
    const body = await res.json()

    expect(body.status).toBe('no_match')
    expect(body.products).toEqual([])
  })

  // Test 5: Singapore prompt returns unsupported_destination.
  it('Singapore prompt returns unsupported_destination without product selection', async () => {
    const res = await POST(makeRequest({ prompt: 'Singapore 3 days city tour' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('unsupported_destination')
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  // Test 7: Tokyo prompt returns unsupported_destination
  it('Tokyo prompt returns unsupported_destination', async () => {
    const res = await POST(makeRequest({ prompt: 'Tokyo for 5 days' }))
    const body = await res.json()

    expect(body.status).toBe('unsupported_destination')
  })

  // Test 8: Mixed Thailand + Singapore prompt returns unsupported_destination
  it('mixed Thailand + Singapore prompt returns unsupported_destination', async () => {
    const res = await POST(makeRequest({ prompt: 'Thailand and Singapore 7 days' }))
    const body = await res.json()

    expect(body.status).toBe('unsupported_destination')
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  // Test 9: Unsupported destination does not build product context.
  it('unsupported destination never builds product context', async () => {
    await POST(makeRequest({ prompt: 'Bali 3 days' }))
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  // Test 10: Unsupported destination does not call model context/model function
  it('unsupported destination never calls buildAiProductContext', async () => {
    await POST(makeRequest({ prompt: 'Dubai tomorrow' }))
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  it('generic Chiang Mai trip length uses reviewed Viator candidates', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    const response = await POST(makeRequest({ prompt: 'Chiang Mai 3 days' }))
    const body = await response.json()

    expect(body.status).toBe('no_match')
    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: expect.stringMatching(/^viator_/),
        city: 'Chiang Mai',
        retailPrice: null,
        currency: null,
      }),
    ]))
  })

  // Test 8: Eligible flow calls buildAiProductContext without modelFn.
  it('eligible flow calls buildAiProductContext without modelFn', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    await POST(makeRequest({ prompt: 'Thailand 3 days' }))

    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith(
      expect.any(Array),
    )
    // Verify no modelFn was passed (second argument absent or undefined)
    const callArgs = contextMock.buildAiProductContext.mock.calls[0]
    expect(callArgs).toHaveLength(1) // only candidates, no options with modelFn
  })

  // Test 9: Context without a reviewed handoff returns no_match.
  it('no eligible products returns no_match status', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    const res = await POST(makeRequest({ prompt: 'Phuket 3 days' }))
    const body = await res.json()

    expect(body.status).toBe('no_match')
    expect(body.products).toEqual([])
  })

  it('does not inject legacy Bókun partner candidates for a Chiang Mai request', async () => {
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<Record<string, unknown>>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
        city: candidate.city,
        summary: candidate.summary,
        tags: candidate.suggestedTags,
        detailHref: candidate.detailHref,
        ctaHref: candidate.ctaHref,
        ctaLabel: candidate.ctaLabel,
        ctaRel: candidate.ctaRel,
        externalHandoff: candidate.externalHandoff,
      })),
    }))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai temples and waterfalls' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.products.every((product: { id: string }) => product.id.startsWith('viator_'))).toBe(true)
    expect(JSON.stringify(body.products)).not.toContain('bokun.io')
    expect(JSON.stringify(body.products)).not.toContain('partner_cm_')
  })

  it('negated elephant prompt does not search elephant aliases or expose elephants as a positive interest', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem({ title: 'Thailand Temple Walk' })],
    })

    const res = await POST(makeRequest({ prompt: 'Thailand temples night market no elephant relaxed evening' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Thailand')
    expect(body.intent.interests).toEqual(expect.arrayContaining(['temples', 'markets']))
    expect(body.intent.interests).not.toContain('elephants')

  })

  it('city-specific avoid-elephants prompt does not fall back to a legacy source', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    const response = await POST(makeRequest({
      prompt: 'Chiang Mai temples and markets without elephants',
    }))
    const body = await response.json()

    expect(body.status).toBe('no_match')
    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith([])
  })

  // Test 15: Response contains no rawJson or eligibility internals
  it('ok response contains no rawJson or eligibility internals', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Thailand 3 days' }))
    const body = await res.json()

    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('rawJson')
    expect(serialized).not.toContain('eligible')
    expect(serialized).not.toContain('foreignSignals')
    expect(serialized).not.toContain('thailandSignals')
    expect(serialized).not.toContain('hasDestinationMismatch')
    expect(serialized).not.toContain('supplierId')
  })

  // Test 16: Response contains no prompt/provider/secrets/commission/payment terms
  it('ok response contains no prompt internals, secrets, or payment terms', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Phuket 3 days beaches' }))
    const body = await res.json()

    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('systemPrompt')
    expect(serialized).not.toContain('commission')
    expect(serialized).not.toContain('commissionPercent')
    expect(serialized).not.toContain('netSettlement')
    expect(serialized).not.toContain('contractTerms')
    expect(serialized).not.toContain('paymentTerms')
    expect(serialized).not.toContain('supplierName')
    expect(serialized).not.toContain('apiKey')
  })

  // Test 17: No duplicate IDs.
  it('response products have no duplicate IDs', async () => {
    const items = [
      makeContextItem({ id: 'p1' }),
      makeContextItem({ id: 'p2' }),
      makeContextItem({ id: 'p3' }),
    ]
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    const ids: string[] = body.products.map((p: { id: string }) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // Test 18: Stable output order.
  it('response preserves the order returned by buildAiProductContext', async () => {
    const items = [
      makeContextItem({ id: 'a', title: 'A' }),
      makeContextItem({ id: 'b', title: 'B' }),
      makeContextItem({ id: 'c', title: 'C' }),
    ]
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(body.products.map((p: { id: string }) => p.id)).toEqual(['a', 'b', 'c'])
  })

  // Test 19: Capability flags are correct.
  it('response meta has correct capability flags', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(body.meta.productRetrievalEnabled).toBe(true)
    expect(body.meta.itineraryGenerationEnabled).toBe(true)
    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })

  it('unsupported_destination response meta also has correct flags', async () => {
    const res = await POST(makeRequest({ prompt: 'Vietnam 3 days' }))
    const body = await res.json()

    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })
})

describe('POST /api/ai-trip/search — security/regression tests 33–34', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test 33: Foreign product cannot render even if injected into mocked candidate pool
  it('IneligibleProductInContextError from buildAiProductContext causes 500 error response (not ineligible product exposure)', async () => {
    const { IneligibleProductInContextError } = await import('@/lib/aiProducts/assertAllProductsThailandEligible')

    contextMock.buildAiProductContext.mockRejectedValue(
      new IneligibleProductInContextError([{ productId: 'foreign_prod', reasons: ['foreign signal'] }]),
    )

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.status).toBe('error')
    // The ineligible product ID must NOT appear in the response
    expect(JSON.stringify(body)).not.toContain('foreign_prod')
    expect(JSON.stringify(body)).not.toContain('foreign signal')
    expect(body.products).toEqual([])
  })

  // Test 34: buildAiProductContext runtime guard is called on every eligible response.
  it('buildAiProductContext is always called after eligible candidate retrieval', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Thailand 3 days' }))

    expect(contextMock.buildAiProductContext).toHaveBeenCalledOnce()
    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: expect.stringMatching(/^viator_/) })]),
    )
  })

  // Telemetry: ok response does not expose timing internals in the JSON body
  it('ok response does not expose timing or telemetry fields in the public JSON', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()
    const serialized = JSON.stringify(body)

    expect(serialized).not.toContain('elapsedMs')
    expect(serialized).not.toContain('candidateCount')
    expect(serialized).not.toContain('eligibleCount')
    expect(serialized).not.toContain('destinationCategory')
    expect(serialized).not.toContain('fallbackUsed')
  })
})

describe('POST /api/ai-trip/search — fallbackUsed telemetry', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  function getSearchLog(): Record<string, unknown> {
    const call = consoleSpy.mock.calls.find(c => c[0] === '[ai-trip/search]')
    if (!call) throw new Error('No [ai-trip/search] log call found')
    return JSON.parse(call[1] as string)
  }

  it('city-specific Viator results do not report a fallback', async () => {
    await POST(makeRequest({ prompt: 'Chiang Mai 3 days' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
  })

  it('a Thailand-wide request with no interests does not report a fallback', async () => {
    await POST(makeRequest({ prompt: 'Thailand 3 days' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
  })

  it('telemetry contains only approved keys (no raw destination, city, prompt, ids, titles, reasons)', async () => {
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))

    const log = getSearchLog()
    const approvedKeys = new Set(['route', 'destinationCategory', 'candidateCount', 'eligibleCount', 'resultCount', 'elapsedMs', 'fallbackUsed'])
    for (const key of Object.keys(log)) {
      expect(approvedKeys, `Unexpected telemetry key: ${key}`).toContain(key)
    }

    const logStr = JSON.stringify(log)
    expect(logStr).not.toContain('Chiang Mai')      // no raw city
    expect(logStr).not.toContain('elephants')        // no raw prompt/interests
    expect(logStr).not.toContain('viator_191442p6')  // no product IDs
    expect(logStr).not.toContain('Doi Inthanon')     // no titles
    expect(logStr).not.toContain('rawJson')          // no rawJson
    expect(logStr).not.toContain('"eligible"')       // no bare eligibility status key
    // destinationCategory must be one of the allowed values only
    expect(['thailand-wide', 'city-specific']).toContain(log.destinationCategory)
  })
})
