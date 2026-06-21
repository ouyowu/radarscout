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
