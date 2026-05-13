import { NextRequest, NextResponse } from 'next/server'
import { db, Prisma } from '@reddit-monitor/db'
import { sendThaiNightWebhookIfNeeded } from '@/lib/thainightWebhook'

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
  const {
    intentScore,
    aiSummary,
    painPoints,
    opportunityType,
    competitors,
    location,
    contentCategory,
    travelIntentScore,
    credibilityScore,
    commercialScore,
    sourceMeta,
  } = body as {
    intentScore?: number | null
    aiSummary?: string | null
    painPoints?: string | null
    opportunityType?: string | null
    competitors?: string[]
    location?: string | null
    contentCategory?: string | null
    travelIntentScore?: number | null
    credibilityScore?: number | null
    commercialScore?: number | null
    sourceMeta?: Record<string, unknown>
  }

  try {
    const match = await db.match.update({
      where: { id: params.id },
      data: {
        ...(intentScore !== undefined && { intentScore }),
        ...(aiSummary !== undefined && { aiSummary }),
        ...(painPoints !== undefined && { painPoints }),
        ...(opportunityType !== undefined && { opportunityType }),
        ...(competitors !== undefined && { competitors }),
        ...(location !== undefined && { location }),
        ...(contentCategory !== undefined && { contentCategory }),
        ...(travelIntentScore !== undefined && { travelIntentScore }),
        ...(credibilityScore !== undefined && { credibilityScore }),
        ...(commercialScore !== undefined && { commercialScore }),
        ...(sourceMeta !== undefined && { sourceMeta: sourceMeta as Prisma.InputJsonValue }),
      },
      include: {
        keyword: { select: { text: true, flags: true } },
      },
    })

    sendThaiNightWebhookIfNeeded(match).catch(err =>
      console.error('[matches] thainight webhook error:', err),
    )
  } catch {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
