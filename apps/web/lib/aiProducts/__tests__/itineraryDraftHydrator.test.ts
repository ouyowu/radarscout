import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  EXPERIENCE_DESCRIPTION_FALLBACK,
  hydrateItineraryExperienceFacts,
} from '../itineraryDraftHydrator'
import type { AiProductContextItem } from '../buildAiProductContext'
import type { ItineraryDraft } from '../itineraryDraftSchema'

function product(id: string, summary: string | null = `Verified ${id}.`): AiProductContextItem {
  return {
    id,
    title: `Canonical ${id}`,
    city: 'Chiang Mai',
    summary,
    tags: [],
    detailHref: `/tours/${id}`,
    retailPrice: null,
    currency: null,
  }
}

function draft(): ItineraryDraft {
  return {
    destination: 'Chiang Mai',
    durationDays: 1,
    summary: 'One day.',
    days: [{
      day: 1,
      title: 'Day 1',
      theme: 'Exploration',
      items: [
        {
          type: 'experience',
          productId: 'prod_1',
          title: 'Private Helicopter Flight',
          description: 'Fly over Chiang Mai by helicopter.',
          timeOfDay: 'morning',
        },
        {
          type: 'free_time',
          title: 'Explore independently',
          description: 'Walk around at your own pace.',
          timeOfDay: 'afternoon',
        },
      ],
    }],
    warnings: [],
  }
}

describe('hydrateItineraryExperienceFacts', () => {
  it('hydrates canonical facts without mutating its inputs', () => {
    const input = draft()
    const allowedProduct = product('prod_1')
    const originalDraft = structuredClone(input)
    const originalProduct = structuredClone(allowedProduct)

    const result = hydrateItineraryExperienceFacts({
      draft: input,
      allowedProducts: new Map([[allowedProduct.id, allowedProduct]]),
    })

    expect(result.days[0].items[0].title).toBe('Canonical prod_1')
    expect(result.days[0].items[0].description).toBe('Verified prod_1.')
    expect(result).not.toBe(input)
    expect(input).toEqual(originalDraft)
    expect(allowedProduct).toEqual(originalProduct)
  })

  it('uses the safe fallback when the canonical summary is null', () => {
    const allowedProduct = product('prod_1', null)
    const result = hydrateItineraryExperienceFacts({
      draft: draft(),
      allowedProducts: new Map([[allowedProduct.id, allowedProduct]]),
    })

    expect(result.days[0].items[0].description).toBe(EXPERIENCE_DESCRIPTION_FALLBACK)
  })

  it('hydrates two products from their respective canonical facts', () => {
    const input = draft()
    input.days[0].items.push({
      type: 'experience',
      productId: 'prod_2',
      title: 'Invented second title',
      description: 'Invented second description.',
      timeOfDay: 'evening',
    })
    const products = [product('prod_1'), product('prod_2')]

    const result = hydrateItineraryExperienceFacts({
      draft: input,
      allowedProducts: new Map(products.map(item => [item.id, item])),
    })

    expect(result.days[0].items[0].title).toBe('Canonical prod_1')
    expect(result.days[0].items[2].title).toBe('Canonical prod_2')
    expect(result.days[0].items[2].description).toBe('Verified prod_2.')
  })

  it('preserves provider text for non-experience items', () => {
    const input = draft()
    const allowedProduct = product('prod_1')
    const result = hydrateItineraryExperienceFacts({
      draft: input,
      allowedProducts: new Map([[allowedProduct.id, allowedProduct]]),
    })

    expect(result.days[0].items[1]).toEqual(input.days[0].items[1])
  })

  it('fails closed when an experience product is unavailable', () => {
    expect(() =>
      hydrateItineraryExperienceFacts({ draft: draft(), allowedProducts: new Map() }),
    ).toThrow('Validated itinerary references an unavailable product')
  })
})
