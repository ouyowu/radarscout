import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expectNoForbiddenPublicCopy, expectNoInternalBokunPublicWiring } from './publicSafetyPatterns'

const rootLayoutSource = readFileSync(new URL('../layout.tsx', import.meta.url), 'utf8')
const destinationsPageSource = readFileSync(new URL('../destinations/page.tsx', import.meta.url), 'utf8')
const appDir = join(process.cwd(), 'app')

function collectRuntimeSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '__tests__') return []

    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) return collectRuntimeSourceFiles(fullPath)
    if (!entry.isFile()) return []
    if (!/\.(ts|tsx)$/.test(entry.name)) return []

    return [fullPath]
  })
}

const publicCopySources = [
  rootLayoutSource,
  readFileSync(new URL('../ThailandTourChat.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../components-showcase/page.tsx', import.meta.url), 'utf8'),
  destinationsPageSource,
  readFileSync(new URL('../destinations/[slug]/page.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/DestinationCapsuleCard.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/CuratedTourCard.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/PartnerInventoryNotice.tsx', import.meta.url), 'utf8'),
  readFileSync(new URL('../_components/SupplierPartnerCTA.tsx', import.meta.url), 'utf8'),
].join('\n')

const publicTourismRuntimeSources = [
  readFileSync(join(appDir, 'page.tsx'), 'utf8'),
  readFileSync(join(appDir, 'ThailandTourChat.tsx'), 'utf8'),
  readFileSync(join(appDir, 'components-showcase', 'page.tsx'), 'utf8'),
  ...[
    join(appDir, '_components'),
    join(appDir, 'ai-trip-planner'),
    join(appDir, 'destinations'),
    join(appDir, 'tours'),
  ].flatMap((dir) => collectRuntimeSourceFiles(dir).map((file) => readFileSync(file, 'utf8'))),
].join('\n')

describe('public RadarScout copy safety', () => {
  it('keeps root and destination metadata within discovery and handoff boundaries', () => {
    expect(rootLayoutSource).toContain('Plan Thailand experiences with guided discovery')
    expect(rootLayoutSource).toContain('trusted booking partner handoff')
    expect(rootLayoutSource).toContain('continue with a trusted booking partner')
    expect(destinationsPageSource).toContain('Thailand-first AI trip planning')
    expect(destinationsPageSource).toContain('other routes remain planning-only')
    expect(destinationsPageSource).toContain('planning-only')

    const metadataSources = [rootLayoutSource, destinationsPageSource].join('\n')
    expect(metadataSources).not.toMatch(/direct-rate/i)
    expect(metadataSources).not.toMatch(/reserve faster/i)
    expect(metadataSources).not.toMatch(/live inventory/i)
    expect(metadataSources).not.toMatch(/Bókun/i)
    expect(metadataSources).not.toMatch(/DMC Planning/i)
    expect(metadataSources).not.toMatch(/DMC portal/i)
  })

  it('does not expose inventory, rate, reservation, or Bókun-backend style copy in public UI sources', () => {
    expectNoForbiddenPublicCopy(publicCopySources)
    expect(publicTourismRuntimeSources).not.toMatch(/\bbackend\b/i)
    expect(publicTourismRuntimeSources).not.toMatch(/\bdatabase\b/i)
  })

  it('does not wire public planning components to internal Bókun APIs or net-rate style estimates', () => {
    expectNoInternalBokunPublicWiring(publicCopySources)
  })

  it('does not wire public tourism runtime source to internal Bókun APIs or net-rate style estimates', () => {
    expectNoInternalBokunPublicWiring(publicTourismRuntimeSources)
  })

  it('uses safe destination and product-sample labels instead', () => {
    expect(publicCopySources).toContain('Focused experience coverage')
    expect(publicCopySources).toContain('booking partner handoff')
    expect(publicCopySources).toContain('Current product sample')
    expect(publicCopySources).toContain('Ask about this experience')
    expect(publicCopySources).toContain('Partner handoff ready')
  })
})
