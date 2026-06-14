import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { toReadOnlyBokunCatalogProduct, type BokunCatalogRecord } from '@/lib/bokunCatalog'

export const dynamic = 'force-dynamic'

const PRODUCT_SOURCE = 'signed-bokun-supplier-products'
const INVENTORY_SCOPE = 'thailand-first'
const THAILAND_CITIES = [
  'Ayutthaya',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Phuket',
]

type ProductMeta = {
  source: typeof PRODUCT_SOURCE
  inventoryScope: typeof INVENTORY_SCOPE
  bookingEnabled: false
  availabilityEnabled: false
  count: number
  resultCount: number
  destination: string
  tagSupported: false
  filters: {
    destination: string
    city: string | null
    hasPrice: boolean | null
    hasImage: boolean | null
    applied: ProductFilters
  }
}

type ProductFilters = {
  destination: string
  city: string | null
  hasPrice: boolean | null
  hasImage: boolean | null
}

type ProductWithImage = {
  product: BokunCatalogRecord
  imageUrl: string | null
}

function meta(count: number, filters: ProductFilters): ProductMeta {
  return {
    source: PRODUCT_SOURCE,
    inventoryScope: INVENTORY_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    count,
    resultCount: count,
    destination: filters.destination,
    tagSupported: false,
    filters: {
      ...filters,
      applied: filters,
    },
  }
}

function parseTake(value: string | null): number {
  if (!value) return 12

  const take = Number(value)
  if (!Number.isFinite(take)) return 12

  return Math.min(Math.max(Math.floor(take), 1), 50)
}

function normalizeDestination(value: string | null): string {
  const destination = value?.trim().toLowerCase()

  return destination || 'thailand'
}

function normalizeCity(value: string | null): string | null {
  const city = value
    ?.trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')

  if (!city) return null

  return THAILAND_CITIES.find(thailandCity =>
    thailandCity.toLowerCase().replace(/\s+/g, '-') === city,
  ) ?? null
}

function parseBooleanFilter(value: string | null): boolean | null {
  if (value === 'true') return true
  if (value === 'false') return false

  return null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const take = parseTake(searchParams.get('take'))
  const destination = normalizeDestination(searchParams.get('destination'))
  const city = normalizeCity(searchParams.get('city'))
  const hasPrice = parseBooleanFilter(searchParams.get('hasPrice'))
  const hasImage = parseBooleanFilter(searchParams.get('hasImage'))
  const filters = { destination, city, hasPrice, hasImage }

  if (destination !== 'thailand') {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
    })
  }

  if (searchParams.get('city') && !city) {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
    })
  }

  try {
    const candidateTake = hasImage === null ? take : Math.min(take * 3, 100)
    const products = await db.bokunProduct.findMany({
      where: {
        active: true,
        supplierId: { not: null },
        city: city ?? { in: THAILAND_CITIES },
        ...(hasPrice === true ? { retailPrice: { not: null } } : {}),
        ...(hasPrice === false ? { retailPrice: null } : {}),
      },
      orderBy: [{ city: 'asc' }, { title: 'asc' }],
      take: candidateTake,
      select: {
        id: true,
        title: true,
        description: true,
        excerpt: true,
        city: true,
        location: true,
        retailPrice: true,
        currency: true,
        rawJson: true,
        lastSyncedAt: true,
        supplier: {
          select: {
            title: true,
          },
        },
      },
    }) as BokunCatalogRecord[]
    const filteredProducts = products
      .map(product => ({
        product,
        imageUrl: toReadOnlyBokunCatalogProduct(product).imageUrl,
      }))
      .filter(({ imageUrl }: ProductWithImage) => {
        if (hasImage === true) return Boolean(imageUrl)
        if (hasImage === false) return !imageUrl

        return true
      })
      .slice(0, take)

    return NextResponse.json({
      products: filteredProducts.map(({ product, imageUrl }: ProductWithImage) => ({
        ...toReadOnlyBokunCatalogProduct(product),
        imageUrl,
        tags: [],
      })),
      meta: meta(filteredProducts.length, filters),
    })
  } catch {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
      error: 'PRODUCTS_UNAVAILABLE',
    })
  }
}
