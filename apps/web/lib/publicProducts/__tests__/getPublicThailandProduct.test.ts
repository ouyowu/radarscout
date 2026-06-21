import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProduct: {
    findFirst: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({ db: dbMock }))

const enrichmentMock = vi.hoisted(() => ({
  getReviewedEnrichmentByProductId: vi.fn(),
}))

vi.mock('@/lib/reviewedEnrichmentReader', () => enrichmentMock)

import { getPublicThailandProduct } from '../getPublicThailandProduct'

function makeProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    description: '<p>Half-day ethical elephant visit.</p>',
    excerpt: 'Half-day ethical elephant visit.',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    retailPrice: { toString: () => '49.00' },
    currency: 'USD',
    rawJson: {},
    lastSyncedAt: null,
    supplier: null,
    ...overrides,
  }
}

function makeEnrichment() {
  return {
    cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
    shortSummary: 'A responsible half-day elephant experience.',
    suggestedTags: ['Elephants', 'Nature'],
    seoTitle: 'Best Elephant Sanctuary in Chiang Mai',
    seoDescription: 'Visit rescued elephants ethically.',
    reviewedBy: 'editor@radarscout.com',
    reviewedAt: '2026-06-15T12:00:00.000Z',
  }
}

describe('getPublicThailandProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null for empty id', async () => {
    const result = await getPublicThailandProduct('   ')

    expect(result).toBeNull()
    expect(dbMock.bokunProduct.findFirst).not.toHaveBeenCalled()
  })

  it('returns null when product is not in DB', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(null)

    const result = await getPublicThailandProduct('missing_id')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns null for ineligible product (foreign signal in title)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Singapore City Tour', city: 'Bangkok' }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns null for Thai-only title with no geographic signal', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Thai Cooking Class', city: null, location: null }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns null for destination-mismatched product (city=Phuket, title=Bali)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Bali Yoga Retreat', city: 'Phuket', location: null }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('returns public-safe product shape for eligible product', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('prod_abc')
    expect(result!.title).toBe('Chiang Mai Elephant Sanctuary')
    expect(result!.city).toBe('Chiang Mai')
    expect(result!.detailHref).toBe('/tours/prod_abc')
    expect(result!).toHaveProperty('reviewedEnrichment')
  })

  it('does not expose rawJson in the returned product', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ rawJson: { keyPhoto: { originalUrl: 'https://cdn.example.com/img.jpg' }, secret: 'internal' } }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).not.toHaveProperty('rawJson')
    expect(JSON.stringify(result)).not.toContain('"rawJson"')
    expect(JSON.stringify(result)).not.toContain('"secret"')
  })

  it('does not call getReviewedEnrichmentByProductId when product is ineligible', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Japan Cherry Tour', city: 'Bangkok' }),
    )

    await getPublicThailandProduct('prod_abc')

    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('includes reviewedEnrichment when eligible and enrichment exists', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(makeEnrichment())

    const result = await getPublicThailandProduct('prod_abc')

    expect(result!.reviewedEnrichment).toEqual(makeEnrichment())
  })

  it('returns null reviewedEnrichment when no enrichment exists for eligible product', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(makeProduct())
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).not.toBeNull()
    expect(result!.reviewedEnrichment).toBeNull()
  })

  it('returns null on DB error', async () => {
    dbMock.bokunProduct.findFirst.mockRejectedValue(new Error('DB failure'))

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
  })
})

describe('getPublicThailandProduct — cities outside original seven-city list', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns eligible product for Chiang Rai (not in old whitelist)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ id: 'cr_1', title: 'Chiang Rai Temple Tour', city: 'Chiang Rai', location: null }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('cr_1')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('cr_1')
    expect(result!.city).toBe('Chiang Rai')
  })

  it('returns eligible product for Hua Hin (not in old whitelist)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ id: 'hh_1', title: 'Hua Hin Beach Cycling Tour', city: 'Hua Hin', location: null }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('hh_1')

    expect(result).not.toBeNull()
    expect(result!.city).toBe('Hua Hin')
  })

  it('returns eligible product for Phang Nga (not in old whitelist)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ id: 'pn_1', title: 'Phang Nga Bay James Bond Island Tour', city: 'Phang Nga', location: null }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('pn_1')

    expect(result).not.toBeNull()
    expect(result!.city).toBe('Phang Nga')
  })

  it('returns eligible product when city is null but title contains Thailand geographic signal', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ id: 'th_1', title: 'Thailand Private Tour', city: null, location: null }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('th_1')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('th_1')
  })

  it('returns eligible product when city is null but location contains Phuket Thailand', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ id: 'loc_1', title: 'Beach Tour', city: null, location: 'Phuket , Thailand' }),
    )
    enrichmentMock.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('loc_1')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('loc_1')
  })

  it('still excludes foreign-signal product regardless of city', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Vietnam Mekong River Tour', city: 'Bangkok', location: null }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('still excludes Thai-only cultural title with no geographic signal', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Thai Massage', city: null, location: null }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
  })

  it('still excludes product with both Thailand and foreign signals (foreign blocks)', async () => {
    dbMock.bokunProduct.findFirst.mockResolvedValue(
      makeProduct({ title: 'Bangkok to Singapore Tour', city: 'Bangkok', location: null }),
    )

    const result = await getPublicThailandProduct('prod_abc')

    expect(result).toBeNull()
    expect(enrichmentMock.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })
})
