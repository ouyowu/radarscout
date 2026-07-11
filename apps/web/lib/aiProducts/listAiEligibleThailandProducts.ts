import 'server-only'
import { db } from '@reddit-monitor/db'
import { evaluateThailandProductEligibility } from '@/lib/productEligibility/thailandEligibility'
import { getReviewedEnrichmentsByProductIds } from '@/lib/reviewedEnrichmentReader'
import { resolveReviewedProductHandoff } from '@/lib/publicProducts/ownerManagedProductHandoffMappings'
import { isDatabaseProductPublishReady } from '@/lib/publicProducts/publicProductReviewGate'

const AI_SCAN_BATCH_SIZE = 50
const AI_SCAN_LIMIT = 500

export type AiProductCandidate = {
  id: string
  title: string
  cleanedTitle: string | null
  city: string | null
  location: string | null
  summary: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  suggestedTags: string[]
  detailHref: string
  retailPrice: string | null
  currency: string | null
  ctaHref?: string | null
  ctaLabel?: 'Check availability' | null
  ctaRel?: 'nofollow sponsored noopener noreferrer' | null
  externalHandoff?: boolean
}

export type ListAiEligibleOptions = {
  city?: string | null
  search?: string | null
  take?: number
}

type RawRow = {
  id: string
  title: string
  city: string | null
  location: string | null
  retailPrice: { toString(): string } | null
  currency: string | null
  bokunActivityId: string | null
}

export async function listAiEligibleThailandProducts(
  options: ListAiEligibleOptions = {},
): Promise<AiProductCandidate[]> {
  const effectiveTake = Math.min(options.take ?? AI_SCAN_LIMIT, AI_SCAN_LIMIT)
  const eligible: RawRow[] = []
  let skip = 0

  try {
    // Phase 1: collect eligible rows without fetching enrichment
    while (eligible.length < effectiveTake && skip < AI_SCAN_LIMIT) {
      const batch = await db.bokunProduct.findMany({
        where: {
          active: true,
          supplierId: { not: null },
          ...(options.city ? { city: options.city } : {}),
          ...(options.search
            ? { title: { contains: options.search, mode: 'insensitive' as const } }
            : {}),
        },
        orderBy: [{ city: 'asc' }, { title: 'asc' }, { id: 'asc' }],
        take: AI_SCAN_BATCH_SIZE,
        skip,
        select: {
          id: true,
          title: true,
          city: true,
          location: true,
          retailPrice: true,
          currency: true,
          bokunActivityId: true,
        },
      })

      if (batch.length === 0) break

      for (const product of batch) {
        if (eligible.length >= effectiveTake) break

        const eligibility = evaluateThailandProductEligibility({
          title: product.title,
          city: product.city,
          location: product.location,
        })

        if (eligibility.eligible) {
          eligible.push(product as RawRow)
        }
      }

      skip += batch.length
      if (batch.length < AI_SCAN_BATCH_SIZE) break
    }

    if (eligible.length === 0) return []

    // Phase 2: single batch enrichment query for all eligible IDs
    const eligibleIds = eligible.map(p => p.id)
    const enrichmentMap = await getReviewedEnrichmentsByProductIds(eligibleIds)

    // Phase 3: map enrichment to candidates
    return eligible.flatMap(product => {
      const enrichment = enrichmentMap.get(product.id) ?? null
      const handoff = resolveReviewedProductHandoff({
        publicProductId: product.id,
        bokunActivityId: product.bokunActivityId,
      })

      if (!isDatabaseProductPublishReady({ enrichment, handoff })) return []

      return [{
        id: product.id,
        title: product.title,
        cleanedTitle: enrichment!.cleanedTitle,
        city: product.city,
        location: product.location,
        summary: enrichment!.shortSummary,
        suggestedTags: enrichment!.suggestedTags,
        detailHref: `/tours/${encodeURIComponent(product.id)}`,
        retailPrice: product.retailPrice != null ? String(product.retailPrice) : null,
        currency: product.currency ?? null,
        ctaHref: handoff!.href,
        ctaLabel: handoff!.label,
        ctaRel: handoff!.rel,
        externalHandoff: true,
      }]
    })
  } catch {
    return []
  }
}
