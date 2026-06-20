import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

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

export type SearchProductRow = {
  id: string
  title: string
  city: string | null
  location: string | null
  retailPrice: string | null
  currency: string | null
  reviewedStatus: 'reviewed' | 'missing'
  cleanedTitle: string | null
  reviewedAt: string | null
  isFlagged: boolean
}

const PRODUCT_SELECT = {
  id: true,
  title: true,
  city: true,
  location: true,
  retailPrice: true,
  currency: true,
  enrichment: {
    select: { cleanedTitle: true, reviewedAt: true },
  },
  issueFlag: {
    select: { id: true },
  },
} as const

export async function GET(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'search_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const q = params.get('q')?.trim() ?? ''
  const cityParam = params.get('city')?.trim() ?? ''
  const status = params.get('status')?.trim() ?? 'all'

  if (!['all', 'missing', 'reviewed', 'flagged'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'invalid_status' }, { status: 400 })
  }

  const cityFilter = cityParam && THAILAND_CITIES.includes(cityParam) ? cityParam : null

  const baseWhere = {
    active: true,
    supplierId: { not: null as string | null },
    city: { in: cityFilter ? [cityFilter] : THAILAND_CITIES },
    ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
  }

  try {
    let rows: Array<{
      id: string
      title: string
      city: string | null
      location: string | null
      retailPrice: { toString(): string } | null
      currency: string | null
      enrichment: { cleanedTitle: string | null; reviewedAt: Date | null } | null
      issueFlag: { id: string } | null
    }>

    if (status === 'missing') {
      rows = await db.bokunProduct.findMany({
        where: { ...baseWhere, enrichment: { is: null }, issueFlag: { is: null } },
        select: PRODUCT_SELECT,
        orderBy: { title: 'asc' },
        take: 25,
      })
    } else if (status === 'reviewed') {
      rows = await db.bokunProduct.findMany({
        where: { ...baseWhere, enrichment: { isNot: null }, issueFlag: { is: null } },
        select: PRODUCT_SELECT,
        orderBy: { title: 'asc' },
        take: 25,
      })
    } else if (status === 'flagged') {
      rows = await db.bokunProduct.findMany({
        where: { ...baseWhere, issueFlag: { isNot: null } },
        select: PRODUCT_SELECT,
        orderBy: { title: 'asc' },
        take: 25,
      })
    } else {
      // status=all: missing enrichment first, then reviewed, max 25 total; both exclude flagged
      const missing = await db.bokunProduct.findMany({
        where: { ...baseWhere, enrichment: { is: null }, issueFlag: { is: null } },
        select: PRODUCT_SELECT,
        orderBy: { title: 'asc' },
        take: 25,
      })
      const remaining = 25 - missing.length
      const reviewed =
        remaining > 0
          ? await db.bokunProduct.findMany({
              where: { ...baseWhere, enrichment: { isNot: null }, issueFlag: { is: null } },
              select: PRODUCT_SELECT,
              orderBy: { title: 'asc' },
              take: remaining,
            })
          : []
      rows = [...missing, ...reviewed]
    }

    const products: SearchProductRow[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      city: row.city,
      location: row.location,
      retailPrice: row.retailPrice?.toString() ?? null,
      currency: row.currency,
      reviewedStatus: row.enrichment ? 'reviewed' : 'missing',
      cleanedTitle: row.enrichment?.cleanedTitle ?? null,
      reviewedAt: row.enrichment?.reviewedAt?.toISOString() ?? null,
      isFlagged: row.issueFlag !== null,
    }))

    return NextResponse.json({ ok: true, products })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'search_unavailable' },
      { status: 500 },
    )
  }
}
