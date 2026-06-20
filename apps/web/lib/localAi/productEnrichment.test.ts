import { beforeEach, describe, expect, it, vi } from 'vitest'

const localAiTaskMocks = vi.hoisted(() => ({
  draftProductEnrichment: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('./tasks', () => localAiTaskMocks)

import { generateProductEnrichmentCandidates } from './productEnrichment'

const mockDraftProductEnrichment =
  localAiTaskMocks.draftProductEnrichment as unknown as ReturnType<typeof vi.fn>

const BASE_INPUT = {
  id: 'prod_123',
  title: 'Chiang Mai elephant sanctuary day tour',
  description: 'Visit an elephant sanctuary with hotel pickup and lunch included.',
  excerpt: 'Elephant sanctuary with lunch',
  destination: 'Chiang Mai',
  location: 'Northern Thailand',
  supplierName: 'Trusted Local Operator',
}

function makeFullResult(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    cleanedTitle: BASE_INPUT.title,
    shortSummary: 'A full-day visit to an ethical elephant sanctuary with lunch.',
    suggestedTags: ['elephants', 'family-friendly'],
    seoTitle: 'Chiang Mai Elephant Sanctuary Day Tour',
    seoDescription: 'Spend the day with elephants at an ethical sanctuary in Chiang Mai.',
    missingFacts: [],
    warnings: [],
    ...overrides,
  }
}

describe('generateProductEnrichmentCandidates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns local_ai_not_configured when local AI is not configured', async () => {
    mockDraftProductEnrichment.mockResolvedValue({
      ok: false,
      error: 'local_ai_not_configured',
      warnings: [],
    })

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result).toEqual({
      ok: false,
      productId: 'prod_123',
      error: 'local_ai_not_configured',
      warnings: [],
    })
  })

  it('never passes rawJson or supplierName to draftProductEnrichment', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult())

    await generateProductEnrichmentCandidates({
      ...BASE_INPUT,
      // @ts-expect-error intentional extra field for runtime safety check
      rawJson: { hidden: true },
    })

    expect(mockDraftProductEnrichment).toHaveBeenCalledWith({
      title: BASE_INPUT.title,
      description: BASE_INPUT.description,
      excerpt: BASE_INPUT.excerpt,
      destination: BASE_INPUT.destination,
      location: BASE_INPUT.location,
    })

    expect(JSON.stringify(mockDraftProductEnrichment.mock.calls)).not.toContain('rawJson')
    expect(JSON.stringify(mockDraftProductEnrichment.mock.calls)).not.toContain('supplierName')
  })

  it('maps unified AI result to all 5 candidate fields', async () => {
    mockDraftProductEnrichment.mockResolvedValue({
      ok: true,
      cleanedTitle: 'Cleaned title',
      shortSummary: 'Short summary',
      suggestedTags: ['elephants', 'family-friendly', 'Elephants'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: ['price', 'availability', 'supplier'],
      warnings: ['clean warning', 'tags warning', 'seo warning'],
    })

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result).toEqual({
      ok: true,
      productId: 'prod_123',
      cleanedTitle: 'Cleaned title',
      shortSummary: 'Short summary',
      suggestedTags: ['elephants', 'family-friendly'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: ['price', 'availability', 'supplier'],
      warnings: ['clean warning', 'tags warning', 'seo warning'],
    })
  })

  it('ignores forbidden generated fields and adds a warning', async () => {
    mockDraftProductEnrichment.mockResolvedValue({
      ok: true,
      cleanedTitle: 'Cleaned title',
      shortSummary: 'Short summary',
      suggestedTags: ['elephants'],
      seoTitle: 'SEO title',
      seoDescription: 'SEO description',
      missingFacts: [],
      warnings: [],
      price: '999 USD',
      rawJson: { forbidden: true },
      bookingUrl: 'https://forbidden.example.com',
      supplier: 'Invented Supplier',
      availability: 'available now',
      rating: '5 stars',
    })

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result).not.toHaveProperty('price')
      expect(result).not.toHaveProperty('availability')
      expect(result).not.toHaveProperty('supplier')
      expect(result).not.toHaveProperty('rating')
      expect(result).not.toHaveProperty('bookingUrl')
      expect(result).not.toHaveProperty('rawJson')
      expect(result.warnings).toEqual([
        'forbidden generated fields ignored: price, rawJson, bookingUrl, supplier, availability, rating',
      ])
    }
  })

  it('limits long strings and tag count safely', async () => {
    mockDraftProductEnrichment.mockResolvedValue({
      ok: true,
      cleanedTitle: 'x'.repeat(150),
      shortSummary: 'y'.repeat(400),
      suggestedTags: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'One'],
      seoTitle: 'z'.repeat(100),
      seoDescription: 'd'.repeat(220),
      missingFacts: [],
      warnings: [],
    })

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.cleanedTitle?.length).toBeLessThanOrEqual(120)
      expect(result.shortSummary?.length).toBeLessThanOrEqual(280)
      expect(result.seoTitle?.length).toBeLessThanOrEqual(70)
      expect(result.seoDescription?.length).toBeLessThanOrEqual(180)
      expect(result.suggestedTags).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'])
    }
  })

  // ── Fallback behaviour ────────────────────────────────────────────────────

  it('uses source title+destination as shortSummary fallback when AI returns null', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult({ shortSummary: null }))

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.shortSummary).toBe(
        'Chiang Mai elephant sanctuary day tour in Chiang Mai.',
      )
      expect(result.warnings).toContain('summary_fallback_used')
    }
  })

  it('uses source title alone as shortSummary fallback when destination and location are null', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult({ shortSummary: null }))

    const result = await generateProductEnrichmentCandidates({
      ...BASE_INPUT,
      destination: null,
      location: null,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.shortSummary).toBe('Chiang Mai elephant sanctuary day tour.')
      expect(result.warnings).toContain('summary_fallback_used')
    }
  })

  it('uses source title+destination as seoDescription fallback when AI returns null', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult({ seoDescription: null }))

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.seoDescription).toBe(
        'Chiang Mai elephant sanctuary day tour — an experience in Chiang Mai.',
      )
      expect(result.warnings).toContain('seo_description_fallback_used')
    }
  })

  it('adds both fallback warnings when both fields are null', async () => {
    mockDraftProductEnrichment.mockResolvedValue(
      makeFullResult({ shortSummary: null, seoDescription: null }),
    )

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.warnings).toContain('summary_fallback_used')
      expect(result.warnings).toContain('seo_description_fallback_used')
    }
  })

  it('does not add fallback warnings when AI provides all fields', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult())

    const result = await generateProductEnrichmentCandidates(BASE_INPUT)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.warnings).not.toContain('summary_fallback_used')
      expect(result.warnings).not.toContain('seo_description_fallback_used')
    }
  })

  it('leaves shortSummary null when title is also null — never invents text', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult({ shortSummary: null }))

    const result = await generateProductEnrichmentCandidates({ ...BASE_INPUT, title: null })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.shortSummary).toBeNull()
      expect(result.warnings).not.toContain('summary_fallback_used')
    }
  })

  it('leaves seoDescription null when title is also null — never invents text', async () => {
    mockDraftProductEnrichment.mockResolvedValue(makeFullResult({ seoDescription: null }))

    const result = await generateProductEnrichmentCandidates({ ...BASE_INPUT, title: null })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.seoDescription).toBeNull()
      expect(result.warnings).not.toContain('seo_description_fallback_used')
    }
  })
})
