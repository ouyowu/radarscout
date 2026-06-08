import { NextRequest, NextResponse } from 'next/server'
import { searchBokunActivities } from '@/lib/bokun'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}
  const query = typeof payload.query === 'string' ? payload.query.trim() : ''
  const currency = typeof payload.currency === 'string' ? payload.currency.trim().toUpperCase() : undefined
  const lang = typeof payload.lang === 'string' ? payload.lang.trim().toUpperCase() : undefined
  const commissionPercent = typeof payload.commissionPercent === 'number'
    ? payload.commissionPercent
    : 20

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  if (query.length > 200) {
    return NextResponse.json({ error: 'query must be 200 characters or less' }, { status: 400 })
  }

  if (commissionPercent < 0 || commissionPercent > 80) {
    return NextResponse.json({ error: 'commissionPercent must be between 0 and 80' }, { status: 400 })
  }

  try {
    const result = await searchBokunActivities({
      query,
      currency,
      lang,
      commissionPercent,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Bókun request failed', status: result.status, detail: result.body },
        { status: 502 },
      )
    }

    return NextResponse.json({
      source: 'bokun',
      query,
      currency: currency ?? process.env.BOKUN_DEFAULT_CURRENCY ?? 'USD',
      commissionPercent,
      generatedAt: new Date().toISOString(),
      ...result.body,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Bókun error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
