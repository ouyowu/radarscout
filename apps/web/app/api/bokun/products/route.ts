import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { getReviewedEnrichmentsByProductIds } from '@/lib/reviewedEnrichmentReader'
import { resolveReviewedProductHandoff } from '@/lib/publicProducts/ownerManagedProductHandoffMappings'
import { isDatabaseProductPublishReady } from '@/lib/publicProducts/publicProductReviewGate'

export const dynamic = 'force-dynamic'

type CatalogSupplier = {
  title: string
} | null

type CatalogProduct = {
  id: string
  bokunActivityId: string | null
  title: string
  excerpt: string | null
  city: string | null
  location: string | null
  retailPrice: { toString(): string } | null
  currency: string | null
  active: boolean
  lastSyncedAt: Date | null
  rawJson: unknown
  supplier: CatalogSupplier
}

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

  try {
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
        currency: true,
        active: true,
        lastSyncedAt: true,
        rawJson: true,
        supplier: {
          select: {
            title: true,
          },
        },
      },
    }) as CatalogProduct[]

    const enrichmentMap = await getReviewedEnrichmentsByProductIds(products.map(product => product.id))
    const publishableProducts = products.flatMap(product => {
      const enrichment = enrichmentMap.get(product.id) ?? null
      const handoff = resolveReviewedProductHandoff({
        publicProductId: product.id,
        bokunActivityId: product.bokunActivityId,
      })

      if (!isDatabaseProductPublishReady({ enrichment, handoff })) return []

      return [{
        id: product.id,
        title: enrichment!.cleanedTitle,
        excerpt: enrichment!.shortSummary,
        city: product.city,
        location: product.location,
        retailPrice: product.retailPrice?.toString() ?? null,
        currency: product.currency,
        active: product.active,
        lastSyncedAt: product.lastSyncedAt,
        imageUrl: findImageUrl(product.rawJson),
        summary: enrichment!.shortSummary,
        supplier: product.supplier ? { title: product.supplier.title } : null,
        bookingPartnerHandoff: handoff,
      }]
    })

    return NextResponse.json({
      count: publishableProducts.length,
      products: publishableProducts,
    })
  } catch {
    return NextResponse.json({
      count: 0,
      products: [],
      warning: 'Product catalog is not connected yet.',
    })
  }
}
