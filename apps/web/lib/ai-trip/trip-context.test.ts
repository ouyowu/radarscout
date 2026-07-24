import { describe, expect, it } from 'vitest'
import { createEmptyTripIntent } from './intent-schema'
import {
  applyConfirmedTripContext,
  deriveTripEndDate,
  InvalidTripContextError,
} from './trip-context'

describe('confirmed trip context', () => {
  it('keeps dates, group size, and traveler type optional', () => {
    const intent = createEmptyTripIntent('en')

    expect(applyConfirmedTripContext(intent)).toBe(intent)
    expect(intent.startDate).toBeNull()
    expect(intent.endDate).toBeNull()
    expect(intent.groupSize).toBeNull()
    expect(intent.adultCount).toBeNull()
    expect(intent.childCount).toBeNull()
    expect(intent.travelerType).toBe('unspecified')
  })

  it('derives the end date from the confirmed start date and duration', () => {
    const intent = createEmptyTripIntent('en')
    intent.durationDays = 3

    const result = applyConfirmedTripContext(intent, {
      startDate: '2099-12-10',
      groupSize: 4,
      travelerType: 'family',
    })

    expect(result).toMatchObject({
      startDate: '2099-12-10',
      endDate: '2099-12-13',
      groupSize: 4,
      travelerType: 'family',
    })
    expect(deriveTripEndDate('2099-12-10', 3)).toBe('2099-12-13')
  })

  it('derives group size only from explicitly confirmed adult and child counts', () => {
    const intent = createEmptyTripIntent('en')
    intent.durationDays = 3

    const result = applyConfirmedTripContext(intent, {
      adultCount: 2,
      childCount: 2,
    })

    expect(result).toMatchObject({
      groupSize: 4,
      adultCount: 2,
      childCount: 2,
    })
  })

  it.each([
    [{ startDate: 'December 10', groupSize: 2 }],
    [{ startDate: '2026-02-30', groupSize: 2 }],
    [{ startDate: '2000-01-01', groupSize: 2 }],
    [{ startDate: '2026-12-10', groupSize: 0 }],
    [{ startDate: '2026-12-10', groupSize: 11 }],
    [{ startDate: '2026-12-10', groupSize: 2, travelerType: 'tour-group' }],
    [{ startDate: '2026-12-10', groupSize: 2, endDate: '2026-12-13' }],
    [{ adultCount: 2 }],
    [{ childCount: 0 }],
    [{ adultCount: 0, childCount: 0 }],
    [{ adultCount: 2, childCount: -1 }],
    [{ adultCount: 10, childCount: 1 }],
    [{ groupSize: 3, adultCount: 2, childCount: 2 }],
  ])('rejects unconfirmed or malformed context without guessing: %j', input => {
    const intent = createEmptyTripIntent('en')
    intent.durationDays = 3

    expect(() => applyConfirmedTripContext(intent, input)).toThrow(InvalidTripContextError)
  })
})
