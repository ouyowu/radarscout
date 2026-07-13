export const exampleChips = [
  'Gentle elephant day in Chiang Mai',
  'Family-friendly elephant sanctuary in Chiang Mai',
  'Chiang Mai cooking and local food day',
  'Chiang Mai nature and elephant day trip',
] as const

/**
 * Build the Planner Studio href for a homepage prompt. Empty/blank input falls
 * back to the bare planner route, so a stray click never sends an empty `idea`.
 */
export function buildIdeaHref(idea: string): string {
  const trimmed = idea.trim()
  const target = '/planner'
  return trimmed ? `${target}?idea=${encodeURIComponent(trimmed)}` : target
}
