import { describe, expect, it } from 'vitest'

import {
  getTourDetailRobots,
  isTourDetailSeoCandidate,
  listTourDetailSeoCandidates,
  tourDetailSeoCandidates,
} from '../tourDetailSeoCandidates'
import { loadReviewedViatorProducts } from '../../viator/reviewedViatorProducts'

const APPROVED_IDS = [
  'viator_6467bkknight',
  'viator_163642p1',
  'viator_191442p6',
  'viator_163642p25',
  'viator_160694p9',
  'viator_44720p2',
] as const

describe('tourDetailSeoCandidates', () => {
  it('contains exactly the six operator-approved Viator SEO candidates', () => {
    expect(tourDetailSeoCandidates.map(candidate => candidate.publicProductId)).toEqual(APPROVED_IDS)
    expect(listTourDetailSeoCandidates()).toEqual(tourDetailSeoCandidates)
  })

  it('keeps every candidate tied to the reviewed public catalog and canonical route', () => {
    const reviewedIds = new Set(loadReviewedViatorProducts().map(product => product.id))

    for (const candidate of tourDetailSeoCandidates) {
      expect(reviewedIds.has(candidate.publicProductId)).toBe(true)
      expect(candidate.reviewedBy).toBe('operator_manual_review')
      expect(candidate.reviewNote).not.toBe('')
      expect(Number.isNaN(Date.parse(candidate.approvedAt))).toBe(false)
      expect(candidate.expectedCanonicalPath).toBe(`/tours/${candidate.publicProductId}`)
    }
  })

  it('treats only the approved IDs as SEO candidates', () => {
    for (const id of APPROVED_IDS) {
      expect(isTourDetailSeoCandidate(id)).toBe(true)
    }

    expect(isTourDetailSeoCandidate('  viator_6467bkknight  ')).toBe(true)
    expect(isTourDetailSeoCandidate('prod_abc')).toBe(false)
    expect(isTourDetailSeoCandidate('  prod_abc  ')).toBe(false)
    expect(isTourDetailSeoCandidate('')).toBe(false)
  })

  it('opens robots only for approved candidates', () => {
    for (const id of APPROVED_IDS) {
      expect(getTourDetailRobots(id)).toEqual({ index: true, follow: true })
    }

    expect(getTourDetailRobots('prod_abc')).toEqual({ index: false, follow: false })
  })

  it('contains no duplicate candidate IDs or canonical paths', () => {
    const ids = tourDetailSeoCandidates.map(candidate => candidate.publicProductId)
    const paths = tourDetailSeoCandidates.map(candidate => candidate.expectedCanonicalPath)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
