import { describe, expect, it } from 'vitest'
import { parseTripIntent } from './parse-intent'

describe('parseTripIntent', () => {
  it('extracts destination, duration, language, and interests from an English prompt', () => {
    const result = parseTripIntent('Barcelona, 4 days 3 nights, cultural food trip, less crowded')

    expect(result.intent.destination).toBe('Barcelona')
    expect(result.intent.durationDays).toBe(4)
    expect(result.intent.durationNights).toBe(3)
    expect(result.intent.language).toBe('en')
    expect(result.intent.interests).toEqual(expect.arrayContaining(['culture', 'food']))
    expect(result.intent.avoid).toContain('crowds')
    expect(result.intent.excludedStyles).toContain('less crowded')
    expect(result.bookingEnabled).toBe(false)
    expect(result.productRetrievalEnabled).toBe(false)
    expect(result.availabilityEnabled).toBe(false)
  })

  it('detects Chinese prompts and extracts destination, duration, interests, and crowd avoidance', () => {
    const result = parseTripIntent('清迈3天，大象，寺庙，美食，避开人多')

    expect(result.intent.destination).toBe('清迈')
    expect(result.intent.durationDays).toBe(3)
    expect(result.intent.language).toBe('zh')
    expect(result.intent.interests).toEqual(expect.arrayContaining(['elephants', 'temples', 'food']))
    expect(result.intent.avoid).toContain('crowds')
    expect(result.intent.excludedStyles).toContain('less crowded')
  })

  it('extracts common interests without creating products or itinerary items', () => {
    const result = parseTripIntent('Tokyo for 5 days, anime, food and local markets')

    expect(result.intent.destination).toBe('Tokyo')
    expect(result.intent.durationDays).toBe(5)
    expect(result.intent.interests).toEqual(expect.arrayContaining(['anime', 'food', 'markets']))
    expect(JSON.stringify(result)).not.toMatch(/productId|supplier|price|rating|itineraryItems/)
  })

  it('extracts Thailand activity interests from a compact prompt', () => {
    const result = parseTripIntent('Chiang Mai 3 days food temples elephants')

    expect(result.intent.destination).toBe('Chiang Mai')
    expect(result.intent.durationDays).toBe(3)
    expect(result.intent.interests).toEqual(expect.arrayContaining(['food', 'temples', 'elephants']))
  })

  it('extracts avoid and excluded style signals', () => {
    const english = parseTripIntent('Barcelona 4 days avoid crowds and not commercial')
    const chinese = parseTripIntent('清迈3天，不拥挤，不商业化')

    expect(english.intent.avoid).toEqual(expect.arrayContaining(['crowds', 'commercial']))
    expect(english.intent.excludedStyles).toEqual(expect.arrayContaining(['less crowded', 'not commercial']))
    expect(chinese.intent.avoid).toEqual(expect.arrayContaining(['crowds', 'commercial']))
    expect(chinese.intent.excludedStyles).toEqual(expect.arrayContaining(['less crowded', 'not commercial']))
  })

  it('ignores booking, payment, and availability requests while keeping disabled flags', () => {
    const result = parseTripIntent('I want to book and pay for Dubai tomorrow')

    expect(result.intent.destination).toBe('Dubai')
    expect(result.warnings).toContain('booking/payment/availability request ignored')
    expect(result.bookingEnabled).toBe(false)
    expect(result.productRetrievalEnabled).toBe(false)
    expect(result.availabilityEnabled).toBe(false)
    expect(JSON.stringify(result)).not.toMatch(/checkoutUrl|paymentUrl|bookingLink|availabilitySlot/)
  })

  it('handles an empty prompt safely', () => {
    const result = parseTripIntent('')

    expect(result.intent.destination).toBeNull()
    expect(result.intent.durationDays).toBeNull()
    expect(result.missingFields).toEqual(expect.arrayContaining(['destination', 'durationDays']))
    expect(result.warnings).toContain('empty prompt')
  })

  it('handles a very long prompt deterministically without throwing', () => {
    const longPrompt = `Chiang Mai 3 days food temples ${'relaxed local neighborhoods '.repeat(80)}`

    expect(() => parseTripIntent(longPrompt)).not.toThrow()

    const first = parseTripIntent(longPrompt)
    const second = parseTripIntent(longPrompt)

    expect(first).toEqual(second)
    expect(first.warnings).toContain('prompt truncated')
    expect(first.intent.destination).toBe('Chiang Mai')
    expect(first.intent.durationDays).toBe(3)
  })
})
