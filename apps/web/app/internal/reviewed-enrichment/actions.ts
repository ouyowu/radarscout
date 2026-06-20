'use server'

import { headers } from 'next/headers'

export type SaveState =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string; fields?: string[] }
  | null

function isSafeProductId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,100}$/.test(id)
}

export type CandidateDraft = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
  seoTitle: string | null
  seoDescription: string | null
}

export type CandidateResult =
  | { ok: true; draft: CandidateDraft; warnings: string[] }
  | { ok: false; error: string }

function getOrigin(): string {
  const headerStore = headers()
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host')
  const proto = headerStore.get('x-forwarded-proto') ?? 'http'

  if (host) return `${proto}://${host}`

  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

export async function saveEnrichment(
  _prevState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return { ok: false, error: 'not_configured' }

  const productId = formData.get('productId')?.toString().trim() ?? ''
  if (!productId) return { ok: false, error: 'invalid_product_id' }

  const tagsRaw = formData.get('suggestedTags')?.toString() ?? ''
  const seen = new Set<string>()
  const suggestedTags = tagsRaw.length > 0
    ? tagsRaw.split(',').map(t => t.trim()).filter(t => {
        if (!t) return false
        const key = t.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    : []

  if (suggestedTags.length > 8) {
    return { ok: false, error: 'too_many_tags', fields: ['suggestedTags'] }
  }

  // reviewedAt intentionally omitted — write endpoint defaults to new Date() when absent
  const payload = {
    productId,
    cleanedTitle: formData.get('cleanedTitle')?.toString() || undefined,
    shortSummary: formData.get('shortSummary')?.toString() || undefined,
    suggestedTags,
    seoTitle: formData.get('seoTitle')?.toString() || undefined,
    seoDescription: formData.get('seoDescription')?.toString() || undefined,
    reviewedBy: formData.get('reviewedBy')?.toString() || undefined,
  }

  const nextProductIdRaw = formData.get('nextProductId')?.toString().trim() ?? ''
  const q = formData.get('q')?.toString().trim() ?? ''
  const city = formData.get('city')?.toString().trim() ?? ''
  const status = formData.get('status')?.toString().trim() ?? ''

  try {
    const response = await fetch(
      `${getOrigin()}/api/internal/product-enrichment/reviewed`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-enrichment-review-secret': secret,
        },
        body: JSON.stringify(payload),
      },
    )

    const data = await response.json() as { ok: boolean; error?: string; fields?: string[] }

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error ?? 'save_failed',
        ...(data.fields ? { fields: data.fields } : {}),
      }
    }
  } catch {
    return { ok: false, error: 'save_unavailable' }
  }

  const useNextId = nextProductIdRaw && isSafeProductId(nextProductIdRaw)

  if (useNextId) {
    const redirectParams = new URLSearchParams({ productId: nextProductIdRaw! })
    if (q) redirectParams.set('q', q)
    if (city) redirectParams.set('city', city)
    if (status) redirectParams.set('status', status)
    redirectParams.set('prevSaved', productId)
    const cleanedTitle = formData.get('cleanedTitle')?.toString().trim() ?? ''
    if (cleanedTitle) redirectParams.set('prevSavedTitle', cleanedTitle)
    return { ok: true, redirectTo: `/internal/reviewed-enrichment?${redirectParams.toString()}` }
  }

  // No next Missing product — return to list with a success notice
  const listParams = new URLSearchParams({ savedFrom: productId })
  if (q) listParams.set('q', q)
  if (city) listParams.set('city', city)
  if (status) listParams.set('status', status)
  return { ok: true, redirectTo: `/internal/reviewed-enrichment?${listParams.toString()}` }
}

const ALLOWED_CANDIDATE_ERRORS = new Set<string>([
  'local_ai_not_configured',
  'local_ai_request_failed',
  'local_ai_invalid_response',
  'cloudflare_access_not_configured',
  'cloudflare_access_forbidden',
  'openwebui_unauthorized',
  'openwebui_not_found',
  'openwebui_model_not_found',
  'openwebui_timeout',
  'openwebui_bad_response',
])

export async function generateCandidate(productId: string): Promise<CandidateResult> {
  const enrichmentSecret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!enrichmentSecret) return { ok: false, error: 'not_configured' }

  const aiSecret = process.env.INTERNAL_AI_PREVIEW_SECRET
  if (!aiSecret) return { ok: false, error: 'ai_preview_not_configured' }

  const trimmedId = productId.trim()
  if (!trimmedId) return { ok: false, error: 'invalid_product_id' }

  try {
    const response = await fetch(
      `${getOrigin()}/api/internal/product-enrichment/preview`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-ai-preview-secret': aiSecret,
        },
        body: JSON.stringify({ productId: trimmedId }),
      },
    )

    if (response.status === 404) {
      return { ok: false, error: 'product_not_found' }
    }

    const data = await response.json() as {
      ok: boolean
      candidate?: {
        ok: boolean
        cleanedTitle?: string | null
        shortSummary?: string | null
        suggestedTags?: string[]
        seoTitle?: string | null
        seoDescription?: string | null
        warnings?: string[]
        error?: string
      }
    }

    if (!response.ok || !data.ok) {
      return { ok: false, error: 'preview_unavailable' }
    }

    const candidate = data.candidate
    if (!candidate) return { ok: false, error: 'preview_unavailable' }

    if (!candidate.ok) {
      const safeError =
        typeof candidate.error === 'string' && ALLOWED_CANDIDATE_ERRORS.has(candidate.error)
          ? candidate.error
          : 'candidate_failed'
      return { ok: false, error: safeError }
    }

    return {
      ok: true,
      draft: {
        cleanedTitle: candidate.cleanedTitle ?? null,
        shortSummary: candidate.shortSummary ?? null,
        suggestedTags: candidate.suggestedTags ?? [],
        seoTitle: candidate.seoTitle ?? null,
        seoDescription: candidate.seoDescription ?? null,
      },
      warnings: candidate.warnings ?? [],
    }
  } catch {
    return { ok: false, error: 'preview_unavailable' }
  }
}

const ISSUE_REASONS = new Set([
  'destination_mismatch',
  'bad_source_data',
  'duplicate_product',
  'not_relevant',
  'needs_manual_research',
  'other',
])

export type FlagState =
  | { ok: true }
  | { ok: false; error: string }
  | null

export async function flagProduct(
  _prevState: FlagState,
  formData: FormData,
): Promise<FlagState> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return { ok: false, error: 'not_configured' }

  const productId = formData.get('productId')?.toString().trim() ?? ''
  if (!productId || !/^[a-zA-Z0-9_-]{1,100}$/.test(productId)) {
    return { ok: false, error: 'invalid_product_id' }
  }

  const reason = formData.get('reason')?.toString().trim() ?? ''
  if (!ISSUE_REASONS.has(reason)) {
    return { ok: false, error: 'invalid_reason' }
  }

  const flaggedBy = formData.get('flaggedBy')?.toString().trim() ?? ''
  if (!flaggedBy || flaggedBy.length > 100) {
    return { ok: false, error: 'invalid_flagged_by' }
  }

  const noteRaw = formData.get('note')?.toString().trim() ?? ''
  const note = noteRaw.length > 0 ? noteRaw.slice(0, 500) : ''

  try {
    const body: Record<string, string> = { productId, reason, flaggedBy }
    if (note) body.note = note

    const response = await fetch(
      `${getOrigin()}/api/internal/product-enrichment/flag`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-enrichment-review-secret': secret,
        },
        body: JSON.stringify(body),
      },
    )
    const data = await response.json() as { ok: boolean; error?: string }
    if (!response.ok || !data.ok) return { ok: false, error: data.error ?? 'flag_failed' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'flag_unavailable' }
  }
}

export async function clearProductFlag(
  _prevState: FlagState,
  formData: FormData,
): Promise<FlagState> {
  const secret = process.env.INTERNAL_ENRICHMENT_REVIEW_SECRET
  if (!secret) return { ok: false, error: 'not_configured' }

  const productId = formData.get('productId')?.toString().trim() ?? ''
  if (!productId || !/^[a-zA-Z0-9_-]{1,100}$/.test(productId)) {
    return { ok: false, error: 'invalid_product_id' }
  }

  try {
    const response = await fetch(
      `${getOrigin()}/api/internal/product-enrichment/flag`,
      {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-enrichment-review-secret': secret,
        },
        body: JSON.stringify({ productId }),
      },
    )
    const data = await response.json() as { ok: boolean; error?: string }
    if (!response.ok || !data.ok) return { ok: false, error: data.error ?? 'clear_failed' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'clear_unavailable' }
  }
}
