import { NextRequest, NextResponse } from 'next/server'
import { syncBokunCatalog } from '@/lib/bokunSync'

export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET
  return !!secret && request.headers.get('x-internal-secret') === secret
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown = {}

  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}
  const queries = Array.isArray(payload.queries)
    ? payload.queries.filter((query): query is string => typeof query === 'string')
    : undefined
  const currency = typeof payload.currency === 'string' ? payload.currency.trim().toUpperCase() : undefined
  const lang = typeof payload.lang === 'string' ? payload.lang.trim().toUpperCase() : undefined
  const commissionPercent = typeof payload.commissionPercent === 'number'
    ? payload.commissionPercent
    : undefined
  const pageSize = typeof payload.pageSize === 'number' ? payload.pageSize : undefined
  const maxPages = typeof payload.maxPages === 'number' ? payload.maxPages : undefined

  if (commissionPercent !== undefined && (commissionPercent < 0 || commissionPercent > 80)) {
    return NextResponse.json({ error: 'commissionPercent must be between 0 and 80' }, { status: 400 })
  }

  if (pageSize !== undefined && (pageSize < 1 || pageSize > 500)) {
    return NextResponse.json({ error: 'pageSize must be between 1 and 500' }, { status: 400 })
  }

  if (maxPages !== undefined && (maxPages < 1 || maxPages > 20)) {
    return NextResponse.json({ error: 'maxPages must be between 1 and 20' }, { status: 400 })
  }

  try {
    const result = await syncBokunCatalog({
      queries,
      currency,
      lang,
      commissionPercent,
      pageSize,
      maxPages,
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Bókun sync error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
