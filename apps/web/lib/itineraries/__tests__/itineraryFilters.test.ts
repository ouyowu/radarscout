import { describe, expect, it } from 'vitest'
import type { ReviewedViatorProduct } from '../../viator/reviewedViatorProducts'
import { filterItineraryProducts, getStopsForPace } from '../itineraryFilters'
import { getThailandItineraryTemplate } from '../thailandTemplates'

const products = [
  {
    id: 'viator_food1',
    city: 'Bangkok',
    tags: ['food', 'culture'],
  },
  {
    id: 'viator_boat1',
    city: 'Bangkok',
    tags: ['boat', 'evening'],
  },
  {
    id: 'viator_phuket1',
    city: 'Phuket',
    tags: ['food'],
  },
] as const satisfies readonly Pick<ReviewedViatorProduct, 'id' | 'city' | 'tags'>[]

describe('itinerary workspace filters', () => {
  it('changes stop density locally for chill, balanced and packed pace', () => {
    const template = getThailandItineraryTemplate('bangkok', 3)
    const day = template?.dayPlans[0]

    expect(day).toBeDefined()
    expect(getStopsForPace(day!, 'chill')).toHaveLength(2)
    expect(getStopsForPace(day!, 'balanced')).toHaveLength(3)
    expect(getStopsForPace(day!, 'packed')).toHaveLength(4)
  })

  it('filters reviewed products by city and selected themes', () => {
    expect(filterItineraryProducts(products, 'Bangkok', [])).toHaveLength(2)
    expect(filterItineraryProducts(products, 'Bangkok', ['food']).map(product => product.id))
      .toEqual(['viator_food1'])
    expect(filterItineraryProducts(products, 'Bangkok', ['nature'])).toEqual([])
  })
})
