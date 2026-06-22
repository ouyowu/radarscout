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

async function queryEligibleCandidates(
  destination: string | null,
  interests: string[],
  take: number,
): Promise<CandidateQueryResult> {
  const city = destination && isCityDestination(destination) ? destination : null

  // Primary: with interest keyword search if interests present
  if (interests.length > 0) {
    const primary = await listAiEligibleThailandProducts({
      city: city ?? undefined,
      search: interests[0],
      take,
    })
    if (primary.length > 0) return { candidates: primary, fallbackUsed: false }
  }

  // Fallback: destination-only (no interest filter).
  // fallbackUsed is true only when interests were present but primary miss occurred.
  const fallback = await listAiEligibleThailandProducts({ city: city ?? undefined, take })
  return { candidates: fallback, fallbackUsed: interests.length > 0 }
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
