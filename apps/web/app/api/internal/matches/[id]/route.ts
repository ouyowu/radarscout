import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET
  return !!secret && request.headers.get('x-internal-secret') === secret
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { intentScore, aiSummary, painPoints, opportunityType, competitors } = body as {
    intentScore?: number | null
    aiSummary?: string | null
    painPoints?: string | null
    opportunityType?: string | null
    competitors?: string[]
  }

  try {
    await db.match.update({
      where: { id: params.id },
      data: {
        ...(intentScore !== undefined && { intentScore }),
        ...(aiSummary !== undefined && { aiSummary }),
        ...(painPoints !== undefined && { painPoints }),
        ...(opportunityType !== undefined && { opportunityType }),
        ...(competitors !== undefined && { competitors }),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
