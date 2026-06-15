import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import {
  sanitizeReviewedEnrichmentInput,
  toReviewedEnrichmentResponse,
  type ReviewedEnrichmentRecord,
} from '@/lib/productEnrichmentReview'

export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET

  if (!secret) return false

  return request.headers.get('x-internal-enrichment-review-secret') === secret
}

export async function POST(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'review_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown = {}

  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const validation = sanitizeReviewedEnrichmentInput(body)

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.error,
        ...(validation.fields ? { fields: validation.fields } : {}),
      },
      { status: validation.status },
    )
  }

  const product = await db.bokunProduct.findUnique({
    where: { id: validation.data.productId },
    select: { id: true },
  })

  if (!product) {
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 })
  }

  const reviewedEnrichment = await db.bokunProductEnrichment.upsert({
    where: { productId: validation.data.productId },
    create: validation.data,
    update: {
      cleanedTitle: validation.data.cleanedTitle,
      shortSummary: validation.data.shortSummary,
      suggestedTags: validation.data.suggestedTags,
      seoTitle: validation.data.seoTitle,
      seoDescription: validation.data.seoDescription,
      reviewedBy: validation.data.reviewedBy,
      reviewedAt: validation.data.reviewedAt,
    },
  }) as ReviewedEnrichmentRecord

  return NextResponse.json({
    ok: true,
    productId: validation.data.productId,
    reviewedEnrichment: toReviewedEnrichmentResponse(reviewedEnrichment),
  })
}
