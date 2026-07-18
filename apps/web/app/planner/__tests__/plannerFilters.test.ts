import { describe, expect, it } from 'vitest'
import {
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
})
