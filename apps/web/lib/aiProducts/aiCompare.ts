import {
  loadActivityFeedV1,
  type ActivityFeedV1Item,
} from '@/lib/activityFeed/activityFeedV1'

export const AI_PRODUCT_COMPARISON_SCHEMA_VERSION =
  'radarscout.ai-product-comparison.v1' as const

export type AiProductComparisonProduct = {
  id: string
  title: string
  summary: string
  themes: string[]
  uniqueThemes: string[]
  whyRecommended: string
  bestFor: string[]
  strengths: string[]
  tradeoffs: string[]
  partnerLink: `https://www.radarscout.io/tours/${string}`
  handoff: {
    label: 'Check availability'
    availabilityClaimed: false
  }
}

export type AiProductComparison = {
  schemaVersion: typeof AI_PRODUCT_COMPARISON_SCHEMA_VERSION
  destination: ActivityFeedV1Item['destination']
  productCount: 2 | 3
  sharedThemes: string[]
  products: AiProductComparisonProduct[]
}

export type AiProductComparisonResult =
  | { ok: true; comparison: AiProductComparison }
  | { ok: false; error: 'invalid_product_count' }
  | { ok: false; error: 'duplicate_product_ids' }
  | { ok: false; error: 'unknown_product_ids'; productIds: string[] }
  | { ok: false; error: 'mixed_destinations' }

function normalizedTheme(theme: string): string {
  return theme.trim().toLowerCase()
}

function sharedThemes(products: readonly ActivityFeedV1Item[]): string[] {
  const remainingThemeSets = products
    .slice(1)
    .map(product => new Set(product.themes.map(normalizedTheme)))

  return products[0].themes.filter(theme => (
    remainingThemeSets.every(themes => themes.has(normalizedTheme(theme)))
  ))
}

function toComparisonProduct(
  product: ActivityFeedV1Item,
  sharedThemeSet: ReadonlySet<string>,
): AiProductComparisonProduct {
  return {
    id: product.id,
    title: product.title,
    summary: product.summary,
    themes: [...product.themes],
    uniqueThemes: product.themes.filter(theme => !sharedThemeSet.has(normalizedTheme(theme))),
    whyRecommended: product.recommendation.whyRecommended.value,
    bestFor: [...product.recommendation.bestFor.value],
    strengths: [...product.recommendation.strengths.value],
    tradeoffs: [...product.recommendation.tradeoffs.value],
    partnerLink: `https://www.radarscout.io${product.detailHref}`,
    handoff: {
      label: product.partnerHandoff.label,
      availabilityClaimed: product.partnerHandoff.availabilityClaimed,
    },
  }
}

export function compareAiReadyProducts(
  productIds: readonly string[],
): AiProductComparisonResult {
  if (productIds.length < 2 || productIds.length > 3) {
    return { ok: false, error: 'invalid_product_count' }
  }
  if (new Set(productIds).size !== productIds.length) {
    return { ok: false, error: 'duplicate_product_ids' }
  }

  const catalogue = loadActivityFeedV1()
  const productsById = new Map(catalogue.map(product => [product.id, product]))
  const unknownProductIds = productIds.filter(productId => !productsById.has(productId))
  if (unknownProductIds.length > 0) {
    return {
      ok: false,
      error: 'unknown_product_ids',
      productIds: unknownProductIds,
    }
  }

  const products = productIds.map(productId => productsById.get(productId)!)
  if (products.some(product => product.destination.city !== products[0].destination.city)) {
    return { ok: false, error: 'mixed_destinations' }
  }

  const commonThemes = sharedThemes(products)
  const sharedThemeSet = new Set(commonThemes.map(normalizedTheme))

  return {
    ok: true,
    comparison: {
      schemaVersion: AI_PRODUCT_COMPARISON_SCHEMA_VERSION,
      destination: { ...products[0].destination },
      productCount: products.length as 2 | 3,
      sharedThemes: commonThemes,
      products: products.map(product => toComparisonProduct(product, sharedThemeSet)),
    },
  }
}
