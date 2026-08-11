import { describe, expect, it } from 'vitest'
import {
  buildAnonymousTripMemory,
  clearAnonymousTripMemory,
  readAnonymousTripMemory,
  writeAnonymousTripMemory,
} from '../anonymousTripMemory'

function createStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe('anonymous trip memory', () => {
  it('keeps only the bounded, confirmed trip preferences', () => {
    const input = {
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'food', 'unreviewed free text'],
      budgetRange: 'mid-range' as const,
      travelerType: 'family' as const,
      groupSize: 3,
      startDate: '2026-12-14',
      rawIdea: 'Two adults and a child named Ava want a private pickup at our hotel.',
    }
    const memory = buildAnonymousTripMemory(input)

    expect(memory).toEqual({
      version: 1,
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants', 'food'],
      budgetRange: 'mid-range',
      travelerType: 'family',
      groupSizeBand: '3-4',
      travelMonth: '2026-12',
    })
    expect(JSON.stringify(memory)).not.toContain('Ava')
    expect(JSON.stringify(memory)).not.toContain('2026-12-14')
  })

  it('round-trips a valid memory and lets the traveler clear it', () => {
    const storage = createStorage()
    const memory = buildAnonymousTripMemory({
      destination: 'Phuket',
      durationDays: 4,
      interests: ['islands', 'snorkeling'],
      budgetRange: 'premium',
      travelerType: 'couple',
      groupSize: 2,
      startDate: null,
    })
    expect(memory).not.toBeNull()
    if (!memory) throw new Error('expected valid anonymous trip memory')

    writeAnonymousTripMemory(storage, memory)
    expect(readAnonymousTripMemory(storage)).toEqual(memory)

    clearAnonymousTripMemory(storage)
    expect(readAnonymousTripMemory(storage)).toBeNull()
  })

  it('drops malformed or over-broad browser storage instead of reusing it', () => {
    const storage = createStorage()
    storage.setItem('radarscout:anonymous-trip-memory', JSON.stringify({
      version: 1,
      destination: 'Chiang Mai',
      durationDays: 3,
      interests: ['elephants'],
      email: 'traveler@example.com',
    }))

    expect(readAnonymousTripMemory(storage)).toBeNull()
    expect(storage.getItem('radarscout:anonymous-trip-memory')).toBeNull()
  })
})
