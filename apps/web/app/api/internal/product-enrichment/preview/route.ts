import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import {
  generateProductEnrichmentCandidates,
  type ProductEnrichmentCandidate,
} from '@/lib/localAi/productEnrichment'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'

export const dynamic = 'force-dynamic'

type ProductRecord = {
  id: string
  title: string
  description: string | null
  excerpt: string | null
  city: string | null
  location: string | null
  supplier: {
    title: string
  } | null
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_AI_PREVIEW_SECRET

  if (!secret) return false

  return request.headers.get('x-internal-ai-preview-secret') === secret
}

function parseProductId(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const productId = value.trim()

  if (!productId || productId.length > 128) return null

  return productId
}

function sanitizeCandidate(candidate: ProductEnrichmentCandidate): ProductEnrichmentCandidate {
  if (!candidate.ok) {
    return {
      ok: false,
      productId: candidate.productId,
      error: candidate.error,
      warnings: candidate.warnings,
    }
  }

  return {
    ok: true,
    productId: candidate.productId,
    cleanedTitle: candidate.cleanedTitle,
    shortSummary: candidate.shortSummary,
    suggestedTags: candidate.suggestedTags,
    seoTitle: candidate.seoTitle,
    seoDescription: candidate.seoDescription,
    missingFacts: candidate.missingFacts,
    warnings: candidate.warnings,
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.INTERNAL_AI_PREVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'preview_not_configured' },
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

  const payload = body && typeof body === 'object'
    ? body as Record<string, unknown>
    : {}
  const productId = parseProductId(payload.productId)

  if (!productId) {
    return NextResponse.json({ ok: false, error: 'invalid_product_id' }, { status: 400 })
  }

  const product = await db.bokunProduct.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      description: true,
      excerpt: true,
      city: true,
      location: true,
      supplier: {
        select: {
          title: true,
        },
      },
    },
  }) as ProductRecord | null

  if (!product) {
    return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 })
  }

  const eligibility = evaluateThailandProductEligibility({
    city: product.city,
    title: product.title,
    location: product.location,
  })

  if (!eligibility.eligible) {
    return NextResponse.json(
      {
        ok: false,
        error: 'source_product_not_thailand_eligible',
        reasons: eligibility.reasons,
      },
      { status: 422 },
    )
  }

  const candidate = await generateProductEnrichmentCandidates({
    id: product.id,
    title: product.title,
    description: product.description,
    excerpt: product.excerpt,
    destination: product.city ?? product.location,
    location: product.location,
    supplierName: product.supplier?.title ?? null,
  })

  return NextResponse.json({
    ok: true,
    productId: product.id,
    candidate: sanitizeCandidate(candidate),
  })
}
