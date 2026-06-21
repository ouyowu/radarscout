'use client'

import { useState, useTransition } from 'react'
import { generateCandidate, type CandidateDraft, type ThailandEligibilityResult } from './actions'
import { detectDraftMismatch } from './qualityWarnings'

type Props = {
  productId: string
  onUseDraft: (draft: CandidateDraft) => void
  city?: string | null
  eligibility?: ThailandEligibilityResult | null
}

const FIELD_LABEL = 'w-36 shrink-0 text-xs font-semibold text-gray-500'
const FIELD_VALUE = 'text-sm text-gray-900'

export function CandidateSection({ productId, onUseDraft, city, eligibility }: Props) {
  const [draft, setDraft] = useState<CandidateDraft | null>(null)
  const [draftWarnings, setDraftWarnings] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isBlocked = eligibility != null && !eligibility.eligible

  function handleGenerate() {
    if (isBlocked) return
    setDraft(null)
    setDraftWarnings([])
    setErrorMsg(null)
    startTransition(async () => {
      const result = await generateCandidate(productId, eligibility ?? undefined)
      if (result.ok) {
        setDraft(result.draft)
        setDraftWarnings(detectDraftMismatch(city ?? null, result.draft))
      } else {
        setErrorMsg(result.error)
      }
    })
  }

  return (
    <div className="overflow-hidden rounded border border-purple-200 bg-purple-50">
      <div className="border-b border-purple-200 bg-purple-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-800">
        AI draft candidate
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs text-purple-700">
          AI-generated draft only. Not saved. Review carefully before using.
        </p>

        {isBlocked ? (
          <div
            className="rounded border border-red-300 bg-red-50 p-4 space-y-2"
            data-testid="ai-draft-blocked"
          >
            <p className="text-sm font-bold text-red-800">AI draft blocked</p>
            <p className="text-sm text-red-700">
              This source product does not appear to be a valid Thailand experience or contains a
              destination mismatch. Do not use AI to rewrite it into a different product. Use Skip
              and investigate the source data.
            </p>
            {eligibility.reasons.map((reason, i) => (
              <p key={i} className="text-xs text-red-600">
                {reason}
              </p>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending}
            className="rounded bg-purple-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isPending ? 'Generating…' : draft ? 'Re-generate draft' : 'Generate draft'}
          </button>
        )}

        {errorMsg && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Could not generate draft: {errorMsg}
          </div>
        )}

        {draft && (
          <div className="space-y-2">
            <div className="divide-y divide-purple-100 overflow-hidden rounded border border-purple-200 bg-white">
              {[
                { label: 'Cleaned title', value: draft.cleanedTitle },
                { label: 'Short summary', value: draft.shortSummary },
                { label: 'SEO title', value: draft.seoTitle },
                { label: 'SEO description', value: draft.seoDescription },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 px-4 py-2">
                  <span className={FIELD_LABEL}>{label}</span>
                  <span className={value ? FIELD_VALUE : 'text-sm italic text-gray-400'}>
                    {value ?? 'not generated'}
                  </span>
                </div>
              ))}
              {draft.suggestedTags.length > 0 && (
                <div className="flex gap-4 px-4 py-2">
                  <span className={FIELD_LABEL}>Suggested tags</span>
                  <div className="flex flex-wrap gap-1">
                    {draft.suggestedTags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-purple-200 px-2 py-0.5 text-xs text-purple-900"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {draftWarnings.length > 0 && (
              <div className="rounded border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                {draftWarnings.map((w, i) => (
                  <div key={i}>⚠ {w}</div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onUseDraft(draft)}
              className="rounded border border-purple-300 bg-white px-4 py-1.5 text-sm font-semibold text-purple-800 hover:bg-purple-50"
            >
              Use this draft →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
