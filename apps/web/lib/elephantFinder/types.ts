export type ElephantFinderInput = {
  adults: number
  children: number
  hotelArea:
    | 'old_city'
    | 'nimman'
    | 'riverside'
    | 'night_bazaar'
    | 'mae_rim'
    | 'outside_city'
    | 'not_sure'
  durationPreference: 'half_day' | 'full_day' | 'either'
  wantsFeeding: boolean
  wantsBathing: boolean
  wantsCloseInteraction: boolean
  wantsElephantCare: boolean
  wantsCookingOrFood: boolean
  wantsNatureDayTrip: boolean
  wantsGentleFamilyExperience: boolean
  ethicalPriority: boolean
  transferSensitivity: 'low' | 'medium' | 'high'
  budgetSensitivity: 'low' | 'medium' | 'high'
}

export type ElephantCampProductProfile = {
  source: 'bokun_owner_managed'
  bokunId: string
  internalProductId?: string
  bookingHandoffUrl?: string
  title: string
  campName: string
  city: 'Chiang Mai' | 'Bangkok & Pattaya'
  category: 'elephant_care' | 'nature_day_trip' | 'cooking_or_food' | 'local_experience'
  durationType: 'half_day' | 'full_day' | 'flexible'
  kidFriendlyScore: 1 | 2 | 3 | 4 | 5
  ethicalScore: 1 | 2 | 3 | 4 | 5
  elephantInteractionLevel: 0 | 1 | 2 | 3 | 4 | 5
  foodOrCookingFocus: boolean
  natureFocus: boolean
  bathingAvailable: boolean
  feedingAvailable: boolean
  walkingAvailable: boolean
  photoFriendly: boolean
  transferConvenienceScore: 1 | 2 | 3 | 4 | 5
  physicalIntensity: 'low' | 'medium' | 'high'
  bestFor: string[]
  notIdealFor: string[]
  pickupAreas: ElephantFinderInput['hotelArea'][]
  priceLevel: 'budget' | 'mid' | 'premium'
}

export type ElephantFinderRecommendation = {
  recommendationId: string
  bokunId: string
  internalProductId?: string
  matchType: 'best_match' | 'family_friendly' | 'best_value' | 'alternative'
  score: number
  title: string
  campName: string
  city: 'Chiang Mai'
  reasons: string[]
  cautionNotes: string[]
  ctaHref: string
  ctaLabel: 'View experience' | 'Check availability'
  externalHandoff: boolean
  linkRel?: 'nofollow sponsored noopener noreferrer'
}
