import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  RADARSCOUT_BRAND_DESCRIPTION,
  RADARSCOUT_ORGANIZATION_ID,
  buildRadarScoutOrganization,
} from './radarscoutEntity'

const coreEntitySources = [
  '../../app/page.tsx',
  '../../app/about-us/page.tsx',
  '../../app/thailand-trip-planner/page.tsx',
  '../../app/thailand/[city]/page.tsx',
  '../../app/guides/page.tsx',
  '../../app/guides/[city]/page.tsx',
  '../../app/guides/[city]/[slug]/page.tsx',
].map(relativePath => readFileSync(new URL(relativePath, import.meta.url), 'utf8'))

describe('RadarScout brand entity consistency', () => {
  it('publishes one canonical organization identity and positioning', () => {
    expect(RADARSCOUT_ORGANIZATION_ID).toBe('https://www.radarscout.io/#organization')
    expect(RADARSCOUT_BRAND_DESCRIPTION).toBe(
      'RadarScout is a Thailand activity comparison and decision-support service.',
    )
    expect(buildRadarScoutOrganization()).toEqual({
      '@type': 'Organization',
      '@id': RADARSCOUT_ORGANIZATION_ID,
      name: 'RadarScout',
      url: 'https://www.radarscout.io',
      description: RADARSCOUT_BRAND_DESCRIPTION,
    })
  })

  it('reuses the shared entity on core indexable brand and editorial pages', () => {
    for (const source of coreEntitySources) {
      expect(source).toContain('buildRadarScoutOrganization')
      expect(source).not.toMatch(/['"]@type['"]:\s*['"]Organization['"]/)
    }
  })

  it('states the canonical positioning visibly on the About page', () => {
    expect(coreEntitySources[1]).toContain('{RADARSCOUT_BRAND_DESCRIPTION}')
  })
})
