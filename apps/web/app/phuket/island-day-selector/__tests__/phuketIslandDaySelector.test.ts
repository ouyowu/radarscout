import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const pageSource = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8')
const clientSource = readFileSync(
  new URL('../PhuketIslandDaySelectorClient.tsx', import.meta.url),
  'utf8',
)
const cityHubSource = readFileSync(
  new URL('../../../thailand/[city]/page.tsx', import.meta.url),
  'utf8',
)

describe('Phuket island day selector', () => {
  it('presents a narrow three-match decision funnel without commerce overclaims', () => {
    expect(pageSource).toContain('Phuket island day selector')
    expect(pageSource).toContain('index: false')
    expect(clientSource).toContain('See my 3 matches')
    expect(clientSource).toContain('Why RadarScout recommends it')
    expect(clientSource).toContain('Best for')
    expect(clientSource).toContain('Not ideal for')
    expect(clientSource).toContain('Check before choosing')
    expect(clientSource).toContain('Check availability')
    expect(clientSource).toContain("track('booking_partner_handoff_clicked'")

    for (const forbidden of [
      'available now',
      'live availability',
      'instant confirmation',
      'guaranteed slot',
      'Book now',
      'Add to cart',
    ]) {
      expect(`${pageSource}\n${clientSource}`).not.toContain(forbidden)
    }
  })

  it('is discoverable from the existing Phuket city hub without changing index policy', () => {
    expect(cityHubSource).toContain('/phuket/island-day-selector')
    expect(cityHubSource).toContain('Find my Phuket island day')
  })
})
