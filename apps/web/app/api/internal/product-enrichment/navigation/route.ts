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

function buildBackHref(q: string, city: string, status: string): string {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (city) params.set('city', city)
  if (status) params.set('status', status)
  const qs = params.toString()
  return qs ? `/internal/reviewed-enrichment?${qs}` : '/internal/reviewed-enrichment'
}

export async function GET(request: NextRequest) {
  if (!process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'navigation_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const productId = params.get('productId')?.trim() ?? ''
  const q = params.get('q')?.trim() ?? ''
  const cityParam = params.get('city')?.trim() ?? ''
  const status = params.get('status')?.trim() ?? ''

  if (!productId) {
    return NextResponse.json({ ok: false, error: 'productId_required' }, { status: 400 })
  }

  const cityFilter = cityParam && THAILAND_CITIES.includes(cityParam) ? cityParam : null

  try {
    const currentProduct = await db.bokunProduct.findFirst({
      where: {
        id: productId,
        active: true,
        supplierId: { not: null as string | null },
        city: { in: THAILAND_CITIES },
      },
      select: { id: true, title: true },
    })

    if (!currentProduct) {
      return NextResponse.json({ ok: false, error: 'product_not_found' }, { status: 404 })
    }

    const currentTitle = currentProduct.title

    const baseWhere = {
      active: true,
      supplierId: { not: null as string | null },
      city: { in: cityFilter ? [cityFilter] : THAILAND_CITIES },
      enrichment: { is: null },
      ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    }

    const [prevProduct, nextProduct] = await Promise.all([
      db.bokunProduct.findFirst({
        where: {
          ...baseWhere,
          OR: [
            { title: { lt: currentTitle } },
            { title: currentTitle, id: { lt: productId } },
          ],
        },
        select: { id: true },
        orderBy: [{ title: 'desc' }, { id: 'desc' }],
      }),
      db.bokunProduct.findFirst({
        where: {
          ...baseWhere,
          OR: [
            { title: { gt: currentTitle } },
            { title: currentTitle, id: { gt: productId } },
          ],
        },
        select: { id: true },
        orderBy: [{ title: 'asc' }, { id: 'asc' }],
      }),
    ])

    return NextResponse.json({
      ok: true,
      previousMissingProductId: prevProduct?.id ?? null,
      nextMissingProductId: nextProduct?.id ?? null,
      backHref: buildBackHref(q, cityParam, status),
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'navigation_unavailable' },
      { status: 500 },
    )
  }
}
