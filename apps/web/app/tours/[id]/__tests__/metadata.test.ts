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
const GENERIC_DESCRIPTION = 'A display-only RadarScout product detail page for curated Thailand supplier experiences powered by signed Bókun supplier partners.'

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

  it('returns generic metadata for unknown id with canonical URL still present', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const meta = await generateMetadata({ params: { id: 'ghost_product' } })

    expect(meta.alternates?.canonical).toContain('ghost_product')
    expect(meta.title).toBe(GENERIC_TITLE)
  })

  it('returns product-specific title for eligible product', async () => {
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

  it('canonical URL always embeds the product id', async () => {
    productLoaderMock.getPublicThailandProduct.mockResolvedValue(null)

    const id = 'my-tour-id-123'
    const meta = await generateMetadata({ params: { id } })

    const canonical = meta.alternates?.canonical as string
    expect(canonical).toContain(encodeURIComponent(id))
  })
})
