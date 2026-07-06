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
      .mockResolvedValueOnce([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem()],
    })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants cooking' }))
    const body = await res.json()

    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0].search).toBe('elephants')
    expect(calls[1].search).toBe('elephant')
    expect(calls.every(options => options.search)).toBe(true)
    expect(body.status).toBe('ok')
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
      .mockResolvedValueOnce([makeCandidate()])  // alias hit
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants cooking' }))

    expect(getSearchLog().fallbackUsed).toBe(false)
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0].search).toBe('elephants')
    expect(calls[1].search).toBe('elephant')
    expect(calls.every(options => options.search)).toBe(true)
  })

  it('interest primary miss with empty aliases: fallbackUsed=true and uses destination fallback', async () => {
    listMock.listAiEligibleThailandProducts
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeCandidate()])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'ok', items: [makeContextItem()] })

    await POST(makeRequest({ prompt: 'Chiang Mai 3 days elephants' }))

    expect(getSearchLog().fallbackUsed).toBe(true)
    expect(listMock.listAiEligibleThailandProducts).toHaveBeenCalledTimes(3)
    const calls = listMock.listAiEligibleThailandProducts.mock.calls.map(call => call[0])
    expect(calls[0]).toMatchObject({ city: 'Chiang Mai', search: 'elephants' })
    expect(calls[1]).toMatchObject({ city: 'Chiang Mai', search: 'elephant' })
    expect(calls[2]).toEqual({ city: 'Chiang Mai', take: expect.any(Number) })
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
