import { NextRequest, NextResponse } from 'next/server'

import { compareAiReadyProducts } from '@/lib/aiProducts/aiCompare'

type CompareBody = {
  productIds?: unknown
}

export async function POST(request: NextRequest) {
  let body: CompareBody
  try {
    body = await request.json() as CompareBody
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    )
  }

  if (!Array.isArray(body.productIds) || !body.productIds.every(id => typeof id === 'string')) {
    return NextResponse.json(
      { ok: false, error: 'product_ids_required' },
      { status: 400 },
    )
  }

  const result = compareAiReadyProducts(body.productIds)
  if (result.ok) {
    return NextResponse.json({ ok: true, comparison: result.comparison })
  }

  const status = result.error === 'unknown_product_ids' ? 404 : 400
  return NextResponse.json(result, { status })
}
