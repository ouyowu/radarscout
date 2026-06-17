import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const dbMock = vi.hoisted(() => ({
  bokunProductEnrichment: {
    findUnique: vi.fn(),
  },
  bokunProduct: {
    findUnique: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({
  db: dbMock,
}))

import {
  getReviewedEnrichmentByProductId,
  getReviewedEnrichmentByBokunActivityId,
  type ReviewedEnrichmentOutput,
} from './reviewedEnrichmentReader'

const REVIEWED_AT = new Date('2026-06-15T12:00:00.000Z')

function makeEnrichmentRow(overrides: Partial<{
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: unknown
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string | null
  reviewedAt: Date | null
}> = {}) {
  return {
    cleanedTitle: 'Chiang Mai Elephant Sanctuary',
    shortSummary: 'A half-day ethical elephant experience.',
    suggestedTags: ['Elephants', 'Nature', 'Families'],
    seoTitle: 'Best Elephant Sanctuary Chiang Mai',
    seoDescription: 'Visit rescued elephants in Chiang Mai.',
    reviewedBy: 'editor@radarscout.com',
    reviewedAt: REVIEWED_AT,
    ...overrides,
  }
}

const FORBIDDEN_KEYS = [
  'rawJson',
  'price',
  'availability',
  'supplier',
  'supplierName',
  'rating',
  'reviewCount',
  'bookingUrl',
  'bookingStatus',
  'openingHours',
  'checkout',
  'payment',
  'aiRawResponse',
  'aiPrompt',
  'localAiRawOutput',
  'candidate',
]

describe('getReviewedEnrichmentByProductId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no enrichment row exists', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(null)

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result).toBeNull()
    expect(dbMock.bokunProductEnrichment.findUnique).toHaveBeenCalledWith({
      where: { productId: 'product_abc' },
      select: expect.objectContaining({ cleanedTitle: true, suggestedTags: true }),
    })
  })

  it('returns only allowed reviewed fields when a row exists', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(makeEnrichmentRow())

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result).toEqual<ReviewedEnrichmentOutput>({
      cleanedTitle: 'Chiang Mai Elephant Sanctuary',
      shortSummary: 'A half-day ethical elephant experience.',
      suggestedTags: ['Elephants', 'Nature', 'Families'],
      seoTitle: 'Best Elephant Sanctuary Chiang Mai',
      seoDescription: 'Visit rescued elephants in Chiang Mai.',
      reviewedBy: 'editor@radarscout.com',
      reviewedAt: REVIEWED_AT.toISOString(),
    })
  })

  it('does not include forbidden fields in the output', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(makeEnrichmentRow())

    const result = await getReviewedEnrichmentByProductId('product_abc')
    const serialized = JSON.stringify(result)

    for (const key of FORBIDDEN_KEYS) {
      expect(serialized).not.toContain(key)
    }
  })

  it('returns reviewedAt as an ISO string', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(makeEnrichmentRow())

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result?.reviewedAt).toBe('2026-06-15T12:00:00.000Z')
  })

  it('returns null reviewedAt when the DB field is null', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(
      makeEnrichmentRow({ reviewedAt: null }),
    )

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result?.reviewedAt).toBeNull()
  })

  it('returns an empty array when suggestedTags is null', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(
      makeEnrichmentRow({ suggestedTags: null }),
    )

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result?.suggestedTags).toEqual([])
  })

  it('filters non-string entries out of suggestedTags', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(
      makeEnrichmentRow({ suggestedTags: ['Nature', 42, null, 'Culture'] }),
    )

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result?.suggestedTags).toEqual(['Nature', 'Culture'])
  })

  it('returns null text fields cleanly when they are null', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(
      makeEnrichmentRow({
        cleanedTitle: null,
        shortSummary: null,
        seoTitle: null,
        seoDescription: null,
        reviewedBy: null,
      }),
    )

    const result = await getReviewedEnrichmentByProductId('product_abc')

    expect(result?.cleanedTitle).toBeNull()
    expect(result?.shortSummary).toBeNull()
    expect(result?.seoTitle).toBeNull()
    expect(result?.seoDescription).toBeNull()
    expect(result?.reviewedBy).toBeNull()
  })

  it('queries by productId with only the safe select fields', async () => {
    dbMock.bokunProductEnrichment.findUnique.mockResolvedValue(null)

    await getReviewedEnrichmentByProductId('product_xyz')

    expect(dbMock.bokunProductEnrichment.findUnique).toHaveBeenCalledWith({
      where: { productId: 'product_xyz' },
      select: {
        cleanedTitle: true,
        shortSummary: true,
        suggestedTags: true,
        seoTitle: true,
        seoDescription: true,
        reviewedBy: true,
        reviewedAt: true,
      },
    })
  })
})

describe('getReviewedEnrichmentByBokunActivityId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no product is found', async () => {
    dbMock.bokunProduct.findUnique.mockResolvedValue(null)

    const result = await getReviewedEnrichmentByBokunActivityId('bokun_999')

    expect(result).toBeNull()
    expect(dbMock.bokunProduct.findUnique).toHaveBeenCalledWith({
      where: { bokunActivityId: 'bokun_999' },
      select: expect.objectContaining({ enrichment: expect.any(Object) }),
    })
  })

  it('returns null when the product exists but has no enrichment', async () => {
    dbMock.bokunProduct.findUnique.mockResolvedValue({ enrichment: null })

    const result = await getReviewedEnrichmentByBokunActivityId('bokun_001')

    expect(result).toBeNull()
  })

  it('returns only allowed reviewed fields when enrichment exists', async () => {
    dbMock.bokunProduct.findUnique.mockResolvedValue({
      enrichment: makeEnrichmentRow(),
    })

    const result = await getReviewedEnrichmentByBokunActivityId('bokun_001')

    expect(result).toEqual<ReviewedEnrichmentOutput>({
      cleanedTitle: 'Chiang Mai Elephant Sanctuary',
      shortSummary: 'A half-day ethical elephant experience.',
      suggestedTags: ['Elephants', 'Nature', 'Families'],
      seoTitle: 'Best Elephant Sanctuary Chiang Mai',
      seoDescription: 'Visit rescued elephants in Chiang Mai.',
      reviewedBy: 'editor@radarscout.com',
      reviewedAt: REVIEWED_AT.toISOString(),
    })
  })

  it('does not include forbidden fields in the output', async () => {
    dbMock.bokunProduct.findUnique.mockResolvedValue({
      enrichment: makeEnrichmentRow(),
    })

    const result = await getReviewedEnrichmentByBokunActivityId('bokun_001')
    const serialized = JSON.stringify(result)

    for (const key of FORBIDDEN_KEYS) {
      expect(serialized).not.toContain(key)
    }
  })

  it('queries by bokunActivityId with the safe enrichment select', async () => {
    dbMock.bokunProduct.findUnique.mockResolvedValue(null)

    await getReviewedEnrichmentByBokunActivityId('bokun_abc')

    expect(dbMock.bokunProduct.findUnique).toHaveBeenCalledWith({
      where: { bokunActivityId: 'bokun_abc' },
      select: {
        enrichment: {
          select: {
            cleanedTitle: true,
            shortSummary: true,
            suggestedTags: true,
            seoTitle: true,
            seoDescription: true,
            reviewedBy: true,
            reviewedAt: true,
          },
        },
      },
    })
  })
})
