import type { AffiliateOffer } from './affiliatePartners'
import {
  AGODA_AREA_CITY_NAMES,
  type AgodaAreaCitySlug,
  type AgodaAreaRecommendation,
} from './agodaAreaRecommendations'

export type ReviewedAgodaStayAreaOffer = {
  area: AgodaAreaRecommendation
  offer: AffiliateOffer
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
