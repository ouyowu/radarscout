import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const routeSource = readFileSync(
  join(process.cwd(), 'app', 'api', 'ai-trip', 'narrate', 'route.ts'),
  'utf8',
)

describe('ai-trip narrate route safety', () => {
  it('requires an explicit feature flag in addition to model and limiter configuration', () => {
    expect(routeSource).toContain('isNarrationEnabled()')
    expect(routeSource).toContain('narrationEnabled: false')
    expect(routeSource).toContain('503')
  })

  it('rate limits anonymous traffic and fails closed if the limiter is down', () => {
    expect(routeSource).toContain("key: 'ai-trip-narrate'")
    expect(routeSource).toContain("scope: 'global'")
    expect(routeSource).toMatch(/catch\s*\{\s*\n?\s*return NextResponse\.json\(\{ narrationEnabled: false \}/)
  })

  it('rebuilds the itinerary through the shared gated pipeline server-side', () => {
    expect(routeSource).toContain('runGatedItineraryPipeline(')
    // The model must only ever see the gated itinerary, never raw client data
    // beyond the bounded trip idea prompt.
    expect(routeSource).toContain('buildNarrationUserMessage(itinerary)')
    expect(routeSource).toContain('PARSER_PROMPT_LIMIT')
  })

  it('sanitizes every streamed chunk before it reaches the browser', () => {
    expect(routeSource).toContain('createNarrationSanitizer()')
    expect(routeSource).toContain('sanitizer.push(')
    expect(routeSource).toContain('sanitizer.flush()')
  })

  it('streams as uncached plain text', () => {
    expect(routeSource).toContain("'Cache-Control': 'no-store'")
    expect(routeSource).toContain("'Content-Type': 'text/plain; charset=utf-8'")
  })

  it('cancels and times out the paid provider request with the browser request', () => {
    expect(routeSource).toContain('signal: request.signal')
    expect(routeSource).toContain('NARRATION_REQUEST_TIMEOUT_MS')
  })
})
