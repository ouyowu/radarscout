import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'
import { effectivePlan } from '@/lib/admin'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keywords = await db.keyword.findMany({
    where: { userId: session.user.id },
    select: { id: true, text: true, enabled: true, dailyHits: true, createdAt: true, campaignId: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(keywords)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { text, campaignId } = await req.json()

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'Keyword text is required' }, { status: 400 })
  }
  if (text.trim().length > 100) {
    return NextResponse.json({ error: 'Keyword must be 100 characters or fewer' }, { status: 400 })
  }

  if (campaignId !== undefined && campaignId !== null) {
    if (typeof campaignId !== 'string') {
      return NextResponse.json({ error: 'Invalid campaignId' }, { status: 400 })
    }
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: { userId: true },
    })
    if (!campaign || campaign.userId !== session.user.id) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
  }

  const plan = effectivePlan(session.user.plan, session.user.email) as PlanKey
  const limit = PLAN_LIMITS[plan]?.keywords ?? 3
  const count = await db.keyword.count({ where: { userId: session.user.id } })
  if (count >= limit) {
    return NextResponse.json(
      { error: `${plan} plan allows ${limit} keywords. Upgrade to add more.` },
      { status: 429 },
    )
  }

  const keyword = await db.keyword.create({
    data: {
      userId: session.user.id,
      text: text.trim(),
      ...(campaignId ? { campaignId } : {}),
    },
    select: { id: true, text: true, enabled: true, campaignId: true },
  })

  return NextResponse.json(keyword, { status: 201 })
}
