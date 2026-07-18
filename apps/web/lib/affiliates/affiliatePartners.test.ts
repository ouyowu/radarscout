import { describe, expect, it } from 'vitest'
import {
  affiliatePlacementPolicy,
  buildGetYourGuideCityGuideOffer,
  getActiveAffiliateProviders,
  primaryPreDepartureProvider,
  validateAffiliateHref,
} from './affiliatePartners'

describe('affiliate partner policy', () => {
  it('keeps the approved provider order for each placement', () => {
    expect(affiliatePlacementPolicy.hotel_results).toEqual(['agoda', 'trip_com', 'expedia'])
    expect(affiliatePlacementPolicy.city_guide).toEqual(['getyourguide', 'klook'])
    expect(affiliatePlacementPolicy.multi_city_transport).toEqual(['12go'])
    expect(affiliatePlacementPolicy.pre_departure).toEqual(['airalo', 'yesim'])
  })

  it('exposes only providers with a reviewed public tracking configuration', () => {
    expect(getActiveAffiliateProviders('city_guide')).toEqual(['getyourguide'])
    expect(getActiveAffiliateProviders('hotel_results')).toEqual([])
    expect(getActiveAffiliateProviders('multi_city_transport')).toEqual([])
    expect(getActiveAffiliateProviders('pre_departure')).toEqual([])
  })

  it('keeps pre-departure recommendations off until exactly one primary provider is chosen', () => {
    expect(primaryPreDepartureProvider).toBeNull()
    expect(affiliatePlacementPolicy.pre_departure).toEqual(['airalo', 'yesim'])
    expect(getActiveAffiliateProviders('pre_departure')).toHaveLength(0)
  })

  it('builds a tracked GetYourGuide city link for reviewed Thailand cities', () => {
    const offer = buildGetYourGuideCityGuideOffer('chiang-mai')

    expect(offer).toMatchObject({
      provider: 'getyourguide',
      placement: 'city_guide',
      destination: 'Chiang Mai',
      campaign: 'radarscout_city_guide_chiang_mai',
    })

    const url = new URL(offer!.href)
    expect(url.origin).toBe('https://www.getyourguide.com')
    expect(url.pathname).toBe('/chiang-mai-l271/')
    expect(url.searchParams.get('partner_id')).toBe('IMR8EUB')
    expect(url.searchParams.get('cmp')).toBe('radarscout_city_guide_chiang_mai')
  })

  it('does not invent links for unsupported destinations', () => {
    expect(buildGetYourGuideCityGuideOffer('tokyo')).toBeNull()
  })

  it('rejects unsafe, lookalike, and untracked affiliate URLs', () => {
    expect(validateAffiliateHref('getyourguide', 'http://www.getyourguide.com/bangkok-l169/?partner_id=IMR8EUB')).toBe(false)
    expect(validateAffiliateHref('getyourguide', 'https://www.getyourguide.com.example.com/bangkok-l169/?partner_id=IMR8EUB')).toBe(false)
    expect(validateAffiliateHref('getyourguide', 'https://www.getyourguide.com/bangkok-l169/')).toBe(false)
    expect(validateAffiliateHref('getyourguide', 'https://www.getyourguide.com/bangkok-l169/?partner_id=IMR8EUB')).toBe(true)
  })
})
