export const SUSPICIOUS_TERMS = [
  'Singapore',
  'Kuala Lumpur',
  'Bali',
  'Jakarta',
  'Tokyo',
  'Osaka',
  'Seoul',
  'Hong Kong',
  'Dubai',
  'Maldives',
  'Vietnam',
  'Cambodia',
  'Malaysia',
  'Japan',
  'Korea',
  'Indonesia',
]

export const THAI_TERMS = [
  'Bangkok',
  'Phuket',
  'Chiang Mai',
  'Pattaya',
  'Krabi',
  'Koh Samui',
  'Thailand',
]

function isThaiCity(city: string | null): boolean {
  if (!city) return false
  const lower = city.toLowerCase()
  return THAI_TERMS.some(t => lower.includes(t.toLowerCase()))
}

function matchedSuspiciousTerms(text: string): string[] {
  const lower = text.toLowerCase()
  return SUSPICIOUS_TERMS.filter(t => lower.includes(t.toLowerCase()))
}

export function detectSourceMismatch(
  city: string | null,
  title: string | null,
  location?: string | null,
): string[] {
  if (!isThaiCity(city)) return []
  const text = [title, location].filter(Boolean).join(' ')
  if (!text) return []
  return matchedSuspiciousTerms(text).map(
    term => `Possible destination mismatch: source city is ${city}, but title mentions ${term}.`,
  )
}

export function detectDraftMismatch(
  city: string | null,
  draft: {
    cleanedTitle?: string | null
    shortSummary?: string | null
    seoTitle?: string | null
    seoDescription?: string | null
  },
): string[] {
  if (!isThaiCity(city)) return []
  const text = [
    draft.cleanedTitle,
    draft.shortSummary,
    draft.seoTitle,
    draft.seoDescription,
  ]
    .filter(Boolean)
    .join(' ')
  if (!text) return []
  return matchedSuspiciousTerms(text).length > 0
    ? ['AI draft may mention a destination that does not match source city.']
    : []
}
