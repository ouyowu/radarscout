export const exampleChips = [
  'Gentle elephant day in Chiang Mai',
  'Family-friendly Thailand experience',
  'Cooking and local food day',
  'Nature day trip from Chiang Mai',
] as const

/**
 * Build the planner href for a homepage prompt. Encodes the idea and always
 * lands on the planner intent anchor. Empty/blank input falls back to the bare
 * planner anchor (no query), so a stray click never sends an empty `idea`.
 */
export function buildIdeaHref(idea: string): string {
  const trimmed = idea.trim()
  const target = '/ai-trip-planner'
  const hash = '#intent-demo'
  return trimmed ? `${target}?idea=${encodeURIComponent(trimmed)}${hash}` : `${target}${hash}`
}
