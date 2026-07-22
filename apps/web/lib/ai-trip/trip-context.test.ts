import { describe, expect, it } from 'vitest'
import { createEmptyTripIntent } from './intent-schema'
import {
  applyConfirmedTripContext,
  deriveTripEndDate,
  InvalidTripContextError,
} from './trip-context'

describe('confirmed trip context', () => {
  it('keeps dates and group size optional', () => {
    const intent = createEmptyTripIntent('en')

    expect(applyConfirmedTripContext(intent)).toBe(intent)
    expect(intent.startDate).toBeNull()
    expect(intent.endDate).toBeNull()
    expect(intent.groupSize).toBeNull()
  })

  it('derives the end date from the confirmed start date and duration', () => {
    const intent = createEmptyTripIntent('en')
    intent.durationDays = 3

    const result = applyConfirmedTripContext(intent, {
      startDate: '2099-12-10',
      groupSize: 4,
    })

    expect(result).toMatchObject({
      startDate: '2099-12-10',
      endDate: '2099-12-13',
      groupSize: 4,
    })
    expect(deriveTripEndDate('2099-12-10', 3)).toBe('2099-12-13')
  })

  it.each([
    [{ startDate: 'December 10', groupSize: 2 }],
    [{ startDate: '2026-02-30', groupSize: 2 }],
    [{ startDate: '2000-01-01', groupSize: 2 }],
    [{ startDate: '2026-12-10', groupSize: 0 }],
    [{ startDate: '2026-12-10', groupSize: 11 }],
    [{ startDate: '2026-12-10', groupSize: 2, endDate: '2026-12-13' }],
  ])('rejects unconfirmed or malformed context without guessing: %j', input => {
    const intent = createEmptyTripIntent('en')
    intent.durationDays = 3

    expect(() => applyConfirmedTripContext(intent, input)).toThrow(InvalidTripContextError)
  })
})
