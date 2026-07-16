import 'server-only'
import { db } from '@reddit-monitor/db'
import { toReadOnlyBokunCatalogProduct, type BokunCatalogRecord } from '@/lib/bokunCatalog'
import { pilotPartnerProducts } from '@/lib/partnerProducts/seed/pilotPartnerProducts'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentByProductId, type ReviewedEnrichmentOutput } from '@/lib/reviewedEnrichmentReader'
import {
  type PublicBookingPartnerHandoff,
  validatePublicBookingPartnerHandoff,
} from './bookingPartnerHandoff'
import { resolveReviewedProductHandoff } from './ownerManagedProductHandoffMappings'
import { isDatabaseProductPublishReady } from './publicProductReviewGate'
import { loadReviewedViatorProducts } from '@/lib/viator/reviewedViatorProducts'

export type PublicThailandProduct = {
  id: string
  title: string
  destination: string | null
  city: string | null
  location: string | null
  imageUrl: string | null
  imageGalleryUrls: string[]
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
  bookingPartnerHandoff?: PublicBookingPartnerHandoff
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

function partnerSeedProductDetail(id: string): PublicThailandProductDetailResult {
  const product = pilotPartnerProducts.find(candidate => candidate.id === id)

  if (!product) return { status: 'not-found' }

  return {
    status: 'found',
    product: {
      id: product.id,
      title: product.title,
      destination: product.destination,
      city: product.destination,
      location: product.destination,
      imageUrl: product.imageUrl ?? null,
      imageGalleryUrls: product.sourceImageUrls ?? (product.imageUrl ? [product.imageUrl] : []),
      summary: product.shortSummary,
      description: product.shortSummary,
      retailPrice: null,
      currency: null,
      detailHref: `/tours/${encodeURIComponent(product.id)}`,
      facts: {
        duration: null,
        meetingPoint: null,
        pickupAvailable: null,
        cancellationPolicy: null,
      },
      reviewedEnrichment: {
        cleanedTitle: product.title,
        shortSummary: product.shortSummary,
        suggestedTags: product.tags,
        seoTitle: null,
        seoDescription: null,
        reviewedBy: product.reviewedBy,
        reviewedAt: product.reviewedAt.toISOString(),
      },
      bookingPartnerHandoff: {
        href: product.bookingWidgetUrl,
        label: 'Check availability',
        rel: 'nofollow sponsored noopener noreferrer',
        source: 'booking_partner_verified_public_widget',
        verifiedBy: 'operator_manual_review',
      },
    },
  }
}

function reviewedViatorProductDetail(id: string): PublicThailandProductDetailResult | null {
  const product = loadReviewedViatorProducts().find(candidate => candidate.id === id)
  if (!product) return null

  const bookingPartnerHandoff = validatePublicBookingPartnerHandoff({
    href: product.productUrl,
    source: 'operator_verified_public_link',
    verifiedBy: 'operator_manual_review',
  })

  if (!bookingPartnerHandoff) return { status: 'not-found' }

  return {
    status: 'found',
    product: {
      id: product.id,
      title: product.title,
      destination: product.city,
      city: product.city,
      location: product.city,
      imageUrl: product.imageUrl,
      imageGalleryUrls: [product.imageUrl],
      summary: product.shortSummary,
      description: product.shortSummary,
      retailPrice: null,
      currency: null,
      detailHref: `/tours/${encodeURIComponent(product.id)}`,
      facts: {
        duration: null,
        meetingPoint: null,
        pickupAvailable: null,
        cancellationPolicy: null,
      },
      reviewedEnrichment: {
        cleanedTitle: product.title,
        shortSummary: product.shortSummary,
        suggestedTags: [...product.tags],
        seoTitle: null,
        seoDescription: null,
        reviewedBy: 'operator_manual_review',
        reviewedAt: product.reviewedAt,
      },
      bookingPartnerHandoff,
    },
  }
}

export async function loadPublicThailandProductDetail(id: string): Promise<PublicThailandProductDetailResult> {
  const normalizedId = id.trim()
  if (!normalizedId) return { status: 'not-found' }

  try {
    const viatorDetail = reviewedViatorProductDetail(normalizedId)
    if (viatorDetail) return viatorDetail

    const partnerDetail = partnerSeedProductDetail(normalizedId)
    if (partnerDetail.status === 'found') return partnerDetail

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
        bokunActivityId: true,
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
    const bookingPartnerHandoff = resolveReviewedProductHandoff({
      publicProductId: product.id,
      bokunActivityId: product.bokunActivityId,
    })

    if (!isDatabaseProductPublishReady({
      enrichment: reviewedEnrichment,
      handoff: bookingPartnerHandoff,
    })) {
      return { status: 'not-found' }
    }

    return {
      status: 'found',
      product: {
        id: shaped.id,
        title: reviewedEnrichment!.cleanedTitle!,
        destination: shaped.destination ?? 'Thailand',
        city: product.city,
        location: product.location,
        imageUrl: shaped.imageUrl,
        imageGalleryUrls: shaped.imageUrl ? [shaped.imageUrl] : [],
        summary: reviewedEnrichment!.shortSummary!,
        description: reviewedEnrichment!.shortSummary!,
        retailPrice: shaped.retailPrice,
        currency: shaped.currency,
        detailHref: shaped.detailHref,
        facts: productFacts(product.rawJson),
        reviewedEnrichment,
        bookingPartnerHandoff: bookingPartnerHandoff!,
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
