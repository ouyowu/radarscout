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
    select: { id: true, text: true, flags: true, user: { select: { plan: true } } },
  })

  // Group enabled keywords by subreddit for the crawler
  const subredditMap = new Map<string, Array<{ id: string; text: string; userPlan: string }>>()
  for (const kw of keywords) {
    const subreddit = (kw.flags as { subreddit?: string }).subreddit
    if (!subreddit) continue
    const group = subredditMap.get(subreddit) ?? []
    group.push({ id: kw.id, text: kw.text, userPlan: kw.user.plan })
    subredditMap.set(subreddit, group)
  }

  const monitors = [...subredditMap.entries()].map(([subreddit, kwList]) => ({
    id: subreddit,
    subreddit,
    keywords: kwList,
  }))

  return NextResponse.json(monitors)
}
