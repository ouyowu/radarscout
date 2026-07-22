import type { TripIntent } from './intent-schema'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MAX_GROUP_SIZE = 10
const ALLOWED_INPUT_KEYS = new Set(['startDate', 'groupSize'])

export type ConfirmedTripContextInput = {
  startDate?: string | null
  groupSize?: number | null
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

  const { startDate, groupSize } = record
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

  if (typeof startDate === 'string') {
    intent.startDate = startDate
    intent.endDate = deriveTripEndDate(startDate, intent.durationDays)
  }
  if (typeof groupSize === 'number') {
    intent.groupSize = groupSize
  }

  return intent
}
