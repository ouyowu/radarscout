import {
  AGODA_AREA_CITY_NAMES,
  type AgodaAreaCitySlug,
  type AgodaAreaRecommendation,
} from '../affiliates/agodaAreaRecommendations'
import { reviewedAgodaAreaRecommendations } from '../affiliates/seed/reviewedAgodaAreas'
import type { ThailandGuideArticle } from './thailandGuides'

/**
 * Stay-area guides for cities whose neighbourhoods have been reviewed but
 * which have no hand-written guide yet.
 *
 * The reviewed Agoda area records already hold what this kind of guide is
 * made of: who each area suits, what it is, and what it costs you. This
 * composes those records into a guide rather than writing a second account of
 * the same neighbourhoods — every sentence below traces to a field a reviewer
 * signed off on, and the guide inherits that reviewer and date instead of
 * claiming a new review that never happened.
 *
 * A city with fewer than two reviewed areas produces no guide: there is no
 * decision to help with, and a one-option "comparison" would be filler.
 */
type StayGuideCityConfig = {
  /** Verified Tourism Authority of Thailand page for the province. */
  officialSource: { label: string; href: string }
  /** Prefilled planner idea for the guide's call to action. */
  plannerIdea: string
}

const MINIMUM_AREAS_FOR_A_COMPARISON = 2

export const STAY_GUIDE_CITIES: Partial<Record<AgodaAreaCitySlug, StayGuideCityConfig>> = {
  pattaya: {
    officialSource: {
      label: 'Tourism Authority of Thailand: Chon Buri destination overview',
      href: 'https://www.tourismthailand.org/Destinations/Provinces/Chon-Buri/464',
    },
    plannerIdea: 'Pattaya 3 days beaches and day trips',
  },
  krabi: {
    officialSource: {
      label: 'Tourism Authority of Thailand: Krabi destination overview',
      href: 'https://www.tourismthailand.org/Destinations/Provinces/Krabi/344',
    },
    plannerIdea: 'Krabi 3 days islands and beaches',
  },
  'koh-samui': {
    officialSource: {
      label: 'Tourism Authority of Thailand: Surat Thani destination overview',
      href: 'https://www.tourismthailand.org/Destinations/Provinces/Surat-Thani/354',
    },
    plannerIdea: 'Koh Samui 4 days beaches and island time',
  },
}

export type StayAreaGuideDraft = Omit<ThailandGuideArticle, 'href' | 'canonicalUrl'>

function listAreasForCity(
  citySlug: AgodaAreaCitySlug,
  areas: readonly AgodaAreaRecommendation[],
): AgodaAreaRecommendation[] {
  return areas.filter(area => area.citySlug === citySlug)
}

/** Latest review date across the areas, so the guide never claims to be fresher. */
function latestReviewDate(areas: readonly AgodaAreaRecommendation[]): string {
  return areas
    .map(area => area.reviewedAt.slice(0, 10))
    .sort()
    .at(-1) as string
}

function uniqueReviewers(areas: readonly AgodaAreaRecommendation[]): string {
  return [...new Set(areas.map(area => area.reviewedBy))].sort().join(', ')
}

export function buildStayAreaGuideDraft(
  citySlug: AgodaAreaCitySlug,
  areas: readonly AgodaAreaRecommendation[] = reviewedAgodaAreaRecommendations,
): StayAreaGuideDraft | null {
  const config = STAY_GUIDE_CITIES[citySlug]
  if (!config) return null

  const cityAreas = listAreasForCity(citySlug, areas)
  if (cityAreas.length < MINIMUM_AREAS_FOR_A_COMPARISON) return null

  const cityName = AGODA_AREA_CITY_NAMES[citySlug]
  const names = cityAreas.map(area => area.name)
  const reviewedAt = latestReviewDate(cityAreas)

  const title = `Where to Stay in ${cityName}: ${names.join(' vs ')}`

  return {
    citySlug: citySlug as ThailandGuideArticle['citySlug'],
    cityName,
    slug: 'where-to-stay',
    stayAreaCitySlug: citySlug,
    title,
    seoTitle: `${title} | RadarScout`,
    description: `Compare ${names.join(', ')} before choosing a ${cityName} base — who each area suits and what each one costs you.`,
    eyebrow: `${cityName} stay-area decision`,
    quickAnswer: cityAreas
      .map(area => `Choose ${area.name} for ${area.bestFor.toLowerCase()}.`)
      .join(' '),
    bestFor: cityAreas.map(area => `${area.name} — ${area.bestFor}`),
    // Every trade-off a reviewer recorded, attributed to its area so a reader
    // can tell which one the caveat belongs to.
    notIdealFor: cityAreas.flatMap(area =>
      area.tradeoffs.map(tradeoff => `${area.name}: ${tradeoff}`),
    ),
    sections: [
      ...cityAreas.map(area => ({
        heading: area.name,
        paragraphs: [area.summary, `Best for: ${area.bestFor}.`],
        checklist: area.tradeoffs,
      })),
      // Closing section is method, not local fact: what to confirm on the
      // partner's own page once the area is chosen. The first item restates
      // the caveat every reviewer recorded — an area name is not an address.
      {
        heading: 'Before you book',
        paragraphs: [
          `Choosing the ${cityName} area narrows the decision; it does not finish it. Areas here cover enough ground that two properties sharing an area label can sit a long walk apart, so confirm the specific location on the booking partner's own page before you commit.`,
          'RadarScout does not hold rooms, prices, or availability. Everything below is checked on the partner page, where the current terms live.',
        ],
        checklist: [
          'The property’s position inside the area, not just the area name',
          'Walking distance to the things you picked the area for',
          'Transfer time from your arrival point, and who arranges it',
          'Current price, cancellation terms, and what the rate includes',
        ],
      },
    ],
    takeaway: `Pick the ${cityName} area that matches how you want to spend your days, then compare rooms inside it.`,
    plannerHref: `/planner?idea=${encodeURIComponent(config.plannerIdea)}`,
    plannerLabel: `Plan my ${cityName} days`,
    officialSources: [config.officialSource],
    author: { name: 'RadarScout Editorial Team', href: '/about-us' },
    // The published byline is the desk, as on every other guide; the specific
    // reviewer and date stay in reviewMethod, where they can be audited.
    reviewedBy: 'RadarScout Thailand desk',
    publishedAt: reviewedAt,
    updatedAt: reviewedAt,
    reviewMethod: `This guide is composed from RadarScout's reviewed ${cityName} neighbourhood records. Each area's suitability and trade-offs were checked by ${uniqueReviewers(cityAreas)} on ${reviewedAt}; nothing here restates an operator's own description, and no stock, price, or availability claim is made.`,
  }
}

/** Drafts for every configured city that has enough reviewed areas. */
export function buildStayAreaGuideDrafts(
  areas: readonly AgodaAreaRecommendation[] = reviewedAgodaAreaRecommendations,
): StayAreaGuideDraft[] {
  return (Object.keys(STAY_GUIDE_CITIES) as AgodaAreaCitySlug[])
    .map(citySlug => buildStayAreaGuideDraft(citySlug, areas))
    .filter((draft): draft is StayAreaGuideDraft => draft !== null)
}
