import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; competitorId: string } },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the parent campaign belongs to this user before deleting
  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    select: { userId: true },
  })

  if (!campaign || campaign.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = await db.competitor.deleteMany({
    where: { id: params.competitorId, campaignId: params.id },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
