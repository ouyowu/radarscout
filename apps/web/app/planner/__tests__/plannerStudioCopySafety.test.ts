import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  expectNoForbiddenPublicCopy,
  expectNoInternalBokunPublicWiring,
} from '../../__tests__/publicSafetyPatterns'

const plannerDir = join(process.cwd(), 'app', 'planner')

function readPlannerSource(fileName: string) {
  return readFileSync(join(plannerDir, fileName), 'utf8')
}

const publicCopy = [
  readPlannerSource('page.tsx'),
  readPlannerSource('PlannerStudio.tsx'),
  readPlannerSource('plannerConversation.ts'),
].join('\n')

describe('planner studio public copy safety', () => {
  it('keeps forbidden partner and commerce wording out of the studio', () => {
    expectNoForbiddenPublicCopy(publicCopy)
    expectNoInternalBokunPublicWiring(publicCopy)
  })

  it('does not market the deterministic flow as a generative AI planner', () => {
    expect(publicCopy).not.toMatch(/\bAI trip planner\b/i)
    expect(publicCopy).not.toMatch(/AI-powered/i)
    expect(publicCopy).not.toMatch(/AI-guided/i)
    expect(publicCopy).toMatch(/parses your trip idea locally|parse it locally|parses it locally/i)
  })

  it('stays comparison-only with an external booking partner handoff', () => {
    expect(publicCopy).toMatch(/comparison only|comparison-only/i)
    expect(publicCopy).toMatch(/booking partner/i)
    expect(publicCopy).toMatch(/external booking partner/i)
    expect(publicCopy).not.toMatch(/hotel|flight|airport/i)
  })

  it('does not claim append-only local parsing can replace earlier choices', () => {
    expect(publicCopy).not.toMatch(/tell me what to change/i)
    expect(publicCopy).toMatch(/use Start over to change the destination or duration/i)
  })

  it('keeps the studio out of search indexes while it is a guarded surface', () => {
    const pageSource = readPlannerSource('page.tsx')

    expect(pageSource).toMatch(/robots: \{ index: false, follow: false \}/)
  })

  it('only calls the guarded deterministic search endpoint', () => {
    const studioSource = readPlannerSource('PlannerStudio.tsx')

    expect(studioSource).toMatch(/fetch\('\/api\/ai-trip\/search'/)
    expect(studioSource).not.toMatch(/fetch\('\/api\/ai-trip\/narrate'/)
    expect(studioSource).not.toMatch(/fetch\('\/api\/(?!ai-trip\/search)/)
  })

  it('labels the zero-cost route overview honestly as local output', () => {
    const studioSource = readPlannerSource('PlannerStudio.tsx')

    expect(studioSource).toMatch(/Route overview · built locally/)
    expect(studioSource).toMatch(/buildDeterministicRouteOverview/)
    expect(studioSource).not.toMatch(/AI-generated text/)
  })
})
