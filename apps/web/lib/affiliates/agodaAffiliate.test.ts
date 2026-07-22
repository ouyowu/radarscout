import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { buildAgodaHotelResultsOffer, buildReviewedAgodaStayAreaOffers } from './agodaAffiliate'
import { reviewedAgodaAreaRecommendations } from './seed/reviewedAgodaAreas'

const originalCid = process.env.AGODA_AFFILIATE_CID

afterEach(() => {
  if (originalCid === undefined) delete process.env.AGODA_AFFILIATE_CID
  else process.env.AGODA_AFFILIATE_CID = originalCid
})

describe('Agoda server-side affiliate handoff', () => {
  it('builds a validated Agoda hotel-results link from the server CID', () => {
    process.env.AGODA_AFFILIATE_CID = '1234567'

    const offer = buildAgodaHotelResultsOffer({
      citySlug: 'chiang-mai',
      areaSlug: 'nimman',
    })

    expect(offer).toMatchObject({
      provider: 'agoda',
      placement: 'hotel_results',
      destination: 'Chiang Mai',
      campaign: 'radarscout_stay_chiang_mai_nimman',
    })

    const url = new URL(offer!.href)
    expect(url.origin).toBe('https://www.agoda.com')
    expect(url.pathname).toBe('/partners/partnersearch.aspx')
    expect(url.searchParams.get('cid')).toBe('1234567')
    expect(url.searchParams.get('pcs')).toBe('8')
    expect(url.searchParams.get('tag')).toBe('radarscout_stay_chiang_mai_nimman')
  })

  it('fails closed when the server CID is absent or invalid', () => {
    delete process.env.AGODA_AFFILIATE_CID

    const input = {
      citySlug: 'bangkok',
      areaSlug: 'riverside',
    }

    expect(buildAgodaHotelResultsOffer(input)).toBeNull()

    process.env.AGODA_AFFILIATE_CID = 'not-a-cid'
    expect(buildAgodaHotelResultsOffer(input)).toBeNull()
  })

  it('rejects unsafe or unsupported destination inputs', () => {
    process.env.AGODA_AFFILIATE_CID = '1234567'

    expect(buildAgodaHotelResultsOffer({
      citySlug: 'tokyo',
      areaSlug: 'shinjuku',
    })).toBeNull()
    expect(buildAgodaHotelResultsOffer({
      citySlug: 'bangkok',
      areaSlug: '../account',
    })).toBeNull()
  })

  it('supports dependency injection without exposing the real environment value', () => {
    delete process.env.AGODA_AFFILIATE_CID

    const offer = buildAgodaHotelResultsOffer(
      {
        citySlug: 'phuket',
        areaSlug: 'kata',
      },
      { cid: '7654321' },
    )

    expect(new URL(offer!.href).searchParams.get('cid')).toBe('7654321')
  })

  it('builds one safe offer per reviewed area and fails closed as a group', () => {
    const offers = buildReviewedAgodaStayAreaOffers(reviewedAgodaAreaRecommendations, { cid: '1234567' })

    expect(offers).toHaveLength(18)
    expect(offers.every(item => item.offer.provider === 'agoda')).toBe(true)
    expect(offers.every(item => item.offer.destination === item.area.city)).toBe(true)
    expect(buildReviewedAgodaStayAreaOffers(reviewedAgodaAreaRecommendations, { cid: 'invalid' })).toEqual([])
  })
})
