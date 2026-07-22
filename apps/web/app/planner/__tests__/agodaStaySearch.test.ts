import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { addDaysToIsoDate } from '../agodaStaySearch.helpers'
import { expectNoForbiddenPublicCopy } from '../../__tests__/publicSafetyPatterns'

const plannerDir = join(process.cwd(), 'app', 'planner')
const accommodationContract = readFileSync(
  join(process.cwd(), 'lib', 'accommodation', 'agoda-contract.ts'),
  'utf8',
)

describe('Planner Agoda stay search', () => {
  const source = readFileSync(join(plannerDir, 'AgodaStaySearch.tsx'), 'utf8')
  const studioSource = readFileSync(join(plannerDir, 'PlannerStudio.tsx'), 'utf8')
  const pageSource = readFileSync(join(plannerDir, 'page.tsx'), 'utf8')

  it('derives a checkout date without timezone drift', () => {
    expect(addDaysToIsoDate('2026-08-10', 3)).toBe('2026-08-13')
    expect(addDaysToIsoDate('', 3)).toBe('')
    expect(addDaysToIsoDate('invalid', 3)).toBe('')
  })

  it('renders only when the server-side Agoda configuration is complete', () => {
    expect(pageSource).toMatch(/getConfiguredAgodaCities/)
    expect(studioSource).toMatch(/agodaCities/)
    expect(studioSource).toMatch(/AgodaStaySearch/)
  })

  it('requires traveler dates before requesting live hotel results', () => {
    expect(source).toMatch(/type="date"/)
    expect(source).toMatch(/\/api\/accommodations\/agoda\/search/)
    expect(source).toMatch(/Find Agoda stays/)
    expect(source).toMatch(/View on Agoda/)
  })

  it('keeps credentials server-only and Agoda responsible for the transaction', () => {
    const visibleCopy = [
      'Stay around this route',
      'Compare Agoda stays',
      'Add dates to retrieve current Agoda hotel content and rates for this trip.',
      'Review the stay details and continue on Agoda.',
      'Find Agoda stays',
      'Hotel results could not be loaded. Your day-trip route is still available above.',
      'Review current rates on Agoda.',
      'View on Agoda',
    ].join('\n')

    expect(source).not.toMatch(/AGODA_CONTENT_API_TOKEN|AGODA_OAUTH_CLIENT_SECRET|AGODA_SEARCH_API_KEY|AGODA_AFFILIATE_CID|Authorization/)
    expect(source).toMatch(/Review the stay details and continue on Agoda/)
    expect(source).toMatch(/rel=\{hotel\.handoffRel\}/)
    expect(accommodationContract).toMatch(/nofollow sponsored noopener noreferrer/)
    expectNoForbiddenPublicCopy(visibleCopy)
  })
})
