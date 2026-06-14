import 'server-only'

export const BOKUN_READ_ONLY_SOURCE = 'bokun-read-only-catalog'

export type BokunCatalogRecord = {
  id: string
  title: string
  description: string | null
  excerpt: string | null
  city: string | null
  location: string | null
  retailPrice: { toString(): string } | null
  currency: string | null
  rawJson: unknown
  lastSyncedAt: Date | null
  supplier?: {
    title: string
  } | null
}

export type ReadOnlyBokunCatalogProduct = {
  id: string
  title: string
  excerpt: string | null
  summary: string | null
  destination: string
  location: string | null
  imageUrl: string | null
  currency: string | null
  retailPrice: string | null
  retailPriceText: string | null
  source: typeof BOKUN_READ_ONLY_SOURCE
  bookingEnabled: false
  availabilityEnabled: false
  supplierName: string | null
  lastSyncedAt: string | null
  detailHref: string
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
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

export function toReadOnlyBokunCatalogProduct(product: BokunCatalogRecord): ReadOnlyBokunCatalogProduct {
  const retailPriceText = product.retailPrice?.toString() ?? null

  return {
    id: product.id,
    title: product.title,
    excerpt: product.excerpt,
    summary: productSummary(product.rawJson, product.excerpt, product.description),
    destination: product.city ?? product.location ?? 'Thailand',
    location: product.location,
    imageUrl: findImageUrl(product.rawJson),
    currency: product.currency,
    retailPrice: retailPriceText,
    retailPriceText,
    source: BOKUN_READ_ONLY_SOURCE,
    bookingEnabled: false,
    availabilityEnabled: false,
    supplierName: product.supplier?.title ?? null,
    lastSyncedAt: product.lastSyncedAt?.toISOString() ?? null,
    detailHref: `/tours/${encodeURIComponent(product.id)}`,
  }
}
