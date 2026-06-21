import { describe, expect, it } from 'vitest'
import { isThailandCompatibleDestination } from '../destinationIntent'

describe('isThailandCompatibleDestination', () => {
  it('returns true for "Thailand"', () => {
    expect(isThailandCompatibleDestination('Thailand')).toBe(true)
  })

  it('returns true for "Bangkok"', () => {
    expect(isThailandCompatibleDestination('Bangkok')).toBe(true)
  })

  it('returns true for "Phuket"', () => {
    expect(isThailandCompatibleDestination('Phuket')).toBe(true)
  })

  it('returns true for "Chiang Mai"', () => {
    expect(isThailandCompatibleDestination('Chiang Mai')).toBe(true)
  })

  it('returns true for "Krabi"', () => {
    expect(isThailandCompatibleDestination('Krabi')).toBe(true)
  })

  it('returns true for "Hua Hin"', () => {
    expect(isThailandCompatibleDestination('Hua Hin')).toBe(true)
  })

  it('returns true for "Chiang Rai"', () => {
    expect(isThailandCompatibleDestination('Chiang Rai')).toBe(true)
  })

  it('returns true for "Koh Samui"', () => {
    expect(isThailandCompatibleDestination('Koh Samui')).toBe(true)
  })

  it('returns false for "Singapore"', () => {
    expect(isThailandCompatibleDestination('Singapore')).toBe(false)
  })

  it('returns false for "Tokyo"', () => {
    expect(isThailandCompatibleDestination('Tokyo')).toBe(false)
  })

  it('returns false for "Bali"', () => {
    expect(isThailandCompatibleDestination('Bali')).toBe(false)
  })

  it('returns false for "Vietnam"', () => {
    expect(isThailandCompatibleDestination('Vietnam')).toBe(false)
  })

  it('returns false for "Kuala Lumpur"', () => {
    expect(isThailandCompatibleDestination('Kuala Lumpur')).toBe(false)
  })

  it('returns false for mixed Thailand + Singapore destination', () => {
    expect(isThailandCompatibleDestination('Thailand and Singapore')).toBe(false)
  })

  it('returns false for null destination', () => {
    expect(isThailandCompatibleDestination(null)).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isThailandCompatibleDestination('')).toBe(false)
  })

  it('returns false for whitespace-only destination', () => {
    expect(isThailandCompatibleDestination('   ')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isThailandCompatibleDestination(undefined)).toBe(false)
  })

  it('returns false for unclear destination with no Thailand signal', () => {
    expect(isThailandCompatibleDestination('Mountain retreat')).toBe(false)
  })
})
