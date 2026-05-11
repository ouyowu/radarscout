import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaigns = await db.campaign.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      industry: true,
      targetCustomer: true,
      status: true,
      createdAt: true,
      _count: { select: { keywords: true, competitors: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, industry, targetCustomer } = body as {
    name?: unknown
    description?: unknown
    industry?: unknown
    targetCustomer?: unknown
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 })
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: 'Campaign name must be 100 characters or fewer' }, { status: 400 })
  }

  const plan = (session.user.plan ?? 'FREE') as PlanKey
  const limit = PLAN_LIMITS[plan]?.campaigns ?? 1
  const count = await db.campaign.count({ where: { userId: session.user.id } })
  if (count >= limit) {
    return NextResponse.json(
      { error: `${plan} plan allows ${limit} campaign${limit === 1 ? '' : 's'}. Upgrade to add more.` },
      { status: 429 },
    )
  }

  const campaign = await db.campaign.create({
    data: {
      userId: session.user.id,
      name: name.trim(),
      ...(typeof description === 'string' && description.trim() && { description: description.trim() }),
      ...(typeof industry === 'string' && industry.trim() && { industry: industry.trim() }),
      ...(typeof targetCustomer === 'string' && targetCustomer.trim() && { targetCustomer: targetCustomer.trim() }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      industry: true,
      targetCustomer: true,
      status: true,
      createdAt: true,
    },
  })

  return NextResponse.json(campaign, { status: 201 })
}
