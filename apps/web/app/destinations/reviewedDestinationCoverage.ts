import {
  listReviewedViatorPublicCatalogueCities,
  loadReviewedViatorPublicCatalogue,
} from '@/lib/viator/reviewedViatorPublicCatalogue'

const featuredCityOrder = [
  'bangkok',
  'chiang-mai',
  'phuket',
  'pattaya',
  'krabi',
  'koh-samui',
] as const

const publicProducts = loadReviewedViatorPublicCatalogue()
const cityRecords = listReviewedViatorPublicCatalogueCities()

function mostUsefulTags(city: string): string[] {
  const frequency = new Map<string, number>()

  for (const product of publicProducts) {
    if (product.destination !== city) continue

    for (const tag of product.tags) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1)
    }
  }

  return [...frequency.entries()]
    .sort(
      ([leftTag, leftCount], [rightTag, rightCount]) =>
        rightCount - leftCount || leftTag.localeCompare(rightTag),
    )
    .slice(0, 4)
    .map(([tag]) => tag)
}

const reviewedCities = cityRecords
  .map((city) => {
    const productCount = publicProducts.filter(
      (product) => product.destination === city.label,
    ).length

    return {
      ...city,
      href: `/tours?city=${city.slug}`,
      productCount,
      tags: mostUsefulTags(city.label),
    }
  })
  .sort((left, right) => {
    const leftPriority = featuredCityOrder.indexOf(
      left.slug as (typeof featuredCityOrder)[number],
    )
    const rightPriority = featuredCityOrder.indexOf(
      right.slug as (typeof featuredCityOrder)[number],
    )
    const leftRank = leftPriority === -1 ? featuredCityOrder.length : leftPriority
    const rightRank = rightPriority === -1 ? featuredCityOrder.length : rightPriority

    return leftRank - rightRank || left.label.localeCompare(right.label)
  })

export const reviewedDestinationCoverage = {
  productCount: publicProducts.length,
  cityCount: reviewedCities.length,
  cities: reviewedCities,
}
