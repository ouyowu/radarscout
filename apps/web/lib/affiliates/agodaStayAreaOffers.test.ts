import { describe, expect, it } from 'vitest'
import type { ReviewedAgodaStayAreaOffer } from './agodaStayAreaOffers'
import { getReviewedAgodaStayAreasForDestination } from './agodaStayAreaOffers'

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
] satisfies ReviewedAgodaStayAreaOffer[]

describe('reviewed Agoda stay-area offers', () => {
  it('matches exact reviewed city names or slugs', () => {
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Chiang Mai')).toHaveLength(1)
    expect(getReviewedAgodaStayAreasForDestination(offers, 'chiang-mai')).toHaveLength(1)
  })

  it('does not use partial or unsupported destination matches', () => {
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Thailand')).toEqual([])
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Chiang')).toEqual([])
    expect(getReviewedAgodaStayAreasForDestination(offers, 'Tokyo')).toEqual([])
  })
})
