import 'server-only'

import {
  cleanProductText,
  draftSeoSnippet,
  suggestProductTags,
} from './tasks'
import type {
  CleanProductTextResult,
  DraftSeoSnippetResult,
  LocalAiError,
  SuggestProductTagsResult,
} from './types'

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

function isCleanProductTextSuccess(
  result: CleanProductTextResult,
): result is Extract<CleanProductTextResult, { ok: true }> {
  return result.ok
}

function isSuggestProductTagsSuccess(
  result: SuggestProductTagsResult,
): result is Extract<SuggestProductTagsResult, { ok: true }> {
  return result.ok
}

function isDraftSeoSnippetSuccess(
  result: DraftSeoSnippetResult,
): result is Extract<DraftSeoSnippetResult, { ok: true }> {
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

export async function generateProductEnrichmentCandidates(
  input: ProductEnrichmentInput,
): Promise<ProductEnrichmentCandidate> {
  const safeInput = {
    productId: input.id,
    title: input.title,
    description: input.description,
    excerpt: input.excerpt,
    destination: input.destination,
    location: input.location,
    supplierName: input.supplierName,
  }

  const [cleaned, tags, seo] = await Promise.all([
    cleanProductText({
      title: safeInput.title,
      description: safeInput.description,
      excerpt: safeInput.excerpt,
    }),
    suggestProductTags({
      title: safeInput.title,
      description: safeInput.description ?? safeInput.excerpt,
      existingTags: [],
    }),
    draftSeoSnippet({
      title: safeInput.title,
      description: safeInput.description ?? safeInput.excerpt,
      destination: safeInput.destination,
    }),
  ])

  if (!isCleanProductTextSuccess(cleaned)) {
    return {
      ok: false,
      productId: safeInput.productId,
      error: cleaned.error,
      warnings: cleaned.warnings,
    }
  }

  if (!isSuggestProductTagsSuccess(tags)) {
    return {
      ok: false,
      productId: safeInput.productId,
      error: tags.error,
      warnings: mergeWarnings(cleaned.warnings, tags.warnings),
    }
  }

  if (!isDraftSeoSnippetSuccess(seo)) {
    return {
      ok: false,
      productId: safeInput.productId,
      error: seo.error,
      warnings: mergeWarnings(cleaned.warnings, tags.warnings, seo.warnings),
    }
  }

  const forbiddenKeys = [
    ...findForbiddenKeys(cleaned),
    ...findForbiddenKeys(tags),
    ...findForbiddenKeys(seo),
  ]

  const warnings = mergeWarnings(
    cleaned.warnings,
    tags.warnings,
    seo.warnings,
    forbiddenKeys.length > 0 ? [`forbidden generated fields ignored: ${normalizeStringArray(forbiddenKeys).join(', ')}`] : [],
  )

  return {
    ok: true,
    productId: safeInput.productId,
    cleanedTitle: clamp(cleaned.title, MAX_TITLE_LENGTH),
    shortSummary: clamp(cleaned.summary, MAX_SUMMARY_LENGTH),
    suggestedTags: normalizeTags(tags.tags),
    seoTitle: clamp(seo.title, MAX_SEO_TITLE_LENGTH),
    seoDescription: clamp(seo.metaDescription, MAX_SEO_DESCRIPTION_LENGTH),
    missingFacts: mergeMissingFacts(
      cleaned.missingFacts,
      tags.missingFacts,
      seo.missingFacts,
    ),
    warnings,
  }
}
