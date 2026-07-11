import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { DayTripItinerary } from './itinerary-contract'
import {
  buildNarrationUserMessage,
  buildNarrationUserPayload,
  createNarrationSanitizer,
  DEFAULT_NARRATION_MODEL,
  isNarrationEnabled,
  NARRATION_SYSTEM_PROMPT,
  resolveNarrationModel,
} from './narration'

const itinerary: DayTripItinerary = {
  version: 1,
  tripSpec: {
    destination: 'Chiang Mai',
    durationDays: 2,
    interests: ['elephants', 'food'],
    pace: 'relaxed',
    travelerType: 'family',
    groupSize: 3,
    contentScope: 'day_tours_only',
  },
  days: [
    {
      dayNumber: 1,
      experience: {
        productId: 'partner_cm_1',
        title: 'Morning Elephant Sanctuary',
        city: 'Chiang Mai',
        summary: 'A gentle morning sanctuary plan.',
        imageUrl: 'https://imgcdn.example/one.jpg',
        imageAlt: 'Elephants',
        tags: ['Elephants', 'Morning'],
        detailHref: '/tours/partner_cm_1',
        handoff: {
          label: 'Check availability',
          href: 'https://widgets.bokun.io/online-sales/abc/experience/1',
          rel: 'nofollow sponsored noopener noreferrer',
        },
      },
    },
  ],
  unfilledDayCount: 1,
  safety: {
    availabilityChecked: false,
    bookingCompleted: false,
    paymentHandled: false,
  },
}

describe('narration feature flag and model', () => {
  const originalKey = process.env.ANTHROPIC_API_KEY
  const originalModel = process.env.AI_TRIP_NARRATION_MODEL

  beforeEach(() => {
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.AI_TRIP_NARRATION_MODEL
  })

  afterEach(() => {
    if (originalKey === undefined) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = originalKey
    if (originalModel === undefined) delete process.env.AI_TRIP_NARRATION_MODEL
    else process.env.AI_TRIP_NARRATION_MODEL = originalModel
  })

  it('is disabled without a model key and enabled with one', () => {
    expect(isNarrationEnabled()).toBe(false)
    process.env.ANTHROPIC_API_KEY = 'test-key'
    expect(isNarrationEnabled()).toBe(true)
  })

  it('falls back to the default model and honors the env override', () => {
    expect(resolveNarrationModel()).toBe(DEFAULT_NARRATION_MODEL)
    process.env.AI_TRIP_NARRATION_MODEL = 'claude-custom'
    expect(resolveNarrationModel()).toBe('claude-custom')
  })
})

describe('narration model input', () => {
  it('exposes only gated itinerary fields to the model', () => {
    const payload = buildNarrationUserPayload(itinerary)

    expect(payload.days).toHaveLength(1)
    expect(payload.days[0]).toEqual({
      dayNumber: 1,
      title: 'Morning Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'A gentle morning sanctuary plan.',
      tags: ['Elephants', 'Morning'],
    })
  })

  it('never leaks handoff URLs, image URLs, product ids, or partner wiring', () => {
    const message = buildNarrationUserMessage(itinerary)

    expect(message).not.toContain('widgets')
    expect(message).not.toContain('http')
    expect(message).not.toContain('partner_cm_1')
    expect(message).not.toContain('detailHref')
    expect(message).not.toContain('handoff')
  })

  it('constrains the system prompt against commerce and logistics claims', () => {
    expect(NARRATION_SYSTEM_PROMPT).toContain('Never mention or speculate about prices')
    expect(NARRATION_SYSTEM_PROMPT).toContain('Never include URLs')
    expect(NARRATION_SYSTEM_PROMPT).toContain('Only describe the experiences provided')
    expect(NARRATION_SYSTEM_PROMPT).toContain('review each product page')
  })
})

describe('narration stream sanitizer', () => {
  function runThrough(chunks: string[]): string {
    const sanitizer = createNarrationSanitizer()
    let out = ''
    for (const chunk of chunks) out += sanitizer.push(chunk)
    out += sanitizer.flush()
    return out
  }

  it('passes clean narration through unchanged', () => {
    const text = 'Day 1: You spend a gentle morning with rescued elephants near Chiang Mai. '
    expect(runThrough([text])).toBe(text)
  })

  it('redacts forbidden commerce wording', () => {
    const out = runThrough(['Day 1: You can check the price and book a hotel near the airport.'])

    expect(out).not.toMatch(/\bprice\b/i)
    expect(out).not.toMatch(/\bbook\b/i)
    expect(out).not.toMatch(/\bhotel\b/i)
    expect(out).not.toMatch(/\bairport\b/i)
    expect(out).toContain('[details on the product page]')
  })

  it('redacts a forbidden word split across stream chunks', () => {
    const out = runThrough(['The tour has great avail', 'ability and easy boo', 'king today.'])

    expect(out).not.toMatch(/availability/i)
    expect(out).not.toMatch(/booking/i)
  })

  it('emits whole words only while holding back the stream tail', () => {
    const sanitizer = createNarrationSanitizer()
    const text = 'You wander through the old town markets and try northern dishes'
    const first = sanitizer.push(text)
    const rest = sanitizer.flush()

    // The emitted prefix must never split a word: the held-back remainder
    // starts at a whitespace boundary, and nothing is lost or reordered.
    expect(first === '' || rest.startsWith(' ')).toBe(true)
    expect(first + rest).toBe(text)
  })
})
