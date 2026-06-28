import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({ get: vi.fn(() => null) })),
}))

const productLoaderMock = vi.hoisted(() => ({
  getPublicThailandProduct: vi.fn(),
}))

vi.mock('@/lib/publicProducts/getPublicThailandProduct', () => productLoaderMock)

import { generateMetadata } from '../page'

const GENERIC_TITLE = 'Thailand Tour Detail Preview | RadarScout'
const GENERIC_DESCRIPTION = 'Explore curated Thailand travel experiences from trusted local operators, with a secure booking handoff.'
const FORBIDDEN_BOKUN_PHRASES = ['Bókun', 'bokun', 'Bokun', 'signed Bókun', 'Bókun supplier', 'Bókun-powered', 'Bókun backend', 'Bókun database']

function makePublicProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: 'prod_abc',
    title: 'Chiang Mai Elephant Sanctuary',
    city: 'Chiang Mai',
    location: 'Mae Rim',
    imageUrl: null,
    summary: 'Half-day ethical elephant visit.',
    description: null,
    retailPrice: '49.00',
    currency: 'USD',
    detailHref: '/tours/prod_abc',
    reviewedEnrichment: null,
    ...overrides,
  }
}

describe('generateMetadata — tours/[id]/page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_BASE_URL = 'https://www.radarscout.io'
  })

  it('returns generic title when product is not found (loader returns null)', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'unknown_id' } })

    expect(meta.title).toBe(GENERIC_TITLE)
    expect(meta.description).toBe(GENERIC_DESCRIPTION)
  })

  it('unknown product has robots.index === false', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'unknown_id' } })

    expect((meta.robots as { index: boolean }).index).toBe(false)
  })

  it('unknown product has robots.follow === false', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'unknown_id' } })

    expect((meta.robots as { follow: boolean }).follow).toBe(false)
  })

  it('ineligible product has the same generic noindex metadata as unknown product', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const ineligibleMeta = await generateMetadata({ params: { id: 'ineligible_id' } })
    const unknownMeta = await generateMetadata({ params: { id: 'unknown_id' } })

    expect(ineligibleMeta.title).toBe(unknownMeta.title)
    expect(ineligibleMeta.description).toBe(unknownMeta.description)
    expect(JSON.stringify(ineligibleMeta.robots)).toBe(JSON.stringify(unknownMeta.robots))
  })

  it('unknown product canonical does not contain the requested product ID', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'blocked_product_id' } })

    const serialized = JSON.stringify(meta)
    expect(serialized).not.toContain('blocked_product_id')
  })

  it('generic metadata description contains no Bókun wording', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'any_id' } })

    const serialized = JSON.stringify(meta)
    for (const phrase of FORBIDDEN_BOKUN_PHRASES) {
      expect(serialized).not.toContain(phrase)
    }
  })

  it('eligible product has product-specific canonical URL', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(makePublicProduct())

    const meta = await generateMetadata({ params: { id: 'prod_abc' } })

    expect(meta.alternates?.canonical).toContain('/tours/prod_abc')
  })

  it('eligible product returns product-specific title', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(makePublicProduct())

    const meta = await generateMetadata({ params: { id: 'prod_abc' } })

    expect(meta.title).toContain('Chiang Mai Elephant Sanctuary')
    expect(meta.title).not.toBe(GENERIC_TITLE)
  })

  it('prefers reviewedEnrichment.cleanedTitle over raw product title', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(
      makePublicProduct({
        reviewedEnrichment: {
          cleanedTitle: 'Ethical Elephant Sanctuary Chiang Mai',
          shortSummary: null,
          suggestedTags: [],
          seoTitle: null,
          seoDescription: null,
          reviewedBy: null,
          reviewedAt: null,
        },
      }),
    )

    const meta = await generateMetadata({ params: { id: 'prod_abc' } })

    expect(meta.title).toContain('Ethical Elephant Sanctuary Chiang Mai')
    expect(meta.title).not.toContain('Chiang Mai Elephant Sanctuary')
  })

  it('eligible product remains noindex while tour detail pages are being remediated', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(makePublicProduct())

    const meta = await generateMetadata({ params: { id: 'prod_abc' } })

    expect(meta.robots).toMatchObject({ index: false, follow: false })
  })
})
