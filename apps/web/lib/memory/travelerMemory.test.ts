import { describe, it, expect, beforeEach } from 'vitest'
import { readTravelerMemory, writeTravelerMemory, type CookieStore } from './travelerMemory'

function createStore(): CookieStore {
  let stored = ''
  const NAME = 'rsm'
  return {
    get: () => stored,
    set: (serialized) => { stored = `${NAME}=${serialized}` },
  }
}

describe('travelerMemory', () => {
  let store: CookieStore

  beforeEach(() => {
    store = createStore()
  })

  it('returns a fresh memory with a deviceId when no cookie exists', () => {
    const mem = readTravelerMemory(store)
    expect(mem.v).toBe(1)
    expect(mem.deviceId).toBeTruthy()
    expect(mem.sessions).toBe(0)
    expect(mem.clickedCategories).toEqual([])
    expect(mem.lastDestination).toBeNull()
  })

  it('persists deviceId across reads', () => {
    const first = readTravelerMemory(store)
    writeTravelerMemory({ sessions: 1 }, store)
    const second = readTravelerMemory(store)
    expect(second.deviceId).toBe(first.deviceId)
  })

  it('increments sessions correctly', () => {
    writeTravelerMemory({ sessions: 1 }, store)
    expect(readTravelerMemory(store).sessions).toBe(1)

    writeTravelerMemory({ sessions: 2 }, store)
    expect(readTravelerMemory(store).sessions).toBe(2)
  })

  it('union-merges clickedCategories without duplicates', () => {
    writeTravelerMemory({ clickedCategories: ['activities'] }, store)
    writeTravelerMemory({ clickedCategories: ['activities', 'accommodation'] }, store)
    expect(readTravelerMemory(store).clickedCategories).toEqual(['activities', 'accommodation'])
  })

  it('rejects unknown clickedCategories', () => {
    writeTravelerMemory({ clickedCategories: ['unknown', 'activities'] }, store)
    expect(readTravelerMemory(store).clickedCategories).toEqual(['activities'])
  })

  it('stores and retrieves lastDestination', () => {
    writeTravelerMemory({ lastDestination: 'Chiang Mai' }, store)
    expect(readTravelerMemory(store).lastDestination).toBe('Chiang Mai')
  })

  it('overwrites lastDestination with a newer value', () => {
    writeTravelerMemory({ lastDestination: 'Bangkok' }, store)
    writeTravelerMemory({ lastDestination: 'Phuket' }, store)
    expect(readTravelerMemory(store).lastDestination).toBe('Phuket')
  })

  it('does not overwrite deviceId on subsequent writes', () => {
    const original = readTravelerMemory(store)
    writeTravelerMemory({ sessions: 5, lastDestination: 'Krabi' }, store)
    expect(readTravelerMemory(store).deviceId).toBe(original.deviceId)
  })
})
