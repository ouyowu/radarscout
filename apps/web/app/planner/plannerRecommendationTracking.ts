import type { RecommendationReasonCode } from '@/lib/ai-trip/recommendation-signals'
import type { TripPace, TravelerType } from '@/lib/ai-trip/intent-schema'

type RecommendationProduct = {
  id: string
  city: string | null
  decisionSignals?: { reasonCode?: RecommendationReasonCode }
}

type PlannerRecommendationEventInput = {
  destination: string
  durationDays: number
  pace: TripPace
  travelerType: TravelerType
  products: readonly RecommendationProduct[]
}

export function buildPlannerRecommendationEvents({
  destination,
  durationDays,
  pace,
  travelerType,
  products,
}: PlannerRecommendationEventInput) {
  return products.map(product => ({
    provider: 'viator',
    placement: 'planner_filtered_matches',
    city: product.city ?? destination,
    productId: product.id,
    recommendationSource: 'planner',
    reasonCode: product.decisionSignals?.reasonCode ?? 'reviewed_fallback',
    durationDays,
    pace,
    travelerType,
  }))
}
