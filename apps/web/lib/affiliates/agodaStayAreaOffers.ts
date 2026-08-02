import type { AffiliateOffer } from './affiliatePartners'
import type { TravelerType, TripBudget } from '@/lib/ai-trip/intent-schema'
import {
  AGODA_AREA_CITY_NAMES,
  type AgodaAreaCitySlug,
  type AgodaAreaRecommendation,
} from './agodaAreaRecommendations'

export type ReviewedAgodaStayAreaOffer = {
  area: AgodaAreaRecommendation
  offer: AffiliateOffer
}

export type AgodaStayDecisionContext = {
  travelerType: TravelerType
  interests: readonly string[]
  budget: TripBudget
}

export type AgodaStayAreaDecision = ReviewedAgodaStayAreaOffer & {
  fitReasons: string[]
  budgetGuidance: string
}

const travelerMatchTerms: Record<Exclude<TravelerType, 'unspecified'>, readonly string[]> = {
  solo: ['solo', 'walkable', 'convenience', 'transit', 'compact'],
  couple: ['couple', 'couples', 'scenic', 'quiet', 'slower', 'boutique'],
  family: ['family', 'families', 'space', 'quiet', 'calm', 'resort'],
  friends: ['friends', 'nightlife', 'energetic', 'dining', 'convenience'],
  business: ['business', 'remote', 'work', 'transit', 'services'],
}

const travelerLabels: Record<Exclude<TravelerType, 'unspecified'>, string> = {
  solo: 'Solo trip',
  couple: 'Couples trip',
  family: 'Family trip',
  friends: 'Friends trip',
  business: 'Work trip',
}

const budgetLabels: Record<Exclude<TripBudget, 'unspecified'>, string> = {
  budget: 'budget',
  'mid-range': 'mid-range',
  premium: 'premium',
  luxury: 'luxury',
}

function searchableAreaText(item: ReviewedAgodaStayAreaOffer): string {
  return [item.area.name, item.area.bestFor, item.area.summary, ...item.area.tradeoffs]
    .join(' ')
    .toLowerCase()
}

function interestMatchesProfile(interest: string, profile: string): boolean {
  return interest
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 4)
    .some(token => profile.includes(token.endsWith('s') ? token.slice(0, -1) : token))
}

function buildBudgetGuidance(budget: TripBudget): string {
  if (budget === 'unspecified') {
    return 'No stay budget was confirmed. Compare current Agoda results before choosing a hotel.'
  }

  return `Your ${budgetLabels[budget]} preference is remembered, but RadarScout does not rank neighbourhoods by unverified hotel prices. Compare current Agoda results before choosing.`
}

const destinationSlugs = new Map<string, AgodaAreaCitySlug>(
  Object.entries(AGODA_AREA_CITY_NAMES).flatMap(([slug, name]) => [
    [slug, slug as AgodaAreaCitySlug],
    [name.toLowerCase(), slug as AgodaAreaCitySlug],
  ]),
)

export function getReviewedAgodaStayAreasForDestination(
  offers: readonly ReviewedAgodaStayAreaOffer[],
  destination: string,
): ReviewedAgodaStayAreaOffer[] {
  const normalizedDestination = destination.trim().toLowerCase().replaceAll(/\s+/g, '-')
  const citySlug = destinationSlugs.get(normalizedDestination)
    ?? destinationSlugs.get(destination.trim().toLowerCase())

  return citySlug ? offers.filter(item => item.area.citySlug === citySlug) : []
}

export function buildAgodaStayAreaDecisions(
  offers: readonly ReviewedAgodaStayAreaOffer[],
  destination: string,
  context: AgodaStayDecisionContext,
): AgodaStayAreaDecision[] {
  return getReviewedAgodaStayAreasForDestination(offers, destination)
    .map((item, index) => {
      const profile = searchableAreaText(item)
      const fitReasons = [`Reviewed area fit: ${item.area.bestFor}.`]
      let score = 0

      if (context.travelerType !== 'unspecified') {
        const hasTravelerMatch = travelerMatchTerms[context.travelerType]
          .some(term => profile.includes(term))
        if (hasTravelerMatch) {
          score += 2
          fitReasons.push(`${travelerLabels[context.travelerType]} characteristics appear in the reviewed area profile.`)
        }
      }

      const matchedInterests = context.interests
        .map(interest => interest.trim())
        .filter(interest => interest && interestMatchesProfile(interest, profile))
      if (matchedInterests.length > 0) {
        score += matchedInterests.length
        fitReasons.push(`Reviewed area notes align with your ${matchedInterests.join(', ')} interest${matchedInterests.length === 1 ? '' : 's'}.`)
      }

      return {
        ...item,
        fitReasons,
        budgetGuidance: buildBudgetGuidance(context.budget),
        score,
        index,
      }
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ score: _score, index: _index, ...decision }) => decision)
}
