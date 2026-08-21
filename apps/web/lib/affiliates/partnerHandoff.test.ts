import { describe, expect, it } from 'vitest'
import {
  buildPartnerHandoffAnalyticsProps,
  createPartnerHandoffRecord,
  resolveReviewedBookingHandoffProvider,
} from './partnerHandoff'

describe('partnerHandoff', () => {
  it('normalizes an approved Viator product handoff with safe intent metadata', () => {
    const href = 'https://www.viator.com/tours/Chiang-Mai/Reviewed-Day-Trip/d5267-12345P1?pid=P00309837&mcid=42383&medium=link'
    const record = createPartnerHandoffRecord({
      href,
      provider: 'viator',
      placement: 'tour_detail_primary',
      destination: 'Chiang Mai',
      productId: 'viator_12345p1',
      recommendationSource: 'tour-detail',
      reasonCode: 'destination_match',
      durationDays: 3,
      pace: 'moderate',
      tripContext: {
        startDate: '2099-12-10',
        endDate: '2099-12-13',
        groupSize: 4,
        adultCount: 2,
        childCount: 2,
        travelerType: 'family',
      },
    })

    expect(record).toEqual({
      href,
      provider: 'viator',
      placement: 'tour_detail_primary',
      destination: 'Chiang Mai',
      productId: 'viator_12345p1',
      recommendationSource: 'tour-detail',
      reasonCode: 'destination_match',
      durationDays: 3,
      pace: 'moderate',
      attributionSource: 'viator_affiliate',
      targetHost: 'www.viator.com',
      intent: {
        hasDates: true,
        hasGroupSize: true,
        hasOccupancy: true,
        travelerType: 'family',
        companionType: 'family',
        groupSizeBand: '3-4',
      },
    })
  })

  it('normalizes an Agoda stay handoff without exposing dates or occupancy counts', () => {
    const href = 'https://www.agoda.com/search?city=9395&cid=1969005&checkIn=2099-12-10&checkOut=2099-12-13&adults=2&children=2'
    const record = createPartnerHandoffRecord({
      href,
      provider: 'agoda',
      placement: 'hotel_results',
      destination: 'Bangkok',
      campaign: 'radarscout_stay_area_bangkok',
      tripContext: {
        startDate: '2099-12-10',
        endDate: '2099-12-13',
        groupSize: 4,
        adultCount: 2,
        childCount: 2,
        travelerType: 'family',
      },
    })

    expect(record?.href).toBe(href)
    expect(record?.attributionSource).toBe('agoda_affiliate')
    expect(record?.intent).toEqual({
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
      companionType: 'family',
      groupSizeBand: '3-4',
    })

    const analytics = buildPartnerHandoffAnalyticsProps(record!)
    expect(analytics).toEqual({
      provider: 'agoda',
      placement: 'hotel_results',
      city: 'Bangkok',
      attributionSource: 'agoda_affiliate',
      targetHost: 'www.agoda.com',
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
      companionType: 'family',
      groupSizeBand: '3-4',
    })
    expect(analytics).not.toHaveProperty('href')
    expect(analytics).not.toHaveProperty('campaign')
    expect(analytics).not.toHaveProperty('startDate')
    expect(analytics).not.toHaveProperty('adultCount')
  })

  it('keeps only structured recommendation context in analytics props', () => {
    const record = createPartnerHandoffRecord({
      href: 'https://www.viator.com/tours/Phuket/example/d349-123P1?pid=P00309837',
      provider: 'viator',
      placement: 'planner_filtered_matches',
      destination: 'Phuket',
      productId: 'viator_123p1',
      recommendationSource: 'planner',
      reasonCode: 'interest_match',
      durationDays: 4,
      pace: 'relaxed',
    })

    expect(buildPartnerHandoffAnalyticsProps(record!)).toMatchObject({
      productId: 'viator_123p1',
      recommendationSource: 'planner',
      reasonCode: 'interest_match',
      durationDays: 4,
      pace: 'relaxed',
    })
  })

  it('allows post-handoff next-step attribution without retaining the outbound URL', () => {
    const record = createPartnerHandoffRecord({
      href: 'https://www.viator.com/tours/Chiang-Mai/example/d5267-123P1?pid=P00309837',
      provider: 'viator',
      placement: 'post_handoff_next_step',
      destination: 'Chiang Mai',
      productId: 'viator_123p1',
      recommendationSource: 'tour-detail',
      reasonCode: 'theme_match',
    })

    expect(buildPartnerHandoffAnalyticsProps(record!)).toMatchObject({
      placement: 'post_handoff_next_step',
      productId: 'viator_123p1',
      recommendationSource: 'tour-detail',
      reasonCode: 'theme_match',
    })
    expect(buildPartnerHandoffAnalyticsProps(record!)).not.toHaveProperty('href')
  })

  it('keeps a reviewed recommendation id while excluding the handoff URL', () => {
    const record = createPartnerHandoffRecord({
      href: 'https://widgets.bokun.io/online-sales/channel/experience/1232729',
      provider: 'bokun',
      placement: 'planner_filtered_matches',
      destination: 'Chiang Mai',
      recommendationId: 'bokun:1232729',
      recommendationSource: 'planner',
    })

    const analytics = buildPartnerHandoffAnalyticsProps(record!)
    expect(analytics.recommendationId).toBe('bokun:1232729')
    expect(analytics).not.toHaveProperty('href')
  })

  it('fails closed when the provider and outbound host do not match', () => {
    expect(createPartnerHandoffRecord({
      href: 'https://example.com/redirect?cid=1969005',
      provider: 'agoda',
      placement: 'hotel_results',
      destination: 'Bangkok',
    })).toBeNull()

    expect(createPartnerHandoffRecord({
      href: 'http://www.viator.com/tours/Bangkok/example/d343-123P1',
      provider: 'viator',
      placement: 'tour_detail_primary',
      destination: 'Bangkok',
      productId: 'viator_123p1',
    })).toBeNull()
  })

  it('does not accept commission amounts or raw provider payloads in the contract', () => {
    const record = createPartnerHandoffRecord({
      href: 'https://www.getyourguide.com/bangkok-l169/?partner_id=IMR8EUB',
      provider: 'getyourguide',
      placement: 'city_guide',
      destination: 'Bangkok',
      campaign: 'radarscout_city_guide_bangkok',
      commissionPercent: 12,
      raw: { supplierRate: 100 },
    } as never)

    expect(record).not.toHaveProperty('commissionPercent')
    expect(record).not.toHaveProperty('raw')
    expect(record?.attributionSource).toBe('getyourguide_affiliate')
  })

  it('keeps reviewed Bókun and direct partner handoffs out of Viator attribution', () => {
    expect(resolveReviewedBookingHandoffProvider(
      'https://widgets.bokun.io/online-sales/channel/experience/1232729',
    )).toBe('bokun')
    expect(resolveReviewedBookingHandoffProvider(
      'https://booking.example.com/experience/123',
    )).toBe('direct_partner')
    expect(resolveReviewedBookingHandoffProvider(
      'https://www.viator.com/tours/Bangkok/example/d343-123P1',
    )).toBe('viator')
  })
})
