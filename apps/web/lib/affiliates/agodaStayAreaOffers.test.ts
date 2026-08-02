import { describe, expect, it } from 'vitest'
import type { ReviewedAgodaStayAreaOffer } from './agodaStayAreaOffers'
import {
  buildAgodaStayAreaDecisions,
  getReviewedAgodaStayAreasForDestination,
} from './agodaStayAreaOffers'

const offers = [
  {
    area: {
      id: 'chiang-mai-nimman',
      citySlug: 'chiang-mai',
      city: 'Chiang Mai',
      areaSlug: 'nimman',
      name: 'Nimman',
      bestFor: 'Cafe stays',
      summary: 'A reviewed area.',
      tradeoffs: ['Check the exact street.'],
      reviewedBy: 'owner',
      reviewedAt: '2026-07-22T00:00:00.000Z',
    },
    offer: {
      provider: 'agoda',
      placement: 'hotel_results',
      destination: 'Chiang Mai',
      campaign: 'radarscout_stay_chiang_mai_nimman',
      href: 'https://www.agoda.com/partners/partnersearch.aspx?cid=1234567&pcs=8&tag=radarscout_stay_chiang_mai_nimman',
    },
  },
  {
    area: {
      id: 'chiang-mai-riverside',
      citySlug: 'chiang-mai',
      city: 'Chiang Mai',
      areaSlug: 'riverside',
      name: 'Riverside',
      bestFor: 'Families, more space and quieter evenings',
      summary: 'A lower-density base near the river with resort-style stays.',
      tradeoffs: ['Walking to Old City sights may not be practical.'],
      reviewedBy: 'owner',
      reviewedAt: '2026-07-22T00:00:00.000Z',
    },
    offer: {
      provider: 'agoda',
      placement: 'hotel_results',
      destination: 'Chiang Mai',
      campaign: 'radarscout_stay_chiang_mai_riverside',
      href: 'https://www.agoda.com/partners/partnersearch.aspx?cid=1234567&pcs=8&tag=radarscout_stay_chiang_mai_riverside',
    },
  },
] satisfies ReviewedAgodaStayAreaOffer[]

describe('reviewed Agoda stay-area offers', () => {
  it('matches exact reviewed city names or slugs', () => {
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Chiang Mai')).toHaveLength(2)
    expect(getReviewedAgodaStayAreasForDestination(offers, 'chiang-mai')).toHaveLength(2)
  })

  it('does not use partial or unsupported destination matches', () => {
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Thailand')).toEqual([])
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Chiang')).toEqual([])
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Tokyo')).toEqual([])
  })

  it('ranks reviewed areas from traveler type and interests without inventing hotel facts', () => {
    const decisions = buildAgodaStayAreaDecisions(offers, 'Chiang Mai', {
      travelerType: 'family',
      interests: ['quiet nature'],
      budget: 'mid-range',
    })

    expect(decisions.map(decision => decision.area.name)).toEqual(['Riverside', 'Nimman'])
    expect(decisions[0].fitReasons.join(' ')).toMatch(/family/i)
    expect(decisions[0].fitReasons.join(' ')).toMatch(/quiet nature/i)
    expect(decisions[0].budgetGuidance).toMatch(/mid-range/i)
    expect(decisions[0].budgetGuidance).toMatch(/current Agoda results/i)
    expect(JSON.stringify(decisions)).not.toMatch(/cheapest|lowest price|available now/i)
  })

  it('keeps reviewed order for an unspecified trip and fails closed for unsupported cities', () => {
    expect(buildAgodaStayAreaDecisions(offers, 'Chiang Mai', {
      travelerType: 'unspecified',
      interests: [],
      budget: 'unspecified',
    }).map(decision => decision.area.name)).toEqual(['Nimman', 'Riverside'])

    expect(buildAgodaStayAreaDecisions(offers, 'Tokyo', {
      travelerType: 'family',
      interests: ['food'],
      budget: 'budget',
    })).toEqual([])
  })
})
