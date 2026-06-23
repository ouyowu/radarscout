import type {
  ElephantCampProductProfile,
  ElephantFinderInput,
  ElephantFinderRecommendation,
} from './types'

const PLACEHOLDER_PRODUCT_ID = 'NEEDS_REAL_PRODUCT_ID'

function priceScore(priceLevel: ElephantCampProductProfile['priceLevel']) {
  if (priceLevel === 'budget') return 12
  if (priceLevel === 'premium') return -8
  return 4
}

function intensityScore(intensity: ElephantCampProductProfile['physicalIntensity']) {
  if (intensity === 'low') return 10
  if (intensity === 'high') return -10
  return 2
}

function buildReasons(input: ElephantFinderInput, profile: ElephantCampProductProfile): string[] {
  const reasons: string[] = []

  if (input.children > 0 || input.wantsGentleFamilyExperience) {
    reasons.push('Good for families')
  }
  if (input.wantsFeeding && profile.feedingAvailable) {
    reasons.push('Includes the interaction style you selected')
  }
  if (input.wantsBathing && profile.bathingAvailable) {
    reasons.push('Includes bathing with elephants')
  }
  if (input.transferSensitivity === 'high' && profile.pickupAreas.includes(input.hotelArea)) {
    reasons.push('Easier transfer from your hotel area')
  }
  if (input.ethicalPriority) {
    reasons.push('Strong fit for ethical / no-riding preferences')
  }
  if (input.budgetSensitivity === 'high' && profile.priceLevel === 'budget') {
    reasons.push('Good value option')
  }

  return reasons.length > 0 ? reasons : ['Best match for your group']
}

function buildCautionNotes(input: ElephantFinderInput, profile: ElephantCampProductProfile): string[] {
  const notes: string[] = []

  if (input.wantsBathing && !profile.bathingAvailable) {
    notes.push('Bathing is not listed for this experience.')
  }
  if (profile.notIdealFor.length > 0) {
    notes.push(...profile.notIdealFor.slice(0, 2))
  }

  return notes
}

function scoreProfile(input: ElephantFinderInput, profile: ElephantCampProductProfile): number {
  let score = 0

  if (input.children > 0 || input.wantsGentleFamilyExperience) {
    score += profile.kidFriendlyScore * 3
    score += intensityScore(profile.physicalIntensity)
  }

  if (input.wantsBathing) {
    score += profile.bathingAvailable ? 20 : -20
  }

  if (input.wantsFeeding) {
    score += profile.feedingAvailable ? 15 : -10
  }

  if (input.wantsCloseInteraction) {
    score += profile.interactionLevel * 3
  }

  if (input.hotelArea !== 'not_sure' && profile.pickupAreas.includes(input.hotelArea)) {
    score += 10
  }

  if (input.transferSensitivity === 'high') {
    score += profile.transferConvenienceScore * 2
  } else if (input.transferSensitivity === 'medium') {
    score += profile.transferConvenienceScore
  }

  if (input.ethicalPriority) {
    score += profile.ethicalScore * 4
  }

  if (input.budgetSensitivity === 'high') {
    score += priceScore(profile.priceLevel)
  } else if (input.budgetSensitivity === 'medium' && profile.priceLevel !== 'premium') {
    score += 4
  }

  if (input.durationPreference !== 'either') {
    score += profile.durationType === input.durationPreference ? 12 : -8
  }

  return score
}

export function scoreElephantCampProducts(params: {
  input: ElephantFinderInput
  profiles: ElephantCampProductProfile[]
}): ElephantFinderRecommendation[] {
  const seen = new Set<string>()

  return params.profiles
    .filter(profile => profile.productId !== PLACEHOLDER_PRODUCT_ID)
    .filter(profile => {
      if (seen.has(profile.productId)) return false
      seen.add(profile.productId)
      return true
    })
    .map(profile => ({
      productId: profile.productId,
      matchType: 'alternative' as const,
      score: scoreProfile(params.input, profile),
      title: profile.title,
      campName: profile.campName,
      city: profile.city,
      reasons: buildReasons(params.input, profile),
      cautionNotes: buildCautionNotes(params.input, profile),
      detailHref: profile.detailHref,
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 3)
    .map((recommendation, index) => ({
      ...recommendation,
      matchType:
        index === 0
          ? 'best_match'
          : recommendation.reasons.includes('Good for families')
            ? 'family_friendly'
            : recommendation.reasons.includes('Good value option')
              ? 'best_value'
              : 'alternative',
    }))
}
