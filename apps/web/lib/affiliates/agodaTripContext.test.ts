import { describe, expect, it } from 'vitest'

import { addAgodaTripContextToHref } from './agodaTripContext'

const agodaHref = 'https://www.agoda.com/partners/partnersearch.aspx?cid=1234567&pcs=8&tag=radarscout_stay_chiang_mai_nimman'

describe('Agoda trip-context deep link', () => {
  it('adds the confirmed date range without changing affiliate attribution', () => {
    const href = addAgodaTripContextToHref(agodaHref, {
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      groupSize: 4,
      adultCount: null,
      childCount: null,
      travelerType: 'family',
    })
    const url = new URL(href)

    expect(url.searchParams.get('cid')).toBe('1234567')
    expect(url.searchParams.get('pcs')).toBe('8')
    expect(url.searchParams.get('tag')).toBe('radarscout_stay_chiang_mai_nimman')
    expect(url.searchParams.get('checkin')).toBe('2026-12-10')
    expect(url.searchParams.get('checkout')).toBe('2026-12-13')
  })

  it('does not guess adult and child occupancy from an ambiguous traveler count', () => {
    const href = addAgodaTripContextToHref(agodaHref, {
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      groupSize: 4,
      adultCount: null,
      childCount: null,
      travelerType: 'family',
    })
    const url = new URL(href)

    expect(url.searchParams.has('NumberofAdults')).toBe(false)
    expect(url.searchParams.has('NumberofChildren')).toBe(false)
    expect(url.searchParams.has('Rooms')).toBe(false)
  })

  it('adds confirmed adult and child occupancy without changing affiliate attribution', () => {
    const href = addAgodaTripContextToHref(agodaHref, {
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      groupSize: 4,
      adultCount: 2,
      childCount: 2,
      travelerType: 'family',
    })
    const url = new URL(href)

    expect(url.searchParams.get('cid')).toBe('1234567')
    expect(url.searchParams.get('NumberofAdults')).toBe('2')
    expect(url.searchParams.get('NumberofChildren')).toBe('2')
    expect(url.searchParams.get('Rooms')).toBe('1')
  })

  it('adds confirmed occupancy when stay dates are not set', () => {
    const href = addAgodaTripContextToHref(agodaHref, {
      startDate: null,
      endDate: null,
      groupSize: 3,
      adultCount: 2,
      childCount: 1,
      travelerType: 'family',
    })
    const url = new URL(href)

    expect(url.searchParams.get('cid')).toBe('1234567')
    expect(url.searchParams.has('checkin')).toBe(false)
    expect(url.searchParams.has('checkout')).toBe(false)
    expect(url.searchParams.get('NumberofAdults')).toBe('2')
    expect(url.searchParams.get('NumberofChildren')).toBe('1')
    expect(url.searchParams.get('Rooms')).toBe('1')
  })

  it('fails closed to the original href for non-Agoda or invalid date input', () => {
    expect(addAgodaTripContextToHref('https://example.com/hotel', {
      startDate: '2026-12-10',
      endDate: '2026-12-13',
      groupSize: 2,
      adultCount: null,
      childCount: null,
      travelerType: 'couple',
    })).toBe('https://example.com/hotel')

    expect(addAgodaTripContextToHref(agodaHref, {
      startDate: 'not-a-date',
      endDate: '2026-12-13',
      groupSize: 2,
      adultCount: null,
      childCount: null,
      travelerType: 'couple',
    })).toBe(agodaHref)

    expect(addAgodaTripContextToHref(agodaHref, {
      startDate: '2026-02-31',
      endDate: '2026-03-03',
      groupSize: 2,
      adultCount: null,
      childCount: null,
      travelerType: 'couple',
    })).toBe(agodaHref)
  })
})
