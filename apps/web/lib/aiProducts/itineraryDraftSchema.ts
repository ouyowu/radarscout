import 'server-only'

export const ITINERARY_SCHEMA_VERSION = 'itinerary-draft-v1' as const
export const MAX_DURATION_DAYS = 14
export const MAX_ITEMS_PER_DAY = 8
export const MAX_WARNINGS = 10
export const MAX_TEXT_SHORT = 200
export const MAX_TEXT_LONG = 500

export type ItineraryDraftItemType = 'experience' | 'free_time' | 'transfer_note' | 'meal_note'
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'flexible'

export type ItineraryDraftItem = {
  type: ItineraryDraftItemType
  productId?: string
  title: string
  description: string
  timeOfDay: TimeOfDay
}

export type ItineraryDraftDay = {
  day: number
  title: string
  theme: string
  items: ItineraryDraftItem[]
}

export type ItineraryDraft = {
  destination: string
  durationDays: number
  summary: string
  days: ItineraryDraftDay[]
  warnings: string[]
}

export type ItineraryDraftValidationCode =
  | 'MALFORMED_OUTPUT'
  | 'INVALID_DURATION_DAYS'
  | 'DURATION_MISMATCH'
  | 'INVALID_DAY_COUNT'
  | 'NON_SEQUENTIAL_DAYS'
  | 'MISSING_DAY'
  | 'TOO_MANY_ITEMS'
  | 'MISSING_PRODUCT_ID'
  | 'PRODUCT_ID_ON_NON_EXPERIENCE'
  | 'UNKNOWN_PRODUCT_ID'
  | 'DUPLICATE_PRODUCT'
  | 'FORBIDDEN_CLAIM'
  | 'OVERSIZED_TEXT'
  | 'INVALID_ITEM_TYPE'
  | 'INVALID_TIME_OF_DAY'

export type SchemaValidationResult =
  | { ok: true; draft: ItineraryDraft }
  | { ok: false; code: ItineraryDraftValidationCode; reason: string }

const VALID_ITEM_TYPES = new Set<string>(['experience', 'free_time', 'transfer_note', 'meal_note'])
const VALID_TIME_OF_DAY = new Set<string>(['morning', 'afternoon', 'evening', 'flexible'])

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v)
}

function assertMaxLength(
  value: string,
  max: number,
  fieldPath: string,
): SchemaValidationResult | null {
  if (value.length > max) {
    return {
      ok: false,
      code: 'OVERSIZED_TEXT',
      reason: `${fieldPath} exceeds max length of ${max} characters`,
    }
  }
  return null
}

export function validateItineraryDraftSchema(raw: unknown): SchemaValidationResult {
  if (!isObject(raw)) {
    return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'Output is not an object' }
  }

  if (!isString(raw.destination)) {
    return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'destination is missing or not a string' }
  }
  const textErr = assertMaxLength(raw.destination, MAX_TEXT_SHORT, 'destination')
  if (textErr) return textErr

  if (typeof raw.durationDays !== 'number' || !Number.isInteger(raw.durationDays)) {
    return { ok: false, code: 'INVALID_DURATION_DAYS', reason: 'durationDays must be an integer' }
  }
  if (raw.durationDays < 1 || raw.durationDays > MAX_DURATION_DAYS) {
    return {
      ok: false,
      code: 'INVALID_DURATION_DAYS',
      reason: `durationDays must be between 1 and ${MAX_DURATION_DAYS}`,
    }
  }

  if (!isString(raw.summary)) {
    return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'summary is missing or not a string' }
  }
  const summaryErr = assertMaxLength(raw.summary, MAX_TEXT_LONG, 'summary')
  if (summaryErr) return summaryErr

  if (!isArray(raw.days)) {
    return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'days must be an array' }
  }

  if (raw.days.length !== raw.durationDays) {
    return {
      ok: false,
      code: 'INVALID_DAY_COUNT',
      reason: `Expected ${raw.durationDays} days but got ${raw.days.length}`,
    }
  }

  const validatedDays: ItineraryDraftDay[] = []

  for (let i = 0; i < raw.days.length; i++) {
    const dayRaw = raw.days[i]
    if (!isObject(dayRaw)) {
      return { ok: false, code: 'MALFORMED_OUTPUT', reason: `Day at index ${i} is not an object` }
    }

    if (typeof dayRaw.day !== 'number' || dayRaw.day !== i + 1) {
      return {
        ok: false,
        code: 'NON_SEQUENTIAL_DAYS',
        reason: `Day at index ${i} has day=${dayRaw.day}, expected ${i + 1}`,
      }
    }

    if (!isString(dayRaw.title)) {
      return { ok: false, code: 'MALFORMED_OUTPUT', reason: `Day ${i + 1} title is missing` }
    }
    const dayTitleErr = assertMaxLength(dayRaw.title, MAX_TEXT_SHORT, `Day ${i + 1} title`)
    if (dayTitleErr) return dayTitleErr

    if (!isString(dayRaw.theme)) {
      return { ok: false, code: 'MALFORMED_OUTPUT', reason: `Day ${i + 1} theme is missing` }
    }
    const dayThemeErr = assertMaxLength(dayRaw.theme, MAX_TEXT_SHORT, `Day ${i + 1} theme`)
    if (dayThemeErr) return dayThemeErr

    if (!isArray(dayRaw.items)) {
      return { ok: false, code: 'MALFORMED_OUTPUT', reason: `Day ${i + 1} items must be an array` }
    }

    if (dayRaw.items.length > MAX_ITEMS_PER_DAY) {
      return {
        ok: false,
        code: 'TOO_MANY_ITEMS',
        reason: `Day ${i + 1} has ${dayRaw.items.length} items, max is ${MAX_ITEMS_PER_DAY}`,
      }
    }

    const validatedItems: ItineraryDraftItem[] = []

    for (let j = 0; j < dayRaw.items.length; j++) {
      const itemRaw = dayRaw.items[j]
      if (!isObject(itemRaw)) {
        return {
          ok: false,
          code: 'MALFORMED_OUTPUT',
          reason: `Day ${i + 1} item ${j} is not an object`,
        }
      }

      if (!isString(itemRaw.type) || !VALID_ITEM_TYPES.has(itemRaw.type)) {
        return {
          ok: false,
          code: 'INVALID_ITEM_TYPE',
          reason: `Day ${i + 1} item ${j} has invalid type "${itemRaw.type}"`,
        }
      }

      if (!isString(itemRaw.title)) {
        return {
          ok: false,
          code: 'MALFORMED_OUTPUT',
          reason: `Day ${i + 1} item ${j} title is missing`,
        }
      }
      const itemTitleErr = assertMaxLength(
        itemRaw.title,
        MAX_TEXT_SHORT,
        `Day ${i + 1} item ${j} title`,
      )
      if (itemTitleErr) return itemTitleErr

      if (!isString(itemRaw.description)) {
        return {
          ok: false,
          code: 'MALFORMED_OUTPUT',
          reason: `Day ${i + 1} item ${j} description is missing`,
        }
      }
      const itemDescErr = assertMaxLength(
        itemRaw.description,
        MAX_TEXT_LONG,
        `Day ${i + 1} item ${j} description`,
      )
      if (itemDescErr) return itemDescErr

      if (!isString(itemRaw.timeOfDay) || !VALID_TIME_OF_DAY.has(itemRaw.timeOfDay)) {
        return {
          ok: false,
          code: 'INVALID_TIME_OF_DAY',
          reason: `Day ${i + 1} item ${j} has invalid timeOfDay "${itemRaw.timeOfDay}"`,
        }
      }

      const item: ItineraryDraftItem = {
        type: itemRaw.type as ItineraryDraftItemType,
        title: itemRaw.title,
        description: itemRaw.description,
        timeOfDay: itemRaw.timeOfDay as TimeOfDay,
      }

      if (itemRaw.productId !== undefined) {
        if (!isString(itemRaw.productId)) {
          return {
            ok: false,
            code: 'MALFORMED_OUTPUT',
            reason: `Day ${i + 1} item ${j} productId must be a string`,
          }
        }
        item.productId = itemRaw.productId
      }

      validatedItems.push(item)
    }

    validatedDays.push({
      day: i + 1,
      title: dayRaw.title,
      theme: dayRaw.theme,
      items: validatedItems,
    })
  }

  if (!isArray(raw.warnings)) {
    return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'warnings must be an array' }
  }
  if (raw.warnings.length > MAX_WARNINGS) {
    return {
      ok: false,
      code: 'MALFORMED_OUTPUT',
      reason: `Too many warnings (max ${MAX_WARNINGS})`,
    }
  }
  for (const w of raw.warnings) {
    if (!isString(w)) {
      return { ok: false, code: 'MALFORMED_OUTPUT', reason: 'Each warning must be a string' }
    }
    const wErr = assertMaxLength(w, MAX_TEXT_SHORT, 'warning')
    if (wErr) return wErr
  }

  return {
    ok: true,
    draft: {
      destination: raw.destination,
      durationDays: raw.durationDays,
      summary: raw.summary,
      days: validatedDays,
      warnings: raw.warnings as string[],
    },
  }
}
