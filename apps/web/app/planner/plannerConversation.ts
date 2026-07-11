import { PARSER_PROMPT_LIMIT, parseTripIntent } from '@/lib/ai-trip/parse-intent'
import type { ParseTripIntentResult } from '@/lib/ai-trip/intent-schema'

// Deterministic guided-conversation steps for the planner studio. This is a
// local rule-based flow (no generative model): each traveler message is merged
// into one trip idea, re-parsed locally, and the next guide step is derived
// from which structured fields are still missing.

export type GuideStepKind =
  | 'ask_destination'
  | 'ask_duration'
  | 'ask_interests'
  | 'ready_to_search'

export type GuideStep = {
  kind: GuideStepKind
  message: string
  chips: string[]
}

export const DESTINATION_CHIPS = ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Thailand multi-city']
export const DURATION_CHIPS = ['1 day', '2 days', '3 days', '4 days', '7 days']
export const INTEREST_CHIPS = ['Elephants', 'Food', 'Temples', 'Islands', 'Nature']
export const SKIP_INTERESTS_CHIP = 'Build my route now'

export const REVIEWED_RETRY_CHIPS = [
  'Gentle elephant day in Chiang Mai',
  'Family-friendly elephant sanctuary in Chiang Mai',
  'Chiang Mai cooking and local food day',
  'Chiang Mai nature and elephant day trip',
]

export function mergeTripIdea(parts: string[]): string {
  return parts
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ')
    .slice(0, PARSER_PROMPT_LIMIT)
}

export function parseMergedTripIdea(parts: string[]): ParseTripIntentResult {
  return parseTripIntent(mergeTripIdea(parts))
}

export function decideNextGuideStep(
  result: ParseTripIntentResult,
  options: { interestsSkipped: boolean },
): GuideStep {
  const { destination, durationDays, interests } = result.intent

  if (!destination) {
    return {
      kind: 'ask_destination',
      message:
        'Where in Thailand are you thinking? I can match reviewed experiences for these destinations, or structure a wider Thailand route.',
      chips: DESTINATION_CHIPS,
    }
  }

  if (!durationDays) {
    return {
      kind: 'ask_duration',
      message: `Nice — ${destination}. How many days should I plan the day-trip sequence for?`,
      chips: DURATION_CHIPS,
    }
  }

  if (interests.length === 0 && !options.interestsSkipped) {
    return {
      kind: 'ask_interests',
      message:
        'Anything you want the days to focus on? Pick an interest or tell me in your own words — or I can build the route from what I have.',
      chips: [...INTEREST_CHIPS, SKIP_INTERESTS_CHIP],
    }
  }

  const interestSummary = interests.length > 0 ? ` around ${interests.join(', ')}` : ''

  return {
    kind: 'ready_to_search',
    message: `Building a ${durationDays}-day ${destination} plan${interestSummary} from reviewed Thailand experiences…`,
    chips: [],
  }
}

export function summarizeUnderstoodIntent(result: ParseTripIntentResult): string[] {
  const chips: string[] = []
  const { destination, durationDays, interests, avoid } = result.intent

  if (destination) chips.push(destination)
  if (durationDays) chips.push(`${durationDays} day${durationDays === 1 ? '' : 's'}`)
  for (const interest of interests) chips.push(interest)
  for (const avoided of avoid) chips.push(`avoid ${avoided}`)

  return chips
}
