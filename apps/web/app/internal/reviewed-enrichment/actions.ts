'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export type SaveState =
  | { ok: true }
  | { ok: false; error: string; fields?: string[] }
  | null

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
  const suggestedTags = tagsRaw.length > 0
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : []

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
