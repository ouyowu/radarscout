import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'

export const dynamic = 'force-dynamic'

function parseTake(value: string | null): number {
  if (!value) return 50

  const take = Number(value)
  if (!Number.isFinite(take)) return 50

  return Math.min(Math.max(Math.floor(take), 1), 100)
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function stripHtml(value: string | null): string | null {
  if (!value) return null

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findImageUrl(rawJson: unknown): string | null {
  const raw = asRecord(rawJson)
  const keyPhoto = asRecord(raw.keyPhoto)
  const derived = Array.isArray(keyPhoto.derived) ? keyPhoto.derived : []
  const large = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'large')
  const preview = derived
    .map(asRecord)
    .find(image => readString(image.name) === 'preview')

  return readString(large?.url) ??
    readString(large?.cleanUrl) ??
    readString(preview?.url) ??
    readString(preview?.cleanUrl) ??
    readString(keyPhoto.originalUrl)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')?.trim()
  const query = searchParams.get('q')?.trim()
  const includeInactive = searchParams.get('includeInactive') === 'true'
  const take = parseTake(searchParams.get('take'))

  const products = await db.bokunProduct.findMany({
    where: {
      ...(includeInactive ? {} : { active: true }),
      ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { excerpt: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: [{ city: 'asc' }, { title: 'asc' }],
    take,
    select: {
      id: true,
      bokunActivityId: true,
      title: true,
      excerpt: true,
      city: true,
      location: true,
      retailPrice: true,
      netSettlementPrice: true,
      currency: true,
      commissionPercent: true,
      active: true,
      lastSyncedAt: true,
      rawJson: true,
      supplier: {
        select: {
          bokunVendorId: true,
          title: true,
          status: true,
        },
      },
    },
  })

  return NextResponse.json({
    count: products.length,
    products: products.map(product => ({
      ...product,
      retailPrice: product.retailPrice?.toString() ?? null,
      netSettlementPrice: product.netSettlementPrice?.toString() ?? null,
      commissionPercent: product.commissionPercent?.toString() ?? null,
      imageUrl: findImageUrl(product.rawJson),
      summary: stripHtml(readString(asRecord(product.rawJson).summary)) ?? product.excerpt,
      rawJson: undefined,
    })),
  })
}
