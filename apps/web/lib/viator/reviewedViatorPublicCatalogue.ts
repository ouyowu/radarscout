import {
  PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
  type PublicBookingPartnerHandoff,
} from '@/lib/publicProducts/bookingPartnerHandoff'

import { isReviewedViatorAffiliateUrl } from './reviewedViatorMatching'
import {
  loadReviewedViatorProducts,
  type ReviewedViatorProduct,
} from './reviewedViatorProducts'

export type ReviewedViatorPublicProduct = {
  id: string
  title: string
  destination: string
  summary: string
  imageUrl: string
  tags: string[]
  retailPrice: null
  currency: null
  detailHref: `/tours/${string}`
  bookingPartnerHandoff: PublicBookingPartnerHandoff
}

export type ReviewedViatorPublicCatalogueCity = {
  slug: string
  label: string
}

type ReviewedViatorPublicCatalogueFilters = {
  city?: string | null
  hasImage?: boolean | null
}

function citySlug(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toPublicProduct(
  product: ReviewedViatorProduct,
): ReviewedViatorPublicProduct | null {
  if (!isReviewedViatorAffiliateUrl(product.productUrl)) return null

  const bookingPartnerHandoff: PublicBookingPartnerHandoff = {
    href: product.productUrl,
    label: 'Check availability',
    rel: PUBLIC_BOOKING_PARTNER_HANDOFF_REL,
    source: 'operator_verified_public_link',
    verifiedBy: 'operator_manual_review',
  }

  return {
    id: product.id,
    title: product.title,
    destination: product.city,
    summary: product.shortSummary,
    imageUrl: product.imageUrl,
    tags: [...product.tags],
    retailPrice: null,
    currency: null,
    detailHref: `/tours/${encodeURIComponent(product.id)}`,
    bookingPartnerHandoff,
  }
}

export function listReviewedViatorPublicCatalogueCities(): ReviewedViatorPublicCatalogueCity[] {
  return [...new Set(loadReviewedViatorProducts().map((product) => product.city))]
    .sort((left, right) => left.localeCompare(right))
    .map((city) => ({ slug: citySlug(city), label: city }))
}

export function loadReviewedViatorPublicCatalogue(
  filters: ReviewedViatorPublicCatalogueFilters = {},
): ReviewedViatorPublicProduct[] {
  const city = filters.city?.trim().toLowerCase() || null

  return loadReviewedViatorProducts().flatMap((product) => {
    if (city && citySlug(product.city) !== city) return []
    if (filters.hasImage === false) return []

    const publicProduct = toPublicProduct(product)
    return publicProduct ? [publicProduct] : []
  })
}

export function paginateReviewedViatorPublicCatalogue(
  products: readonly ReviewedViatorPublicProduct[],
  requestedPage: number,
  requestedPageSize: number,
) {
  const pageSize = Math.max(1, Math.floor(requestedPageSize))
  const totalItems = products.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(Math.max(1, Math.floor(requestedPage)), totalPages)
  const start = (page - 1) * pageSize

  return {
    items: products.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems,
    totalPages,
  }
}
