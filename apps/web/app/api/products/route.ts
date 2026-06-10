import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { productView } from '@/lib/bokunProductView'

export const dynamic = 'force-dynamic'

function parseTake(value: string | null): number {
  if (!value) return 12

  const take = Number(value)
  if (!Number.isFinite(take)) return 12

  return Math.min(Math.max(Math.floor(take), 1), 100)
}

function parseSkip(value: string | null): number {
  if (!value) return 0

  const skip = Number(value)
  if (!Number.isFinite(skip)) return 0

  return Math.max(Math.floor(skip), 0)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')?.trim()
  const take = parseTake(searchParams.get('take'))
  const skip = parseSkip(searchParams.get('skip'))

  if (!tag) {
    return NextResponse.json(
      { error: 'tag query parameter is required' },
      { status: 400 }
    )
  }

  const where = {
    active: true,
    tagName: {
      equals: tag,
      mode: 'insensitive' as const,
    },
    product: {
      active: true,
    },
  }

  const [total, rows] = await Promise.all([
    db.productTag.count({ where }),
    db.productTag.findMany({
      where,
      orderBy: [
        { score: 'desc' },
        { lastSeenAt: 'desc' },
      ],
      skip,
      take,
      include: {
        product: {
          select: {
            id: true,
            bokunActivityId: true,
            title: true,
            excerpt: true,
            description: true,
            city: true,
            location: true,
            retailPrice: true,
            currency: true,
            active: true,
            rawJson: true,
          },
        },
      },
    }),
  ])

  return NextResponse.json({
    tag,
    total,
    count: rows.length,
    skip,
    take,
    hasMore: skip + rows.length < total,
    products: rows.map((row) => {
      const view = productView(row.product.rawJson, row.product.description, row.product.excerpt)

      return {
        id: row.product.id,
        bokunActivityId: row.product.bokunActivityId,
        title: row.product.title,
        city: row.product.city,
        location: row.product.location,
        retailPrice: row.product.retailPrice?.toString() ?? null,
        currency: row.product.currency,
        imageUrl: view.imageUrl,
        summary: view.summary ?? row.product.excerpt,
        tagScore: row.score.toString(),
      }
    }),
  })
}
