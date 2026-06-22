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

import { POST, _resetProviderForTest, _setProviderForTest } from '../route'

afterEach(() => {
  _resetProviderForTest()
})

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

  it('replaces hallucinated experience facts with canonical allowed-product facts', async () => {
    const output = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    output.days[0].items[0].title = 'Private Helicopter Flight'
    output.days[0].items[0].description = 'Fly over Chiang Mai by helicopter.'
    _setProviderForTest(makeMockProvider(output))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    const experience = body.itinerary.days[0].items[0]
    const bodyStr = JSON.stringify(body)

    expect(body.status).toBe('ok')
    expect(experience.title).toBe('Chiang Mai Tour prod_1')
    expect(experience.description).toBe('Half-day ethical elephant visit.')
    expect(bodyStr).not.toContain('Private Helicopter Flight')
    expect(bodyStr).not.toContain('Fly over Chiang Mai by helicopter.')
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

  it('returns safe generation_failed when enabled without an injected provider', async () => {
    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    const bodyStr = JSON.stringify(body)

    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
    expect(bodyStr).not.toContain('mock')
    expect(bodyStr).not.toContain('provider')
    expect(bodyStr).not.toContain('model')
    expect(bodyStr).not.toContain('prompt')
    expect(bodyStr).not.toContain('rawOutput')
  })

  it('reset helper clears an explicitly injected provider', async () => {
    _setProviderForTest(makeMockProvider(makeValidDraftOutput([{ id: 'prod_1' }], 1)))
    _resetProviderForTest()

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
  })

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

  it('rejects forbidden provider text before canonical hydration', async () => {
    const output = makeValidDraftOutput([{ id: 'prod_1' }], 1)
    output.days[0].items[0].title = 'Discount helicopter tour'
    output.days[0].items[0].description = 'Book this private flight for $99.'
    _setProviderForTest(makeMockProvider(output))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day food' }))
    const body = await res.json()
    const bodyStr = JSON.stringify(body)

    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.itinerary).toBeNull()
    expect(body.products).toEqual([])
    expect(bodyStr).not.toContain('Discount helicopter tour')
    expect(bodyStr).not.toContain('$99')
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

describe('POST /api/ai-trip/itinerary-draft — referenced products only', () => {
  function makeContextItems(ids: string[]) {
    return ids.map(id => makeContextItem(id))
  }

  function makeCandidates(ids: string[]) {
    return ids.map(id => makeCandidate(id))
  }

  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
  })

  afterEach(() => vi.restoreAllMocks())

  it('6 allowed candidates, itinerary references 2 → exactly 2 products returned', async () => {
    const ids = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6']
    listMock.listAiEligibleThailandProducts.mockResolvedValue(makeCandidates(ids))
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: makeContextItems(ids),
    })

    // Only reference prod_3 and prod_5 in the itinerary
    const validOutput = {
      destination: 'Chiang Mai',
      durationDays: 2,
      summary: 'Two days using only 2 of 6 products.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            { type: 'experience', productId: 'prod_3', title: 'Tour 3', description: 'Visit.', timeOfDay: 'morning' },
          ],
        },
        {
          day: 2,
          title: 'Day 2',
          theme: 'Nature',
          items: [
            { type: 'experience', productId: 'prod_5', title: 'Tour 5', description: 'Visit.', timeOfDay: 'afternoon' },
          ],
        },
      ],
      warnings: [],
    }
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 2 days culture' }))
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.products).toHaveLength(2)
    expect(body.products.map((p: { id: string }) => p.id)).toEqual(['prod_3', 'prod_5'])
  })

  it('returned product order follows first itinerary reference order', async () => {
    const ids = ['prod_a', 'prod_b', 'prod_c']
    listMock.listAiEligibleThailandProducts.mockResolvedValue(makeCandidates(ids))
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: makeContextItems(ids),
    })

    // Reference prod_c first, then prod_a
    const validOutput = {
      destination: 'Chiang Mai',
      durationDays: 2,
      summary: 'Two days, reversed reference order.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            { type: 'experience', productId: 'prod_c', title: 'Tour C', description: 'C first.', timeOfDay: 'morning' },
          ],
        },
        {
          day: 2,
          title: 'Day 2',
          theme: 'Nature',
          items: [
            { type: 'experience', productId: 'prod_a', title: 'Tour A', description: 'A second.', timeOfDay: 'afternoon' },
          ],
        },
      ],
      warnings: [],
    }
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 2 days' }))
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.products).toHaveLength(2)
    // Order must follow itinerary reference: prod_c before prod_a
    expect(body.products[0].id).toBe('prod_c')
    expect(body.products[1].id).toBe('prod_a')
  })

  it('no experience items → products []', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate('prod_1')])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem('prod_1')],
    })

    // All free_time — no experience items
    const validOutput = {
      destination: 'Chiang Mai',
      durationDays: 1,
      summary: 'Free day in Chiang Mai.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Free',
          items: [
            { type: 'free_time', title: 'Explore', description: 'Wander the city.', timeOfDay: 'flexible' },
          ],
        },
      ],
      warnings: [],
    }
    _setProviderForTest(makeMockProvider(validOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day relaxed' }))
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.products).toEqual([])
  })

  it('unknown product ID → generation_failed and products []', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate('prod_1')])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem('prod_1')],
    })

    const invalidOutput = {
      destination: 'Chiang Mai',
      durationDays: 1,
      summary: 'One day.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            { type: 'experience', productId: 'not_in_allowlist', title: 'Fake', description: 'Not verified.', timeOfDay: 'morning' },
          ],
        },
      ],
      warnings: [],
    }
    _setProviderForTest(makeMockProvider(invalidOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day culture' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.products).toEqual([])
  })

  it('invalid output (unknown root field) → generation_failed, no partial products', async () => {
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate('prod_1')])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem('prod_1')],
    })

    // Root has providerCommentary — unknown field — must be rejected
    const invalidOutput = {
      destination: 'Chiang Mai',
      durationDays: 1,
      summary: 'One day.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            { type: 'experience', productId: 'prod_1', title: 'Tour', description: 'A tour.', timeOfDay: 'morning' },
          ],
        },
      ],
      warnings: [],
      providerCommentary: 'internal note from provider',
    }
    _setProviderForTest(makeMockProvider(invalidOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day culture' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.products).toEqual([])
    expect(JSON.stringify(body)).not.toContain('providerCommentary')
  })
})

describe('POST /api/ai-trip/itinerary-draft — destination mismatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flagMock.isAiItineraryDraftEnabled.mockReturnValue(true)
    listMock.listAiEligibleThailandProducts.mockResolvedValue([makeCandidate('prod_1')])
    contextMock.buildAiProductContext.mockResolvedValue({
      status: 'ok',
      items: [makeContextItem('prod_1')],
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('generation_failed when draft destination does not match intent destination', async () => {
    // Intent is Chiang Mai but provider returns Thailand as destination
    const mismatchedOutput = {
      destination: 'Thailand',
      durationDays: 1,
      summary: 'One day.',
      days: [
        {
          day: 1,
          title: 'Day 1',
          theme: 'Culture',
          items: [
            { type: 'experience', productId: 'prod_1', title: 'Tour', description: 'A tour.', timeOfDay: 'morning' },
          ],
        },
      ],
      warnings: [],
    }
    _setProviderForTest(makeMockProvider(mismatchedOutput))

    const res = await POST(makeRequest({ prompt: 'Chiang Mai 1 day temples' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body.status).toBe('generation_failed')
    expect(body.products).toEqual([])
  })
})
