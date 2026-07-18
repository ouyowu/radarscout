export type TourDetailSeoCandidate = {
  publicProductId: string
  reviewedBy: 'operator_manual_review'
  reviewNote: string
  approvedAt: string
  expectedCanonicalPath: `/tours/${string}`
}

const APPROVED_AT = '2026-07-18T00:00:00.000Z'
const REVIEW_NOTE = 'Operator approved for the six-product Viator SEO pilot.'

export const tourDetailSeoCandidates: readonly TourDetailSeoCandidate[] = [
  {
    publicProductId: 'viator_6467bkknight',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_6467bkknight',
  },
  {
    publicProductId: 'viator_163642p1',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_163642p1',
  },
  {
    publicProductId: 'viator_191442p6',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_191442p6',
  },
  {
    publicProductId: 'viator_163642p25',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_163642p25',
  },
  {
    publicProductId: 'viator_160694p9',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_160694p9',
  },
  {
    publicProductId: 'viator_44720p2',
    reviewedBy: 'operator_manual_review',
    reviewNote: REVIEW_NOTE,
    approvedAt: APPROVED_AT,
    expectedCanonicalPath: '/tours/viator_44720p2',
  },
]

export function listTourDetailSeoCandidates(): readonly TourDetailSeoCandidate[] {
  return tourDetailSeoCandidates
}

export function isTourDetailSeoCandidate(publicProductId: string): boolean {
  const normalizedId = publicProductId.trim()
  if (!normalizedId) return false

  return tourDetailSeoCandidates.some(candidate => candidate.publicProductId === normalizedId)
}

export function getTourDetailRobots(publicProductId: string): { index: boolean; follow: boolean } {
  const isCandidate = isTourDetailSeoCandidate(publicProductId)

  return { index: isCandidate, follow: isCandidate }
}
