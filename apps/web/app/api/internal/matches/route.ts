import { NextRequest, NextResponse } from 'next/server'
import { db, Platform } from '@reddit-monitor/db'
import { sendMatchDigest } from '@reddit-monitor/mailer'
import { sendThaiNightWebhookIfNeeded } from '@/lib/thainightWebhook'
import { isAdminEmail } from '@/lib/admin'

const BATCH_WINDOW_MS = 60_000

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET
  return !!secret && request.headers.get('x-internal-secret') === secret
}

function makeUnsubscribeUrl(userId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const token = Buffer.from(userId).toString('base64url')
  return `${base}/api/unsubscribe?token=${token}`
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    keywordId,
    platform,
    postId,
    title,
    url,
    snippet,
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
    keywordId?: string
    platform?: string
    postId?: string
    title?: string
    url?: string
    snippet?: string
    painPoints?: string
    opportunityType?: string
    competitors?: string[]
    location?: string
    contentCategory?: string
    travelIntentScore?: number
    credibilityScore?: number
    commercialScore?: number
    sourceMeta?: Record<string, unknown>
  }

  if (!keywordId || !platform || !postId || !title || !url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!Object.values(Platform).includes(platform as Platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  const match = await db.match.create({
    data: {
      keywordId,
      platform: platform as Platform,
      postId,
      title,
      url,
      snippet: snippet ?? '',
      ...(painPoints !== undefined && { painPoints }),
      ...(opportunityType !== undefined && { opportunityType }),
      ...(competitors !== undefined && { competitors }),
      ...(location !== undefined && { location }),
      ...(contentCategory !== undefined && { contentCategory }),
      ...(travelIntentScore !== undefined && { travelIntentScore }),
      ...(credibilityScore !== undefined && { credibilityScore }),
      ...(commercialScore !== undefined && { commercialScore }),
      ...(sourceMeta !== undefined && { sourceMeta: sourceMeta as any }),
    },
    include: {
      keyword: { select: { text: true, flags: true } },
    },
  })

  sendThaiNightWebhookIfNeeded(match).catch(err =>
    console.error('[matches] thainight webhook error:', err),
  )

  // Fire-and-forget: batch notifications per user over a 60-second window
  sendEmailIfDue(keywordId).catch(err =>
    console.error('[matches] notification error:', err),
  )

  return NextResponse.json({ id: match.id }, { status: 201 })
}

async function sendEmailIfDue(keywordId: string): Promise<void> {
  const keyword = await db.keyword.findUnique({
    where: { id: keywordId },
    include: { user: true },
  })
  if (!keyword?.user?.email) return
  if (!keyword.user.emailEnabled) return
  if (isAdminEmail(keyword.user.email)) return

  const userId = keyword.user.id
  const windowStart = new Date(Date.now() - BATCH_WINDOW_MS)

  // If a notification was already sent within the batch window, skip —
  // the new match is saved in DB and will appear in the next digest.
  const recent = await db.notification.findFirst({
    where: { userId, deliveredAt: { gte: windowStart } },
  })
  if (recent) return

  // Collect all matches since the previous notification (or beginning of time)
  const prev = await db.notification.findFirst({
    where: { userId },
    orderBy: { deliveredAt: 'desc' },
  })
  const since = prev?.deliveredAt ?? new Date(0)

  const pending = await db.match.findMany({
    where: { matchedAt: { gt: since }, keyword: { userId } },
    include: { keyword: true },
    orderBy: { matchedAt: 'asc' },
  })
  if (pending.length === 0) return

  await sendMatchDigest({
    to: keyword.user.email,
    unsubscribeUrl: makeUnsubscribeUrl(userId),
    matches: pending.map(m => ({
      keyword: m.keyword.text,
      subreddit: (m.keyword.flags as { subreddit?: string }).subreddit ?? '',
      postTitle: m.title,
      postUrl: m.url,
      snippet: m.snippet,
    })),
  })

  await db.notification.create({
    data: { userId, matchCount: pending.length },
  })
}
