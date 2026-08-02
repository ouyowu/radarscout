import type { ReviewedViatorPublicProduct } from '@/lib/viator/reviewedViatorPublicCatalogue'

export type PhuketIslandExperience = 'snorkeling' | 'scenery' | 'relaxed'
export type PhuketIslandTravelerType = 'family' | 'couple' | 'friends'
export type PhuketIslandPace = 'gentle' | 'balanced' | 'active'

export type PhuketIslandSelectorInput = {
  experience: PhuketIslandExperience
  travelerType: PhuketIslandTravelerType
  pace: PhuketIslandPace
}

export type PhuketIslandDayMatch = {
  product: ReviewedViatorPublicProduct
  whyRecommended: string
  bestFor: string[]
  notFor: string[]
  watchOut: string
}

const WATER_DAY_TAGS = new Set([
  'beach-club',
  'boat',
  'canoeing',
  'catamaran',
  'islands',
  'jet-ski',
  'kayaking',
  'leisure',
  'snorkeling',
  'speedboat',
  'sunset',
  'yacht',
])

// The stored title describes a James Bond Island yacht trip, while the reviewed
// handoff URL still names a Similan catamaran product. Keep it out of decision
// results until the catalogue record is re-reviewed against Viator.
const PRODUCTS_REQUIRING_CATALOGUE_REVIEW = new Set(['viator_100246p6'])

const EXPERIENCE_TAGS: Record<PhuketIslandExperience, readonly string[]> = {
  snorkeling: ['snorkeling', 'kayaking', 'canoeing'],
  scenery: ['islands', 'nature', 'sunset'],
  relaxed: ['catamaran', 'yacht', 'leisure', 'beach-club'],
}

const PACE_TAGS: Record<PhuketIslandPace, readonly string[]> = {
  gentle: ['catamaran', 'yacht', 'leisure', 'big-boat'],
  balanced: ['boat', 'islands', 'nature'],
  active: ['snorkeling', 'kayaking', 'canoeing', 'jet-ski', 'speedboat', 'adventure'],
}

const TRAVELER_TAGS: Record<PhuketIslandTravelerType, readonly string[]> = {
  family: ['catamaran', 'boat', 'nature', 'islands'],
  couple: ['sunset', 'yacht', 'private', 'leisure'],
  friends: ['snorkeling', 'kayaking', 'canoeing', 'speedboat', 'adventure'],
}

function normalizedTags(product: ReviewedViatorPublicProduct): Set<string> {
  return new Set(product.tags.map(tag => tag.trim().toLowerCase()))
}

function countMatches(tags: Set<string>, preferred: readonly string[]): number {
  return preferred.reduce((score, tag) => score + Number(tags.has(tag)), 0)
}

function scoreProduct(
  product: ReviewedViatorPublicProduct,
  input: PhuketIslandSelectorInput,
): number {
  const tags = normalizedTags(product)
  let score = countMatches(tags, EXPERIENCE_TAGS[input.experience]) * 5
  score += countMatches(tags, PACE_TAGS[input.pace]) * 3
  score += countMatches(tags, TRAVELER_TAGS[input.travelerType]) * 2

  if (input.travelerType === 'family' && (tags.has('jet-ski') || tags.has('adventure'))) {
    score -= 5
  }
  if (input.pace === 'gentle' && (tags.has('jet-ski') || tags.has('speedboat'))) {
    score -= 3
  }

  return score
}

function buildDecisionCopy(
  product: ReviewedViatorPublicProduct,
  input: PhuketIslandSelectorInput,
): Omit<PhuketIslandDayMatch, 'product'> {
  const tags = normalizedTags(product)
  const experienceLabel = {
    snorkeling: 'snorkeling and time in the water',
    scenery: 'island scenery and a classic Phuket day out',
    relaxed: 'a more relaxed day on the water',
  }[input.experience]
  const travelerLabel = {
    family: 'families comparing reviewed island days',
    couple: 'couples choosing a Phuket day together',
    friends: 'friends planning a shared water-based day',
  }[input.travelerType]

  const active = tags.has('jet-ski') || tags.has('adventure') || tags.has('speedboat')
  const participatesInWater = tags.has('snorkeling') || tags.has('kayaking') || tags.has('canoeing')

  return {
    whyRecommended: `This reviewed Phuket option is a strong match for ${experienceLabel}.`,
    bestFor: [travelerLabel, `${input.pace[0].toUpperCase()}${input.pace.slice(1)}-pace comparisons`],
    notFor: [
      active
        ? 'Travelers who prefer to avoid faster or more active time on the water'
        : 'Travelers looking for a high-adrenaline water-sports day',
      participatesInWater
        ? 'Travelers who do not want optional water participation'
        : 'Travelers whose main priority is snorkeling or paddling',
    ],
    watchOut: 'Confirm current price, pickup coverage, cancellation terms, duration, and sea-condition guidance on Viator before choosing.',
  }
}

export function selectPhuketIslandDayMatches(
  products: readonly ReviewedViatorPublicProduct[],
  input: PhuketIslandSelectorInput,
): PhuketIslandDayMatch[] {
  return products
    .filter(product => product.destination === 'Phuket')
    .filter(product => !PRODUCTS_REQUIRING_CATALOGUE_REVIEW.has(product.id))
    .filter(product => {
      const tags = normalizedTags(product)
      return [...tags].some(tag => WATER_DAY_TAGS.has(tag))
    })
    .map((product, index) => ({ product, index, score: scoreProduct(product, input) }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .map(({ product }) => ({ product, ...buildDecisionCopy(product, input) }))
}
