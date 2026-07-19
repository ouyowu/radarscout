import type { TripPace } from '@/lib/ai-trip/intent-schema'
import type { ThailandItineraryPace } from '@/lib/itineraries/thailandTemplates'

type TaggedProduct = {
  tags: readonly string[]
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
