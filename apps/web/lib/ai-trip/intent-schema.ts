export type TripPace = 'relaxed' | 'moderate' | 'packed' | 'unspecified'
export type TripBudget = 'budget' | 'mid-range' | 'premium' | 'luxury' | 'unspecified'
export type TravelerType = 'solo' | 'couple' | 'family' | 'friends' | 'business' | 'unspecified'

export type TripIntent = {
  destination: string | null
  durationDays: number | null
  durationNights: number | null
  startDate: string | null
  endDate: string | null
  interests: string[]
  excludedStyles: string[]
  pace: TripPace
  budget: TripBudget
  travelerType: TravelerType
  groupSize: number | null
  mustHave: string[]
  avoid: string[]
  accessibilityNeeds: string[]
  foodPreferences: string[]
  language: string
  confidence: number
  missingFields: string[]
}

export type ParseTripIntentResult = {
  intent: TripIntent
  missingFields: string[]
  warnings: string[]
  bookingEnabled: false
  productRetrievalEnabled: false
  availabilityEnabled: false
}

export function normalizeStringList(values: string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const value of values) {
    const trimmed = value.trim()
    if (!trimmed) continue

    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    normalized.push(trimmed)
  }

  return normalized
}

export function createEmptyTripIntent(language = 'unknown'): TripIntent {
  return {
    destination: null,
    durationDays: null,
    durationNights: null,
    startDate: null,
    endDate: null,
    interests: [],
    excludedStyles: [],
    pace: 'unspecified',
    budget: 'unspecified',
    travelerType: 'unspecified',
    groupSize: null,
    mustHave: [],
    avoid: [],
    accessibilityNeeds: [],
    foodPreferences: [],
    language,
    confidence: 0,
    missingFields: ['destination', 'durationDays'],
  }
}

export function withNormalizedIntentLists(intent: TripIntent): TripIntent {
  return {
    ...intent,
    interests: normalizeStringList(intent.interests),
    excludedStyles: normalizeStringList(intent.excludedStyles),
    mustHave: normalizeStringList(intent.mustHave),
    avoid: normalizeStringList(intent.avoid),
    accessibilityNeeds: normalizeStringList(intent.accessibilityNeeds),
    foodPreferences: normalizeStringList(intent.foodPreferences),
    missingFields: normalizeStringList(intent.missingFields),
  }
}
