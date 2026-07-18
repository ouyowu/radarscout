import type { ReviewedViatorProduct } from '../viator/reviewedViatorProducts'
import type {
  ThailandItineraryDayPlan,
  ThailandItineraryPace,
  ThailandItineraryStop,
} from './thailandTemplates'

const stopCountByPace: Record<ThailandItineraryPace, number> = {
  chill: 2,
  balanced: 3,
  packed: 4,
}

export function getStopsForPace(
  dayPlan: ThailandItineraryDayPlan,
  pace: ThailandItineraryPace,
): readonly ThailandItineraryStop[] {
  return dayPlan.stops.slice(0, stopCountByPace[pace])
}

export function filterItineraryProducts<T extends Pick<ReviewedViatorProduct, 'city' | 'tags'>>(
  products: readonly T[],
  cityName: string,
  selectedThemes: readonly string[],
): readonly T[] {
  const city = cityName.trim().toLowerCase()
  const themes = selectedThemes.map(theme => theme.trim().toLowerCase()).filter(Boolean)

  return products.filter(product => {
    if (product.city.toLowerCase() !== city) return false
    if (themes.length === 0) return true

    const productTags = new Set(product.tags.map(tag => tag.toLowerCase()))
    return themes.some(theme => productTags.has(theme))
  })
}
