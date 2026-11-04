import { describe, expect, it } from 'vitest'

import { reviewedAgodaAreaRecommendations } from '@/lib/affiliates/seed/reviewedAgodaAreas'
import type { AgodaAreaRecommendation } from '@/lib/affiliates/agodaAreaRecommendations'
import {
  buildStayAreaGuideDraft,
  buildStayAreaGuideDrafts,
  STAY_GUIDE_CITIES,
} from '../stayAreaGuides'

const CITIES = ['pattaya', 'krabi', 'koh-samui'] as const

function areasFor(citySlug: string): AgodaAreaRecommendation[] {
  return reviewedAgodaAreaRecommendations.filter(area => area.citySlug === citySlug)
}

describe('composed stay-area guides', () => {
  it('builds one guide for each configured city', () => {
    const drafts = buildStayAreaGuideDrafts()
    expect(drafts.map(draft => draft.citySlug).sort()).toEqual([...CITIES].sort())
  })

  it('states nothing the reviewed area records do not already say', () => {
    for (const citySlug of CITIES) {
      const draft = buildStayAreaGuideDraft(citySlug)!
      const areas = areasFor(citySlug)
      expect(draft).toBeTruthy()

      // Every area contributes its own section, verbatim, followed by one
      // closing section that is booking method rather than local fact.
      expect(draft.sections.map(section => section.heading)).toEqual([
        ...areas.map(a => a.name),
        'Before you book',
      ])
      for (const [index, area] of areas.entries()) {
        expect(draft.sections[index].paragraphs[0]).toBe(area.summary)
        expect(draft.sections[index].checklist).toEqual(area.tradeoffs)
      }
      // The depth standard the hand-written guides are held to.
      expect(draft.sections.length).toBeGreaterThanOrEqual(4)

      // The verdict is composed only from reviewed `bestFor` values.
      for (const area of areas) {
        expect(draft.quickAnswer).toContain(area.name)
        expect(draft.bestFor).toContain(`${area.name} — ${area.bestFor}`)
      }

      // Caveats stay attributed to the area they belong to.
      expect(draft.notIdealFor).toHaveLength(
        areas.reduce((total, area) => total + area.tradeoffs.length, 0),
      )
    }
  })

  it('inherits the reviewer and date from the areas instead of claiming a new review', () => {
    for (const citySlug of CITIES) {
      const draft = buildStayAreaGuideDraft(citySlug)!
      const areas = areasFor(citySlug)
      const reviewers = [...new Set(areas.map(area => area.reviewedBy))].sort().join(', ')
      const latest = areas.map(a => a.reviewedAt.slice(0, 10)).sort().at(-1)

      // The byline is the desk, as on every hand-written guide; the specific
      // reviewer stays auditable in reviewMethod.
      expect(draft.reviewedBy).toBe('RadarScout Thailand desk')
      expect(draft.updatedAt).toBe(latest)
      expect(draft.publishedAt).toBe(latest)
      expect(draft.reviewMethod).toContain(reviewers)
      expect(draft.reviewMethod).toContain(latest!)
    }
  })

  it('carries the accommodation handoff and a verified official source', () => {
    for (const citySlug of CITIES) {
      const draft = buildStayAreaGuideDraft(citySlug)!
      expect(draft.stayAreaCitySlug).toBe(citySlug)
      expect(draft.officialSources).toHaveLength(1)
      // Verified against the live Tourism Authority of Thailand site.
      expect(draft.officialSources[0].href).toMatch(
        /^https:\/\/www\.tourismthailand\.org\/Destinations\/Provinces\//,
      )
      expect(STAY_GUIDE_CITIES[citySlug]!.officialSource.href).toBe(
        draft.officialSources[0].href,
      )
    }
  })

  it('publishes no guide for a city without enough reviewed areas to compare', () => {
    const single = areasFor('pattaya').slice(0, 1)
    expect(buildStayAreaGuideDraft('pattaya', single)).toBeNull()
    expect(buildStayAreaGuideDraft('pattaya', [])).toBeNull()
    // A city with reviewed areas but no configuration stays unpublished.
    expect(buildStayAreaGuideDraft('bangkok')).toBeNull()
  })
})
