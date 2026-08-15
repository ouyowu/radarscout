import type { ActivityFeedV1Item } from './activityFeedV1'

export type DetailComparisonCandidate = {
  item: ActivityFeedV1Item
  sharedThemes: string[]
}

function normalizedThemes(themes: readonly string[]) {
  return new Map(themes.map(theme => [theme.trim().toLowerCase(), theme.trim()]))
}

/**
 * Selects only reviewed catalogue items from the same city that share at least
 * one stated theme. This is intentionally not a price, sales, or rating rank.
 */
export function selectDetailComparisonCandidates(
  primary: ActivityFeedV1Item,
  catalogue: readonly ActivityFeedV1Item[],
  take = 2,
): DetailComparisonCandidate[] {
  const limit = Math.max(0, Math.min(2, Math.floor(take)))
  if (limit === 0) return []

  const primaryThemes = normalizedThemes(primary.themes)
  const city = primary.destination.city.trim().toLowerCase()

  return catalogue
    .filter(candidate => candidate.id !== primary.id)
    .filter(candidate => candidate.provenance.reviewStatus === 'human_reviewed')
    .filter(candidate => candidate.destination.city.trim().toLowerCase() === city)
    .map((item) => {
      const sharedThemes = item.themes
        .map(theme => primaryThemes.get(theme.trim().toLowerCase()))
        .filter((theme): theme is string => Boolean(theme))

      return { item, sharedThemes }
    })
    .filter(candidate => candidate.sharedThemes.length > 0)
    .sort((a, b) => {
      const themeDifference = b.sharedThemes.length - a.sharedThemes.length
      if (themeDifference !== 0) return themeDifference
      return a.item.title.localeCompare(b.item.title)
    })
    .slice(0, limit)
}
