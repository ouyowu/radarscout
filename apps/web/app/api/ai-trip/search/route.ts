import { NextRequest, NextResponse } from 'next/server'
import { parseTripIntent, PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
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

export const dynamic = 'force-dynamic'

const DEFAULT_TAKE = 6
const MAX_TAKE = 12
const MAX_INTEREST_SEARCH_TERMS = 8

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
  itineraryGenerationEnabled: false,
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
  message?: string
  meta: AiTripSearchMeta
}

type CandidateQueryResult = {
  candidates: AiProductCandidate[]
  fallbackUsed: boolean
}

function isCityDestination(destination: string): boolean {
  return destination.toLowerCase() !== 'thailand'
}

function getInterestSearchTerms(interests: string[]): string[] {
  const terms: string[] = []
  const seen = new Set<string>()

  for (const interest of interests) {
    const normalized = interest.trim().toLowerCase()
    if (!normalized) continue

    for (const term of [normalized, ...(INTEREST_SEARCH_ALIASES[normalized] ?? [])]) {
      const normalizedTerm = term.trim().toLowerCase()
      if (!normalizedTerm || seen.has(normalizedTerm)) continue

      seen.add(normalizedTerm)
      terms.push(normalizedTerm)

      if (terms.length >= MAX_INTEREST_SEARCH_TERMS) return terms
    }
  }

  return terms
}

async function queryEligibleCandidates(
  destination: string | null,
  interests: string[],
  take: number,
): Promise<CandidateQueryResult> {
  const city = destination && isCityDestination(destination) ? destination : null

  if (interests.length > 0) {
    const byId = new Map<string, AiProductCandidate>()

    for (const term of getInterestSearchTerms(interests)) {
      const matches = await listAiEligibleThailandProducts({
        city: city ?? undefined,
        search: term,
        take,
      })

      for (const candidate of matches) {
        if (!byId.has(candidate.id)) byId.set(candidate.id, candidate)
        if (byId.size >= take) break
      }

      if (byId.size >= take) break
    }

    const interestMatches = Array.from(byId.values()).slice(0, take)
    if (interestMatches.length > 0) {
      return { candidates: interestMatches, fallbackUsed: false }
    }

    const fallback = await listAiEligibleThailandProducts({ city: city ?? undefined, take })
    return { candidates: fallback, fallbackUsed: true }
  }

  const fallback = await listAiEligibleThailandProducts({ city: city ?? undefined, take })
  return { candidates: fallback, fallbackUsed: false }
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
    )

    const context = await buildAiProductContext(candidates)

    const elapsedMs = Date.now() - startMs

    console.log('[ai-trip/search]', JSON.stringify({
      route: 'POST /api/ai-trip/search',
      destinationCategory,
      candidateCount: candidates.length,
      eligibleCount: candidates.length,
      resultCount: context.status === 'ok' ? context.items.length : 0,
      elapsedMs,
      fallbackUsed,
    }))

    if (context.status === 'no_match') {
      return NextResponse.json({
        status: 'no_match',
        intent,
        products: [],
        meta: META,
      } satisfies AiTripSearchResponse)
    }

    return NextResponse.json({
      status: 'ok',
      intent,
      products: context.items,
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
