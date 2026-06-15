import { beforeEach, describe, expect, it, vi } from 'vitest'

const localAiTaskMocks = vi.hoisted(() => ({
  cleanProductText: vi.fn(),
  suggestProductTags: vi.fn(),
  draftSeoSnippet: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('./tasks', () => localAiTaskMocks)

import { generateProductEnrichmentCandidates } from './productEnrichment'

const mockCleanProductText =
  localAiTaskMocks.cleanProductText as unknown as ReturnType<typeof vi.fn>
const mockSuggestProductTags =
  localAiTaskMocks.suggestProductTags as unknown as ReturnType<typeof vi.fn>
const mockDraftSeoSnippet =
  localAiTaskMocks.draftSeoSnippet as unknown as ReturnType<typeof vi.fn>

const BASE_INPUT = {
  id: 'prod_123',
  title: 'Chiang Mai elephant sanctuary day tour',
  description: 'Visit an elephant sanctuary with hotel pickup and lunch included.',
  excerpt: 'Elephant sanctuary with lunch',
  destination: 'Chiang Mai',
  location: 'Northern Thailand',
  supplierName: 'Trusted Local Operator',
}

describe('generateProductEnrichmentCandidates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns local_ai_not_configured when local AI is not configured', async () => {
    mockCleanProductText.mockResolvedValue({
      ok: false,
      error: 'local_ai_not_configured',
      warnings: [],
    })
    mockSuggestProductTags.mockResolvedValue({
      ok: true,
      tags: [],
      missingFacts: [],
      warnings: [],
    })
    mockDraftSeoSnippet.mockResolvedValue({
      ok: true,
      title: null,
      metaDescription: null,
      missingFacts: [],
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

  it('never passes rawJson to local AI tasks', async () => {
    mockCleanProductText.mockResolvedValue({
      ok: true,
      title: BASE_INPUT.title,
      summary: 'Clean summary',
      tags: [],
      missingFacts: [],
      warnings: [],
    })
    mockSuggestProductTags.mockResolvedValue({
      ok: true,
      tags: ['elephants'],
      missingFacts: [],
      warnings: [],
    })
    mockDraftSeoSnippet.mockResolvedValue({
      ok: true,
      title: 'SEO title',
      metaDescription: 'SEO description',
      missingFacts: [],
      warnings: [],
    })

    await generateProductEnrichmentCandidates({
      ...BASE_INPUT,
      // @ts-expect-error intentional extra field for runtime safety check
      rawJson: { hidden: true },
    })

    expect(mockCleanProductText).toHaveBeenCalledWith({
      title: BASE_INPUT.title,
      description: BASE_INPUT.description,
      excerpt: BASE_INPUT.excerpt,
    })
    expect(mockSuggestProductTags).toHaveBeenCalledWith({
      title: BASE_INPUT.title,
      description: BASE_INPUT.description,
      existingTags: [],
    })
    expect(mockDraftSeoSnippet).toHaveBeenCalledWith({
      title: BASE_INPUT.title,
      description: BASE_INPUT.description,
      destination: BASE_INPUT.destination,
    })

    expect(JSON.stringify(mockCleanProductText.mock.calls)).not.toContain('rawJson')
    expect(JSON.stringify(mockSuggestProductTags.mock.calls)).not.toContain('rawJson')
    expect(JSON.stringify(mockDraftSeoSnippet.mock.calls)).not.toContain('rawJson')
  })

  it('combines cleaned text, tags, and seo candidate output', async () => {
    mockCleanProductText.mockResolvedValue({
      ok: true,
      title: 'Cleaned title',
      summary: 'Short summary',
      tags: ['ignored-from-clean-task'],
      missingFacts: ['price'],
      warnings: ['clean warning'],
    })
    mockSuggestProductTags.mockResolvedValue({
      ok: true,
      tags: ['elephants', 'family-friendly', 'Elephants'],
      missingFacts: ['availability'],
      warnings: ['tags warning'],
    })
    mockDraftSeoSnippet.mockResolvedValue({
      ok: true,
      title: 'SEO title',
      metaDescription: 'SEO description',
      missingFacts: ['supplier'],
      warnings: ['seo warning'],
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
    mockCleanProductText.mockResolvedValue({
      ok: true,
      title: 'Cleaned title',
      summary: 'Short summary',
      tags: [],
      missingFacts: [],
      warnings: [],
      price: '999 USD',
      rawJson: { forbidden: true },
    })
    mockSuggestProductTags.mockResolvedValue({
      ok: true,
      tags: ['elephants'],
      missingFacts: [],
      warnings: [],
      bookingUrl: 'https://forbidden.example.com',
    })
    mockDraftSeoSnippet.mockResolvedValue({
      ok: true,
      title: 'SEO title',
      metaDescription: 'SEO description',
      missingFacts: [],
      warnings: [],
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
    mockCleanProductText.mockResolvedValue({
      ok: true,
      title: 'x'.repeat(150),
      summary: 'y'.repeat(400),
      tags: [],
      missingFacts: [],
      warnings: [],
    })
    mockSuggestProductTags.mockResolvedValue({
      ok: true,
      tags: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'One'],
      missingFacts: [],
      warnings: [],
    })
    mockDraftSeoSnippet.mockResolvedValue({
      ok: true,
      title: 'z'.repeat(100),
      metaDescription: 'd'.repeat(220),
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
})
