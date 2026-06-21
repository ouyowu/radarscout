export const THAILAND_TERMS: readonly string[] = [
  'Thailand',
  'Thai',
  'Bangkok',
  'Phuket',
  'Chiang Mai',
  'Chiang Rai',
  'Pattaya',
  'Krabi',
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
  'Railay',
  'Ao Nang',
]

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

function matchTerms(text: string, terms: readonly string[]): string[] {
  const lower = text.toLowerCase()
  return terms.filter(term => lower.includes(term.toLowerCase()))
}

export function evaluateThailandProductEligibility(
  input: ThailandEligibilityInput,
): ThailandEligibilityResult {
  const { title, city, location } = input

  const allText = [title, city, location].filter(Boolean).join(' ')

  const foreignSignals = matchTerms(allText, FOREIGN_TERMS)
  const thailandSignals = matchTerms(allText, THAILAND_TERMS)

  if (foreignSignals.length > 0) {
    const cityIsThailand =
      city != null && matchTerms(city, THAILAND_TERMS).length > 0
    const hasDestinationMismatch = cityIsThailand

    const reasons: string[] = foreignSignals.map(foreign => {
      if (hasDestinationMismatch) {
        return `Source city is ${city}, but title mentions ${foreign}.`
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

  if (thailandSignals.length > 0) {
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
    thailandSignals: [],
    foreignSignals: [],
    hasDestinationMismatch: false,
  }
}
