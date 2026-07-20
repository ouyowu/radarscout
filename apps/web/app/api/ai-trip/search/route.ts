import { NextRequest, NextResponse } from 'next/server'
import { PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
import type { DayTripItinerary, DayTripSpec } from '@/lib/ai-trip/itinerary-contract'
import type { AiProductContextItem } from '@/lib/aiProducts/buildAiProductContext'
import { IneligibleProductInContextError } from '@/lib/aiProducts/assertAllProductsThailandEligible'
import { runGatedItineraryPipeline } from '@/lib/ai-trip/gated-itinerary-pipeline'
import { InvalidTripContextError } from '@/lib/ai-trip/trip-context'

export const dynamic = 'force-dynamic'

const NO_REVIEWED_HANDOFF_MESSAGE = 'No reviewed booking partner match is available for this trip idea yet.'

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

  try {
    const result = await runGatedItineraryPipeline(prompt, payload.tripContext)
    const intent = {
      destination: result.parsed.intent.destination,
      days: result.parsed.intent.durationDays,
      interests: result.parsed.intent.interests,
    }

    if (result.status === 'unsupported_destination') {
      return NextResponse.json({
        status: 'unsupported_destination',
        intent,
        products: [],
        message: 'RadarScout currently searches Thailand experiences only.',
        meta: META,
      } satisfies AiTripSearchResponse)
    }

    const destinationCategory =
      result.parsed.intent.destination?.toLowerCase() === 'thailand' || !result.parsed.intent.destination
        ? 'thailand-wide'
        : 'city-specific'
    const elapsedMs = Date.now() - startMs

    console.log('[ai-trip/search]', JSON.stringify({
      route: 'POST /api/ai-trip/search',
      destinationCategory,
      candidateCount: result.candidateCount,
      eligibleCount: result.candidateCount,
      resultCount: result.status === 'ok' ? result.handoffReadyProducts.length : 0,
      elapsedMs,
      fallbackUsed: result.fallbackUsed,
    }))

    if (result.status === 'no_match') {
      return NextResponse.json({
        status: 'no_match',
        intent,
        products: [],
        message: NO_REVIEWED_HANDOFF_MESSAGE,
        meta: META,
      } satisfies AiTripSearchResponse)
    }

    return NextResponse.json({
      status: 'ok',
      intent,
      products: result.handoffReadyProducts,
      ...(result.itinerary ? { tripSpec: result.itinerary.tripSpec, itinerary: result.itinerary } : {}),
      meta: META,
    } satisfies AiTripSearchResponse)
  } catch (err) {
    if (err instanceof InvalidTripContextError) {
      return NextResponse.json(
        { status: 'invalid_request', products: [], meta: META } satisfies AiTripSearchResponse,
        { status: 400 },
      )
    }

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
