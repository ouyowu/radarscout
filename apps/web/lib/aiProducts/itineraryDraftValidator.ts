import 'server-only'
import { validateItineraryDraftSchema, type ItineraryDraft, type ItineraryDraftValidationCode } from './itineraryDraftSchema'
import type { AiProductContextItem } from './buildAiProductContext'

export type ItineraryDraftValidationResult =
  | { ok: true; draft: ItineraryDraft }
  | { ok: false; code: ItineraryDraftValidationCode; reason: string }

type ForbiddenPattern = { pattern: RegExp; code: ItineraryDraftValidationCode; label: string }

const FORBIDDEN_PATTERNS: ForbiddenPattern[] = [
  {
    pattern: /\$\s*[\d,]+|\b\d+(?:\.\d+)?\s*(?:USD|THB|EUR|GBP|AUD|SGD)\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'price amount',
  },
  {
    pattern: /\bdiscount\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'discount claim',
  },
  {
    pattern: /\b(\d+(?:\.\d+)?\s*(?:out\s*of\s*)?\d*\s*stars?|★+)\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'star rating',
  },
  {
    pattern: /\b(\d+(?:,\d+)*\s*reviews?|review\s*count)\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'review count',
  },
  {
    pattern: /\bavailable\s*now\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'available now claim',
  },
  {
    pattern: /\blive\s*availability\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'live availability claim',
  },
  {
    pattern: /\bguaranteed\s*slot\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'guaranteed slot claim',
  },
  {
    pattern: /\breal[-\s]?time\s*slots?\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'real-time slots claim',
  },
  {
    pattern: /\blive\s*inventory\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'live inventory claim',
  },
  {
    pattern: /\binstant\s*confirmation\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'instant confirmation claim',
  },
  {
    pattern: /\bbooking\s*confirmed\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'booking confirmed claim',
  },
  {
    pattern: /\breservation\s*complete\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'reservation complete claim',
  },
  {
    pattern: /\bcheckout\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'checkout instruction',
  },
  {
    pattern: /\bpayment\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'payment instruction',
  },
  {
    pattern: /\bsupplier\s*net\s*rate\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'supplier net rate',
  },
  {
    pattern: /\bcommission\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'commission claim',
  },
  {
    pattern: /\bpartner\s*rate\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'partner rate claim',
  },
  {
    pattern: /\bpickup\s*guaranteed\b|\bguaranteed\s*pickup\b/i,
    code: 'FORBIDDEN_CLAIM',
    label: 'pickup guarantee',
  },
]

function scanStringForForbiddenContent(
  value: string,
): { code: ItineraryDraftValidationCode; reason: string } | null {
  for (const { pattern, code, label } of FORBIDDEN_PATTERNS) {
    if (pattern.test(value)) {
      return { code, reason: `Output contains forbidden ${label}` }
    }
  }
  return null
}

function scanDraftStrings(
  draft: ItineraryDraft,
): { code: ItineraryDraftValidationCode; reason: string } | null {
  const stringsToScan: string[] = [draft.destination, draft.summary, ...draft.warnings]

  for (const day of draft.days) {
    stringsToScan.push(day.title, day.theme)
    for (const item of day.items) {
      stringsToScan.push(item.title, item.description)
    }
  }

  for (const str of stringsToScan) {
    const violation = scanStringForForbiddenContent(str)
    if (violation) return violation
  }

  return null
}

export function validateItineraryDraftOutput(params: {
  rawOutput: unknown
  intent: { durationDays: number; destination: string }
  allowedProducts: Map<string, AiProductContextItem>
}): ItineraryDraftValidationResult {
  const { rawOutput, intent, allowedProducts } = params

  // Step 1: structural schema validation
  const schemaResult = validateItineraryDraftSchema(rawOutput)
  if (!schemaResult.ok) return schemaResult

  const { draft } = schemaResult

  // Step 2: durationDays must match confirmed intent
  if (draft.durationDays !== intent.durationDays) {
    return {
      ok: false,
      code: 'DURATION_MISMATCH',
      reason: `Draft durationDays (${draft.durationDays}) does not match intent durationDays (${intent.durationDays})`,
    }
  }

  // Step 3: product reference checks
  const seenProductIds = new Set<string>()

  for (const day of draft.days) {
    for (const item of day.items) {
      if (item.type === 'experience') {
        if (!item.productId) {
          return {
            ok: false,
            code: 'MISSING_PRODUCT_ID',
            reason: `Experience item "${item.title}" in Day ${day.day} is missing productId`,
          }
        }
        if (!allowedProducts.has(item.productId)) {
          return {
            ok: false,
            code: 'UNKNOWN_PRODUCT_ID',
            reason: `productId "${item.productId}" in Day ${day.day} is not in the verified product list`,
          }
        }
        if (seenProductIds.has(item.productId)) {
          return {
            ok: false,
            code: 'DUPLICATE_PRODUCT',
            reason: `productId "${item.productId}" appears more than once across the itinerary`,
          }
        }
        seenProductIds.add(item.productId)
      } else {
        // non-experience items must NOT have productId
        if (item.productId !== undefined) {
          return {
            ok: false,
            code: 'PRODUCT_ID_ON_NON_EXPERIENCE',
            reason: `Non-experience item type "${item.type}" in Day ${day.day} must not have productId`,
          }
        }
      }
    }
  }

  // Step 4: forbidden claim scan over all string fields
  const claimViolation = scanDraftStrings(draft)
  if (claimViolation) return { ok: false, ...claimViolation }

  return { ok: true, draft }
}
