import type { TravelerType, TripIntent } from './intent-schema'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MAX_GROUP_SIZE = 10
const MAX_CHILD_COUNT = 9
const ALLOWED_INPUT_KEYS = new Set([
  'startDate',
  'groupSize',
  'adultCount',
  'childCount',
  'travelerType',
])
const ALLOWED_TRAVELER_TYPES = new Set<TravelerType>([
  'solo',
  'couple',
  'family',
  'friends',
  'business',
  'unspecified',
])

export type ConfirmedTripContextInput = {
  startDate?: string | null
  groupSize?: number | null
  adultCount?: number | null
  childCount?: number | null
  travelerType?: TravelerType | null
}

export class InvalidTripContextError extends Error {
  constructor() {
    super('Invalid confirmed trip context')
    this.name = 'InvalidTripContextError'
  }
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function isCurrentOrFutureDate(value: string): boolean {
  return value >= new Date().toISOString().slice(0, 10)
}

export function deriveTripEndDate(startDate: string, durationDays: number | null): string | null {
  if (!isValidIsoDate(startDate)) return null
  if (!Number.isInteger(durationDays) || !durationDays || durationDays < 1 || durationDays > 30) return null

  const endDate = new Date(`${startDate}T00:00:00.000Z`)
  endDate.setUTCDate(endDate.getUTCDate() + durationDays)
  return endDate.toISOString().slice(0, 10)
}

export function applyConfirmedTripContext(
  intent: TripIntent,
  input?: unknown,
): TripIntent {
  if (input === undefined) return intent
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new InvalidTripContextError()
  }

  const record = input as Record<string, unknown>
  if (Object.keys(record).some(key => !ALLOWED_INPUT_KEYS.has(key))) {
    throw new InvalidTripContextError()
  }

  const { startDate, groupSize, adultCount, childCount, travelerType } = record
  if (startDate !== undefined && startDate !== null && (
    typeof startDate !== 'string'
    || !isValidIsoDate(startDate)
    || !isCurrentOrFutureDate(startDate)
  )) {
    throw new InvalidTripContextError()
  }
  if (groupSize !== undefined && groupSize !== null && (
    typeof groupSize !== 'number'
    || !Number.isInteger(groupSize)
    || groupSize < 1
    || groupSize > MAX_GROUP_SIZE
  )) {
    throw new InvalidTripContextError()
  }
  const hasAdultCount = adultCount !== undefined && adultCount !== null
  const hasChildCount = childCount !== undefined && childCount !== null
  if (hasAdultCount !== hasChildCount) {
    throw new InvalidTripContextError()
  }
  if (hasAdultCount && hasChildCount && (
    typeof adultCount !== 'number'
    || !Number.isInteger(adultCount)
    || adultCount < 1
    || adultCount > MAX_GROUP_SIZE
    || typeof childCount !== 'number'
    || !Number.isInteger(childCount)
    || childCount < 0
    || childCount > MAX_CHILD_COUNT
    || adultCount + childCount > MAX_GROUP_SIZE
    || (typeof groupSize === 'number' && groupSize !== adultCount + childCount)
  )) {
    throw new InvalidTripContextError()
  }
  if (travelerType !== undefined && travelerType !== null && (
    typeof travelerType !== 'string'
    || !ALLOWED_TRAVELER_TYPES.has(travelerType as TravelerType)
  )) {
    throw new InvalidTripContextError()
  }

  if (typeof startDate === 'string') {
    intent.startDate = startDate
    intent.endDate = deriveTripEndDate(startDate, intent.durationDays)
  }
  if (typeof adultCount === 'number' && typeof childCount === 'number') {
    intent.adultCount = adultCount
    intent.childCount = childCount
    intent.groupSize = adultCount + childCount
  } else if (typeof groupSize === 'number') {
    intent.groupSize = groupSize
  }
  if (typeof travelerType === 'string') {
    intent.travelerType = travelerType as TravelerType
  }

  return intent
}
