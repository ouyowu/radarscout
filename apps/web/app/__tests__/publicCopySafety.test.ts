import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const rootLayoutSource = readFileSync(new URL('../layout.tsx', import.meta.url), 'utf8')
const destinationsPageSource = readFileSync(new URL('../destinations/page.tsx', import.meta.url), 'utf8')

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

describe('public RadarScout copy safety', () => {
  it('keeps root and destination metadata within discovery and handoff boundaries', () => {
    expect(rootLayoutSource).toContain('Plan Thailand experiences with guided discovery')
    expect(rootLayoutSource).toContain('trusted booking partner handoff')
    expect(rootLayoutSource).toContain('continue with a trusted booking partner')
    expect(destinationsPageSource).toContain('AI-guided private trip planning')
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
    expect(publicCopySources).not.toMatch(/Live Bókun/i)
    expect(publicCopySources).not.toMatch(/Bókun/i)
    expect(publicCopySources).not.toMatch(/DMC Portal/i)
    expect(publicCopySources).not.toMatch(/DMC-style/i)
    expect(publicCopySources).not.toMatch(/Bókun partner inventory/i)
    expect(publicCopySources).not.toMatch(/Bókun supplier/i)
    expect(publicCopySources).not.toMatch(/Bókun backend/i)
    expect(publicCopySources).not.toMatch(/Bókun database/i)
    expect(publicCopySources).not.toMatch(/Bókun-powered/i)
    expect(publicCopySources).not.toMatch(/direct-rate/i)
    expect(publicCopySources).not.toMatch(/supplier inventory/i)
    expect(publicCopySources).not.toMatch(/live inventory/i)
    expect(publicCopySources).not.toMatch(/live signed/i)
    expect(publicCopySources).not.toMatch(/live bookable/i)
    expect(publicCopySources).not.toMatch(/\bbookable\b/i)
    expect(publicCopySources).not.toMatch(/live tours/i)
    expect(publicCopySources).not.toMatch(/available now/i)
    expect(publicCopySources).not.toMatch(/instant confirmation/i)
    expect(publicCopySources).not.toMatch(/Reserve in/i)
    expect(publicCopySources).not.toMatch(/\bReserve\b/i)
    expect(publicCopySources).not.toMatch(/reserve faster/i)
    expect(publicCopySources).not.toMatch(/partner rate/i)
    expect(publicCopySources).not.toMatch(/supplier net rate/i)
    expect(publicCopySources).not.toMatch(/\bcommission\b/i)
    expect(publicCopySources).not.toMatch(/\bcheckout\b/i)
    expect(publicCopySources).not.toMatch(/\bpayment\b/i)
  })

  it('uses safe destination and product-sample labels instead', () => {
    expect(publicCopySources).toContain('Focused experience coverage')
    expect(publicCopySources).toContain('booking partner handoff')
    expect(publicCopySources).toContain('Current product sample')
    expect(publicCopySources).toContain('Ask about this experience')
    expect(publicCopySources).toContain('Partner handoff ready')
  })
})
