'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type SaveState =
  | { ok: true }
  | { ok: false; error: string; fields?: string[] }
  | null

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

  redirect(
    `/internal/reviewed-enrichment?productId=${encodeURIComponent(productId)}&saved=1`,
  )
}

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
      return { ok: false, error: candidate.error ?? 'candidate_failed' }
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
