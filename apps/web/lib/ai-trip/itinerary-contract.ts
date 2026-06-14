import type { TripIntent } from './intent-schema'

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

export type ItineraryContractResult = {
  status: ItineraryGenerationStatus
  placeholderDays: PlaceholderDaySlot[]
  warnings: string[]
  capabilityFlags: ItineraryCapabilityFlags
}
