import { NextRequest, NextResponse } from 'next/server'
import { parseTripIntent, PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
import { buildDayTripItinerary } from '@/lib/ai-trip/day-trip-itinerary'
import type { DayTripItinerary, DayTripSpec } from '@/lib/ai-trip/itinerary-contract'
import { isThailandCompatibleDestination } from '@/lib/aiProducts/destinationIntent'
import {
  listAiEligibleThailandProducts,
  type AiProductCandidate,
} from '@/lib/aiProducts/listAiEligibleThailandProducts'
import {
  buildAiProductContext,
  type AiProductContextItem,
} from '@/lib/aiProducts/buildAiProductContext'
import { IneligibleProductInContextError } from '@/lib/aiProducts/assertAllProductsThailandEligible'
import { listMatchingPartnerProductCandidates } from '@/lib/partnerProducts/matching'

export const dynamic = 'force-dynamic'

const DEFAULT_TAKE = 6
const MAX_TAKE = 12
const MAX_INTEREST_SEARCH_TERMS = 8
const PUBLIC_HANDOFF_REL = 'nofollow sponsored noopener noreferrer' as const
const NO_REVIEWED_HANDOFF_MESSAGE = 'No reviewed booking partner match is available for this trip idea yet.'

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

const META = {
  productRetrievalEnabled: true,
  itineraryGenerationEnabled: true,
  bookingEnabled: false,
  availabilityEnabled: false,
} as const

export type AiTripSearchMeta = typeof META

export type AiTripSearchResponse = {
  status: 'ok' | 'no_match' | 'unsupported_destination' | 'invalid_request' | 'error'
  intent?: {
    destination: string | null
    days: number | null
    interests: string[]
  }
  products: AiProductContextItem[]
  tripSpec?: DayTripSpec
  itinerary?: DayTripItinerary
  message?: string
  meta: AiTripSearchMeta
}

type CandidateQueryResult = {
  candidates: AiProductCandidate[]
  fallbackUsed: boolean
}

function isReviewedHandoffReadyProduct(product: AiProductContextItem): boolean {
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
    return url.protocol === 'https:' &&
      url.hostname === 'widgets.bokun.io' &&
      url.pathname.startsWith('/online-sales/')
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

async function queryEligibleCandidates(
  destination: string | null,
  interests: string[],
  take: number,
  promptSearch?: string | null,
): Promise<CandidateQueryResult> {
  const city = destination && isCityDestination(destination) ? destination : null
  const promptPartnerMatches = promptSearch
    ? listMatchingPartnerProductCandidates({ city, search: promptSearch, take })
    : []

  if (city) {
    return { candidates: promptPartnerMatches, fallbackUsed: false }
  }

  if (interests.length > 0) {
    const matchBuckets: AiProductCandidate[][] = []

    if (promptPartnerMatches.length > 0) matchBuckets.push(promptPartnerMatches)

    const termMatchBuckets = await Promise.all(getInterestSearchTerms(interests).map(async term => {
      const matches = await listAiEligibleThailandProducts({
        city: city ?? undefined,
        search: term,
        take,
      })
      const partnerMatches = listMatchingPartnerProductCandidates({
        city,
        search: term,
        take,
      })
      const combinedMatches = [...matches, ...partnerMatches]

      return combinedMatches
    }))

    matchBuckets.push(...termMatchBuckets.filter(matches => matches.length > 0))

    const interestMatches = mergeCandidateBuckets(matchBuckets, take)
    if (interestMatches.length > 0) {
      return { candidates: interestMatches, fallbackUsed: false }
    }

    const fallback = await listAiEligibleThailandProducts({ city: city ?? undefined, take })
    const partnerFallback = listMatchingPartnerProductCandidates({ city, take })
    return { candidates: mergeCandidateBuckets([[...fallback, ...partnerFallback]], take), fallbackUsed: true }
  }

  const fallback = await listAiEligibleThailandProducts({ city: city ?? undefined, take })
  const partnerFallback = listMatchingPartnerProductCandidates({ city, take })
  return { candidates: mergeCandidateBuckets([[...fallback, ...partnerFallback]], take), fallbackUsed: false }
}

export async function POST(request: NextRequest) {
  const startMs = Date.now()
  let body: unknown = {}

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        status: 'invalid_request',
        products: [],
        meta: META,
      } satisfies AiTripSearchResponse,
      { status: 400 },
    )
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { status: 'invalid_request', products: [], meta: META } satisfies AiTripSearchResponse,
      { status: 400 },
    )
  }

  const payload = body as Record<string, unknown>
  const rawPrompt = payload.prompt

  if (typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return NextResponse.json(
      { status: 'invalid_request', products: [], meta: META } satisfies AiTripSearchResponse,
      { status: 400 },
    )
  }

  const prompt = rawPrompt.trim()

  if (prompt.length > PARSER_PROMPT_LIMIT) {
    return NextResponse.json(
      { status: 'invalid_request', products: [], meta: META } satisfies AiTripSearchResponse,
      { status: 400 },
    )
  }

  const parsed = parseTripIntent(prompt)
  const intent = {
    destination: parsed.intent.destination,
    days: parsed.intent.durationDays,
    interests: parsed.intent.interests,
  }

  if (!isThailandCompatibleDestination(parsed.intent.destination)) {
    return NextResponse.json({
      status: 'unsupported_destination',
      intent,
      products: [],
      message: 'RadarScout currently searches Thailand experiences only.',
      meta: META,
    } satisfies AiTripSearchResponse)
  }

  try {
    const destinationCategory =
      parsed.intent.destination?.toLowerCase() === 'thailand' || !parsed.intent.destination
        ? 'thailand-wide'
        : 'city-specific'

    const { candidates, fallbackUsed } = await queryEligibleCandidates(
      parsed.intent.destination,
      parsed.intent.interests,
      Math.min(DEFAULT_TAKE, MAX_TAKE),
      parsed.intent.avoid.some(avoid => avoid.toLowerCase() === 'elephants') ? null : prompt,
    )

    const context = await buildAiProductContext(candidates)

    const handoffReadyProducts = context.status === 'ok'
      ? context.items.filter(isReviewedHandoffReadyProduct)
      : []
    const elapsedMs = Date.now() - startMs

    console.log('[ai-trip/search]', JSON.stringify({
      route: 'POST /api/ai-trip/search',
      destinationCategory,
      candidateCount: candidates.length,
      eligibleCount: candidates.length,
      resultCount: handoffReadyProducts.length,
      elapsedMs,
      fallbackUsed,
    }))

    if (context.status === 'no_match' || handoffReadyProducts.length === 0) {
      return NextResponse.json({
        status: 'no_match',
        intent,
        products: [],
        message: NO_REVIEWED_HANDOFF_MESSAGE,
        meta: META,
      } satisfies AiTripSearchResponse)
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

    return NextResponse.json({
      status: 'ok',
      intent,
      products: handoffReadyProducts,
      ...(itinerary ? { tripSpec: itinerary.tripSpec, itinerary } : {}),
      meta: META,
    } satisfies AiTripSearchResponse)
  } catch (err) {
    if (err instanceof IneligibleProductInContextError) {
      return NextResponse.json(
        { status: 'error', products: [], meta: META } satisfies AiTripSearchResponse,
        { status: 500 },
      )
    }

    return NextResponse.json(
      { status: 'error', products: [], meta: META } satisfies AiTripSearchResponse,
      { status: 500 },
    )
  }
}
