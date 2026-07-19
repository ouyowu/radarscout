import type { TripIntent } from './intent-schema'
import type { ProductRecommendationSignals } from './recommendation-signals'

export type ItineraryGenerationStatus =
  | 'disabled'
  | 'placeholder_only'
  | 'ready_for_future_engine'

export type ItineraryCapabilityFlags = {
  itineraryGenerationEnabled: false
  productRetrievalEnabled: false
  supplierLookupEnabled: false
  availabilityEnabled: false
  bookingEnabled: false
  checkoutEnabled: false
  paymentEnabled: false
}

export type ConfirmedTripIntent = Pick<
  TripIntent,
  | 'destination'
  | 'durationDays'
  | 'durationNights'
  | 'interests'
  | 'excludedStyles'
  | 'pace'
  | 'budget'
  | 'travelerType'
  | 'groupSize'
  | 'avoid'
  | 'foodPreferences'
  | 'language'
  | 'confidence'
  | 'missingFields'
>

export type ItineraryRequestContext = {
  confirmedIntent: ConfirmedTripIntent
  source: 'local_demo'
  status: ItineraryGenerationStatus
  capabilityFlags: ItineraryCapabilityFlags
}

export type PlaceholderDaySlot = {
  dayNumber: number
  label: string
  isPlaceholder: true
  notes: string[]
}

export type DeterministicPlanningSlot = {
  label: 'Start' | 'Middle' | 'Later'
  title: string
  description: string
}

export type DeterministicPlanningOutline = {
  title: string
  fitExplanation: string
  slots: DeterministicPlanningSlot[]
  safetyNote: string
}

export type ItineraryContractResult = {
  status: ItineraryGenerationStatus
  placeholderDays: PlaceholderDaySlot[]
  warnings: string[]
  capabilityFlags: ItineraryCapabilityFlags
}

export type DayTripSpec = {
  destination: string
  durationDays: number
  interests: string[]
  pace: TripIntent['pace']
  travelerType: TripIntent['travelerType']
  groupSize: number | null
  contentScope: 'day_tours_only'
}

export type DayTripExperience = {
  productId: string
  title: string
  city: string | null
  summary: string | null
  imageUrl: string | null
  imageAlt: string | null
  tags: string[]
  detailHref: string
  decisionSignals?: ProductRecommendationSignals
  handoff: {
    label: 'Check availability'
    href: string
    rel: 'nofollow sponsored noopener noreferrer'
  }
}

export type DayTripItinerary = {
  version: 1
  tripSpec: DayTripSpec
  days: Array<{
    dayNumber: number
    experience: DayTripExperience
  }>
  unfilledDayCount: number
  safety: {
    availabilityChecked: false
    bookingCompleted: false
    paymentHandled: false
  }
}
