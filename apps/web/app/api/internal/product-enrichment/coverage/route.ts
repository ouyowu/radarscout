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

export type CityRow = {
  city: string
  total: number
  reviewed: number
  missing: number
  pct: number
}

export type CoverageData = {
  total: number
  reviewed: number
  missing: number
  pct: number
  cities: CityRow[]
}

type CityCountRow = {
  city: string | null
  _count: {
    _all: number
  }
}

const BASE_WHERE = {
  active: true,
  supplierId: { not: null as string | null },
  city: { in: THAILAND_CITIES },
}

function countByCity(rows: CityCountRow[]) {
  return new Map(
    rows
      .filter((row): row is CityCountRow & { city: string } => typeof row.city === 'string')
      .map(row => [row.city, row._count._all]),
  )
}

export async function GET(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'coverage_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const [totalsByCity, reviewedByCity] = await Promise.all([
      db.bokunProduct.groupBy({
        by: ['city'],
        where: BASE_WHERE,
        _count: { _all: true },
      }),
      db.bokunProduct.groupBy({
        by: ['city'],
        where: { ...BASE_WHERE, enrichment: { isNot: null } },
        _count: { _all: true },
      }),
    ])

    const totalsMap = countByCity(totalsByCity)
    const reviewedMap = countByCity(reviewedByCity)

    const cities: CityRow[] = THAILAND_CITIES.map(city => {
      const total = totalsMap.get(city) ?? 0
      const reviewed = reviewedMap.get(city) ?? 0
      const missing = total - reviewed
      const pct = total > 0 ? Math.round((reviewed / total) * 1000) / 10 : 0
      return { city, total, reviewed, missing, pct }
    })

    const total = cities.reduce((sum, c) => sum + c.total, 0)
    const reviewed = cities.reduce((sum, c) => sum + c.reviewed, 0)
    const missing = total - reviewed
    const pct = total > 0 ? Math.round((reviewed / total) * 1000) / 10 : 0

    return NextResponse.json({ ok: true, coverage: { total, reviewed, missing, pct, cities } })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'coverage_unavailable' },
      { status: 500 },
    )
  }
}
