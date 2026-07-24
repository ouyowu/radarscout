import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(join(process.cwd(), 'app', 'tours', '[id]', 'page.tsx'), 'utf8')

describe('tour detail handoff context', () => {
  it('accepts only bounded context indicators from the trusted internal planner link', () => {
    expect(source).toMatch(/hasDates\?: string/)
    expect(source).toMatch(/hasGroupSize\?: string/)
    expect(source).toMatch(/hasOccupancy\?: string/)
    expect(source).toMatch(/travelerType\?: string/)
    expect(source).toMatch(/parseSafeAffiliateAnalyticsContext\(searchParams, isFromAiTripPlanner\)/)
    expect(source).toMatch(/city=\{location\}/)
    expect(source).toMatch(/\{\.\.\.safeTripContext\}/)
    expect(source).toMatch(/Confirmed in RadarScout/)
    expect(source).not.toMatch(/searchParams\?\.(?:startDate|endDate|groupSize|adultCount|childCount)/)
  })
})
