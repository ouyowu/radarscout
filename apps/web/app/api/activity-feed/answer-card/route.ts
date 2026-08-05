import { NextRequest, NextResponse } from 'next/server'

import { getActivityFeedV1ItemById } from '@/lib/activityFeed/activityFeedV1'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')?.trim() ?? ''
  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'product_id_required' },
      { status: 400 },
    )
  }

  const answerCard = getActivityFeedV1ItemById(id)
  if (!answerCard) {
    return NextResponse.json(
      { ok: false, error: 'product_not_found' },
      { status: 404 },
    )
  }

  return NextResponse.json({
    ok: true,
    answerCard,
  })
}
