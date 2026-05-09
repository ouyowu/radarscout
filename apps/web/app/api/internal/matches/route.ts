import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { sendMatchAlert } from '@reddit-monitor/mailer'

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET
  return !!secret && request.headers.get('x-internal-secret') === secret
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { keywordId, platform, postId, title, url, snippet } = body as {
    keywordId?: string
    platform?: string
    postId?: string
    title?: string
    url?: string
    snippet?: string
  }

  if (!keywordId || !platform || !postId || !title || !url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (platform !== 'REDDIT' && platform !== 'HN') {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  const match = await db.match.create({
    data: { keywordId, platform, postId, title, url, snippet: snippet ?? '' },
  })

  // Fire-and-forget: send email alert + record notification
  sendEmailAndNotify({ keywordId, title, url, snippet: snippet ?? '' }).catch(err =>
    console.error('[matches] post-create error:', err),
  )

  return NextResponse.json({ id: match.id }, { status: 201 })
}

async function sendEmailAndNotify({
  keywordId,
  title,
  url,
  snippet,
}: {
  keywordId: string
  title: string
  url: string
  snippet: string
}) {
  const keyword = await db.keyword.findUnique({
    where: { id: keywordId },
    include: { user: true },
  })

  if (!keyword?.user?.email) return

  const subreddit = (keyword.flags as { subreddit?: string }).subreddit ?? ''

  await sendMatchAlert({
    to: keyword.user.email,
    keyword: keyword.text,
    subreddit,
    postTitle: title,
    postUrl: url,
    snippet,
  })

  await db.notification.create({
    data: { userId: keyword.user.id, matchCount: 1 },
  })
}
