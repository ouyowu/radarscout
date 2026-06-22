import { NextRequest, NextResponse } from 'next/server'
import { isAiItineraryDraftEnabled } from '@/lib/featureFlags'
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
import { buildItineraryDraftInput } from '@/lib/aiProducts/itineraryDraftInputBuilder'
import { MockItineraryDraftProvider } from '@/lib/aiProducts/itineraryDraftProvider'
import { validateItineraryDraftOutput } from '@/lib/aiProducts/itineraryDraftValidator'
import type { ItineraryDraft } from '@/lib/aiProducts/itineraryDraftSchema'

export const dynamic = 'force-dynamic'

const ITINERARY_TAKE = 6

const META = {
  itineraryGenerationEnabled: true,
  bookingEnabled: false,
  availabilityEnabled: false,
} as const

const META_DISABLED = {
  itineraryGenerationEnabled: false,
  bookingEnabled: false,
  availabilityEnabled: false,
} as const

export type ItineraryDraftStatus =
  | 'ok'
  | 'disabled'
  | 'invalid_request'
  | 'unsupported_destination'
  | 'no_match'
  | 'generation_failed'

export type ItineraryDraftResponse = {
  status: ItineraryDraftStatus
  intent?: {
    destination: string | null
    days: number | null
    interests: string[]
  }
  itinerary: ItineraryDraft | null
  products: AiProductContextItem[]
  meta: typeof META | typeof META_DISABLED
}

// Provider is injected for testability; defaults to mock until a real provider is enabled.
let _provider = new MockItineraryDraftProvider()

export function _setProviderForTest(p: { generate: (input: unknown) => Promise<unknown> }) {
  _provider = p as MockItineraryDraftProvider
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAiItineraryDraftEnabled()) {
    return NextResponse.json({
      status: 'disabled',
      itinerary: null,
      products: [],
      meta: META_DISABLED,
    } satisfies ItineraryDraftResponse)
  }

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { status: 'invalid_request', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
      { status: 400 },
    )
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { status: 'invalid_request', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
      { status: 400 },
    )
  }

  const payload = body as Record<string, unknown>
  const rawPrompt = payload.prompt

  if (typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return NextResponse.json(
      { status: 'invalid_request', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
      { status: 400 },
    )
  }

  const prompt = rawPrompt.trim()

  if (prompt.length > PARSER_PROMPT_LIMIT) {
    return NextResponse.json(
      { status: 'invalid_request', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
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
      itinerary: null,
      products: [],
      meta: META,
    } satisfies ItineraryDraftResponse)
  }

  try {
    // Re-derive products server-side. Never trust client-supplied product context.
    const city =
      parsed.intent.destination?.toLowerCase() !== 'thailand' && parsed.intent.destination
        ? parsed.intent.destination
        : undefined

    const candidates: AiProductCandidate[] = await listAiEligibleThailandProducts({
      city,
      search: parsed.intent.interests[0] ?? undefined,
      take: ITINERARY_TAKE,
    })

    const context = await buildAiProductContext(candidates)

    if (context.status === 'no_match') {
      return NextResponse.json({
        status: 'no_match',
        intent,
        itinerary: null,
        products: [],
        meta: META,
      } satisfies ItineraryDraftResponse)
    }

    const allowedProducts = new Map(context.items.map(p => [p.id, p]))

    const draftInput = buildItineraryDraftInput({
      intent: {
        destination: parsed.intent.destination,
        durationDays: parsed.intent.durationDays,
        interests: parsed.intent.interests,
      },
      products: context.items,
    })

    let rawOutput: unknown
    try {
      rawOutput = await _provider.generate(draftInput)
    } catch {
      return NextResponse.json(
        { status: 'generation_failed', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
        { status: 500 },
      )
    }

    const validation = validateItineraryDraftOutput({
      rawOutput,
      intent: {
        durationDays: draftInput.durationDays,
        destination: draftInput.destination,
      },
      allowedProducts,
    })

    if (!validation.ok) {
      return NextResponse.json(
        { status: 'generation_failed', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: 'ok',
      intent,
      itinerary: validation.draft,
      products: context.items,
      meta: META,
    } satisfies ItineraryDraftResponse)
  } catch (err) {
    if (err instanceof IneligibleProductInContextError) {
      return NextResponse.json(
        { status: 'generation_failed', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
        { status: 500 },
      )
    }
    return NextResponse.json(
      { status: 'generation_failed', itinerary: null, products: [], meta: META } satisfies ItineraryDraftResponse,
      { status: 500 },
    )
  }
}
