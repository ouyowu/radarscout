import {
  createEmptyTripIntent,
  ParseTripIntentResult,
  TripBudget,
  TripIntent,
  TripPace,
  TravelerType,
  withNormalizedIntentLists,
} from './intent-schema'

const MAX_PROMPT_LENGTH = 600

const interestMatchers: Array<[RegExp, string]> = [
  [/\b(food|foods|tapas|street food|local food)\b/i, 'food'],
  [/\b(culture|cultural|heritage|history|historic)\b/i, 'culture'],
  [/\b(temple|temples|shrine|shrines)\b/i, 'temples'],
  [/\b(elephant|elephants)\b/i, 'elephants'],
  [/\b(anime|manga)\b/i, 'anime'],
  [/\b(market|markets|bazaar|bazaars)\b/i, 'markets'],
  [/\b(desert|dunes)\b/i, 'desert'],
  [/\b(skyline|skyscraper|skyscrapers)\b/i, 'skyline'],
  [/\b(private transfer|transfer|transfers)\b/i, 'private transfer'],
  [/\b(beach|beaches|island|islands)\b/i, 'beaches'],
  [/\b(hiking|trekking|trail|trails)\b/i, 'hiking'],
  [/\b(nightlife|bars|clubs)\b/i, 'nightlife'],
  [/\b(shopping|mall|malls)\b/i, 'shopping'],
  [/\b(museum|museums|gallery|galleries)\b/i, 'museums'],
  [/\b(cooking|cookery|cooking class)\b/i, 'cooking'],
  [/\b(local neighborhoods|neighborhoods|neighbourhoods|hidden neighborhoods|hidden neighbourhoods)\b/i, 'local neighborhoods'],
  [/美食/, 'food'],
  [/寺庙/, 'temples'],
  [/大象/, 'elephants'],
  [/市场/, 'markets'],
  [/夜生活/, 'nightlife'],
  [/购物/, 'shopping'],
  [/海滩/, 'beaches'],
  [/徒步/, 'hiking'],
  [/博物馆/, 'museums'],
]

const avoidMatchers: Array<[RegExp, string, string]> = [
  [/\b(less crowded|avoid crowds|avoid crowded|not crowded)\b/i, 'crowds', 'less crowded'],
  [/\b(not commercial|less commercial|avoid commercial)\b/i, 'commercial', 'not commercial'],
  [/\b(off the beaten path|off-the-beaten-path)\b/i, 'tourist crowds', 'off the beaten path'],
  [/不拥挤|避开人多/, 'crowds', 'less crowded'],
  [/不商业化/, 'commercial', 'not commercial'],
]

const foodMatchers: Array<[RegExp, string]> = [
  [/\b(vegetarian)\b/i, 'vegetarian'],
  [/\b(vegan)\b/i, 'vegan'],
  [/\b(halal)\b/i, 'halal'],
  [/\b(seafood)\b/i, 'seafood'],
  [/\b(local food|street food)\b/i, 'local food'],
  [/素食/, 'vegetarian'],
  [/清真/, 'halal'],
  [/海鲜/, 'seafood'],
  [/美食/, 'local food'],
]

const accessibilityMatchers: Array<[RegExp, string]> = [
  [/\b(wheelchair)\b/i, 'wheelchair'],
  [/\b(stroller)\b/i, 'stroller'],
  [/\b(accessible|accessibility)\b/i, 'accessible'],
  [/\b(elderly friendly|senior friendly)\b/i, 'elderly friendly'],
  [/轮椅/, 'wheelchair'],
  [/婴儿车/, 'stroller'],
  [/老人|长辈/, 'elderly friendly'],
]

function detectLanguage(prompt: string): string {
  if (/[\u3400-\u9fff]/.test(prompt)) return 'zh'
  if (/[a-z]/i.test(prompt)) return 'en'

  return 'unknown'
}

function normalizeDestination(value: string): string | null {
  const destination = value
    .replace(/\b(for|in|to|trip|travel|plan|itinerary|please|i want|we want|book|booking|pay|payment|tomorrow|today)\b/gi, ' ')
    .replace(/[，。,.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!destination) return null

  return destination
    .split(' ')
    .map(part => part ? part[0].toUpperCase() + part.slice(1) : part)
    .join(' ')
}

function extractDestination(prompt: string): string | null {
  const trimmed = prompt.trim()
  const beforeComma = trimmed.split(/[,，]/)[0]?.trim()
  if (
    beforeComma &&
    !/\d+\s*(days?|nights?|d\s*\d*n|天|晚)/i.test(beforeComma) &&
    !/\b(book|booking|pay|payment|checkout|reserve)\b/i.test(beforeComma)
  ) {
    return normalizeDestination(beforeComma)
  }

  const englishMatch = trimmed.match(/\b(?:in|to|for)\s+([A-Z][A-Za-z\s-]{1,40}?)(?:\s+(?:today|tomorrow|next|for|in|with|and|,|\d)|$)/)
  if (englishMatch?.[1]) return normalizeDestination(englishMatch[1])

  const chineseMatch = trimmed.match(/^([\u3400-\u9fff]{2,12})\s*\d+\s*(?:天|晚)/)
  if (chineseMatch?.[1]) return chineseMatch[1]

  const leadingPlace = trimmed.match(/^([A-Z][A-Za-z\s-]{2,40})\s+\d+\s*(?:days?|nights?)/i)
  if (leadingPlace?.[1]) return normalizeDestination(leadingPlace[1])

  return null
}

function extractNumber(pattern: RegExp, prompt: string): number | null {
  const match = prompt.match(pattern)
  if (!match?.[1]) return null

  const value = Number(match[1])
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : null
}

function extractDurationDays(prompt: string): number | null {
  return extractNumber(/\b(\d{1,2})\s*(?:days?|d)\b/i, prompt) ??
    extractNumber(/\b(\d{1,2})\s*d\s*\d{1,2}\s*n\b/i, prompt) ??
    extractNumber(/(\d{1,2})\s*天/, prompt)
}

function extractDurationNights(prompt: string): number | null {
  return extractNumber(/\b(\d{1,2})\s*(?:nights?|n)\b/i, prompt) ??
    extractNumber(/\b\d{1,2}\s*d\s*(\d{1,2})\s*n\b/i, prompt) ??
    extractNumber(/(\d{1,2})\s*晚/, prompt)
}

function extractMatches(prompt: string, matchers: Array<[RegExp, string]>): string[] {
  return matchers
    .filter(([pattern]) => pattern.test(prompt))
    .map(([, value]) => value)
}

function extractAvoid(prompt: string): Pick<TripIntent, 'avoid' | 'excludedStyles'> {
  const avoid: string[] = []
  const excludedStyles: string[] = []

  for (const [pattern, avoidValue, styleValue] of avoidMatchers) {
    if (!pattern.test(prompt)) continue
    avoid.push(avoidValue)
    excludedStyles.push(styleValue)
  }

  return { avoid, excludedStyles }
}

function extractPace(prompt: string): TripPace {
  if (/\b(relaxed|slow|chill|easy pace|leisurely)\b/i.test(prompt)) return 'relaxed'
  if (/\b(packed|busy|full schedule|intense)\b/i.test(prompt)) return 'packed'
  if (/\b(moderate|balanced)\b/i.test(prompt)) return 'moderate'

  return 'unspecified'
}

function extractBudget(prompt: string): TripBudget {
  if (/\b(cheap|budget|affordable|low cost)\b/i.test(prompt)) return 'budget'
  if (/\b(mid-range|mid range|moderate budget)\b/i.test(prompt)) return 'mid-range'
  if (/\b(premium|upscale)\b/i.test(prompt)) return 'premium'
  if (/\b(luxury|high-end|high end)\b/i.test(prompt)) return 'luxury'

  return 'unspecified'
}

function extractTravelerType(prompt: string): TravelerType {
  if (/\b(solo|alone)\b/i.test(prompt)) return 'solo'
  if (/\b(couple|honeymoon)\b/i.test(prompt)) return 'couple'
  if (/\b(family|kids|children)\b/i.test(prompt)) return 'family'
  if (/\b(friends)\b/i.test(prompt)) return 'friends'
  if (/\b(business|work trip)\b/i.test(prompt)) return 'business'
  if (/一家三口|亲子|孩子/.test(prompt)) return 'family'

  return 'unspecified'
}

function extractGroupSize(prompt: string): number | null {
  const numeric = prompt.match(/\b(?:group of|party of)\s*(\d{1,2})\b/i) ??
    prompt.match(/\b(\d{1,2})\s*(?:people|pax|travelers|travellers)\b/i)

  if (numeric?.[1]) {
    const value = Number(numeric[1])
    if (Number.isFinite(value) && value > 0) return Math.floor(value)
  }

  if (/一家三口/.test(prompt)) return 3

  return null
}

function hasBookingRequest(prompt: string): boolean {
  return /\b(book|booking|pay|payment|checkout|check availability|reserve)\b/i.test(prompt) ||
    /预订|付款|支付|查看余位|确认空位/.test(prompt)
}

function calculateConfidence(intent: TripIntent): number {
  let score = 0
  if (intent.destination) score += 0.3
  if (intent.durationDays) score += 0.25
  if (intent.interests.length > 0) score += 0.2
  if (intent.avoid.length > 0 || intent.excludedStyles.length > 0) score += 0.1
  if (intent.travelerType !== 'unspecified') score += 0.05
  if (intent.budget !== 'unspecified') score += 0.05
  if (intent.pace !== 'unspecified') score += 0.05

  return Math.min(1, Number(score.toFixed(2)))
}

export function parseTripIntent(prompt: string): ParseTripIntentResult {
  const warnings: string[] = []
  const rawPrompt = prompt.trim()
  const language = detectLanguage(rawPrompt)
  const intent = createEmptyTripIntent(language)

  if (!rawPrompt) {
    warnings.push('empty prompt')

    return {
      intent,
      missingFields: intent.missingFields,
      warnings,
      bookingEnabled: false,
      productRetrievalEnabled: false,
      availabilityEnabled: false,
    }
  }

  const normalizedPrompt = rawPrompt.length > MAX_PROMPT_LENGTH
    ? rawPrompt.slice(0, MAX_PROMPT_LENGTH)
    : rawPrompt

  if (rawPrompt.length > MAX_PROMPT_LENGTH) warnings.push('prompt truncated')

  intent.destination = extractDestination(normalizedPrompt)
  intent.durationDays = extractDurationDays(normalizedPrompt)
  intent.durationNights = extractDurationNights(normalizedPrompt)
  intent.interests = extractMatches(normalizedPrompt, interestMatchers)
  intent.foodPreferences = extractMatches(normalizedPrompt, foodMatchers)
  intent.accessibilityNeeds = extractMatches(normalizedPrompt, accessibilityMatchers)
  intent.pace = extractPace(normalizedPrompt)
  intent.budget = extractBudget(normalizedPrompt)
  intent.travelerType = extractTravelerType(normalizedPrompt)
  intent.groupSize = extractGroupSize(normalizedPrompt)

  const avoidIntent = extractAvoid(normalizedPrompt)
  intent.avoid = avoidIntent.avoid
  intent.excludedStyles = avoidIntent.excludedStyles

  if (!intent.destination) warnings.push('ambiguous or missing destination')
  if (!intent.durationDays) warnings.push('ambiguous or missing duration')
  if (hasBookingRequest(normalizedPrompt)) {
    warnings.push('booking/payment/availability request ignored')
  }

  intent.missingFields = [
    ...(!intent.destination ? ['destination'] : []),
    ...(!intent.durationDays ? ['durationDays'] : []),
  ]
  intent.confidence = calculateConfidence(intent)

  const normalizedIntent = withNormalizedIntentLists(intent)

  return {
    intent: normalizedIntent,
    missingFields: normalizedIntent.missingFields,
    warnings,
    bookingEnabled: false,
    productRetrievalEnabled: false,
    availabilityEnabled: false,
  }
}
