export const THAILAND_GEOGRAPHIC_TERMS: readonly string[] = [
  'Thailand',
  'Bangkok',
  'Phuket',
  'Chiang Mai',
  'Chiang Rai',
  'Pattaya',
  'Krabi',
  'Bophut',
  'Koh Samui',
  'Ko Samui',
  'Ayutthaya',
  'Hua Hin',
  'Khao Lak',
  'Phang Nga',
  'Phi Phi',
  'Koh Phi Phi',
  'Koh Tao',
  'Koh Phangan',
  'Sukhothai',
  'Kanchanaburi',
  'Trat',
  'Koh Chang',
  'Ko Chang',
  'Ko Lanta',
  'Ko Lipe',
  'Ko Pha Ngan',
  'Ko Phi Phi Don',
  'Ko Yao Yai',
  'Mae Hong Son',
  'Railay',
  'Ao Nang',
]

export const THAILAND_CULTURAL_TERMS: readonly string[] = ['Thai']

export const FOREIGN_TERMS: readonly string[] = [
  'Singapore',
  'Kuala Lumpur',
  'Malaysia',
  'Bali',
  'Jakarta',
  'Indonesia',
  'Tokyo',
  'Osaka',
  'Kyoto',
  'Japan',
  'Seoul',
  'Korea',
  'Hong Kong',
  'Macau',
  'Dubai',
  'Maldives',
  'Hanoi',
  'Ho Chi Minh',
  'Vietnam',
  'Phnom Penh',
  'Siem Reap',
  'Cambodia',
  'Paris',
  'London',
  'Rome',
  'New York',
]

export type ThailandEligibilityResult = {
  eligible: boolean
  reasons: string[]
  thailandSignals: string[]
  foreignSignals: string[]
  hasDestinationMismatch: boolean
}

export type ThailandEligibilityInput = {
  title?: string | null
  city?: string | null
  location?: string | null
  description?: string | null
}

function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchTerms(text: string, terms: readonly string[]): string[] {
  const padded = ' ' + normalizeForMatching(text) + ' '
  return terms.filter(term => {
    const normalizedTerm = normalizeForMatching(term)
    return padded.includes(' ' + normalizedTerm + ' ')
  })
}

function attributeField(
  term: string,
  title: string | null | undefined,
  location: string | null | undefined,
): 'title' | 'location' | 'source data' {
  const inTitle = Boolean(title && matchTerms(title, [term]).length > 0)
  const inLocation = Boolean(location && matchTerms(location, [term]).length > 0)
  if (inTitle && !inLocation) return 'title'
  if (inLocation && !inTitle) return 'location'
  return 'source data'
}

export function evaluateThailandProductEligibility(
  input: ThailandEligibilityInput,
): ThailandEligibilityResult {
  const { title, city, location } = input

  const allText = [title, city, location].filter(Boolean).join(' ')

  const foreignSignals = matchTerms(allText, FOREIGN_TERMS)
  const geographicSignals = matchTerms(allText, THAILAND_GEOGRAPHIC_TERMS)
  const culturalSignals = matchTerms(allText, THAILAND_CULTURAL_TERMS)
  const thailandSignals = [...geographicSignals, ...culturalSignals]

  if (foreignSignals.length > 0) {
    const cityIsThailand =
      city != null && matchTerms(city, THAILAND_GEOGRAPHIC_TERMS).length > 0
    const hasDestinationMismatch = cityIsThailand

    const reasons: string[] = foreignSignals.map(foreign => {
      if (hasDestinationMismatch) {
        const field = attributeField(foreign, title, location)
        return `Source city is ${city}, but ${field} mentions ${foreign}.`
      }
      return `Source data explicitly mentions non-Thailand destination: ${foreign}.`
    })

    return {
      eligible: false,
      reasons,
      thailandSignals,
      foreignSignals,
      hasDestinationMismatch,
    }
  }

  if (geographicSignals.length > 0) {
    return {
      eligible: true,
      reasons: [],
      thailandSignals,
      foreignSignals: [],
      hasDestinationMismatch: false,
    }
  }

  return {
    eligible: false,
    reasons: ['Source data does not clearly identify a Thailand destination.'],
    thailandSignals,
    foreignSignals: [],
    hasDestinationMismatch: false,
  }
}
