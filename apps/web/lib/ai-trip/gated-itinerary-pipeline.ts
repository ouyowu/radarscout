import { parseTripIntent } from './parse-intent'
import { applyConfirmedTripContext } from './trip-context'
import { buildDayTripItinerary } from './day-trip-itinerary'
import type { DayTripItinerary } from './itinerary-contract'
import type { ParseTripIntentResult } from './intent-schema'
import { isThailandCompatibleDestination } from '@/lib/aiProducts/destinationIntent'
import type { AiProductCandidate } from '@/lib/aiProducts/listAiEligibleThailandProducts'
import {
  buildAiProductContext,
  type AiProductContextItem,
} from '@/lib/aiProducts/buildAiProductContext'
import {
  isReviewedViatorAffiliateUrl,
  listMatchingReviewedViatorProductCandidates,
} from '@/lib/viator/reviewedViatorMatching'
import {
  buildProductRecommendationSignals,
  extractTravelMonth,
} from './recommendation-signals'

// Shared guarded retrieval pipeline for AI-trip surfaces. Every consumer gets
// the same review gate: only reviewed products with a verified public booking
// partner handoff ever leave this module.

const DEFAULT_TAKE = 6
const MAX_TAKE = 12
const MAX_INTEREST_SEARCH_TERMS = 8
const PUBLIC_HANDOFF_REL = 'nofollow sponsored noopener noreferrer' as const

const INTEREST_SEARCH_ALIASES: Record<string, string[]> = {
  elephant: ['elephants'],
  elephants: ['elephant'],
  temple: ['temples'],
  temples: ['temple'],
  food: ['meal', 'meals', 'lunch', 'dinner', 'dining', 'cuisine', 'khan toke', 'cooking'],
  cooking: ['food', 'meal', 'lunch', 'dinner', 'dining', 'cuisine', 'khan toke'],
  nature: ['trail', 'trekking', 'forest'],
  beach: ['beaches', 'island', 'islands'],
  beaches: ['beach', 'island', 'islands'],
  canal: ['canals'],
  canals: ['canal'],
}

export type CandidateQueryResult = {
  candidates: AiProductCandidate[]
  fallbackUsed: boolean
}

export type GatedItineraryPipelineResult =
  | { status: 'unsupported_destination'; parsed: ParseTripIntentResult }
  | { status: 'no_match'; parsed: ParseTripIntentResult; fallbackUsed: boolean; candidateCount: number }
  | {
      status: 'ok'
      parsed: ParseTripIntentResult
      handoffReadyProducts: AiProductContextItem[]
      itinerary: DayTripItinerary | null
      fallbackUsed: boolean
      candidateCount: number
    }

export function isReviewedHandoffReadyProduct(product: AiProductContextItem): boolean {
  if (
    product.externalHandoff !== true ||
    product.ctaLabel !== 'Check availability' ||
    product.ctaRel !== PUBLIC_HANDOFF_REL ||
    !product.ctaHref
  ) {
    return false
  }

  try {
    const url = new URL(product.ctaHref)
    const isBokunWidget = url.protocol === 'https:' &&
      url.hostname === 'widgets.bokun.io' &&
      url.pathname.startsWith('/online-sales/')

    return isBokunWidget || isReviewedViatorAffiliateUrl(product.ctaHref)
  } catch {
    return false
  }
}

function isCityDestination(destination: string): boolean {
  return destination.toLowerCase() !== 'thailand'
}

function getInterestSearchTerms(interests: string[]): string[] {
  const terms: string[] = []
  const seen = new Set<string>()
  const termGroups: string[][] = []

  for (const interest of interests) {
    const normalized = interest.trim().toLowerCase()
    if (!normalized) continue

    const group: string[] = []
    for (const term of [normalized, ...(INTEREST_SEARCH_ALIASES[normalized] ?? [])]) {
      const normalizedTerm = term.trim().toLowerCase()
      if (!normalizedTerm || group.includes(normalizedTerm)) continue

      group.push(normalizedTerm)
    }

    if (group.length > 0) termGroups.push(group)
  }

  const maxGroupLength = Math.max(0, ...termGroups.map(group => group.length))

  for (let termIndex = 0; termIndex < maxGroupLength; termIndex += 1) {
    for (const group of termGroups) {
      const term = group[termIndex]
      if (!term || seen.has(term)) continue

      seen.add(term)
      terms.push(term)

      if (terms.length >= MAX_INTEREST_SEARCH_TERMS) return terms
    }
  }

  return terms
}

function mergeCandidateBuckets(
  buckets: AiProductCandidate[][],
  take: number,
): AiProductCandidate[] {
  const merged: AiProductCandidate[] = []
  const seen = new Set<string>()
  const cursors = buckets.map(() => 0)

  while (merged.length < take) {
    let addedThisRound = false

    for (let bucketIndex = 0; bucketIndex < buckets.length; bucketIndex += 1) {
      const bucket = buckets[bucketIndex]

      while (cursors[bucketIndex] < bucket.length) {
        const candidate = bucket[cursors[bucketIndex]]
        cursors[bucketIndex] += 1

        if (seen.has(candidate.id)) continue

        seen.add(candidate.id)
        merged.push(candidate)
        addedThisRound = true
        break
      }

      if (merged.length >= take) break
    }

    if (!addedThisRound) break
  }

  return merged
}

export async function queryEligibleCandidates(
  destination: string | null,
  interests: string[],
  take: number,
  promptSearch?: string | null,
): Promise<CandidateQueryResult> {
  const city = destination && isCityDestination(destination) ? destination : null
  const promptViatorMatches = promptSearch
    ? listMatchingReviewedViatorProductCandidates({ city, search: promptSearch, take })
    : []

  if (city) {
    return {
      candidates: promptViatorMatches,
      fallbackUsed: false,
    }
  }

  if (interests.length > 0) {
    const matchBuckets: AiProductCandidate[][] = []

    if (promptViatorMatches.length > 0) {
      matchBuckets.push(promptViatorMatches)
    }

    const termMatchBuckets = getInterestSearchTerms(interests).map(term =>
      listMatchingReviewedViatorProductCandidates({
        city,
        search: term,
        take,
      }),
    )

    matchBuckets.push(...termMatchBuckets.filter(matches => matches.length > 0))

    const interestMatches = mergeCandidateBuckets(matchBuckets, take)
    if (interestMatches.length > 0) {
      return { candidates: interestMatches, fallbackUsed: false }
    }

    const fallback = listMatchingReviewedViatorProductCandidates({ city, take })
    return {
      candidates: fallback,
      fallbackUsed: true,
    }
  }

  const fallback = listMatchingReviewedViatorProductCandidates({ city, take })
  return {
    candidates: fallback,
    fallbackUsed: false,
  }
}

export async function runGatedItineraryPipeline(
  prompt: string,
  confirmedTripContext?: unknown,
): Promise<GatedItineraryPipelineResult> {
  const parsed = parseTripIntent(prompt)
  applyConfirmedTripContext(parsed.intent, confirmedTripContext)

  if (!isThailandCompatibleDestination(parsed.intent.destination)) {
    return { status: 'unsupported_destination', parsed }
  }

  const { candidates, fallbackUsed } = await queryEligibleCandidates(
    parsed.intent.destination,
    parsed.intent.interests,
    Math.min(DEFAULT_TAKE, MAX_TAKE),
    parsed.intent.avoid.some(avoid => avoid.toLowerCase() === 'elephants') ? null : prompt,
  )

  const context = await buildAiProductContext(candidates)

  const recommendationContext = {
    destination: parsed.intent.destination,
    interests: parsed.intent.interests,
    travelerType: parsed.intent.travelerType,
    pace: parsed.intent.pace,
    month: extractTravelMonth(prompt),
  }
  const handoffReadyProducts = context.status === 'ok'
    ? context.items
        .filter(isReviewedHandoffReadyProduct)
        .map(product => ({
          ...product,
          decisionSignals: buildProductRecommendationSignals(product, recommendationContext),
        }))
    : []

  if (context.status === 'no_match' || handoffReadyProducts.length === 0) {
    return { status: 'no_match', parsed, fallbackUsed, candidateCount: candidates.length }
  }

  const itinerary = parsed.intent.destination && parsed.intent.durationDays
    ? buildDayTripItinerary({
        destination: parsed.intent.destination,
        durationDays: parsed.intent.durationDays,
        interests: parsed.intent.interests,
        pace: parsed.intent.pace,
        travelerType: parsed.intent.travelerType,
        groupSize: parsed.intent.groupSize,
      }, handoffReadyProducts)
    : null

  return {
    status: 'ok',
    parsed,
    handoffReadyProducts,
    itinerary,
    fallbackUsed,
    candidateCount: candidates.length,
  }
}
