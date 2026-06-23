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
  wantsGentleFamilyExperience: boolean
  ethicalPriority: boolean
  transferSensitivity: 'low' | 'medium' | 'high'
  budgetSensitivity: 'low' | 'medium' | 'high'
}

export type ElephantCampProductProfile = {
  productId: string
  title: string
  campName: string
  city: 'Chiang Mai'
  durationType: 'half_day' | 'full_day'
  kidFriendlyScore: 1 | 2 | 3 | 4 | 5
  ethicalScore: 1 | 2 | 3 | 4 | 5
  interactionLevel: 1 | 2 | 3 | 4 | 5
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
  detailHref: string
}

export type ElephantFinderRecommendation = {
  productId: string
  matchType: 'best_match' | 'family_friendly' | 'best_value' | 'alternative'
  score: number
  title: string
  campName: string
  city: 'Chiang Mai'
  reasons: string[]
  cautionNotes: string[]
  detailHref: string
}
