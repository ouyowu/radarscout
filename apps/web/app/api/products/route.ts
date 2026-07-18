import { NextRequest, NextResponse } from 'next/server'

import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
  paginateReviewedViatorPublicCatalogue,
} from '@/lib/viator/reviewedViatorPublicCatalogue'

export const dynamic = 'force-dynamic'

const PRODUCT_SOURCE = 'reviewed-viator-affiliate-products'
const CATALOGUE_SCOPE = 'thailand-reviewed'

type ProductFilters = {
  destination: string
  city: string | null
  hasPrice: boolean | null
  hasImage: boolean | null
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) return fallback

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback

  return Math.max(1, Math.floor(parsed))
}

function parseTake(value: string | null): number {
  return Math.min(parsePositiveInteger(value, 12), 50)
}

function normalizeDestination(value: string | null): string {
  return value?.trim().toLowerCase() || 'thailand'
}

function normalizeCity(value: string | null): string | null {
  const city = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return city || null
}

function parseBooleanFilter(value: string | null): boolean | null {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

function meta(
  count: number,
  totalCount: number,
  page: number,
  pageSize: number,
  totalPages: number,
  filters: ProductFilters,
) {
  return {
    source: PRODUCT_SOURCE,
    catalogueScope: CATALOGUE_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    count,
    resultCount: count,
    totalCount,
    page,
    pageSize,
    totalPages,
    destination: filters.destination,
    tagSupported: false,
    filters: {
      ...filters,
      applied: filters,
    },
  }
}

function emptyResponse(filters: ProductFilters, page: number, pageSize: number) {
  return NextResponse.json({
    products: [],
    meta: meta(0, 0, page, pageSize, 1, filters),
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const destination = normalizeDestination(searchParams.get('destination'))
  const city = normalizeCity(searchParams.get('city'))
  const hasPrice = parseBooleanFilter(searchParams.get('hasPrice'))
  const hasImage = parseBooleanFilter(searchParams.get('hasImage'))
  const page = parsePositiveInteger(searchParams.get('page'), 1)
  const take = parseTake(searchParams.get('take'))
  const filters = { destination, city, hasPrice, hasImage }

  if (destination !== 'thailand') return emptyResponse(filters, page, take)

  const supportedCities = listReviewedViatorPublicCatalogueCities()
  if (city && !supportedCities.some((option) => option.slug === city)) {
    return emptyResponse(filters, page, take)
  }

  if (hasPrice === true) return emptyResponse(filters, page, take)

  try {
    const products = loadReviewedViatorPublicCatalogue({ city, hasImage })
    const paginated = paginateReviewedViatorPublicCatalogue(products, page, take)

    return NextResponse.json({
      products: paginated.items,
      meta: meta(
        paginated.items.length,
        paginated.totalItems,
        paginated.page,
        paginated.pageSize,
        paginated.totalPages,
        filters,
      ),
    })
  } catch {
    return NextResponse.json({
      products: [],
      meta: meta(0, 0, page, take, 1, filters),
      error: 'PRODUCTS_UNAVAILABLE',
    })
  }
}
