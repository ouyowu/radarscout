import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

export const dynamic = 'force-dynamic'

const ISSUE_REASONS = new Set([
  'destination_mismatch',
  'bad_source_data',
  'duplicate_product',
  'not_relevant',
  'needs_manual_research',
  'other',
])

function isSafeProductId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,100}$/.test(id)
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return false
  return request.headers.get('x-internal-enrichment-review-secret') === secret
}

export async function POST(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json({ ok: false, error: 'flag_not_configured' }, { status: 503 })
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const { productId, reason, note, flaggedBy } = body as Record<string, unknown>

  if (typeof productId !== 'string' || !isSafeProductId(productId)) {
    return NextResponse.json({ ok: false, error: 'invalid_product_id' }, { status: 400 })
  }

  if (typeof reason !== 'string' || !ISSUE_REASONS.has(reason)) {
    return NextResponse.json({ ok: false, error: 'invalid_reason' }, { status: 400 })
  }

  if (typeof flaggedBy !== 'string' || !flaggedBy.trim() || flaggedBy.length > 100) {
    return NextResponse.json({ ok: false, error: 'invalid_flagged_by' }, { status: 400 })
  }

  const sanitizedNote =
    note != null && typeof note === 'string' && note.trim().length > 0
      ? note.trim().slice(0, 500)
      : null

  try {
    await db.productIssueFlag.upsert({
      where: { productId },
      create: {
        productId,
        reason,
        note: sanitizedNote,
        flaggedBy: flaggedBy.trim(),
        flaggedAt: new Date(),
        resolvedAt: null,
      },
      update: {
        reason,
        note: sanitizedNote,
        flaggedBy: flaggedBy.trim(),
        flaggedAt: new Date(),
        resolvedAt: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'flag_failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json({ ok: false, error: 'flag_not_configured' }, { status: 503 })
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  const { productId } = body as Record<string, unknown>

  if (typeof productId !== 'string' || !isSafeProductId(productId)) {
    return NextResponse.json({ ok: false, error: 'invalid_product_id' }, { status: 400 })
  }

  try {
    await db.productIssueFlag.delete({ where: { productId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'flag_not_found' }, { status: 404 })
  }
}
