import type { TripPace } from '@/lib/ai-trip/intent-schema'
import type { ProductRecommendationSignals } from '@/lib/ai-trip/recommendation-signals'
import type { ThailandItineraryPace } from '@/lib/itineraries/thailandTemplates'

type TaggedProduct = {
  tags: readonly string[]
}

const PACE_BEST_FOR: Record<ThailandItineraryPace, string> = {
  chill: 'A relaxed itinerary',
  balanced: 'A balanced itinerary',
  packed: 'A packed itinerary',
}

const PACE_BEST_FOR_VALUES = new Set(Object.values(PACE_BEST_FOR))
const GENERIC_WATCH_OUT = 'Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.'
const PACKED_WATCH_OUT = 'A packed plan leaves less buffer; confirm duration, meeting details, and current terms before choosing.'

function sentenceList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? ''
  if (values.length === 2) return `${values[0]} and ${values[1]}`
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`
}

export function toPlannerPace(pace: TripPace): ThailandItineraryPace {
  if (pace === 'relaxed') return 'chill'
  if (pace === 'packed') return 'packed'
  return 'balanced'
}

export function collectPlannerThemes(products: readonly TaggedProduct[]): string[] {
  return Array.from(new Set(products.flatMap(product => product.tags)))
    .sort((left, right) => left.localeCompare(right))
    .slice(0, 8)
}

export function filterPlannerProductsByThemes<T extends TaggedProduct>(
  products: readonly T[],
  selectedThemes: readonly string[],
): readonly T[] {
  const themes = selectedThemes
    .map(theme => theme.trim().toLowerCase())
    .filter(Boolean)

  if (themes.length === 0) return products

  return products.filter(product => {
    const productTags = new Set(product.tags.map(tag => tag.toLowerCase()))
    return themes.some(theme => productTags.has(theme))
  })
}

export function adaptPlannerDecisionSignals(
  product: TaggedProduct,
  signals: ProductRecommendationSignals | null | undefined,
  pace: ThailandItineraryPace,
  selectedThemes: readonly string[],
): ProductRecommendationSignals | null {
  if (!signals) return null

  const productTags = new Set(product.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean))
  const matchingThemes = Array.from(new Set(selectedThemes
    .map(theme => theme.trim().toLowerCase())
    .filter(theme => theme && productTags.has(theme))))
    .slice(0, 2)

  const stableBestFor = signals.bestFor.filter(item => (
    !PACE_BEST_FOR_VALUES.has(item)
    && !item.startsWith('Travelers interested in ')
  ))
  const originalInterestFit = signals.bestFor.filter(item => item.startsWith('Travelers interested in '))
  const currentInterestFit = matchingThemes.length > 0
    ? [`Travelers interested in ${sentenceList(matchingThemes)}`]
    : originalInterestFit

  const themeCopy = matchingThemes.length > 0
    ? ` It also matches your selected ${sentenceList(matchingThemes)} theme${matchingThemes.length === 1 ? '' : 's'}.`
    : ''
  const whyRecommended = themeCopy
    ? `${signals.whyRecommended.replace(/\.$/, '')}.${themeCopy}`
    : signals.whyRecommended

  const watchOut = signals.watchOut === GENERIC_WATCH_OUT || signals.watchOut === PACKED_WATCH_OUT
    ? pace === 'packed' ? PACKED_WATCH_OUT : GENERIC_WATCH_OUT
    : signals.watchOut

  return {
    whyRecommended,
    bestFor: [...stableBestFor, PACE_BEST_FOR[pace], ...currentInterestFit].slice(0, 3),
    watchOut,
  }
}
