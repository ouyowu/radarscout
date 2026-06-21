import 'server-only'
import { db } from '@reddit-monitor/db'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentByProductId, type ReviewedEnrichmentOutput } from '@/lib/reviewedEnrichmentReader'

const THAILAND_CITIES = [
  'Ayutthaya',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Phuket',
]

export type PublicThailandProduct = {
  id: string
  title: string
  city: string | null
  location: string | null
  imageUrl: string | null
  summary: string | null
  description: string | null
  retailPrice: string | null
  currency: string | null
  detailHref: string
  reviewedEnrichment: ReviewedEnrichmentOutput | null
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function findImageUrl(rawJson: unknown): string | null {
  const raw = asRecord(rawJson)
  const keyPhoto = asRecord(raw.keyPhoto)
  const derived = Array.isArray(keyPhoto.derived) ? keyPhoto.derived : []
  const large = derived.map(asRecord).find(image => readString(image.name) === 'large')
  const preview = derived.map(asRecord).find(image => readString(image.name) === 'preview')

  return readString(large?.url) ??
    readString(large?.cleanUrl) ??
    readString(preview?.url) ??
    readString(preview?.cleanUrl) ??
    readString(keyPhoto.originalUrl)
}

function stripHtml(value: string | null | undefined): string | null {
  if (!value) return null
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || null
}

function productSummary(rawJson: unknown, excerpt: string | null, description: string | null): string | null {
  const raw = asRecord(rawJson)
  return stripHtml(readString(raw.summary)) ??
    stripHtml(excerpt) ??
    stripHtml(description)
}

function productDescription(rawJson: unknown, description: string | null): string | null {
  const raw = asRecord(rawJson)
  return stripHtml(description) ?? stripHtml(readString(raw.description))
}

export async function getPublicThailandProduct(id: string): Promise<PublicThailandProduct | null> {
  if (!id.trim()) return null

  try {
    const product = await db.bokunProduct.findFirst({
      where: {
        id: id.trim(),
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

    if (!product) return null

    const eligibility = evaluateThailandProductEligibility({
      title: product.title,
      city: product.city,
      location: product.location,
    })

    if (!eligibility.eligible) return null

    const reviewedEnrichment = await getReviewedEnrichmentByProductId(product.id)

    return {
      id: product.id,
      title: product.title,
      city: product.city,
      location: product.location,
      imageUrl: findImageUrl(product.rawJson),
      summary: productSummary(product.rawJson, product.excerpt, product.description),
      description: productDescription(product.rawJson, product.description),
      retailPrice: product.retailPrice?.toString() ?? null,
      currency: product.currency,
      detailHref: `/tours/${encodeURIComponent(product.id)}`,
      reviewedEnrichment,
    }
  } catch {
    return null
  }
}
