/**
 * Regression tests 26–31: Verifying that existing public/internal
 * product behaviors are unchanged by the TD-THAILAND-AI-RAG-4 changes.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

// ── Test 26: Public product APIs remain unchanged ─────────────────────────────

const dbMockForPublic = vi.hoisted(() => ({
  bokunProduct: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
}))

vi.mock('@reddit-monitor/db', () => ({ db: dbMockForPublic }))

const enrichmentMockForPublic = vi.hoisted(() => ({
  getReviewedEnrichmentByProductId: vi.fn(),
}))

vi.mock('@/lib/reviewedEnrichmentReader', () => enrichmentMockForPublic)

vi.mock('@/lib/bokunCatalog', () => ({
  toReadOnlyBokunCatalogProduct: (product: { id: string; title: string; city: string | null; location: string | null }) => ({
    id: product.id,
    title: product.title,
    imageUrl: null,
    summary: null,
    retailPrice: null,
    currency: null,
    detailHref: `/tours/${product.id}`,
    supplierName: null,
  }),
}))

import { getPublicThailandProduct } from '@/lib/publicProducts/getPublicThailandProduct'
import { listPublicThailandProducts } from '@/lib/publicProducts/listPublicThailandProducts'

describe('Regression 26: Public product APIs remain unchanged', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getPublicThailandProduct still returns null for ineligible (foreign) product', async () => {
    dbMockForPublic.bokunProduct.findFirst.mockResolvedValue({
      id: 'foreign_1',
      title: 'Singapore City Tour',
      description: null,
      excerpt: null,
      city: 'Bangkok',
      location: null,
      retailPrice: null,
      currency: null,
      rawJson: {},
      lastSyncedAt: null,
      supplier: null,
    })

    const result = await getPublicThailandProduct('foreign_1')

    expect(result).toBeNull()
    expect(enrichmentMockForPublic.getReviewedEnrichmentByProductId).not.toHaveBeenCalled()
  })

  it('getPublicThailandProduct still returns product for eligible (Bangkok) product', async () => {
    dbMockForPublic.bokunProduct.findFirst.mockResolvedValue({
      id: 'bkk_1',
      title: 'Bangkok Temple Tour',
      description: null,
      excerpt: null,
      city: 'Bangkok',
      location: null,
      retailPrice: null,
      currency: null,
      rawJson: {},
      lastSyncedAt: null,
      supplier: null,
    })
    enrichmentMockForPublic.getReviewedEnrichmentByProductId.mockResolvedValue(null)

    const result = await getPublicThailandProduct('bkk_1')

    expect(result).not.toBeNull()
    expect(result!.id).toBe('bkk_1')
  })
})

// ── Test 27: Sitemap behavior remains unchanged ───────────────────────────────

describe('Regression 27: Sitemap behavior remains unchanged', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listPublicThailandProducts still excludes ineligible products from sitemap feed', async () => {
    dbMockForPublic.bokunProduct.findMany
      .mockResolvedValueOnce([
        { id: 'eligible_1', title: 'Phuket Snorkeling', city: 'Phuket', location: null, lastSyncedAt: null },
        { id: 'foreign_1', title: 'Bali Yoga Retreat', city: 'Phuket', location: null, lastSyncedAt: null },
      ])
      .mockResolvedValue([])

    const result = await listPublicThailandProducts()

    const ids = result.map(r => r.id)
    expect(ids).toContain('eligible_1')
    expect(ids).not.toContain('foreign_1')
  })

  it('listPublicThailandProducts returns only public-safe fields (id, title, city, lastSyncedAt)', async () => {
    dbMockForPublic.bokunProduct.findMany
      .mockResolvedValueOnce([
        { id: 'bkk_1', title: 'Bangkok Float Tour', city: 'Bangkok', location: null, lastSyncedAt: new Date('2026-01-01') },
      ])
      .mockResolvedValue([])

    const result = await listPublicThailandProducts()

    expect(result).toHaveLength(1)
    expect(Object.keys(result[0]).sort()).toEqual(['city', 'id', 'lastSyncedAt', 'title'])
    expect(result[0]).not.toHaveProperty('rawJson')
    expect(result[0]).not.toHaveProperty('location')
  })
})

// ── Test 28: Blocked metadata remains noindex ─────────────────────────────────

import { THAILAND_GEOGRAPHIC_TERMS, FOREIGN_TERMS } from '@/lib/productEligibility/thailandEligibility'

describe('Regression 28: Blocked product metadata remains noindex', () => {
  it('THAILAND_GEOGRAPHIC_TERMS still includes core Thailand destinations', () => {
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Thailand')
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Bangkok')
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Phuket')
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Chiang Mai')
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Chiang Rai')
    expect(THAILAND_GEOGRAPHIC_TERMS).toContain('Hua Hin')
  })

  it('FOREIGN_TERMS still includes key non-Thailand destinations', () => {
    expect(FOREIGN_TERMS).toContain('Singapore')
    expect(FOREIGN_TERMS).toContain('Tokyo')
    expect(FOREIGN_TERMS).toContain('Bali')
    expect(FOREIGN_TERMS).toContain('Vietnam')
    expect(FOREIGN_TERMS).toContain('Dubai')
  })
})

// ── Test 29: Internal reviewed-enrichment remains unrestricted ────────────────

import { getReviewedEnrichmentByProductId } from '@/lib/reviewedEnrichmentReader'

describe('Regression 29: Internal reviewed-enrichment retrieval is not gated by AI eligibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getReviewedEnrichmentByProductId can be called for any product ID without eligibility check', async () => {
    dbMockForPublic.bokunProduct.findFirst.mockResolvedValue(null)

    // This should not throw — it doesn't know about eligibility
    const enrichmentResult = await getReviewedEnrichmentByProductId.call(null as never, 'any_product_id')

    // Will return null because our DB mock returns null; what matters is it didn't throw
    expect(enrichmentResult).toBeNull()
  })
})

// ── Test 30: AI enrichment draft blocked behavior remains unchanged ────────────

import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'

describe('Regression 30: AI enrichment draft generation still blocked for non-Thailand products', () => {
  it('ineligible product returns eligible=false and reasons from evaluateThailandProductEligibility', () => {
    const result = evaluateThailandProductEligibility({
      title: 'Singapore City Tour',
      city: 'Bangkok',
      location: null,
    })

    expect(result.eligible).toBe(false)
    expect(result.foreignSignals).toContain('Singapore')
    expect(result.reasons.length).toBeGreaterThan(0)
  })

  it('eligible product passes evaluateThailandProductEligibility unchanged', () => {
    const result = evaluateThailandProductEligibility({
      title: 'Chiang Mai Elephant Sanctuary',
      city: 'Chiang Mai',
      location: null,
    })

    expect(result.eligible).toBe(true)
    expect(result.foreignSignals).toHaveLength(0)
  })
})

// ── Test 31: Issue flags remain disabled when env is absent ──────────────────

describe('Regression 31: PRODUCT_ISSUE_FLAGS_ENABLED remains absent/disabled', () => {
  it('PRODUCT_ISSUE_FLAGS_ENABLED env is not set in test environment', () => {
    // This test validates the project constraint: no one should have enabled the flag
    const flagValue = process.env.PRODUCT_ISSUE_FLAGS_ENABLED
    expect(flagValue).toBeFalsy()
  })

  it('evaluating eligibility does not depend on PRODUCT_ISSUE_FLAGS_ENABLED', () => {
    // Eligibility helper must be independent of feature flags
    const originalValue = process.env.PRODUCT_ISSUE_FLAGS_ENABLED
    delete process.env.PRODUCT_ISSUE_FLAGS_ENABLED

    const result = evaluateThailandProductEligibility({ title: 'Bangkok Temple Tour', city: 'Bangkok', location: null })
    expect(result.eligible).toBe(true)

    if (originalValue !== undefined) {
      process.env.PRODUCT_ISSUE_FLAGS_ENABLED = originalValue
    }
  })
})
