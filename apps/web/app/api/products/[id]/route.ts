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

type ProductDetailMeta = {
  source: typeof PRODUCT_SOURCE
  inventoryScope: typeof INVENTORY_SCOPE
  bookingEnabled: false
  availabilityEnabled: false
  detailSupported: true
}

function meta(): ProductDetailMeta {
  return {
    source: PRODUCT_SOURCE,
    inventoryScope: INVENTORY_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    detailSupported: true,
  }
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

function productDescription(rawJson: unknown, description: string | null): string | null {
  const raw = asRecord(rawJson)

  return stripHtml(description) ??
    stripHtml(readString(raw.description))
}

function productFacts(rawJson: unknown) {
  const raw = asRecord(rawJson)
  const pickupAvailable = typeof raw.pickupAvailable === 'boolean'
    ? raw.pickupAvailable
    : null

  return {
    duration: readString(raw.duration) ?? readString(raw.durationText),
    meetingPoint: readString(raw.meetingPoint) ?? readString(raw.meetingPointText),
    pickupAvailable,
    cancellationPolicy: readString(raw.cancellationPolicy) ?? readString(raw.cancellationPolicyText),
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = decodeURIComponent(params.id).trim()

  if (!id) {
    return NextResponse.json({
      product: null,
      meta: meta(),
      error: 'PRODUCT_NOT_FOUND',
    }, { status: 404 })
  }

  try {
    const product = await db.bokunProduct.findFirst({
      where: {
        id,
        active: true,
        supplierId: { not: null },
        city: { in: THAILAND_CITIES },
      },
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

    if (!product) {
      return NextResponse.json({
        product: null,
        meta: meta(),
        error: 'PRODUCT_NOT_FOUND',
      }, { status: 404 })
    }

    return NextResponse.json({
      product: {
        id: product.id,
        title: product.title,
        summary: productSummary(product.rawJson, product.excerpt, product.description),
        description: productDescription(product.rawJson, product.description),
        destination: product.city ?? product.location ?? 'Thailand',
        city: product.city,
        location: product.location,
        imageUrl: findImageUrl(product.rawJson),
        retailPrice: product.retailPrice?.toString() ?? null,
        currency: product.currency,
        detailHref: `/tours/${encodeURIComponent(product.id)}`,
        facts: productFacts(product.rawJson),
      },
      meta: meta(),
    })
  } catch {
    return NextResponse.json({
      product: null,
      meta: meta(),
      error: 'PRODUCT_DETAIL_UNAVAILABLE',
    }, { status: 500 })
  }
}
