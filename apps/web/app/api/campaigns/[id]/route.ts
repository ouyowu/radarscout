import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

const VALID_STATUSES = ['active', 'paused'] as const

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      industry: true,
      targetCustomer: true,
      status: true,
      createdAt: true,
      keywords: {
        select: { id: true, text: true, enabled: true, dailyHits: true },
        orderBy: { createdAt: 'asc' },
      },
      competitors: {
        select: { id: true, name: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!campaign || campaign.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { userId: _, ...rest } = campaign
  return NextResponse.json(rest)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await db.campaign.findUnique({
    where: { id: params.id },
    select: { userId: true },
  })

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await req.json()
  const { name, description, industry, targetCustomer, status } = body as {
    name?: unknown
    description?: unknown
    industry?: unknown
    targetCustomer?: unknown
    status?: unknown
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Campaign name must be a non-empty string' }, { status: 400 })
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Campaign name must be 100 characters or fewer' }, { status: 400 })
    }
  }

  if (status !== undefined && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json(
      { error: `Status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    )
  }

  const updated = await db.campaign.update({
    where: { id: params.id },
    data: {
      ...(typeof name === 'string' && { name: name.trim() }),
      ...(description !== undefined && { description: typeof description === 'string' ? description.trim() || null : null }),
      ...(industry !== undefined && { industry: typeof industry === 'string' ? industry.trim() || null : null }),
      ...(targetCustomer !== undefined && { targetCustomer: typeof targetCustomer === 'string' ? targetCustomer.trim() || null : null }),
      ...(status !== undefined && { status: status as string }),
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

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await db.campaign.deleteMany({
    where: { id: params.id, userId: session.user.id },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
