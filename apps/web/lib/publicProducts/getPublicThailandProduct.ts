import 'server-only'
import { db } from '@reddit-monitor/db'
import { toReadOnlyBokunCatalogProduct, type BokunCatalogRecord } from '@/lib/bokunCatalog'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentByProductId, type ReviewedEnrichmentOutput } from '@/lib/reviewedEnrichmentReader'

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

export async function getPublicThailandProduct(id: string): Promise<PublicThailandProduct | null> {
  if (!id.trim()) return null

  try {
    const product = await db.bokunProduct.findFirst({
      where: {
        id: id.trim(),
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

    if (!product) return null

    const eligibility = evaluateThailandProductEligibility({
      title: product.title,
      city: product.city,
      location: product.location,
    })

    if (!eligibility.eligible) return null

    const shaped = toReadOnlyBokunCatalogProduct(product as BokunCatalogRecord)
    const reviewedEnrichment = await getReviewedEnrichmentByProductId(product.id)

    return {
      id: shaped.id,
      title: shaped.title,
      city: product.city,
      location: product.location,
      imageUrl: shaped.imageUrl,
      summary: shaped.summary,
      description: shaped.summary,
      retailPrice: shaped.retailPrice,
      currency: shaped.currency,
      detailHref: shaped.detailHref,
      reviewedEnrichment,
    }
  } catch {
    return null
  }
}
