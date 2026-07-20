import type { ProductRecommendationSignals } from '@/lib/ai-trip/recommendation-signals'
import type { ThailandItineraryPace } from '@/lib/itineraries/thailandTemplates'

export type PlannerRealityModel = {
  destination: string
  durationDays: number
  paceLabel: string
  selectedThemes: string[]
  statusLabel: string
  verdict: string
  assignedDayCount: number
  mapCoverageDayCount: number
  reviewedMatchCount: number
  visibleMatchCount: number
  whyThisRoute: string[]
  bestFor: string[]
  beforeChoosing: string[]
  paceNote: string
  mapAndHandoffNotes: string[]
}

type BuildPlannerRealityModelInput = {
  destination: string
  durationDays: number
  assignedDayCount: number
  mapCoverageDayCount: number
  reviewedMatchCount: number
  visibleMatchCount: number
  pace: ThailandItineraryPace
  selectedThemes: readonly string[]
  signals: readonly ProductRecommendationSignals[]
}

const PACE_LABELS: Record<ThailandItineraryPace, string> = {
  chill: 'Chill pace',
  balanced: 'Balanced pace',
  packed: 'Packed pace',
}

const PACE_NOTES: Record<ThailandItineraryPace, string> = {
  chill: 'The map shows the lightest reviewed orientation. Confirm each product duration before combining activities.',
  balanced: 'The map shows a moderate reviewed orientation. Confirm timing and meeting details on each product page.',
  packed: 'The map shows the fullest reviewed orientation. It does not confirm that every stop fits into one day.',
}

function uniqueItems(values: readonly string[], limit: number): string[] {
  return Array.from(new Set(values.map(value => value.trim()).filter(Boolean))).slice(0, limit)
}

export function buildPlannerRealityModel({
  destination,
  durationDays,
  assignedDayCount,
  mapCoverageDayCount,
  reviewedMatchCount,
  visibleMatchCount,
  pace,
  selectedThemes,
  signals,
}: BuildPlannerRealityModelInput): PlannerRealityModel {
  const safeDurationDays = Math.max(1, durationDays)
  const safeAssignedDayCount = Math.min(Math.max(0, assignedDayCount), safeDurationDays)
  const safeMapCoverageDayCount = Math.min(Math.max(0, mapCoverageDayCount), safeDurationDays)
  const flexibleDayCount = safeDurationDays - safeAssignedDayCount
  const statusLabel = safeAssignedDayCount === 0
    ? 'More reviewed matches needed'
    : flexibleDayCount > 0
      ? 'Ready to compare, with room left open'
      : 'Ready to compare'
  const assignedCopy = `${safeAssignedDayCount} reviewed day-tour stop${safeAssignedDayCount === 1 ? '' : 's'} ${safeAssignedDayCount === 1 ? 'is' : 'are'} ready to compare.`
  const flexibleCopy = flexibleDayCount > 0
    ? ` ${flexibleDayCount} day${flexibleDayCount === 1 ? '' : 's'} remain flexible because RadarScout does not invent missing matches.`
    : ' Every requested day has a reviewed match.'
  const whyThisRoute = uniqueItems(signals.map(signal => signal.whyRecommended), 4)
  const bestFor = uniqueItems(signals.flatMap(signal => signal.bestFor), 6)
  const beforeChoosing = uniqueItems(signals.map(signal => signal.watchOut), 4)

  return {
    destination,
    durationDays: safeDurationDays,
    paceLabel: PACE_LABELS[pace],
    selectedThemes: uniqueItems(selectedThemes, 4),
    statusLabel,
    verdict: `${assignedCopy}${flexibleCopy}`,
    assignedDayCount: safeAssignedDayCount,
    mapCoverageDayCount: safeMapCoverageDayCount,
    reviewedMatchCount: Math.max(0, reviewedMatchCount),
    visibleMatchCount: Math.max(0, visibleMatchCount),
    whyThisRoute: whyThisRoute.length > 0
      ? whyThisRoute
      : [`Reviewed matches are limited to the confirmed ${destination} route.`],
    bestFor: bestFor.length > 0
      ? bestFor
      : ['Travelers comparing reviewed Thailand day trips'],
    beforeChoosing: beforeChoosing.length > 0
      ? beforeChoosing
      : ['Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.'],
    paceNote: PACE_NOTES[pace],
    mapAndHandoffNotes: [
      `${safeMapCoverageDayCount} of ${safeDurationDays} days have reviewed map orientation. Pins are not exact routes, pickup points, or meeting points.`,
      'RadarScout compares reviewed options. Current product details and the final booking step stay with Viator.',
    ],
  }
}
