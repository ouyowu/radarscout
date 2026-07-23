import 'server-only'
import { assertAllProductsThailandEligible } from './assertAllProductsThailandEligible'
import { isThailandCompatibleDestination } from './destinationIntent'
import type { AiProductCandidate } from './listAiEligibleThailandProducts'
import type { ProductRecommendationSignals } from '../ai-trip/recommendation-signals'

export type AiProductContextItem = {
  id: string
  title: string
  city: string | null
  summary: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  tags: string[]
  detailHref: string
  retailPrice: string | null
  currency: string | null
  priceFetchedAt?: string | null
  ctaHref?: string | null
  ctaLabel?: 'Check availability' | null
  ctaRel?: 'nofollow sponsored noopener noreferrer' | null
  externalHandoff?: boolean
  decisionSignals?: ProductRecommendationSignals
}

export type AiProductContextResult =
  | { status: 'ok'; items: AiProductContextItem[] }
  | { status: 'no_match' }

export type ModelFn = (items: AiProductContextItem[]) => Promise<unknown>

export type BuildAiProductContextOptions = {
  destination?: string | null
  modelFn?: ModelFn
}

function serializeCandidate(candidate: AiProductCandidate): AiProductContextItem {
  const item: AiProductContextItem = {
    id: candidate.id,
    title: candidate.cleanedTitle ?? candidate.title,
    city: candidate.city,
    summary: candidate.summary,
    ...(candidate.imageUrl ? { imageUrl: candidate.imageUrl } : {}),
    ...(candidate.imageAlt ? { imageAlt: candidate.imageAlt } : {}),
    tags: candidate.suggestedTags,
    detailHref: candidate.detailHref,
    retailPrice: candidate.retailPrice,
    currency: candidate.currency,
    ...(candidate.priceFetchedAt ? { priceFetchedAt: candidate.priceFetchedAt } : {}),
  }

  if (candidate.ctaHref) item.ctaHref = candidate.ctaHref
  if (candidate.ctaLabel) item.ctaLabel = candidate.ctaLabel
  if (candidate.ctaRel) item.ctaRel = candidate.ctaRel
  if (candidate.externalHandoff) item.externalHandoff = candidate.externalHandoff

  return item
}

export async function buildAiProductContext(
  candidates: AiProductCandidate[],
  options: BuildAiProductContextOptions = {},
): Promise<AiProductContextResult> {
  if (options.destination !== undefined) {
    if (!isThailandCompatibleDestination(options.destination)) {
      return { status: 'no_match' }
    }
  }

  // Throws in dev/test if any ineligible candidate reaches this point.
  // Filters silently in production.
  const eligible = assertAllProductsThailandEligible(candidates)

  if (eligible.length === 0) {
    return { status: 'no_match' }
  }

  const items = eligible.map(serializeCandidate)

  if (options.modelFn) {
    await options.modelFn(items)
  }

  return { status: 'ok', items }
}
