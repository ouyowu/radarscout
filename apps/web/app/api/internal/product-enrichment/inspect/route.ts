import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { getReviewedEnrichmentByProductId } from '@/lib/reviewedEnrichmentReader'
import { isIssueFlagsEnabled } from '@/lib/featureFlags'

export const dynamic = 'force-dynamic'

const THAILAND_CITIES = [
  'Ayutthaya',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Phuket',
]

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET

  if (!secret) return false

  return request.headers.get('x-internal-enrichment-review-secret') === secret
}

export async function GET(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'inspect_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const productId = request.nextUrl.searchParams.get('productId')?.trim() ?? ''

  if (!productId) {
    return NextResponse.json({ ok: false, error: 'productId_required' }, { status: 400 })
  }

  try {
    const product = await db.bokunProduct.findFirst({
      where: {
        id: productId,
        active: true,
        supplierId: { not: null },
        city: { in: THAILAND_CITIES },
      },
      select: {
        id: true,
        title: true,
        city: true,
        location: true,
        retailPrice: true,
        currency: true,
      },
    })

    if (!product) {
      return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 })
    }

    let reviewedEnrichment: Awaited<ReturnType<typeof getReviewedEnrichmentByProductId>>
    let issueFlag: { id: string; reason: string; note: string | null; flaggedBy: string; flaggedAt: Date } | null = null

    if (isIssueFlagsEnabled()) {
      ;[reviewedEnrichment, issueFlag] = await Promise.all([
        getReviewedEnrichmentByProductId(product.id),
        db.productIssueFlag.findUnique({ where: { productId: product.id } }),
      ])
    } else {
      reviewedEnrichment = await getReviewedEnrichmentByProductId(product.id)
    }

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        title: product.title,
        city: product.city,
        location: product.location,
        retailPrice: product.retailPrice?.toString() ?? null,
        currency: product.currency,
      },
      reviewedEnrichment,
      issueFlag: issueFlag
        ? {
            id: issueFlag.id,
            reason: issueFlag.reason,
            note: issueFlag.note,
            flaggedBy: issueFlag.flaggedBy,
            flaggedAt: issueFlag.flaggedAt.toISOString(),
          }
        : null,
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'inspect_unavailable' },
      { status: 500 },
    )
  }
}
