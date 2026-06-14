import { describe, expect, it } from 'vitest'
import { buildPlaceholderDaySlots } from './placeholder-itinerary'

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
          'No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.',
        ],
      },
      {
        dayNumber: 2,
        label: 'Day 2 placeholder',
        isPlaceholder: true,
        notes: [
          'Experience slots will appear here after itinerary generation is implemented.',
          'No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.',
        ],
      },
      {
        dayNumber: 3,
        label: 'Day 3 placeholder',
        isPlaceholder: true,
        notes: [
          'Experience slots will appear here after itinerary generation is implemented.',
          'No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.',
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
    }
  })
})
