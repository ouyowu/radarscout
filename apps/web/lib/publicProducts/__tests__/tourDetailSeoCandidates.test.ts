import { describe, expect, it } from 'vitest'

import {
  getTourDetailRobots,
  isTourDetailSeoCandidate,
  listTourDetailSeoCandidates,
  tourDetailSeoCandidates,
} from '../tourDetailSeoCandidates'

describe('tourDetailSeoCandidates', () => {
  it('starts with an empty reviewed SEO candidate allowlist', () => {
    expect(tourDetailSeoCandidates).toEqual([])
    expect(listTourDetailSeoCandidates()).toEqual([])
  })

  it('does not treat any tour detail product as an SEO candidate by default', () => {
    expect(isTourDetailSeoCandidate('prod_abc')).toBe(false)
    expect(isTourDetailSeoCandidate('  prod_abc  ')).toBe(false)
    expect(isTourDetailSeoCandidate('')).toBe(false)
  })

  it('keeps tour detail robots closed for non-candidates', () => {
    expect(getTourDetailRobots('prod_abc')).toEqual({ index: false, follow: false })
  })
})
