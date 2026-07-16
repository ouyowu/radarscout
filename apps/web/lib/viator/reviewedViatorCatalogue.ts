import type { CatalogTheme } from './catalogCoverage'
import type { ReviewedViatorProduct, ViatorThailandCity } from './reviewedViatorProducts'

export const reviewedViatorCatalogueCities = [
  { slug: 'bangkok', label: 'Bangkok', city: 'Bangkok' },
  { slug: 'chiang-mai', label: 'Chiang Mai', city: 'Chiang Mai' },
  { slug: 'phuket', label: 'Phuket', city: 'Phuket' },
  { slug: 'krabi', label: 'Krabi', city: 'Krabi' },
  { slug: 'pattaya', label: 'Pattaya', city: 'Pattaya' },
  { slug: 'koh-samui', label: 'Koh Samui', city: 'Koh Samui' },
] as const satisfies readonly { slug: string; label: string; city: ViatorThailandCity }[]

export type ReviewedViatorCatalogueCitySlug = typeof reviewedViatorCatalogueCities[number]['slug']
export type ReviewedViatorCatalogueDuration = 'half-day' | 'full-day'

export type ReviewedViatorCatalogueFilters = {
  city?: ReviewedViatorCatalogueCitySlug | null
  theme?: CatalogTheme | null
  duration?: ReviewedViatorCatalogueDuration | null
}

const themeTags: Record<CatalogTheme, readonly string[]> = {
  culture: ['culture', 'temples', 'history', 'markets', 'city'],
  food: ['food', 'dining', 'dinner-cruise'],
  nature: ['nature', 'waterfalls', 'beach', 'islands', 'outdoors', 'viewpoints'],
  adventure: ['adventure', 'atv', 'zipline', 'kayaking', 'snorkeling', 'canoeing', 'jet-ski'],
}

function cityForSlug(slug: ReviewedViatorCatalogueCitySlug): ViatorThailandCity {
  return reviewedViatorCatalogueCities.find(city => city.slug === slug)?.city
    ?? reviewedViatorCatalogueCities[0].city
}

function hasTheme(product: ReviewedViatorProduct, theme: CatalogTheme): boolean {
  return product.tags.some(tag => themeTags[theme].includes(tag))
}

function productText(product: ReviewedViatorProduct): string {
  return `${product.title} ${product.shortSummary} ${product.tags.join(' ')}`.toLowerCase()
}

function hasDuration(product: ReviewedViatorProduct, duration: ReviewedViatorCatalogueDuration): boolean {
  const pattern = duration === 'half-day' ? /\bhalf[-\s]?day\b/ : /\bfull[-\s]?day\b/
  return pattern.test(productText(product))
}

export function listReviewedViatorCatalogueProducts(
  products: readonly ReviewedViatorProduct[],
  filters: ReviewedViatorCatalogueFilters,
): ReviewedViatorProduct[] {
  return products.filter(product => {
    if (filters.city && product.city !== cityForSlug(filters.city)) return false
    if (filters.theme && !hasTheme(product, filters.theme)) return false
    if (filters.duration && !hasDuration(product, filters.duration)) return false
    return true
  })
}

export function paginateReviewedViatorCatalogueProducts(
  products: readonly ReviewedViatorProduct[],
  requestedPage: number,
  pageSize: number,
) {
  const totalItems = products.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(Math.max(1, requestedPage), totalPages)
  const start = (page - 1) * pageSize

  return {
    items: products.slice(start, start + pageSize),
    page,
    totalItems,
    totalPages,
  }
}
