import {
  loadReviewedViatorProducts,
  type ReviewedViatorProduct,
} from './reviewedViatorProducts'
import {
  hasReviewedViatorCatalogueDuration,
  type ReviewedViatorCatalogueDuration,
} from './reviewedViatorCatalogue'

const themeTags = {
  culture: ['culture', 'temples', 'history', 'markets', 'city'],
  food: ['food', 'dining', 'dinner-cruise'],
  nature: ['nature', 'waterfalls', 'beach', 'islands', 'outdoors', 'viewpoints'],
  adventure: ['adventure', 'atv', 'zipline', 'kayaking', 'snorkeling', 'canoeing', 'jet-ski'],
} as const

export type CatalogTheme = keyof typeof themeTags

const requiredCatalogueDurations: readonly ReviewedViatorCatalogueDuration[] = [
  'half-day',
  'full-day',
]

export type ViatorCatalogCoverageTarget = {
  city: string
  minimumProducts: number
  minimumProductsByTheme: number
  themes: readonly CatalogTheme[]
  requestedDayCounts: readonly number[]
}

export const viatorCatalogCoverageTargets: readonly ViatorCatalogCoverageTarget[] = [
  {
    city: 'Chiang Mai',
    minimumProducts: 12,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
  {
    city: 'Bangkok',
    minimumProducts: 12,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
  {
    city: 'Phuket',
    minimumProducts: 12,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
  {
    city: 'Krabi',
    minimumProducts: 12,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
  {
    city: 'Chiang Rai',
    minimumProducts: 8,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3],
  },
  {
    city: 'Hua Hin',
    minimumProducts: 8,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3],
  },
  {
    city: 'Pai',
    minimumProducts: 8,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3],
  },
  {
    city: 'Khao Sok',
    minimumProducts: 8,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3],
  },
  {
    city: 'Koh Samui',
    minimumProducts: 12,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
  {
    city: 'Pattaya',
    minimumProducts: 10,
    minimumProductsByTheme: 1,
    themes: ['culture', 'food', 'nature', 'adventure'],
    requestedDayCounts: [1, 3, 5],
  },
]

export type ThemeCoverage = {
  theme: CatalogTheme
  productCount: number
  minimumProducts: number
  covered: boolean
}

export type MultiDayCoverage = {
  days: number
  availableDistinctExperiences: number
  covered: boolean
}

export type DurationCoverage = {
  duration: ReviewedViatorCatalogueDuration
  productCount: number
  minimumProducts: 1
  covered: boolean
}

export type CityCatalogCoverage = {
  city: string
  productCount: number
  minimumProducts: number
  missingProducts: number
  themeCoverage: ThemeCoverage[]
  multiDayCoverage: MultiDayCoverage[]
  durationCoverage: DurationCoverage[]
  needsNewCandidateBatch: boolean
}

export type ViatorCatalogCoverageReport = {
  totalProducts: number
  cities: CityCatalogCoverage[]
}

function cityProducts(products: readonly ReviewedViatorProduct[], city: string) {
  return products.filter((product) => product.city === city)
}

function hasTheme(product: ReviewedViatorProduct, theme: CatalogTheme) {
  const tagsForTheme: readonly string[] = themeTags[theme]
  return product.tags.some((tag) => tagsForTheme.includes(tag))
}

export function auditViatorCatalogCoverage(
  products: readonly ReviewedViatorProduct[] = loadReviewedViatorProducts(),
  options: { targets?: readonly ViatorCatalogCoverageTarget[] } = {},
): ViatorCatalogCoverageReport {
  const targets = options.targets ?? viatorCatalogCoverageTargets

  return {
    totalProducts: products.length,
    cities: targets.map((target) => {
      const productsForCity = cityProducts(products, target.city)
      const productCount = productsForCity.length
      const missingProducts = Math.max(0, target.minimumProducts - productCount)
      const themeCoverage = target.themes.map((theme) => {
        const productCountForTheme = productsForCity.filter((product) => hasTheme(product, theme)).length

        return {
          theme,
          productCount: productCountForTheme,
          minimumProducts: target.minimumProductsByTheme,
          covered: productCountForTheme >= target.minimumProductsByTheme,
        }
      })
      const multiDayCoverage = target.requestedDayCounts.map((days) => ({
        days,
        availableDistinctExperiences: productCount,
        covered: productCount >= days,
      }))
      const durationCoverage = requiredCatalogueDurations.map((duration) => {
        const productCountForDuration = productsForCity.filter((product) => (
          hasReviewedViatorCatalogueDuration(product, duration)
        )).length

        return {
          duration,
          productCount: productCountForDuration,
          minimumProducts: 1 as const,
          covered: productCountForDuration >= 1,
        }
      })

      return {
        city: target.city,
        productCount,
        minimumProducts: target.minimumProducts,
        missingProducts,
        themeCoverage,
        multiDayCoverage,
        durationCoverage,
        needsNewCandidateBatch: missingProducts > 0
          || themeCoverage.some((coverage) => !coverage.covered)
          || multiDayCoverage.some((coverage) => !coverage.covered)
          || durationCoverage.some((coverage) => !coverage.covered),
      }
    }),
  }
}
