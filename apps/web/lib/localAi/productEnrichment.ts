import 'server-only'

import { draftProductEnrichment } from './tasks'
import type { DraftProductEnrichmentResult, LocalAiError } from './types'

const MAX_TITLE_LENGTH = 120
const MAX_SUMMARY_LENGTH = 280
const MAX_SEO_TITLE_LENGTH = 70
const MAX_SEO_DESCRIPTION_LENGTH = 180
const MAX_TAGS = 8

const FORBIDDEN_KEYS = new Set([
  'price',
  'availability',
  'supplier',
  'rating',
  'bookingUrl',
  'rawJson',
  'openingHours',
  'reviewCount',
  'productId',
  'externalId',
  'externalIds',
])

export type ProductEnrichmentInput = {
  id: string
  title: string | null
  description: string | null
  excerpt: string | null
  destination: string | null
  location: string | null
  supplierName: string | null
}

export type ProductEnrichmentCandidate =
  | {
      ok: true
      productId: string
      cleanedTitle: string | null
      shortSummary: string | null
      suggestedTags: string[]
      seoTitle: string | null
      seoDescription: string | null
      missingFacts: string[]
      warnings: string[]
    }
  | {
      ok: false
      productId: string
      error: LocalAiError
      warnings: string[]
    }

function isDraftProductEnrichmentSuccess(
  result: DraftProductEnrichmentResult,
): result is Extract<DraftProductEnrichmentResult, { ok: true }> {
  return result.ok
}

function clamp(value: string | null | undefined, maxLength: number): string | null {
  if (!value) return null

  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) return null

  return normalized.length > maxLength
    ? normalized.slice(0, maxLength).trim()
    : normalized
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags?.length) return []

  const seen = new Set<string>()
  const normalized: string[] = []

  for (const rawTag of tags) {
    const tag = rawTag.trim().replace(/\s+/g, ' ')
    const key = tag.toLowerCase()

    if (!tag || seen.has(key)) continue

    seen.add(key)
    normalized.push(tag)

    if (normalized.length >= MAX_TAGS) break
  }

  return normalized
}

function normalizeStringArray(values: string[]): string[] {
  return normalizeTags(values)
}

function findForbiddenKeys(value: unknown, path = ''): string[] {
  if (!value || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  const warnings: string[] = []

  for (const [key, nested] of Object.entries(record)) {
    const currentPath = path ? `${path}.${key}` : key

    if (FORBIDDEN_KEYS.has(key)) {
      warnings.push(currentPath)
    }

    warnings.push(...findForbiddenKeys(nested, currentPath))
  }

  return warnings
}

function mergeWarnings(...warningGroups: string[][]): string[] {
  return normalizeStringArray(warningGroups.flat())
}

function mergeMissingFacts(...missingGroups: string[][]): string[] {
  return normalizeStringArray(missingGroups.flat())
}

// Builds a conservative summary fallback from source fields only — never invents facts.
function buildSummaryFallback(input: ProductEnrichmentInput): string | null {
  const title = input.title?.trim()
  if (!title) return null
  const place = (input.destination ?? input.location)?.trim()
  return place ? `${title} in ${place}.` : `${title}.`
}

// Builds a conservative SEO description fallback from source fields only.
function buildSeoDescriptionFallback(input: ProductEnrichmentInput): string | null {
  const title = input.title?.trim()
  if (!title) return null
  const place = (input.destination ?? input.location)?.trim()
  return place ? `${title} — an experience in ${place}.` : `${title}.`
}

export async function generateProductEnrichmentCandidates(
  input: ProductEnrichmentInput,
): Promise<ProductEnrichmentCandidate> {
  // supplierName is deliberately excluded — never passed to AI
  const safeInput = {
    title: input.title,
    description: input.description,
    excerpt: input.excerpt,
    destination: input.destination,
    location: input.location,
  }

  const enrichment = await draftProductEnrichment(safeInput)

  if (!isDraftProductEnrichmentSuccess(enrichment)) {
    return {
      ok: false,
      productId: input.id,
      error: enrichment.error,
      warnings: enrichment.warnings,
    }
  }

  const forbiddenKeys = findForbiddenKeys(enrichment)
  const warnings = mergeWarnings(
    enrichment.warnings,
    forbiddenKeys.length > 0
      ? [`forbidden generated fields ignored: ${normalizeStringArray(forbiddenKeys).join(', ')}`]
      : [],
  )

  let shortSummary = clamp(enrichment.shortSummary, MAX_SUMMARY_LENGTH)
  let seoDescription = clamp(enrichment.seoDescription, MAX_SEO_DESCRIPTION_LENGTH)

  if (!shortSummary) {
    const fallback = buildSummaryFallback(input)
    if (fallback) {
      shortSummary = clamp(fallback, MAX_SUMMARY_LENGTH)
      warnings.push('summary_fallback_used')
    }
  }

  if (!seoDescription) {
    const fallback = buildSeoDescriptionFallback(input)
    if (fallback) {
      seoDescription = clamp(fallback, MAX_SEO_DESCRIPTION_LENGTH)
      warnings.push('seo_description_fallback_used')
    }
  }

  return {
    ok: true,
    productId: input.id,
    cleanedTitle: clamp(enrichment.cleanedTitle, MAX_TITLE_LENGTH),
    shortSummary,
    suggestedTags: normalizeTags(enrichment.suggestedTags),
    seoTitle: clamp(enrichment.seoTitle, MAX_SEO_TITLE_LENGTH),
    seoDescription,
    missingFacts: mergeMissingFacts(enrichment.missingFacts),
    warnings,
  }
}
