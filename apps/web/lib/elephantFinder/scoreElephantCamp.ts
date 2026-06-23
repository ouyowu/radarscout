import type {
  ElephantCampProductProfile,
  ElephantFinderInput,
  ElephantFinderRecommendation,
} from './types'

const PLACEHOLDER_PRODUCT_ID = 'NEEDS_REAL_PRODUCT_ID'
const EXTERNAL_HANDOFF_REL = 'nofollow sponsored noopener noreferrer' as const

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

  if (input.wantsElephantCare && profile.category === 'elephant_care') {
    reasons.push('Matches your elephant care preference')
  }
  if (input.wantsCookingOrFood && profile.foodOrCookingFocus) {
    reasons.push('Good fit for cooking or local food')
  }
  if (input.wantsNatureDayTrip && profile.natureFocus) {
    reasons.push('Good fit for a nature day trip')
  }
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

  if (input.wantsElephantCare) {
    score += profile.category === 'elephant_care' || profile.elephantInteractionLevel > 0 ? 18 : -8
  }

  if (input.wantsCookingOrFood) {
    score += profile.foodOrCookingFocus ? 20 : -6
    score += profile.category === 'cooking_or_food' ? 10 : 0
  }

  if (input.wantsNatureDayTrip) {
    score += profile.natureFocus ? 18 : -4
    score += profile.category === 'nature_day_trip' ? 12 : 0
  }

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
    score += profile.elephantInteractionLevel * 3
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
    score += profile.durationType === input.durationPreference ? 12 : profile.durationType === 'flexible' ? 2 : -8
  }

  return score
}

function buildProfileLink(profile: ElephantCampProductProfile):
  | Pick<
      ElephantFinderRecommendation,
      'recommendationId' | 'internalProductId' | 'ctaHref' | 'ctaLabel' | 'externalHandoff' | 'linkRel'
    >
  | null {
  if (profile.internalProductId && profile.internalProductId !== PLACEHOLDER_PRODUCT_ID) {
    return {
      recommendationId: profile.internalProductId,
      internalProductId: profile.internalProductId,
      ctaHref: `/tours/${profile.internalProductId}`,
      ctaLabel: 'View experience',
      externalHandoff: false,
    }
  }

  if (profile.bookingHandoffUrl) {
    return {
      recommendationId: `bokun:${profile.bokunId}`,
      ctaHref: profile.bookingHandoffUrl,
      ctaLabel: 'Check availability',
      externalHandoff: true,
      linkRel: EXTERNAL_HANDOFF_REL,
    }
  }

  return null
}

export function scoreElephantCampProducts(params: {
  input: ElephantFinderInput
  profiles: ElephantCampProductProfile[]
}): ElephantFinderRecommendation[] {
  const seen = new Set<string>()

  return params.profiles
    .filter(profile => profile.city === 'Chiang Mai')
    .map(profile => ({ profile, link: buildProfileLink(profile) }))
    .filter((entry): entry is { profile: ElephantCampProductProfile; link: NonNullable<ReturnType<typeof buildProfileLink>> } => Boolean(entry.link))
    .filter(profile => {
      if (seen.has(profile.link.recommendationId)) return false
      seen.add(profile.link.recommendationId)
      return true
    })
    .map(({ profile, link }) => ({
      ...link,
      bokunId: profile.bokunId,
      matchType: 'alternative' as const,
      score: scoreProfile(params.input, profile),
      title: profile.title,
      campName: profile.campName,
      city: profile.city,
      reasons: buildReasons(params.input, profile),
      cautionNotes: buildCautionNotes(params.input, profile),
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
