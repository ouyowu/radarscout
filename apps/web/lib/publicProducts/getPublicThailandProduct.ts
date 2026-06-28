import 'server-only'
import { db } from '@reddit-monitor/db'
import { toReadOnlyBokunCatalogProduct, type BokunCatalogRecord } from '@/lib/bokunCatalog'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentByProductId, type ReviewedEnrichmentOutput } from '@/lib/reviewedEnrichmentReader'

export type PublicThailandProduct = {
  id: string
  title: string
  destination: string | null
  city: string | null
  location: string | null
  imageUrl: string | null
  summary: string | null
  description: string | null
  retailPrice: string | null
  currency: string | null
  detailHref: string
  facts: {
    duration: string | null
    meetingPoint: string | null
    pickupAvailable: boolean | null
    cancellationPolicy: string | null
  }
  reviewedEnrichment: ReviewedEnrichmentOutput | null
}

export type PublicThailandProductDetailResult =
  | { status: 'found'; product: PublicThailandProduct }
  | { status: 'not-found' }
  | { status: 'error' }

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

function productDescription(rawJson: unknown, description: string | null): string | null {
  const raw = asRecord(rawJson)

  return stripHtml(description) ??
    stripHtml(readString(raw.description))
}

function productFacts(rawJson: unknown): PublicThailandProduct['facts'] {
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

export async function loadPublicThailandProductDetail(id: string): Promise<PublicThailandProductDetailResult> {
  const normalizedId = id.trim()
  if (!normalizedId) return { status: 'not-found' }

  try {
    const product = await db.bokunProduct.findFirst({
      where: {
        id: normalizedId,
        active: true,
        supplierId: { not: null },
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
        lastSyncedAt: true,
        supplier: { select: { title: true } },
      },
    })

    if (!product) return { status: 'not-found' }

    const eligibility = evaluateThailandProductEligibility({
      title: product.title,
      city: product.city,
      location: product.location,
    })

    if (!eligibility.eligible) return { status: 'not-found' }

    const shaped = toReadOnlyBokunCatalogProduct(product as BokunCatalogRecord)
    const reviewedEnrichment = await getReviewedEnrichmentByProductId(product.id)

    return {
      status: 'found',
      product: {
        id: shaped.id,
        title: shaped.title,
        destination: shaped.destination ?? 'Thailand',
        city: product.city,
        location: product.location,
        imageUrl: shaped.imageUrl,
        summary: shaped.summary,
        description: productDescription(product.rawJson, product.description) ?? shaped.summary,
        retailPrice: shaped.retailPrice,
        currency: shaped.currency,
        detailHref: shaped.detailHref,
        facts: productFacts(product.rawJson),
        reviewedEnrichment,
      },
    }
  } catch {
    return { status: 'error' }
  }
}

export async function getPublicThailandProduct(id: string): Promise<PublicThailandProduct | null> {
  const result = await loadPublicThailandProductDetail(id)

  return result.status === 'found' ? result.product : null
}
