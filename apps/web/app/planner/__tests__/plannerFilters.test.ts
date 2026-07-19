import { describe, expect, it } from 'vitest'
import {
  adaptPlannerDecisionSignals,
  collectPlannerThemes,
  filterPlannerProductsByThemes,
  toPlannerPace,
} from '../plannerFilters'

const products = [
  { id: 'food', tags: ['Food', 'Markets'] },
  { id: 'nature', tags: ['Nature', 'Temples'] },
  { id: 'mixed', tags: ['Food', 'Nature'] },
]

describe('Planner Studio filters', () => {
  it('maps the confirmed trip pace to the deterministic local map control', () => {
    expect(toPlannerPace('relaxed')).toBe('chill')
    expect(toPlannerPace('moderate')).toBe('balanced')
    expect(toPlannerPace('packed')).toBe('packed')
    expect(toPlannerPace('unspecified')).toBe('balanced')
  })

  it('collects a stable deduplicated theme list from the reviewed result set', () => {
    expect(collectPlannerThemes(products)).toEqual(['Food', 'Markets', 'Nature', 'Temples'])
  })

  it('shows every reviewed result when no theme is selected', () => {
    expect(filterPlannerProductsByThemes(products, [])).toEqual(products)
  })

  it('matches any selected theme without changing the source order', () => {
    expect(filterPlannerProductsByThemes(products, ['Nature']).map(product => product.id))
      .toEqual(['nature', 'mixed'])
    expect(filterPlannerProductsByThemes(products, ['markets', 'temples']).map(product => product.id))
      .toEqual(['food', 'nature'])
  })

  it('keeps traveler fit while updating pace after the local control changes', () => {
    const result = adaptPlannerDecisionSignals(
      { tags: ['Food', 'Markets'] },
      {
        whyRecommended: 'This reviewed Bangkok experience matches your interest in food.',
        bestFor: ['Families comparing this route', 'A relaxed itinerary', 'Travelers interested in food'],
        watchOut: 'Review duration, meeting details, inclusions, and current terms on the Viator product page before choosing.',
      },
      'packed',
      [],
    )

    expect(result).toEqual({
      whyRecommended: 'This reviewed Bangkok experience matches your interest in food.',
      bestFor: ['Families comparing this route', 'A packed itinerary', 'Travelers interested in food'],
      watchOut: 'A packed plan leaves less buffer; confirm duration, meeting details, and current terms before choosing.',
    })
  })

  it('combines matching client themes without inventing a non-matching interest', () => {
    const result = adaptPlannerDecisionSignals(
      { tags: ['Nature', 'Temples'] },
      {
        whyRecommended: 'This reviewed Chiang Mai option matches the confirmed route.',
        bestFor: ['Couples comparing this route', 'A balanced itinerary', 'Travelers interested in culture'],
        watchOut: 'Rainy-season conditions may affect outdoor comfort or routing; review current operator details on Viator before choosing.',
      },
      'chill',
      ['Nature', 'Food'],
    )

    expect(result).toEqual({
      whyRecommended: 'This reviewed Chiang Mai option matches the confirmed route. It also matches your selected nature theme.',
      bestFor: ['Couples comparing this route', 'A relaxed itinerary', 'Travelers interested in nature'],
      watchOut: 'Rainy-season conditions may affect outdoor comfort or routing; review current operator details on Viator before choosing.',
    })
    expect(JSON.stringify(result)).not.toContain('food')
  })

  it('returns null when a legacy card has no server-reviewed recommendation signals', () => {
    expect(adaptPlannerDecisionSignals({ tags: ['Nature'] }, undefined, 'balanced', ['Nature']))
      .toBeNull()
  })
})
