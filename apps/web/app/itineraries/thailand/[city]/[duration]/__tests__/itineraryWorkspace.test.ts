import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy } from '../../../../../__tests__/publicSafetyPatterns'

const routeDir = join(process.cwd(), 'app', 'itineraries', 'thailand', '[city]', '[duration]')

function readRouteSource(fileName: string) {
  return readFileSync(join(routeDir, fileName), 'utf8')
}

describe('Thailand itinerary workspace', () => {
  it('keeps pace and theme interactions local and renders a reviewed Viator handoff', () => {
    const source = readRouteSource('ItineraryWorkspace.tsx')

    expect(source).not.toMatch(/\bfetch\s*\(/)
    expect(source).toMatch(/Chill/)
    expect(source).toMatch(/Balanced/)
    expect(source).toMatch(/Packed/)
    expect(source).toMatch(/Check availability/)
    expect(source).toMatch(/nofollow sponsored noopener noreferrer/)
    expectNoForbiddenPublicCopy(source)
  })

  it('uses template coordinates directly and never geocodes a place name', () => {
    const source = readRouteSource('MapLibreDayMap.tsx')

    expect(source).toMatch(/maplibre-gl/)
    expect(source).toMatch(/https:\/\/tiles\.openfreemap\.org\/styles\/liberty/)
    expect(source).toMatch(/fitBounds/)
    expect(source).toMatch(/stop\.lng/)
    expect(source).toMatch(/stop\.lat/)
    expect(source).not.toMatch(/if \(!publicToken\) return/)
    expect(source).not.toMatch(/setMapFailed/)
    expect(source).not.toMatch(/geocod/i)
    expect(source).not.toMatch(/google/i)
  })

  it('keeps the new route noindex until the explicit SEO opening gate', () => {
    const source = readRouteSource('page.tsx')

    expect(source).toMatch(/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/)
  })
})
