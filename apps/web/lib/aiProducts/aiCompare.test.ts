import { describe, expect, it } from 'vitest'

import { loadAiReadyProductCatalogue } from './aiReadyProductSchema'
import {
  AI_PRODUCT_COMPARISON_SCHEMA_VERSION,
  compareAiReadyProducts,
} from './aiCompare'

function findComparableProductIds(): [string, string] {
  const products = loadAiReadyProductCatalogue()

  for (const product of products) {
    const match = products.find(candidate => (
      candidate.id !== product.id
      && candidate.destination.city === product.destination.city
      && candidate.themes.some(theme => product.themes.includes(theme))
    ))
    if (match) return [product.id, match.id]
  }

  throw new Error('Expected at least two reviewed products with one shared city and theme')
}

function findCrossCityProductIds(): [string, string] {
  const products = loadAiReadyProductCatalogue()
  const first = products[0]
  const second = products.find(product => product.destination.city !== first.destination.city)

  if (!second) throw new Error('Expected reviewed products in at least two cities')
  return [first.id, second.id]
}

function findThreeSameCityProductIds(): [string, string, string] {
  const products = loadAiReadyProductCatalogue()

  for (const product of products) {
    const matches = products.filter(candidate => (
      candidate.destination.city === product.destination.city
    ))
    if (matches.length >= 3) {
      return [matches[0].id, matches[1].id, matches[2].id]
    }
  }

  throw new Error('Expected at least three reviewed products in one city')
}

describe('AI-ready product comparison', () => {
  it('compares reviewed products in request order using only decision-support fields', () => {
    const ids = findComparableProductIds()
    const result = compareAiReadyProducts(ids)

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.comparison.schemaVersion).toBe(AI_PRODUCT_COMPARISON_SCHEMA_VERSION)
    expect(result.comparison.productCount).toBe(2)
    expect(result.comparison.products.map(product => product.id)).toEqual(ids)
    expect(result.comparison.sharedThemes.length).toBeGreaterThan(0)

    for (const product of result.comparison.products) {
      expect(product.whyRecommended.trim()).not.toBe('')
      expect(product.bestFor.length).toBeGreaterThan(0)
      expect(product.strengths.length).toBeGreaterThan(0)
      expect(product.tradeoffs.length).toBeGreaterThan(0)
      expect(product.partnerLink).toBe(`https://www.radarscout.io/tours/${product.id}`)
      expect(product.handoff).toEqual({
        label: 'Check availability',
        availabilityClaimed: false,
      })
    }

    expect(JSON.stringify(result.comparison)).not.toMatch(
      /viator\.com|price|currency|availability\"\s*:|rating|reviewCount|supplier|commission|raw|winner|best value/i,
    )
  })

  it('requires two or three unique reviewed product ids', () => {
    const [first, second] = findComparableProductIds()

    expect(compareAiReadyProducts([first])).toEqual({
      ok: false,
      error: 'invalid_product_count',
    })
    expect(compareAiReadyProducts([first, second, first])).toEqual({
      ok: false,
      error: 'duplicate_product_ids',
    })
    expect(compareAiReadyProducts([first, second, first, second])).toEqual({
      ok: false,
      error: 'invalid_product_count',
    })
  })

  it('supports a stable three-product comparison without declaring a winner', () => {
    const ids = findThreeSameCityProductIds()
    const result = compareAiReadyProducts(ids)

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.comparison.productCount).toBe(3)
    expect(result.comparison.products.map(product => product.id)).toEqual(ids)
    expect(result.comparison).not.toHaveProperty('winner')
    expect(result.comparison).not.toHaveProperty('ranking')
  })

  it('fails closed for unknown or non-reviewed product ids', () => {
    const [first] = findComparableProductIds()

    expect(compareAiReadyProducts([first, 'viator_not_reviewed'])).toEqual({
      ok: false,
      error: 'unknown_product_ids',
      productIds: ['viator_not_reviewed'],
    })
  })

  it('rejects cross-city comparisons rather than implying unlike routes are equivalent', () => {
    const ids = findCrossCityProductIds()

    expect(compareAiReadyProducts(ids)).toEqual({
      ok: false,
      error: 'mixed_destinations',
    })
  })
})
