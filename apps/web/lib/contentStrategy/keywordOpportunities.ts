export type FreshnessDependency = {
  price: boolean
  pickup: boolean
  policy: boolean
  verifiedAt: boolean
}

export type LocalEvidenceRequired = 'none' | 'original_photos' | 'field_review'

export type ExpectedRevenuePerContentCost = {
  status: 'not_measured'
  value: null
}

export type KeywordOpportunity = {
  keyword: string
  aiSubstitutionRisk: number
  commercialIntent: number
  freshnessDependency: FreshnessDependency
  comparisonDepth: 1 | 2 | 3
  localEvidenceRequired: LocalEvidenceRequired
  partnerHandoffPotential: number
  expectedRevenuePerContentCost: ExpectedRevenuePerContentCost
  scoreRationale: string
}

export type ScoredKeywordOpportunity = KeywordOpportunity & {
  priority: number
}

const SCORE_MIN = 0
const SCORE_MAX = 100

function isScore(value: number): boolean {
  return Number.isInteger(value) && value >= SCORE_MIN && value <= SCORE_MAX
}

/**
 * A transparent editorial priority. It is deliberately not a traffic, CPC,
 * conversion, or revenue prediction; those stay unmeasured until RadarScout
 * has reliable source data and partner attribution evidence.
 */
export function calculateKeywordPriority(
  opportunity: Pick<KeywordOpportunity, 'commercialIntent' | 'aiSubstitutionRisk' | 'partnerHandoffPotential'>,
): number | null {
  if (
    !isScore(opportunity.commercialIntent)
    || !isScore(opportunity.aiSubstitutionRisk)
    || !isScore(opportunity.partnerHandoffPotential)
  ) return null

  return opportunity.commercialIntent
    * (SCORE_MAX - opportunity.aiSubstitutionRisk)
    * opportunity.partnerHandoffPotential
}

const keywordOpportunities: readonly KeywordOpportunity[] = [
  {
    keyword: 'Living Green vs Big Boy for a 6-year-old',
    aiSubstitutionRisk: 10,
    commercialIntent: 96,
    freshnessDependency: { price: true, pickup: true, policy: true, verifiedAt: true },
    comparisonDepth: 3,
    localEvidenceRequired: 'field_review',
    partnerHandoffPotential: 96,
    expectedRevenuePerContentCost: { status: 'not_measured', value: null },
    scoreRationale: 'High-intent family comparison where reviewed child, transfer, and ethics evidence materially changes the decision.',
  },
  {
    keyword: 'Which Chiang Mai elephant sanctuary has the shortest transfer from Nimman?',
    aiSubstitutionRisk: 10,
    commercialIntent: 94,
    freshnessDependency: { price: false, pickup: true, policy: false, verifiedAt: true },
    comparisonDepth: 2,
    localEvidenceRequired: 'field_review',
    partnerHandoffPotential: 94,
    expectedRevenuePerContentCost: { status: 'not_measured', value: null },
    scoreRationale: 'Transfer coverage and travel time are decision-critical, changeable facts that require verified local evidence.',
  },
  {
    keyword: 'Best elephant sanctuary for families staying in Nimman',
    aiSubstitutionRisk: 16,
    commercialIntent: 92,
    freshnessDependency: { price: true, pickup: true, policy: true, verifiedAt: true },
    comparisonDepth: 3,
    localEvidenceRequired: 'field_review',
    partnerHandoffPotential: 92,
    expectedRevenuePerContentCost: { status: 'not_measured', value: null },
    scoreRationale: 'Family fit, pickup coverage, and experience constraints require an explicit recommendation rather than generic inspiration content.',
  },
  {
    keyword: 'Phi Phi vs James Bond Island with children',
    aiSubstitutionRisk: 22,
    commercialIntent: 88,
    freshnessDependency: { price: true, pickup: true, policy: true, verifiedAt: true },
    comparisonDepth: 3,
    localEvidenceRequired: 'original_photos',
    partnerHandoffPotential: 90,
    expectedRevenuePerContentCost: { status: 'not_measured', value: null },
    scoreRationale: 'A family island comparison benefits from real activity differences and current partner terms before handoff.',
  },
  {
    keyword: 'Which Bangkok area is best for families before an Ayutthaya day trip?',
    aiSubstitutionRisk: 30,
    commercialIntent: 78,
    freshnessDependency: { price: true, pickup: false, policy: false, verifiedAt: true },
    comparisonDepth: 2,
    localEvidenceRequired: 'original_photos',
    partnerHandoffPotential: 76,
    expectedRevenuePerContentCost: { status: 'not_measured', value: null },
    scoreRationale: 'A stay-area decision can lead to accommodation and activity handoffs, but needs more verified local coverage than the activity comparisons.',
  },
]

export function listKeywordOpportunities(): ScoredKeywordOpportunity[] {
  return keywordOpportunities
    .map((opportunity) => ({
      ...opportunity,
      priority: calculateKeywordPriority(opportunity) ?? 0,
    }))
    .sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword))
}
