import { NextRequest, NextResponse } from 'next/server'
import { isBokunCatalogConfigured, syncBokunCatalog } from '@/lib/bokunSync'

export const dynamic = 'force-dynamic'

type SyncRequestPayload = {
  queries?: string[]
  currency?: string
  lang?: string
  commissionPercent?: number
  pageSize?: number
  maxPages?: number
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.BOKUN_SYNC_SECRET

  if (!secret) return false

  return request.headers.get('x-bokun-sync-secret') === secret
}

function readPayload(value: unknown): SyncRequestPayload {
  const payload = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : {}

  return {
    queries: Array.isArray(payload.queries)
      ? payload.queries.filter((query): query is string => typeof query === 'string')
      : undefined,
    currency: typeof payload.currency === 'string' ? payload.currency.trim().toUpperCase() : undefined,
    lang: typeof payload.lang === 'string' ? payload.lang.trim().toUpperCase() : undefined,
    commissionPercent: typeof payload.commissionPercent === 'number'
      ? payload.commissionPercent
      : undefined,
    pageSize: typeof payload.pageSize === 'number' ? payload.pageSize : undefined,
    maxPages: typeof payload.maxPages === 'number' ? payload.maxPages : undefined,
  }
}

function validatePayload(payload: SyncRequestPayload): string | null {
  if (
    payload.commissionPercent !== undefined &&
    (payload.commissionPercent < 0 || payload.commissionPercent > 80)
  ) {
    return 'commission_percent_out_of_range'
  }

  if (payload.pageSize !== undefined && (payload.pageSize < 1 || payload.pageSize > 500)) {
    return 'page_size_out_of_range'
  }

  if (payload.maxPages !== undefined && (payload.maxPages < 1 || payload.maxPages > 20)) {
    return 'max_pages_out_of_range'
  }

  return null
}

export async function POST(request: NextRequest) {
  const syncSecret = process.env.BOKUN_SYNC_SECRET

  if (!syncSecret) {
    return NextResponse.json(
      { ok: false, error: 'sync_not_configured' },
      { status: 503 },
    )
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  if (!isBokunCatalogConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'bokun_not_configured' },
      { status: 503 },
    )
  }

  let body: unknown = {}

  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const payload = readPayload(body)
  const validationError = validatePayload(payload)

  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 })
  }

  try {
    const result = await syncBokunCatalog(payload)

    return NextResponse.json({
      ok: true,
      syncedProducts: result.productsUpserted,
      syncedSuppliers: result.suppliersUpserted,
      skippedProducts: result.skippedProducts,
      errors: result.failures.length,
      startedAt: result.startedAt,
      finishedAt: result.finishedAt,
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'bokun_sync_failed' },
      { status: 502 },
    )
  }
}
