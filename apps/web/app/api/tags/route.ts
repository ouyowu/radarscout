import { NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tags = await db.productTag.groupBy({
    by: ['tagName'],
    where: {
      active: true,
      product: {
        active: true,
      },
    },
    _count: {
      tagName: true,
    },
    orderBy: {
      _count: {
        tagName: 'desc',
      },
    },
  })

  return NextResponse.json({
    tags: tags.map(tag => ({
      tag: tag.tagName,
      count: tag._count.tagName,
    })),
  })
}
