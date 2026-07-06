import { describe, expect, it } from 'vitest'
import { buildDeterministicPlanningOutline, buildPlaceholderDaySlots } from './placeholder-itinerary'

describe('buildPlaceholderDaySlots', () => {
  it.each([null, undefined, 0, -1, 1.2, Number.NaN])(
    'returns an empty list for invalid duration: %s',
    durationDays => {
      expect(buildPlaceholderDaySlots(durationDays as number | null | undefined)).toEqual([])
    },
  )

  it('returns generic placeholder day slots for a valid duration', () => {
    const slots = buildPlaceholderDaySlots(3)

    expect(slots).toHaveLength(3)
    expect(slots).toEqual([
      {
        dayNumber: 1,
        label: 'Day 1 placeholder',
        isPlaceholder: true,
        notes: [
          'Experience slots will appear here after itinerary generation is implemented.',
          'No product, supplier, price, availability, final partner step, or partner handoff links are loaded.',
        ],
      },
      {
        dayNumber: 2,
        label: 'Day 2 placeholder',
        isPlaceholder: true,
        notes: [
          'Experience slots will appear here after itinerary generation is implemented.',
          'No product, supplier, price, availability, final partner step, or partner handoff links are loaded.',
        ],
      },
      {
        dayNumber: 3,
        label: 'Day 3 placeholder',
        isPlaceholder: true,
        notes: [
          'Experience slots will appear here after itinerary generation is implemented.',
          'No product, supplier, price, availability, final partner step, or partner handoff links are loaded.',
        ],
      },
    ])
  })

  it('caps placeholder days at seven', () => {
    const slots = buildPlaceholderDaySlots(12)

    expect(slots).toHaveLength(7)
    expect(slots[0]).toMatchObject({
      dayNumber: 1,
      label: 'Day 1 placeholder',
      isPlaceholder: true,
    })
    expect(slots[6]).toMatchObject({
      dayNumber: 7,
      label: 'Day 7 placeholder',
      isPlaceholder: true,
    })
  })

  it('never emits real itinerary or booking fields', () => {
    const slots = buildPlaceholderDaySlots(2)

    for (const slot of slots) {
      expect(slot).toMatchObject({ isPlaceholder: true })
      expect(slot).not.toHaveProperty('productId')
      expect(slot).not.toHaveProperty('supplierId')
      expect(slot).not.toHaveProperty('price')
      expect(slot).not.toHaveProperty('rating')
      expect(slot).not.toHaveProperty('bookingUrl')
      expect(slot).not.toHaveProperty('checkoutUrl')
      expect(slot).not.toHaveProperty('paymentUrl')
      expect(slot).not.toHaveProperty('availabilitySlot')
      expect(slot.notes.join(' ')).not.toMatch(/real attraction/i)
      expect(slot.notes.join(' ')).not.toMatch(/\bcheckout\b/i)
      expect(slot.notes.join(' ')).not.toMatch(/\bpayment\b/i)
      expect(slot.notes.join(' ')).not.toMatch(/\bbooking\b/i)
    }
  })
})

describe('buildDeterministicPlanningOutline', () => {
  it('returns null until destination and duration are confirmed', () => {
    expect(buildDeterministicPlanningOutline({
      destination: null,
      durationDays: 3,
      interests: ['food'],
      foodPreferences: [],
      pace: 'relaxed',
      travelerType: 'family',
      avoid: [],
    })).toBeNull()

    expect(buildDeterministicPlanningOutline({
      destination: 'Chiang Mai',
      durationDays: null,
      interests: ['food'],
      foodPreferences: [],
      pace: 'relaxed',
      travelerType: 'family',
      avoid: [],
    })).toBeNull()
  })

  it('builds a safe deterministic outline from confirmed intent', () => {
    const outline = buildDeterministicPlanningOutline({
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'temples'],
      foodPreferences: ['local food'],
      pace: 'relaxed',
      travelerType: 'family',
      avoid: ['crowds'],
    })

    expect(outline).not.toBeNull()
    expect(outline?.title).toBe('Suggested Chiang Mai planning outline')
    expect(outline?.fitExplanation).toMatch(/3-day Chiang Mai plan/i)
    expect(outline?.fitExplanation).toMatch(/elephant care/i)
    expect(outline?.fitExplanation).toMatch(/relaxed pace/i)
    expect(outline?.slots).toHaveLength(3)
    expect(outline?.slots.map(slot => slot.label)).toEqual(['Start', 'Middle', 'Later'])
  })

  it('builds a Thailand-wide route outline for multi-city trip prompts', () => {
    const outline = buildDeterministicPlanningOutline({
      destination: 'Thailand',
      durationDays: 7,
      interests: ['food', 'temples', 'beaches'],
      foodPreferences: [],
      pace: 'relaxed',
      travelerType: 'couple',
      avoid: [],
    })

    expect(outline).not.toBeNull()
    expect(outline?.title).toBe('Suggested Thailand multi-city route outline')
    expect(outline?.fitExplanation).toMatch(/7-day Thailand route/i)
    expect(outline?.fitExplanation).toMatch(/Bangkok/i)
    expect(outline?.fitExplanation).toMatch(/Chiang Mai/i)
    expect(outline?.fitExplanation).toMatch(/Phuket/i)
    expect(outline?.slots.map(slot => slot.title)).toEqual([
      'Start with Bangkok city context',
      'Compare Chiang Mai, Phuket, or nearby Thailand stops',
      'Shortlist real Thailand product pages',
    ])
  })

  it('does not emit checkout, payment, booking, ratings, or fake availability claims', () => {
    const outline = buildDeterministicPlanningOutline({
      destination: 'Phuket',
      durationDays: 4,
      interests: ['beaches', 'food'],
      foodPreferences: [],
      pace: 'moderate',
      travelerType: 'couple',
      avoid: [],
    })

    const serialized = JSON.stringify(outline)
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
    expect(serialized).not.toMatch(/\bbooking\b/i)
    expect(serialized).not.toMatch(/rating/i)
    expect(serialized).not.toMatch(/review/i)
  })
})
