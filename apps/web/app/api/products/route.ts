import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

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
  destination: string
  tagSupported: false
}

function meta(count: number, destination: string): ProductMeta {
  return {
    source: PRODUCT_SOURCE,
    inventoryScope: INVENTORY_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    count,
    destination,
    tagSupported: false,
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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function stripHtml(value: string | null): string | null {
  if (!value) return null

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findImageUrl(rawJson: unknown): string | null {
  const raw = asRecord(rawJson)
  const keyPhoto = asRecord(raw.keyPhoto)
  const derived = Array.isArray(keyPhoto.derived) ? keyPhoto.derived : []
  const large = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'large')
  const preview = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'preview')

  return readString(large?.url) ??
    readString(large?.cleanUrl) ??
    readString(preview?.url) ??
    readString(preview?.cleanUrl) ??
    readString(keyPhoto.originalUrl)
}

function productSummary(rawJson: unknown, excerpt: string | null, description: string | null): string | null {
  const raw = asRecord(rawJson)

  return stripHtml(readString(raw.summary)) ??
    stripHtml(excerpt) ??
    stripHtml(description)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const take = parseTake(searchParams.get('take'))
  const destination = normalizeDestination(searchParams.get('destination'))

  if (destination !== 'thailand') {
    return NextResponse.json({
      products: [],
      meta: meta(0, destination),
    })
  }

  try {
    const products = await db.bokunProduct.findMany({
      where: {
        active: true,
        supplierId: { not: null },
        city: { in: THAILAND_CITIES },
      },
      orderBy: [{ city: 'asc' }, { title: 'asc' }],
      take,
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
      },
    })

    return NextResponse.json({
      products: products.map(product => ({
        id: product.id,
        title: product.title,
        destination: product.city ?? product.location ?? 'Thailand',
        summary: productSummary(product.rawJson, product.excerpt, product.description),
        imageUrl: findImageUrl(product.rawJson),
        retailPrice: product.retailPrice?.toString() ?? null,
        currency: product.currency,
        tags: [],
        detailHref: `/tours/${encodeURIComponent(product.id)}`,
      })),
      meta: meta(products.length, destination),
    })
  } catch {
    return NextResponse.json({
      products: [],
      meta: meta(0, destination),
      error: 'PRODUCTS_UNAVAILABLE',
    })
  }
}
