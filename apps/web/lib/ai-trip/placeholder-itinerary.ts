import type { ConfirmedTripIntent } from './itinerary-contract'
import type { DeterministicPlanningOutline, PlaceholderDaySlot } from './itinerary-contract'

const MAX_PLACEHOLDER_DAYS = 7
const PLACEHOLDER_NOTES = [
  'Experience slots will appear here after itinerary generation is implemented.',
  'No product, supplier, price, availability, final partner workflow, or partner handoff links are loaded.',
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

function hasInterest(intent: Pick<ConfirmedTripIntent, 'interests' | 'foodPreferences'>, value: string) {
  const pattern = new RegExp(value, 'i')

  return [...intent.interests, ...intent.foodPreferences].some(item => pattern.test(item))
}

function destinationLabel(destination: string | null) {
  return destination ?? 'Thailand'
}

function buildFocusPhrase(intent: Pick<ConfirmedTripIntent, 'interests' | 'foodPreferences'>) {
  if (hasInterest(intent, 'elephant')) return 'elephant care and nature time'
  if (hasInterest(intent, 'food|cooking')) return 'local food and cooking-led experiences'
  if (hasInterest(intent, 'temple|culture')) return 'temples, culture, and local neighborhoods'
  if (hasInterest(intent, 'beach|island')) return 'beaches, islands, and slower coastal time'

  return 'the interests you confirmed'
}

function buildPacePhrase(intent: Pick<ConfirmedTripIntent, 'pace' | 'travelerType'>) {
  if (intent.pace === 'relaxed') return 'with a relaxed pace'
  if (intent.pace === 'packed') return 'with a fuller schedule'
  if (intent.travelerType === 'family') return 'with family-friendly pacing'
  if (intent.travelerType === 'couple') return 'with room for a couple-friendly rhythm'

  return 'with enough space to compare options'
}

export function buildDeterministicPlanningOutline(
  intent: Pick<
    ConfirmedTripIntent,
    'destination' | 'durationDays' | 'interests' | 'foodPreferences' | 'pace' | 'travelerType' | 'avoid'
  >,
): DeterministicPlanningOutline | null {
  if (!intent.destination || !intent.durationDays) return null

  const destination = destinationLabel(intent.destination)
  const focus = buildFocusPhrase(intent)
  const pace = buildPacePhrase(intent)
  const avoidNote = intent.avoid.length > 0
    ? ` while avoiding ${intent.avoid.slice(0, 2).join(' and ')}`
    : ''

  return {
    title: `Suggested ${destination} planning outline`,
    fitExplanation: `A ${intent.durationDays}-day ${destination} plan can start with ${focus} ${pace}${avoidNote}.`,
    slots: [
      {
        label: 'Start',
        title: 'Anchor the day around your strongest interest',
        description: `Use ${focus} as the first comparison filter before comparing product cards.`,
      },
      {
        label: 'Middle',
        title: 'Compare nearby supporting experiences',
        description: 'Look for food, culture, nature, or transfer fit that matches your confirmed destination and duration.',
      },
      {
        label: 'Later',
        title: 'Shortlist real product pages',
        description: 'Use the product results below to open details, then continue only through the public partner handoff path.',
      },
    ],
    safetyNote:
      'This outline is deterministic planning guidance. It does not check availability, complete partner workflows, or replace product-page details.',
  }
}
