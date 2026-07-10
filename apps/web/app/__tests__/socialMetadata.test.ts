import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { metadata as homepageMetadata } from '../page'

const layoutSource = readFileSync(new URL('../layout.tsx', import.meta.url), 'utf8')
const pricingSource = readFileSync(new URL('../pricing/page.tsx', import.meta.url), 'utf8')
const useCasesSource = readFileSync(new URL('../use-cases/page.tsx', import.meta.url), 'utf8')
const imageUrl = new URL('../opengraph-image.tsx', import.meta.url)

describe('public social share metadata', () => {
  it('uses honest Thailand planner language across default and homepage metadata', () => {
    const metadataSource = [layoutSource, JSON.stringify(homepageMetadata)].join('\n')

    expect(layoutSource).toContain('RadarScout — Thailand Experience Planner')
    expect(homepageMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'RadarScout | Personalized Thailand Experience Planner',
    })
    expect(metadataSource).not.toMatch(/AI concierge/i)
  })

  it('uses the generated RadarScout share card instead of the obsolete static image', () => {
    expect(existsSync(imageUrl)).toBe(true)

    const imageSource = existsSync(imageUrl) ? readFileSync(imageUrl, 'utf8') : ''
    const socialMetadataSources = [layoutSource, pricingSource, useCasesSource].join('\n')

    expect(imageSource).toContain("export const alt = 'RadarScout Thailand Experience Planner'")
    expect(imageSource).toContain('width: 1200')
    expect(imageSource).toContain('height: 630')
    expect(imageSource).toContain('Thailand Experience Planner')
    expect(imageSource).not.toMatch(/https?:\/\//i)
    expect(imageSource).not.toMatch(/Reddit alerts|AI concierge/i)
    expect(socialMetadataSources).not.toContain('/og-image.png')
    expect(pricingSource).toContain("url: '/opengraph-image'")
    expect(useCasesSource).toContain("url: '/opengraph-image'")
  })
})
