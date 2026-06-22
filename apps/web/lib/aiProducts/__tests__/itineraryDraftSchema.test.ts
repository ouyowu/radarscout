import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  validateItineraryDraftSchema,
  MAX_DURATION_DAYS,
  MAX_ITEMS_PER_DAY,
  MAX_TEXT_SHORT,
  MAX_TEXT_LONG,
} from '../itineraryDraftSchema'

function makeValidDraft(overrides: Record<string, unknown> = {}) {
  return {
    destination: 'Chiang Mai',
    durationDays: 2,
    summary: 'A 2-day exploration of Chiang Mai.',
    days: [
      {
        day: 1,
        title: 'Temples and culture',
        theme: 'Culture',
        items: [
          {
            type: 'experience',
            productId: 'prod_1',
            title: 'Doi Suthep Temple Tour',
            description: 'Visit the most iconic temple in Chiang Mai.',
            timeOfDay: 'morning',
          },
        ],
      },
      {
        day: 2,
        title: 'Market exploration',
        theme: 'Food and Markets',
        items: [
          {
            type: 'free_time',
            title: 'Night Bazaar',
            description: 'Explore the famous night market.',
            timeOfDay: 'evening',
          },
        ],
      },
    ],
    warnings: [],
    ...overrides,
  }
}

describe('validateItineraryDraftSchema — valid drafts', () => {
  it('accepts a valid 1-day draft', () => {
    const result = validateItineraryDraftSchema({
      destination: 'Chiang Mai',
      durationDays: 1,
      summary: 'Single day in Chiang Mai.',
      days: [
        {
          day: 1,
          title: 'Temples',
          theme: 'Culture',
          items: [
            {
              type: 'experience',
              productId: 'prod_a',
              title: 'Temple Tour',
              description: 'Visit local temples.',
              timeOfDay: 'morning',
            },
          ],
        },
      ],
      warnings: [],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.draft.durationDays).toBe(1)
      expect(result.draft.days).toHaveLength(1)
    }
  })

  it('accepts a valid multi-day draft', () => {
    const result = validateItineraryDraftSchema(makeValidDraft())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.draft.days).toHaveLength(2)
    }
  })

  it(`accepts exactly ${MAX_DURATION_DAYS} days`, () => {
    const days = Array.from({ length: MAX_DURATION_DAYS }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      theme: 'Exploration',
      items: [
        { type: 'free_time', title: 'Rest', description: 'Free time.', timeOfDay: 'flexible' },
      ],
    }))
    const result = validateItineraryDraftSchema({
      destination: 'Thailand',
      durationDays: MAX_DURATION_DAYS,
      summary: 'Two-week itinerary.',
      days,
      warnings: [],
    })
    expect(result.ok).toBe(true)
  })

  it('accepts free_time, transfer_note, and meal_note items without productId', () => {
    const result = validateItineraryDraftSchema({
      destination: 'Bangkok',
      durationDays: 1,
      summary: 'A day in Bangkok.',
      days: [
        {
          day: 1,
          title: 'Bangkok day',
          theme: 'Mixed',
          items: [
            { type: 'free_time', title: 'Explore', description: 'Free morning.', timeOfDay: 'morning' },
            { type: 'transfer_note', title: 'Airport transfer', description: 'Take taxi.', timeOfDay: 'afternoon' },
            { type: 'meal_note', title: 'Street food', description: 'Try local street food.', timeOfDay: 'evening' },
          ],
        },
      ],
      warnings: [],
    })
    expect(result.ok).toBe(true)
  })

  it('accepts warnings array with up to 10 strings', () => {
    const warnings = Array.from({ length: 10 }, (_, i) => `Warning ${i + 1}`)
    const result = validateItineraryDraftSchema(makeValidDraft({ warnings }))
    expect(result.ok).toBe(true)
  })
})

describe('validateItineraryDraftSchema — duration rejections', () => {
  it(`rejects ${MAX_DURATION_DAYS + 1} days`, () => {
    const days = Array.from({ length: MAX_DURATION_DAYS + 1 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      theme: 'X',
      items: [],
    }))
    const result = validateItineraryDraftSchema({
      destination: 'Thailand',
      durationDays: MAX_DURATION_DAYS + 1,
      summary: 'Too long.',
      days,
      warnings: [],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_DURATION_DAYS')
  })

  it('rejects durationDays 0', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ durationDays: 0, days: [] }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_DURATION_DAYS')
  })

  it('rejects durationDays as a float', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ durationDays: 1.5 }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_DURATION_DAYS')
  })
})

describe('validateItineraryDraftSchema — day structure rejections', () => {
  it('rejects missing day (1 day declared but 0 days in array)', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ durationDays: 1, days: [] }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_DAY_COUNT')
  })

  it('rejects non-sequential days (day 2 before day 1)', () => {
    const result = validateItineraryDraftSchema({
      destination: 'Chiang Mai',
      durationDays: 2,
      summary: 'Bad order.',
      days: [
        { day: 2, title: 'Second', theme: 'X', items: [] },
        { day: 1, title: 'First', theme: 'Y', items: [] },
      ],
      warnings: [],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('NON_SEQUENTIAL_DAYS')
  })

  it('rejects duplicate day numbers', () => {
    const result = validateItineraryDraftSchema({
      destination: 'Chiang Mai',
      durationDays: 2,
      summary: 'Duplicate days.',
      days: [
        { day: 1, title: 'Day 1', theme: 'X', items: [] },
        { day: 1, title: 'Day 1 again', theme: 'Y', items: [] },
      ],
      warnings: [],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('NON_SEQUENTIAL_DAYS')
  })

  it(`rejects more than ${MAX_ITEMS_PER_DAY} items in a day`, () => {
    const tooManyItems = Array.from({ length: MAX_ITEMS_PER_DAY + 1 }, (_, i) => ({
      type: 'free_time',
      title: `Item ${i}`,
      description: 'Some activity.',
      timeOfDay: 'flexible',
    }))
    const result = validateItineraryDraftSchema({
      destination: 'Chiang Mai',
      durationDays: 1,
      summary: 'Overpacked day.',
      days: [{ day: 1, title: 'Busy day', theme: 'X', items: tooManyItems }],
      warnings: [],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('TOO_MANY_ITEMS')
  })
})

describe('validateItineraryDraftSchema — oversized text', () => {
  it(`rejects summary longer than ${MAX_TEXT_LONG} chars`, () => {
    const result = validateItineraryDraftSchema(
      makeValidDraft({ summary: 'x'.repeat(MAX_TEXT_LONG + 1) }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('OVERSIZED_TEXT')
  })

  it(`rejects day title longer than ${MAX_TEXT_SHORT} chars`, () => {
    const days = [
      {
        day: 1,
        title: 'x'.repeat(MAX_TEXT_SHORT + 1),
        theme: 'Culture',
        items: [],
      },
      {
        day: 2,
        title: 'Normal',
        theme: 'Markets',
        items: [],
      },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('OVERSIZED_TEXT')
  })

  it(`rejects item description longer than ${MAX_TEXT_LONG} chars`, () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'X',
        items: [
          {
            type: 'free_time',
            title: 'Activity',
            description: 'x'.repeat(MAX_TEXT_LONG + 1),
            timeOfDay: 'flexible',
          },
        ],
      },
      {
        day: 2,
        title: 'Day 2',
        theme: 'Y',
        items: [],
      },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('OVERSIZED_TEXT')
  })
})

describe('validateItineraryDraftSchema — malformed output', () => {
  it('rejects null', () => {
    const result = validateItineraryDraftSchema(null)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('MALFORMED_OUTPUT')
  })

  it('rejects a string', () => {
    const result = validateItineraryDraftSchema('some text')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('MALFORMED_OUTPUT')
  })

  it('rejects an array', () => {
    const result = validateItineraryDraftSchema([])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('MALFORMED_OUTPUT')
  })

  it('rejects missing destination', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ destination: undefined }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('MALFORMED_OUTPUT')
  })

  it('rejects invalid item type', () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'X',
        items: [
          { type: 'hotel_checkin', title: 'Hotel', description: 'Check in.', timeOfDay: 'afternoon' },
        ],
      },
      {
        day: 2,
        title: 'Day 2',
        theme: 'Y',
        items: [],
      },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_ITEM_TYPE')
  })

  it('rejects invalid timeOfDay', () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'X',
        items: [
          { type: 'free_time', title: 'Wander', description: 'Walk around.', timeOfDay: 'noon' },
        ],
      },
      {
        day: 2,
        title: 'Day 2',
        theme: 'Y',
        items: [],
      },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('INVALID_TIME_OF_DAY')
  })

  it('rejects more than 10 warnings', () => {
    const warnings = Array.from({ length: 11 }, (_, i) => `Warning ${i + 1}`)
    const result = validateItineraryDraftSchema(makeValidDraft({ warnings }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('MALFORMED_OUTPUT')
  })
})

describe('validateItineraryDraftSchema — strict schema (UNKNOWN_FIELD)', () => {
  it('rejects unknown root-level key: providerCommentary', () => {
    const result = validateItineraryDraftSchema(
      makeValidDraft({ providerCommentary: 'some internal note' }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.code).toBe('UNKNOWN_FIELD')
      expect(result.reason).toContain('providerCommentary')
    }
  })

  it('rejects unknown root-level key: systemPrompt', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ systemPrompt: 'you are...' }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown root-level key: debug', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ debug: { tokens: 1234 } }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown root-level key: price', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ price: '1000' }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown root-level key: availability', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ availability: 'open' }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown root-level key: bookingUrl', () => {
    const result = validateItineraryDraftSchema(makeValidDraft({ bookingUrl: 'https://example.com' }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown day-level key: providerNotes', () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'Culture',
        items: [],
        providerNotes: 'internal day notes',
      },
      { day: 2, title: 'Day 2', theme: 'Nature', items: [] },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown item-level key: rating', () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'Culture',
        items: [
          {
            type: 'free_time',
            title: 'Wander',
            description: 'Walk around.',
            timeOfDay: 'morning',
            rating: 4.5,
          },
        ],
      },
      { day: 2, title: 'Day 2', theme: 'Nature', items: [] },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })

  it('rejects unknown item-level key: checkoutUrl', () => {
    const days = [
      {
        day: 1,
        title: 'Day 1',
        theme: 'Culture',
        items: [
          {
            type: 'experience',
            productId: 'prod_1',
            title: 'Tour',
            description: 'Visit a temple.',
            timeOfDay: 'morning',
            checkoutUrl: 'https://book.example.com',
          },
        ],
      },
      { day: 2, title: 'Day 2', theme: 'Nature', items: [] },
    ]
    const result = validateItineraryDraftSchema(makeValidDraft({ days }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('UNKNOWN_FIELD')
  })
})
