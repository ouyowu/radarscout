import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

const listMock = vi.hoisted(() => ({ listAiEligibleThailandProducts: vi.fn() }))
const contextMock = vi.hoisted(() => ({ buildAiProductContext: vi.fn() }))
const assertMock = vi.hoisted(() => ({ assertAllProductsThailandEligible: vi.fn((candidates: unknown[]) => candidates) }))

vi.mock('@/lib/aiProducts/listAiEligibleThailandProducts', () => listMock)
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

function makeCandidate(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_1',
    title: 'Chiang Mai Elephant Sanctuary',
    cleanedTitle: null,
    city: 'Chiang Mai',
    location: 'Mae Rim',
    summary: 'Half-day ethical elephant visit.',
    suggestedTags: ['Elephants', 'Nature'],
    detailHref: '/tours/prod_1',
    retailPrice: '49.00',
    currency: 'USD',
    ...overrides,
  }
}

function makeContextItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_1',
    title: 'Chiang Mai Elephant Sanctuary',
    city: 'Chiang Mai',
    summary: 'Half-day ethical elephant visit.',
    tags: ['Elephants', 'Nature'],
    detailHref: '/tours/prod_1',
    retailPrice: '49.00',
    currency: 'USD',
    ...overrides,
  }
}

describe('POST /api/ai-trip/search — API tests 1–20', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
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

  it('oversized prompt (601+ chars) is rejected before calling parseTripIntent-dependent retrieval', async () => {
    // Thailand in first 600 chars, Singapore appended after char 600 — must be rejected before parsing
    const thaiPart = 'Bangkok 3 days food temples '.repeat(22).slice(0, 600) // exactly 600
    const withForeignSuffix = thaiPart + ' Singapore beaches'
    expect(withForeignSuffix.length).toBeGreaterThan(600)

    const res = await POST(makeRequest({ prompt: withForeignSuffix }))
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
    expect(listMock.listAiEligibleThailandProducts).not.toHaveBeenCalled()
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

  // Test 4: Chiang Mai prompt returns eligible Chiang Mai candidates
  it('Chiang Mai prompt calls retrieval and returns products', async () => {
    const candidate = makeCandidate()
    listMock.listAiEligibleThailandProducts.mockResolvedValue([candidate])
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
    expect(body.products[0].id).toBe('prod_1')
  })

  it('Chiang Mai prompt includes reviewed partner handoff candidates when matching DB products are absent', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
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
    const partnerProduct = body.products.find((product: { id: string }) => product.id === 'partner_cm_1232729')

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(partnerProduct).toMatchObject({
      title: 'Half-Day Morning Elephant Sanctuary Program in Chiang Mai',
      city: 'Chiang Mai',
      retailPrice: null,
      currency: null,
      ctaLabel: 'Check availability',
      ctaRel: 'nofollow sponsored noopener noreferrer',
      externalHandoff: true,
    })
    expect(partnerProduct.ctaHref).toMatch(/^https:\/\/widgets\.bokun\.io\/online-sales\//)
    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })

  // Test 5: Thailand-wide prompt returns eligible Thailand candidates
  it('Thailand-wide prompt does not force city filter', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    await POST(makeRequest({ prompt: 'Thailand 5 days beaches temples' }))

    const calls = listMock.listAiEligibleThailandProducts.mock.calls
    const firstCall = calls[0][0]
    // "Thailand" destination should not pass city filter
    expect(firstCall.city).toBeFalsy()
  })

  // Test 6: Singapore prompt returns unsupported_destination
  it('Singapore prompt returns unsupported_destination without calling retrieval', async () => {
    const res = await POST(makeRequest({ prompt: 'Singapore 3 days city tour' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('unsupported_destination')
    expect(listMock.listAiEligibleThailandProducts).not.toHaveBeenCalled()
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
    expect(listMock.listAiEligibleThailandProducts).not.toHaveBeenCalled()
  })

  // Test 9: Unsupported destination does not call product retrieval
  it('unsupported destination never calls listAiEligibleThailandProducts', async () => {
    await POST(makeRequest({ prompt: 'Bali 3 days' }))
    expect(listMock.listAiEligibleThailandProducts).not.toHaveBeenCalled()
  })

  // Test 10: Unsupported destination does not call model context/model function
  it('unsupported destination never calls buildAiProductContext', async () => {
    await POST(makeRequest({ prompt: 'Dubai tomorrow' }))
    expect(contextMock.buildAiProductContext).not.toHaveBeenCalled()
  })

  // Test 11: Eligible flow calls listAiEligibleThailandProducts
  it('eligible Bangkok flow calls listAiEligibleThailandProducts', async () => {
    await POST(makeRequest({ prompt: 'Bangkok 3 days food' }))
    expect(listMock.listAiEligibleThailandProducts).toHaveBeenCalled()
  })

  // Test 12: Eligible flow calls buildAiProductContext without modelFn
  it('eligible flow calls buildAiProductContext without modelFn', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    await POST(makeRequest({ prompt: 'Bangkok 3 days' }))

    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith(
      expect.any(Array),
    )
    // Verify no modelFn was passed (second argument absent or undefined)
    const callArgs = contextMock.buildAiProductContext.mock.calls[0]
    expect(callArgs).toHaveLength(1) // only candidates, no options with modelFn
  })

  // Test 13: No eligible products returns no_match
  it('no eligible products returns no_match status', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    const res = await POST(makeRequest({ prompt: 'Phuket 3 days' }))
    const body = await res.json()

    expect(body.status).toBe('no_match')
    expect(body.products).toEqual([])
  })

  // Test 14: Interest-specific retrieval tries safe aliases before returning no_match.
  it('interest search tries singular aliases before returning products', async () => {
    listMock.listAiEligibleThailandProducts
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants cooking' }))
    const body = await res.json()

    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0].search).toBe('elephants')
    expect(calls[1].search).toBe('cooking')
    expect(calls[2].search).toBe('elephant')
    expect(calls.every(options => options.search)).toBe(true)
    expect(body.status).toBe('ok')
  })

  it('multi-interest search reaches later interests before alias budget is exhausted', async () => {
    listMock.listAiEligibleThailandProducts.mockImplementation((options: { search?: string }) =>
      Promise.resolve(options.search === 'elephant' ? [makeCandidate()] : []),
    )
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants temples food' }))
    const body = await res.json()

    const searches = listMock.listAiEligibleThailandProducts.mock.calls
      .map(call => call[0].search)
      .filter(Boolean)

    expect(searches).toContain('food')
    expect(searches).toContain('temples')
    expect(searches).toContain('elephants')
    expect(searches).toContain('elephant')
    expect(body.status).toBe('ok')
    expect(body.products).toHaveLength(1)
  })

  it('multi-interest results keep later-interest matches when the first parsed interest fills the candidate limit', async () => {
    const foodCandidates = Array.from({ length: 6 }, (_, index) =>
      makeCandidate({
        id: `food-${index + 1}`,
        title: `Chiang Mai Local Food Walk ${index + 1}`,
        suggestedTags: ['Food'],
      }),
    )
    const elephantCandidate = makeCandidate({
      id: 'elephant-1',
      title: 'Chiang Mai Elephant Care',
      suggestedTags: ['Elephants'],
    })

    listMock.listAiEligibleThailandProducts.mockImplementation((options: { search?: string }) => {
      if (options.search === 'food') return Promise.resolve(foodCandidates)
      if (options.search === 'elephants') return Promise.resolve([elephantCandidate])
      return Promise.resolve([])
    })
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<{ id: string; title: string }>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
      })),
    }))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants food' }))
    const body = await res.json()

    const searches = listMock.listAiEligibleThailandProducts.mock.calls
      .map(call => call[0].search)
      .filter(Boolean)
    const rankedIds = contextMock.buildAiProductContext.mock.calls[0][0]
      .map((candidate: { id: string }) => candidate.id)

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(searches).toContain('elephants')
    expect(rankedIds).toContain('elephant-1')
    expect(rankedIds.slice(0, 3)).toContain('elephant-1')
  })

  it('interest searches fall back to destination-only products when all terms miss', async () => {
    listMock.listAiEligibleThailandProducts.mockImplementation((options: { search?: string }) =>
      Promise.resolve(options.search ? [] : [makeCandidate()]),
    )
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Pattaya 2 days elephant food beach' }))
    const body = await res.json()

    expect(body.status).toBe('ok')
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls.length).toBeGreaterThan(1)
    expect(calls.at(-1)).toEqual({ city: 'Pattaya', take: expect.any(Number) })
  })

  it('compact Chiang Mai interest prompt can use reviewed partner matches without a combined destination fallback', async () => {
    listMock.listAiEligibleThailandProducts.mockImplementation((options: { search?: string }) =>
      Promise.resolve(options.search ? [] : [makeCandidate()]),
    )
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai elephants' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Chiang Mai')
    expect(body.intent.interests).toContain('elephants')

    const rankedIds = contextMock.buildAiProductContext.mock.calls[0][0]
      .map((candidate: { id: string }) => candidate.id)
    expect(rankedIds.some((id: string) => id.startsWith('partner_cm_'))).toBe(true)

    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls.every(call => call.city === 'Chiang Mai')).toBe(true)
    expect(calls.some(call => call.search === 'elephants')).toBe(true)
  })

  it('specific Chiang Mai prompts can surface reviewed bamboo rafting and trail partner products', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<{ id: string; title: string }>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
      })),
    }))

    await POST(makeRequest({ prompt: 'Chiang Mai bamboo rafting elephant nature adventure' }))
    await POST(makeRequest({ prompt: 'Chiang Mai Inthanon elephant trail' }))

    const bambooCandidateIds = contextMock.buildAiProductContext.mock.calls[0][0]
      .map((candidate: { id: string }) => candidate.id)
    const inthanonCandidateIds = contextMock.buildAiProductContext.mock.calls[1][0]
      .map((candidate: { id: string }) => candidate.id)

    expect(bambooCandidateIds).toContain('partner_cm_1236830')
    expect(inthanonCandidateIds).toContain('partner_cm_1232798')
  })

  it('specific Bigboy prompt can surface reviewed Bigboy partner products', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockImplementation(async (candidates: Array<{ id: string; title: string }>) => ({
      status: 'ok',
      items: candidates.map(candidate => makeContextItem({
        id: candidate.id,
        title: candidate.title,
      })),
    }))

    await POST(makeRequest({ prompt: 'Chiang Mai Bigboy half day morning elephant' }))

    const rankedIds = contextMock.buildAiProductContext.mock.calls[0][0]
      .map((candidate: { id: string }) => candidate.id)

    expect(rankedIds).toContain('partner_cm_1236811')
  })

  it('negated elephant prompt does not search elephant aliases or expose elephants as a positive interest', async () => {
    listMock.listAiEligibleThailandProducts.mockImplementation((options: { search?: string }) =>
      Promise.resolve(options.search === 'temples' ? [makeCandidate({ title: 'Chiang Mai Temple Walk' })] : []),
    )
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem({ title: 'Chiang Mai Temple Walk' })],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai temples night market no elephant relaxed evening' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.intent.destination).toBe('Chiang Mai')
    expect(body.intent.interests).toEqual(expect.arrayContaining(['temples', 'markets']))
    expect(body.intent.interests).not.toContain('elephants')

    const searches = listMock.listAiEligibleThailandProducts.mock.calls
      .map(call => call[0].search)
      .filter(Boolean)
    expect(searches).toContain('temples')
    expect(searches).not.toContain('elephants')
    expect(searches).not.toContain('elephant')
  })

  // Test 15: Response contains no rawJson or eligibility internals
  it('ok response contains no rawJson or eligibility internals', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
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
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
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

  // Test 17: Maximum 12 products
  it('retrieval take is capped at maximum', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const firstCall = listMock.listAiEligibleThailandProducts.mock.calls[0][0]
    expect(firstCall.take).toBeLessThanOrEqual(12)
    expect(firstCall.take).toBeGreaterThanOrEqual(1)
  })

  // Test 18: No duplicate IDs (deferred to retrieval layer — list function guarantees this)
  it('response products have no duplicate IDs', async () => {
    const items = [
      makeContextItem({ id: 'p1' }),
      makeContextItem({ id: 'p2' }),
      makeContextItem({ id: 'p3' }),
    ]
    listMock.listAiEligibleThailandProducts.mockResolvedValue(items.map(i => makeCandidate({ id: i.id })))
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    const ids: string[] = body.products.map((p: { id: string }) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // Test 19: Stable output order (preserves retrieval order)
  it('response preserves the order returned by buildAiProductContext', async () => {
    const items = [
      makeContextItem({ id: 'a', title: 'A' }),
      makeContextItem({ id: 'b', title: 'B' }),
      makeContextItem({ id: 'c', title: 'C' }),
    ]
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(body.products.map((p: { id: string }) => p.id)).toEqual(['a', 'b', 'c'])
  })

  // Test 20: Capability flags are correct
  it('response meta has correct capability flags', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(body.meta.productRetrievalEnabled).toBe(true)
    expect(body.meta.itineraryGenerationEnabled).toBe(false)
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

    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
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

  // Test 34: buildAiProductContext runtime guard is called on every eligible response
  it('buildAiProductContext is always called after eligible candidate retrieval', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Phuket 3 days' }))

    expect(contextMock.buildAiProductContext).toHaveBeenCalledOnce()
    expect(contextMock.buildAiProductContext).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'prod_1' })]),
    )
  })

  // No application-level timeout: slow retrieval that eventually resolves must return success
  it('slow retrieval that eventually resolves returns ok status (no application-level timeout)', async () => {
    listMock.listAiEligibleThailandProducts.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([makeCandidate()]), 50)),
    )
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.products).toHaveLength(1)
  })

  // Actual retrieval rejection returns safe generic 500 (no partial products, no internal error detail)
  it('retrieval rejection returns safe generic 500 with empty products', async () => {
    listMock.listAiEligibleThailandProducts.mockRejectedValue(new Error('DB connection failed'))
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })

    const res = await POST(makeRequest({ prompt: 'Bangkok 3 days' }))
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.status).toBe('error')
    expect(body.products).toEqual([])
    // Internal error must not be surfaced in the response
    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('DB connection failed')
    expect(serialized).not.toContain('Error')
  })

  // Telemetry: ok response does not expose timing internals in the JSON body
  it('ok response does not expose timing or telemetry fields in the public JSON', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
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

  it('interest primary hit: fallbackUsed=false, retrieval stays interest-scoped', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls.length).toBeGreaterThan(0)
    expect(calls.every(options => options.search)).toBe(true)
  })

  it('interest primary miss with successful alias: fallbackUsed=false and no destination fallback', async () => {
    listMock.listAiEligibleThailandProducts
      .mockResolvedValueOnce([])              // primary miss
      .mockResolvedValueOnce([])              // next interest primary miss
      .mockResolvedValueOnce([makeCandidate()])  // alias hit
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants cooking' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0].search).toBe('elephants')
    expect(calls[1].search).toBe('cooking')
    expect(calls[2].search).toBe('elephant')
    expect(calls.every(options => options.search)).toBe(true)
  })

  it('interest primary miss with reviewed partner aliases: fallbackUsed=false and skips destination fallback', async () => {
    listMock.listAiEligibleThailandProducts
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
    expect(listMock.listAiEligibleThailandProducts).toHaveBeenCalledTimes(2)
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0]).toMatchObject({ city: 'Chiang Mai', search: 'elephants' })
    expect(calls[1]).toMatchObject({ city: 'Chiang Mai', search: 'elephant' })
    expect(calls.every(options => options.search)).toBe(true)
  })

  it('no-interest query: fallbackUsed=false, retrieval called once', async () => {
    // "Bangkok 3 days" has no interest keywords → interests=[] → no primary search
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])

    await POST(makeRequest({ prompt: 'Bangkok 3 days' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
    expect(listMock.listAiEligibleThailandProducts).toHaveBeenCalledTimes(1)
  })

  it('telemetry contains only approved keys (no raw destination, city, prompt, ids, titles, reasons)', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate()])
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
    expect(logStr).not.toContain('prod_1')           // no product IDs
    expect(logStr).not.toContain('Chiang Mai Elephant Sanctuary')  // no titles
    expect(logStr).not.toContain('rawJson')          // no rawJson
    expect(logStr).not.toContain('"eligible"')       // no bare eligibility status key
    // destinationCategory must be one of the allowed values only
    expect(['thailand-wide', 'city-specific']).toContain(log.destinationCategory)
  })
})
