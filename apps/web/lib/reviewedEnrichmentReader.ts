import 'server-only'
import { db } from '@reddit-monitor/db'

export type ReviewedEnrichmentOutput = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string | null
  reviewedAt: string | null
}

const ENRICHMENT_SELECT = {
  cleanedTitle: true,
  shortSummary: true,
  suggestedTags: true,
  seoTitle: true,
  seoDescription: true,
  reviewedBy: true,
  reviewedAt: true,
} as const

type EnrichmentRow = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: unknown
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string | null
  reviewedAt: Date | null
}

function parseSuggestedTags(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function toOutput(row: EnrichmentRow): ReviewedEnrichmentOutput {
  return {
    cleanedTitle: row.cleanedTitle,
    shortSummary: row.shortSummary,
    suggestedTags: parseSuggestedTags(row.suggestedTags),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
  }
}

export async function getReviewedEnrichmentByProductId(
  productId: string,
): Promise<ReviewedEnrichmentOutput | null> {
  const row = await db.bokunProductEnrichment.findUnique({
    where: { productId },
    select: ENRICHMENT_SELECT,
  })

  return row ? toOutput(row) : null
}

export async function getReviewedEnrichmentByBokunActivityId(
  bokunActivityId: string,
): Promise<ReviewedEnrichmentOutput | null> {
  const product = await db.bokunProduct.findUnique({
    where: { bokunActivityId },
    select: { enrichment: { select: ENRICHMENT_SELECT } },
  })

  return product?.enrichment ? toOutput(product.enrichment) : null
}
