'use client'

import { useState } from 'react'
import { CandidateSection } from './CandidateSection'
import { EditForm } from './EditForm'
import type { CandidateDraft } from './actions'

type ReviewedEnrichment = {
  cleanedTitle: string | null
  shortSummary: string | null
  suggestedTags: string[]
  seoTitle: string | null
  seoDescription: string | null
  reviewedBy: string | null
}

type NavigationData = {
  previousMissingProductId: string | null
  nextMissingProductId: string | null
  backHref: string
}

type SearchContext = {
  q: string
  city: string
  status: string
}

type Props = {
  productId: string
  enrichment: ReviewedEnrichment | null
  navigation: NavigationData | null
  searchContext: SearchContext
  city?: string | null
}

function buildNavUrl(productId: string, searchContext: SearchContext): string {
  const params = new URLSearchParams({ productId })
  if (searchContext.q) params.set('q', searchContext.q)
  if (searchContext.city) params.set('city', searchContext.city)
  if (searchContext.status && searchContext.status !== 'all') params.set('status', searchContext.status)
  return `/internal/reviewed-enrichment?${params.toString()}`
}

function NavigationBar({
  navigation,
  searchContext,
}: {
  navigation: NavigationData
  searchContext: SearchContext
}) {
  const prevUrl = navigation.previousMissingProductId
    ? buildNavUrl(navigation.previousMissingProductId, searchContext)
    : null
  const nextUrl = navigation.nextMissingProductId
    ? buildNavUrl(navigation.nextMissingProductId, searchContext)
    : null

  return (
    <div className="flex items-center gap-3 rounded border border-gray-200 bg-white px-4 py-2 text-sm">
      <a
        href={navigation.backHref}
        className="text-gray-600 underline hover:text-gray-900"
      >
        ← Back to list
      </a>

      <span className="text-gray-300">|</span>

      {prevUrl ? (
        <a
          href={prevUrl}
          className="text-gray-600 underline hover:text-gray-900"
        >
          ← Previous missing
        </a>
      ) : (
        <span className="text-gray-400 cursor-not-allowed">← Previous missing</span>
      )}

      <span className="text-gray-300">|</span>

      {nextUrl ? (
        <a
          href={nextUrl}
          className="text-gray-600 underline hover:text-gray-900"
        >
          Next missing →
        </a>
      ) : (
        <span className="text-gray-400 cursor-not-allowed">Next missing →</span>
      )}
    </div>
  )
}

export function InspectEditor({ productId, enrichment, navigation, searchContext, city }: Props) {
  const [selectedDraft, setSelectedDraft] = useState<CandidateDraft | null>(null)
  const [formKey, setFormKey] = useState(0)

  function handleUseDraft(draft: CandidateDraft) {
    setSelectedDraft(draft)
    setFormKey(k => k + 1)
  }

  return (
    <>
      {navigation && (
        <NavigationBar navigation={navigation} searchContext={searchContext} />
      )}
      <CandidateSection productId={productId} onUseDraft={handleUseDraft} city={city} />
      <EditForm
        key={formKey}
        productId={productId}
        enrichment={enrichment}
        prefillValues={selectedDraft}
        nextProductId={navigation?.nextMissingProductId ?? null}
        searchContext={searchContext}
      />
    </>
  )
}
