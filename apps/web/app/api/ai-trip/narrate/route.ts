import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PARSER_PROMPT_LIMIT } from '@/lib/ai-trip/parse-intent'
import { runGatedItineraryPipeline } from '@/lib/ai-trip/gated-itinerary-pipeline'
import {
  buildNarrationUserMessage,
  createNarrationSanitizer,
  isNarrationEnabled,
  NARRATION_MAX_TOKENS,
  NARRATION_SYSTEM_PROMPT,
  resolveNarrationModel,
} from '@/lib/ai-trip/narration'
import { rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Streams display-only narrative text for a gated itinerary. The itinerary is
// rebuilt server-side through the same review-gated pipeline as /search —
// nothing from the client besides the trip idea prompt reaches the model, and
// the model output is sanitized before it reaches the browser.
export async function POST(request: NextRequest) {
  if (!isNarrationEnabled()) {
    return NextResponse.json({ narrationEnabled: false }, { status: 503 })
  }

  // Fail closed if the limiter is unavailable: this endpoint spends paid
  // model tokens on anonymous traffic. The timeout matters — with an
  // unreachable Redis, ioredis queues commands indefinitely instead of
  // rejecting, which would otherwise hang the request.
  try {
    const limited = await Promise.race([
      rateLimit(request, { key: 'ai-trip-narrate', max: 10, windowSeconds: 600 }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('rate limiter timeout')), 2000)
      }),
    ])
    if (limited) return limited
  } catch {
    return NextResponse.json({ narrationEnabled: false }, { status: 503 })
  }

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const payload = body && typeof body === 'object' && !Array.isArray(body)
    ? body as Record<string, unknown>
    : {}
  const rawPrompt = payload.prompt

  if (typeof rawPrompt !== 'string' || !rawPrompt.trim() || rawPrompt.trim().length > PARSER_PROMPT_LIMIT) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const result = await runGatedItineraryPipeline(rawPrompt.trim())

  if (result.status !== 'ok' || !result.itinerary) {
    return NextResponse.json({ error: 'no_itinerary' }, { status: 422 })
  }

  const itinerary = result.itinerary
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const model = resolveNarrationModel()
  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const sanitizer = createNarrationSanitizer()

      try {
        const messageStream = client.messages.stream({
          model,
          max_tokens: NARRATION_MAX_TOKENS,
          system: NARRATION_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildNarrationUserMessage(itinerary) }],
        })

        for await (const event of messageStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta' &&
            event.delta.text
          ) {
            const safeText = sanitizer.push(event.delta.text)
            if (safeText) controller.enqueue(encoder.encode(safeText))
          }
        }

        const rest = sanitizer.flush()
        if (rest) controller.enqueue(encoder.encode(rest))
        controller.close()
      } catch (error) {
        console.error('[ai-trip/narrate]', error instanceof Error ? error.message : 'stream error')
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  })
}
