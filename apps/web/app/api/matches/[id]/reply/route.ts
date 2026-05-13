import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'
import { redis } from '@/lib/redis'

const RATE_LIMIT = 20

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function secondsUntilMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return Math.ceil((midnight.getTime() - now.getTime()) / 1000)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plan = ((session.user.plan as string | undefined) ?? 'FREE') as PlanKey
  if (!PLAN_LIMITS[plan]?.aiReply) {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
  }

  const userId = session.user.id
  const rateKey = `lp:reply:${userId}:${utcDateKey()}`

  const count = await redis.incr(rateKey)
  if (count === 1) {
    // Set TTL only on first increment so it expires at midnight UTC
    await redis.expire(rateKey, secondsUntilMidnightUTC())
  }
  if (count > RATE_LIMIT) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 })
  }

  const match = await db.match.findUnique({
    where: { id: params.id },
    include: { keyword: { select: { userId: true } } },
  })

  if (!match || match.keyword.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json() as { productDescription?: string }
  const { productDescription } = body

  let resolvedDesc = productDescription?.trim() ?? null

  if (resolvedDesc) {
    await db.user.update({
      where: { id: userId },
      data: { productDescription: resolvedDesc },
    })
  } else {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { productDescription: true },
    })
    resolvedDesc = user?.productDescription ?? null
  }

  if (!resolvedDesc) {
    return NextResponse.json({ error: 'Product description required' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
  }

  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: 'claude-haiku-20250307',
    max_tokens: 256,
    system: `You are writing a human-reviewed reply draft for a Thailand nightlife travel community.
Write a genuine reply that helps the person first. Mention ThaiNight only if it is contextually useful, never as a hard sell.
Rules:
- Lead with practical Thailand nightlife advice, safety context, or planning help
- If mentioning ThaiNight, do it in the last sentence only and keep it optional
- Max 4 sentences total
- Sound like a real traveler or local helper, not a marketer
- No exclamation marks
- Never start with "Great question" or similar
- Do not make claims you cannot verify
- Do not post automatically; this is only a draft for a human to review`,
    messages: [
      {
        role: 'user',
        content: `Reddit post title: ${match.title}
Post content: ${match.snippet}
Site/context to mention only when appropriate: ${resolvedDesc}`,
      },
    ],
  })

  const draft =
    response.content[0]?.type === 'text' ? response.content[0].text.trim() : ''

  await db.match.update({
    where: { id: params.id },
    data: { aiReplyDraft: draft },
  })

  return NextResponse.json({ draft })
}
