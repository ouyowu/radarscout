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

type Props = {
  productId: string
  enrichment: ReviewedEnrichment | null
}

export function InspectEditor({ productId, enrichment }: Props) {
  const [selectedDraft, setSelectedDraft] = useState<CandidateDraft | null>(null)
  const [formKey, setFormKey] = useState(0)

  function handleUseDraft(draft: CandidateDraft) {
    setSelectedDraft(draft)
    setFormKey(k => k + 1)
  }

  return (
    <>
      <CandidateSection productId={productId} onUseDraft={handleUseDraft} />
      <EditForm
        key={formKey}
        productId={productId}
        enrichment={enrichment}
        prefillValues={selectedDraft}
      />
    </>
  )
}
