import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET
  return !!secret && request.headers.get('x-internal-secret') === secret
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keywords = await db.keyword.findMany({
    where: { enabled: true },
    select: { id: true, text: true, userId: true },
  })

  return NextResponse.json(keywords)
}
