import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    select: { userId: true },
  })

  if (!campaign || campaign.userId !== session.user.id) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const body = await req.json()
  const { name } = body as { name?: unknown }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Competitor name is required' }, { status: 400 })
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: 'Competitor name must be 100 characters or fewer' }, { status: 400 })
  }

  const competitor = await db.competitor.create({
    data: { campaignId: params.id, name: name.trim() },
    select: { id: true, name: true, createdAt: true },
  })

  return NextResponse.json(competitor, { status: 201 })
}
