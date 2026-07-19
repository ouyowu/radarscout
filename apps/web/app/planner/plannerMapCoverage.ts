import type { DayTripExperience } from '@/lib/ai-trip/itinerary-contract'
import {
  listThailandItineraryTemplates,
  type ThailandItineraryDayPlan,
} from '@/lib/itineraries/thailandTemplates'
import { getReviewedPlannerMapArea } from '@/lib/itineraries/reviewedPlannerMapRegions'

export type ReviewedPlannerMapDay = {
  cityName: string
  dayPlan: ThailandItineraryDayPlan
  lastReviewedAt: string
  precision: 'route' | 'area'
  sourceUrl: string | null
}

function normalizeCitySlug(destination: string): string {
  return destination.trim().toLowerCase().replaceAll(/\s+/g, '-')
}

export function getReviewedPlannerMapDay(
  destination: string,
  dayNumber: number,
  product?: DayTripExperience | null,
): ReviewedPlannerMapDay | null {
  if (!Number.isInteger(dayNumber) || dayNumber <= 0) return null

  if (product) return getReviewedPlannerMapArea(destination, dayNumber, product)

  const citySlug = normalizeCitySlug(destination)
  const matchingTemplate = listThailandItineraryTemplates()
    .filter(template => template.citySlug === citySlug)
    .sort((a, b) => a.days - b.days)
    .find(template => template.dayPlans.some(dayPlan => dayPlan.day === dayNumber))
  const dayPlan = matchingTemplate?.dayPlans.find(plan => plan.day === dayNumber)

  if (!matchingTemplate || !dayPlan) return null

  return {
    cityName: matchingTemplate.cityName,
    dayPlan,
    lastReviewedAt: matchingTemplate.lastReviewedAt,
    precision: 'route',
    sourceUrl: null,
  }
}
