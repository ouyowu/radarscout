import type { TripBudget, TravelerType } from '@/lib/ai-trip/intent-schema'

export const ANONYMOUS_TRIP_MEMORY_STORAGE_KEY = 'radarscout:anonymous-trip-memory'

const APPROVED_DESTINATIONS = new Set([
  'Bangkok',
  'Bophut',
  'Chiang Mai',
  'Chiang Rai',
  'Hua Hin',
  'Kanchanaburi',
  'Khao Lak',
  'Ko Chang',
  'Ko Lanta',
  'Ko Lipe',
  'Ko Pha Ngan',
  'Ko Phi Phi Don',
  'Ko Yao Yai',
  'Koh Samui',
  'Koh Tao',
  'Krabi',
  'Mae Hong Son',
  'Pattaya',
  'Phuket',
  'Thailand',
])

const APPROVED_INTERESTS = new Set([
  'anime',
  'beaches',
  'cooking',
  'culture',
  'desert',
  'elephants',
  'food',
  'hiking',
  'local neighborhoods',
  'markets',
  'museums',
  'nightlife',
  'private transfer',
  'shopping',
  'skyline',
  'temples',
])

const APPROVED_BUDGETS = new Set<TripBudget>([
  'budget',
  'mid-range',
  'premium',
  'luxury',
  'unspecified',
])

const APPROVED_TRAVELER_TYPES = new Set<TravelerType>([
  'solo',
  'couple',
  'family',
  'friends',
  'business',
  'unspecified',
])

const GROUP_SIZE_BANDS = new Set(['1', '2', '3-4', '5+'])
const TRAVEL_MONTH = /^20\d{2}-(0[1-9]|1[0-2])$/

export type AnonymousTripMemory = {
  version: 1
  destination: string
  durationDays: number
  interests: string[]
  budgetRange: TripBudget
  travelerType: TravelerType
  groupSizeBand?: '1' | '2' | '3-4' | '5+'
  travelMonth?: string
}

export type AnonymousTripMemoryInput = {
  destination: string | null
  durationDays: number | null
  interests: string[]
  budgetRange: TripBudget
  travelerType: TravelerType
  groupSize: number | null
  startDate: string | null
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function getGroupSizeBand(groupSize: number | null): AnonymousTripMemory['groupSizeBand'] {
  if (groupSize === null || !Number.isInteger(groupSize) || groupSize < 1) return undefined
  if (groupSize === 1) return '1'
  if (groupSize === 2) return '2'
  return groupSize <= 4 ? '3-4' : '5+'
}

function isAnonymousTripMemory(value: unknown): value is AnonymousTripMemory {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const record = value as Record<string, unknown>
  const expectedKeys = new Set([
    'version', 'destination', 'durationDays', 'interests', 'budgetRange', 'travelerType', 'groupSizeBand', 'travelMonth',
  ])
  if (Object.keys(record).some(key => !expectedKeys.has(key))) return false

  return record.version === 1
    && typeof record.destination === 'string'
    && APPROVED_DESTINATIONS.has(record.destination)
    && typeof record.durationDays === 'number'
    && Number.isInteger(record.durationDays)
    && record.durationDays >= 1
    && record.durationDays <= 14
    && Array.isArray(record.interests)
    && record.interests.length <= 5
    && record.interests.every(interest => typeof interest === 'string' && APPROVED_INTERESTS.has(interest))
    && typeof record.budgetRange === 'string'
    && APPROVED_BUDGETS.has(record.budgetRange as TripBudget)
    && typeof record.travelerType === 'string'
    && APPROVED_TRAVELER_TYPES.has(record.travelerType as TravelerType)
    && (record.groupSizeBand === undefined || typeof record.groupSizeBand === 'string' && GROUP_SIZE_BANDS.has(record.groupSizeBand))
    && (record.travelMonth === undefined || typeof record.travelMonth === 'string' && TRAVEL_MONTH.test(record.travelMonth))
}

export function buildAnonymousTripMemory(input: AnonymousTripMemoryInput): AnonymousTripMemory | null {
  if (!input.destination || !APPROVED_DESTINATIONS.has(input.destination)) return null
  if (!input.durationDays || !Number.isInteger(input.durationDays) || input.durationDays < 1 || input.durationDays > 14) return null

  const interests = input.interests
    .filter(interest => APPROVED_INTERESTS.has(interest))
    .slice(0, 5)
  const budgetRange = APPROVED_BUDGETS.has(input.budgetRange) ? input.budgetRange : 'unspecified'
  const travelerType = APPROVED_TRAVELER_TYPES.has(input.travelerType) ? input.travelerType : 'unspecified'
  const travelMonth = input.startDate?.slice(0, 7)

  return {
    version: 1,
    destination: input.destination,
    durationDays: input.durationDays,
    interests,
    budgetRange,
    travelerType,
    ...(getGroupSizeBand(input.groupSize) ? { groupSizeBand: getGroupSizeBand(input.groupSize) } : {}),
    ...(travelMonth && TRAVEL_MONTH.test(travelMonth) ? { travelMonth } : {}),
  }
}

export function readAnonymousTripMemory(storage: StorageLike): AnonymousTripMemory | null {
  try {
    const raw = storage.getItem(ANONYMOUS_TRIP_MEMORY_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (isAnonymousTripMemory(parsed)) return parsed

    storage.removeItem(ANONYMOUS_TRIP_MEMORY_STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

export function writeAnonymousTripMemory(storage: StorageLike, memory: AnonymousTripMemory): void {
  storage.setItem(ANONYMOUS_TRIP_MEMORY_STORAGE_KEY, JSON.stringify(memory))
}

export function clearAnonymousTripMemory(storage: StorageLike): void {
  storage.removeItem(ANONYMOUS_TRIP_MEMORY_STORAGE_KEY)
}

export function formatAnonymousTripMemoryIdea(memory: AnonymousTripMemory): string {
  return [memory.destination, `${memory.durationDays} days`, ...memory.interests].join(' ')
}
