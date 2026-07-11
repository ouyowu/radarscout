import { NextRequest, NextResponse } from 'next/server'
import { db } from '@reddit-monitor/db'
import { toReadOnlyBokunCatalogProduct, type BokunCatalogRecord } from '@/lib/bokunCatalog'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentsByProductIds } from '@/lib/reviewedEnrichmentReader'
import { resolveReviewedProductHandoff } from '@/lib/publicProducts/ownerManagedProductHandoffMappings'
import { isDatabaseProductPublishReady } from '@/lib/publicProducts/publicProductReviewGate'
import { pilotPartnerProducts } from '@/lib/partnerProducts/seed/pilotPartnerProducts'

export const dynamic = 'force-dynamic'

const PRODUCT_SOURCE = 'signed-bokun-supplier-products'
const INVENTORY_SCOPE = 'thailand-first'
const THAILAND_CITIES = [
  'Ayutthaya',
  'Bangkok',
  'Chiang Mai',
  'Koh Samui',
  'Krabi',
  'Pattaya',
  'Phuket',
]

const SCAN_BATCH_SIZE = 50
const SCAN_LIMIT = 500

type ProductMeta = {
  source: typeof PRODUCT_SOURCE
  inventoryScope: typeof INVENTORY_SCOPE
  bookingEnabled: false
  availabilityEnabled: false
  count: number
  resultCount: number
  destination: string
  tagSupported: false
  filters: {
    destination: string
    city: string | null
    hasPrice: boolean | null
    hasImage: boolean | null
    applied: ProductFilters
  }
}

type ProductFilters = {
  destination: string
  city: string | null
  hasPrice: boolean | null
  hasImage: boolean | null
}

type ProductWithImage = {
  product: BokunCatalogRecord & { bokunActivityId: string | null }
  imageUrl: string | null
}

function meta(count: number, filters: ProductFilters): ProductMeta {
  return {
    source: PRODUCT_SOURCE,
    inventoryScope: INVENTORY_SCOPE,
    bookingEnabled: false,
    availabilityEnabled: false,
    count,
    resultCount: count,
    destination: filters.destination,
    tagSupported: false,
    filters: {
      ...filters,
      applied: filters,
    },
  }
}

function parseTake(value: string | null): number {
  if (!value) return 12

  const take = Number(value)
  if (!Number.isFinite(take)) return 12

  return Math.min(Math.max(Math.floor(take), 1), 50)
}

function normalizeDestination(value: string | null): string {
  const destination = value?.trim().toLowerCase()

  return destination || 'thailand'
}

function normalizeCity(value: string | null): string | null {
  const city = value
    ?.trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')

  if (!city) return null

  return THAILAND_CITIES.find(thailandCity =>
    thailandCity.toLowerCase().replace(/\s+/g, '-') === city,
  ) ?? null
}

function parseBooleanFilter(value: string | null): boolean | null {
  if (value === 'true') return true
  if (value === 'false') return false

  return null
}

function reviewedSeedProducts(filters: ProductFilters) {
  return pilotPartnerProducts.flatMap(product => {
    if (filters.city && product.destination !== filters.city) return []
    if (filters.hasPrice === true) return []
    if (filters.hasImage === true && !product.imageUrl) return []
    if (filters.hasImage === false && product.imageUrl) return []

    return [{
      id: product.id,
      title: product.title,
      destination: product.destination,
      imageUrl: product.imageUrl ?? null,
      summary: product.shortSummary,
      retailPrice: null,
      currency: null,
      detailHref: `/tours/${encodeURIComponent(product.id)}`,
      supplierName: product.partnerName,
      tags: product.tags,
      bookingPartnerHandoff: {
        href: product.bookingWidgetUrl,
        label: 'Check availability' as const,
        rel: 'nofollow sponsored noopener noreferrer' as const,
        source: 'booking_partner_verified_public_widget' as const,
        verifiedBy: 'operator_manual_review' as const,
      },
    }]
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const take = parseTake(searchParams.get('take'))
  const destination = normalizeDestination(searchParams.get('destination'))
  const city = normalizeCity(searchParams.get('city'))
  const hasPrice = parseBooleanFilter(searchParams.get('hasPrice'))
  const hasImage = parseBooleanFilter(searchParams.get('hasImage'))
  const filters = { destination, city, hasPrice, hasImage }

  if (destination !== 'thailand') {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
    })
  }

  if (searchParams.get('city') && !city) {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
    })
  }

  try {
    const seedProducts = reviewedSeedProducts(filters).slice(0, take)
    const where = {
      active: true as const,
      supplierId: { not: null as null },
      city: city ?? { in: THAILAND_CITIES },
      ...(hasPrice === true ? { retailPrice: { not: null as null } } : {}),
      ...(hasPrice === false ? { retailPrice: null as null } : {}),
    }

    const collected: ProductWithImage[] = []
    let skip = 0

    while (collected.length < take && skip < SCAN_LIMIT) {
      const batch = await db.bokunProduct.findMany({
        where,
        orderBy: [{ city: 'asc' }, { title: 'asc' }, { id: 'asc' }],
        take: SCAN_BATCH_SIZE,
        skip,
        select: {
          id: true,
          bokunActivityId: true,
          title: true,
          description: true,
          excerpt: true,
          city: true,
          location: true,
          retailPrice: true,
          currency: true,
          rawJson: true,
          lastSyncedAt: true,
          supplier: {
            select: {
              title: true,
            },
          },
        },
      }) as Array<BokunCatalogRecord & { bokunActivityId: string | null }>

      if (batch.length === 0) break

      for (const product of batch) {
        if (collected.length >= take) break

        const imageUrl = toReadOnlyBokunCatalogProduct(product).imageUrl

        if (hasImage === true && !imageUrl) continue
        if (hasImage === false && imageUrl) continue

        const eligibility = evaluateThailandProductEligibility({
          title: product.title,
          city: product.city,
          location: product.location,
        })
        if (!eligibility.eligible) continue

        collected.push({ product, imageUrl })
      }

      skip += batch.length
      if (batch.length < SCAN_BATCH_SIZE) break
    }

    const enrichmentMap = await getReviewedEnrichmentsByProductIds(
      collected.map(({ product }) => product.id),
    )
    const databaseProducts = collected.flatMap(({ product, imageUrl }: ProductWithImage) => {
      const enrichment = enrichmentMap.get(product.id) ?? null
      const handoff = resolveReviewedProductHandoff({
        publicProductId: product.id,
        bokunActivityId: product.bokunActivityId,
      })

      if (!isDatabaseProductPublishReady({ enrichment, handoff })) return []

      return [{
        ...toReadOnlyBokunCatalogProduct(product),
        title: enrichment!.cleanedTitle,
        summary: enrichment!.shortSummary,
        imageUrl,
        tags: enrichment!.suggestedTags,
        bookingPartnerHandoff: handoff,
      }]
    })

    const products = [...seedProducts, ...databaseProducts]
      .filter((product, index, all) => all.findIndex(candidate => candidate.id === product.id) === index)
      .slice(0, take)

    return NextResponse.json({
      products,
      meta: meta(products.length, filters),
    })
  } catch {
    return NextResponse.json({
      products: [],
      meta: meta(0, filters),
      error: 'PRODUCTS_UNAVAILABLE',
    })
  }
}
