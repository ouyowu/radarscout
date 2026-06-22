import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('server-only', () => ({}))

const flagMock = vi.hoisted(() => ({ isAiItineraryDraftEnabled: vi.fn() }))
const listMock = vi.hoisted(() => ({ listAiEligibleThailandProducts: vi.fn() }))
const contextMock = vi.hoisted(() => ({ buildAiProductContext: vi.fn() }))
const assertMock = vi.hoisted(() => ({
  assertAllProductsThailandEligible: vi.fn((c: unknown[]) => c),
}))

vi.mock('@/lib/featureFlags', () => flagMock)
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

import { POST, _setProviderForTest } from '../route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/ai-trip/itinerary-draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeCandidate(id = 'prod_1') {
  return {
    id,
    title: `Chiang Mai Tour ${id}`,
    cleanedTitle: null,
    city: 'Chiang Mai',
    location: null,
    summary: 'Half-day ethical elephant visit.',
    suggestedTags: ['Elephants'],
    detailHref: `/tours/${id}`,
    retailPrice: '49.00',
    currency: 'USD',
  }
}

function makeContextItem(id = 'prod_1') {
  return {
    id,
    title: `Chiang Mai Tour ${id}`,
    city: 'Chiang Mai',
    summary: 'Half-day ethical elephant visit.',
    tags: ['Elephants'],
    detailHref: `/tours/${id}`,
    retailPrice: '49.00',
    currency: 'USD',
  }
}

function makeMockProvider(output: unknown) {
  return { generate: vi.fn().mockResolvedValue(output) }
}

function makeValidDraftOutput(items: { id: string }[], durationDays = 1) {
  return {
    destination: 'Chiang Mai',
    durationDays,
    summary: 'A suggested AI itinerary draft.',
    days: items.map((item, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      theme: 'Exploration',
      items: [
        {
          type: 'experience',
          productId: item.id,
          title: 'Tour',
          description: 'Visit this attraction.',
          timeOfDay: 'morning',
        },
      ],
    })),
    warnings: [],
  }
}

describe('POST /api/ai-trip/itinerary-draft — feature flag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns disabled when flag env var is absent', async () => {
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(false)
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.status).toBe('disabled')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
    expect(body.meta.itineraryGenerationEnabled).toBe(false)
    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
  })

  it('returns disabled when flag is explicitly false', async () => {
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(false)
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days' }))
    const body = await res.json()
    expect(body.status).toBe('disabled')
  })

  it('proceeds when flag is true', async () => {
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days food' }))
    const body = await res.json()
    // Flag is true but no products → no_match is acceptable
    expect(['ok', 'no_match', 'generation_failed'].includes(body.status)).toBe(true)
    expect(body.status).not.toBe('disabled')
  })
})

describe('POST /api/ai-trip/itinerary-draft — request validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns 400 for empty body', async () => {
    const req = new NextRequest('http://localhost/api/ai-trip/itinerary-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.status).toBe('invalid_request')
    expect(body.itinerary).toBeNull()
  })

  it('returns 400 for missing prompt', async () => {
    const res = await POST(makeRequest({}))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  it('returns 400 for empty string prompt', async () => {
    const res = await POST(makeRequest({ prompt: '' }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  it('returns 400 for oversized prompt (>600 chars)', async () => {
    const res = await POST(makeRequest({ prompt: 'a'.repeat(601) }))
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.status).toBe('invalid_request')
  })

  it('accepts a 600-character prompt', async () => {
    const res = await POST(makeRequest({ prompt: 'Chiang Mai ' + 'a'.repeat(589) }))
    const body = await res.json()
    expect(body.status).not.toBe('invalid_request')
  })
})

describe('POST /api/ai-trip/itinerary-draft — destination validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns unsupported_destination for Singapore', async () => {
    const res = await POST(makeRequest({ prompt: 'Singapore 3 days food' }))
    const body = await res.json()
    expect(body.status).toBe('unsupported_destination')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
    expect(body.meta.bookingEnabled).toBe(false)
  })

  it('returns unsupported_destination for Tokyo', async () => {
    const res = await POST(makeRequest({ prompt: 'Tokyo 4 days culture' }))
    const body = await res.json()
    expect(body.status).toBe('unsupported_destination')
    expect(body.itinerary).toBeNull()
  })

  it('returns unsupported_destination for mixed destination', async () => {
    const res = await POST(makeRequest({ prompt: 'Thailand and Singapore 7 days' }))
    const body = await res.json()
    expect(body.status).toBe('unsupported_destination')
    expect(body.itinerary).toBeNull()
  })
})

describe('POST /api/ai-trip/itinerary-draft — no_match flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    listMock.listAiEligibleThailandProducts.mockResolvedValue([])
    contextMock.buildAiProductContext.mockResolvedValue({ status: 'no_match' })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns no_match when no eligible products found', async () => {
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 3 days food' }))
    const body = await res.json()
    expect(body.status).toBe('no_match')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
  })
})

describe('POST /api/ai-trip/itinerary-draft — ok flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    const candidate = makeCandidate('prod_1')
    const contextItem = makeContextItem('prod_1')
    listMock.listAiEligibleThailandProducts.mockResolvedValue([candidate])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [contextItem],
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns ok with valid draft for Thailand intent', async () => {
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.itinerary).not.toBeNull()
    expect(body.products).toHaveLength(1)
    expect(body.meta.bookingEnabled).toBe(false)
    expect(body.meta.availabilityEnabled).toBe(false)
    expect(body.meta.itineraryGenerationEnabled).toBe(true)
  })

  it('does not expose raw provider output in response', async () => {
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    const bodyStr = JSON.stringify(body)
    expect(bodyStr).not.toContain('providerName')
    expect(bodyStr).not.toContain('modelName')
    expect(bodyStr).not.toContain('rawOutput')
    expect(bodyStr).not.toContain('systemPrompt')
    expect(bodyStr).not.toContain('tokenUsage')
  })

  it('does not expose prompt or provider metadata in response', async () => {
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(body).not.toHaveProperty('prompt')
    expect(body).not.toHaveProperty('provider')
    expect(body).not.toHaveProperty('model')
  })

  it('does not accept client-supplied product context', async () => {
    // Client sends arbitrary productIds — they must be ignored; server re-derives
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(
      makeRequest({
        prompt: 'Chiang Mai 1 day food',
        products: [{ id: 'attacker_id', title: 'Fake' }],
        productContext: [{ id: 'other_id' }],
      }),
    )
    const body = await res.json()
    // Response should not include any client-supplied IDs
    const bodyStr = JSON.stringify(body)
    expect(bodyStr).not.toContain('attacker_id')
    expect(bodyStr).not.toContain('other_id')
  })
})

describe('POST /api/ai-trip/itinerary-draft — provider failure', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    const candidate = makeCandidate('prod_1')
    const contextItem = makeContextItem('prod_1')
    listMock.listAiEligibleThailandProducts.mockResolvedValue([candidate])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [contextItem],
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns generation_failed when provider throws', async () => {
    _setProviderForTest({ generate: vi.fn().mockRejectedValue(new Error('provider error')) })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
  })

  it('returns generation_failed when provider returns invalid output', async () => {
    _setProviderForTest(makeMockProvider({ invalid: true, garbage: 'output' }))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.itinerary).toBeNull()
  })

  it('does not expose raw provider output in generation_failed response', async () => {
    _setProviderForTest({ generate: vi.fn().mockRejectedValue(new Error('INTERNAL_SECRET_ERROR')) })

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    const bodyStr = JSON.stringify(body)
    expect(bodyStr).not.toContain('INTERNAL_SECRET_ERROR')
    expect(bodyStr).not.toContain('provider error')
  })
})

describe('POST /api/ai-trip/itinerary-draft — safety constants', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    const candidate = makeCandidate('prod_1')
    const contextItem = makeContextItem('prod_1')
    listMock.listAiEligibleThailandProducts.mockResolvedValue([candidate])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [contextItem],
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('always returns bookingEnabled=false', async () => {
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(body.meta.bookingEnabled).toBe(false)
  })

  it('always returns availabilityEnabled=false', async () => {
    const validOutput = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    _setProviderForTest(makeMockProvider(validOutput))
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    expect(body.meta.availabilityEnabled).toBe(false)
  })
})
