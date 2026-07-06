export type TourDetailSeoCandidate = {
  publicProductId: string
  reviewedBy: 'operator_manual_review'
  reviewNote: string
  approvedAt: string
  expectedCanonicalPath: `/tours/${string}`
}

export const tourDetailSeoCandidates: readonly TourDetailSeoCandidate[] = []

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
