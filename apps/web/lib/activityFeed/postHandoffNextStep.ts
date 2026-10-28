import type { ActivityFeedV1Item } from './activityFeedV1'

export type PostHandoffNextStepCandidate = {
  item: ActivityFeedV1Item
  newThemes: string[]
}

function normalizedThemes(themes: readonly string[]) {
  return new Set(themes.map(theme => theme.trim().toLowerCase()))
}

/**
 * Suggest a different reviewed activity for a later day after a traveler opens
 * a booking partner. This deliberately makes no claim about availability,
 * price, bookings, or an inferred purchase.
 */
export function selectPostHandoffNextStepCandidates(
  primary: ActivityFeedV1Item,
  catalogue: readonly ActivityFeedV1Item[],
  take = 2,
): PostHandoffNextStepCandidate[] {
  const limit = Math.max(0, Math.min(2, Math.floor(take)))
  if (limit === 0) return []

  const primaryThemes = normalizedThemes(primary.themes)
  const city = primary.destination.city.trim().toLowerCase()

  return catalogue
    .filter(candidate => candidate.id !== primary.id)
    .filter(candidate => candidate.provenance.reviewStatus === 'human_reviewed')
    .filter(candidate => candidate.destination.city.trim().toLowerCase() === city)
    .map((item) => ({
      item,
      newThemes: item.themes.filter(theme => !primaryThemes.has(theme.trim().toLowerCase())),
    }))
    .filter(candidate => candidate.newThemes.length > 0)
    .sort((a, b) => {
      const themeDifference = b.newThemes.length - a.newThemes.length
      if (themeDifference !== 0) return themeDifference
      return a.item.title.localeCompare(b.item.title)
    })
    .slice(0, limit)
}
