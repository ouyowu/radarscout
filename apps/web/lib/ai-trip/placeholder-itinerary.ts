import type { PlaceholderDaySlot } from './itinerary-contract'

const MAX_PLACEHOLDER_DAYS = 7
const PLACEHOLDER_NOTES = [
  'Experience slots will appear here after itinerary generation is implemented.',
  'No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.',
]

export function buildPlaceholderDaySlots(
  durationDays: number | null | undefined,
): PlaceholderDaySlot[] {
  if (durationDays == null || !Number.isInteger(durationDays) || durationDays <= 0) {
    return []
  }

  const count = Math.min(durationDays, MAX_PLACEHOLDER_DAYS)

  return Array.from({ length: count }, (_, index) => ({
    dayNumber: index + 1,
    label: `Day ${index + 1} placeholder`,
    isPlaceholder: true,
    notes: [...PLACEHOLDER_NOTES],
  }))
}
