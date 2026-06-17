'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { saveEnrichment, type SaveState } from './actions'

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

const FIELD_CLASSES =
  'w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none'

const LABEL_CLASSES = 'block text-xs font-semibold text-gray-500'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Save enrichment'}
    </button>
  )
}

export function EditForm({ productId, enrichment }: Props) {
  const [state, formAction] = useFormState<SaveState, FormData>(saveEnrichment, null)

  return (
    <div className="overflow-hidden rounded border border-blue-200 bg-blue-50">
      <div className="border-b border-blue-200 bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-800">
        Edit enrichment
      </div>

      <form action={formAction} className="space-y-3 p-4">
        <input type="hidden" name="productId" value={productId} />

        {state && !state.ok && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Error: {state.error}
            {state.fields && state.fields.length > 0 && (
              <span className="ml-1 font-mono text-xs">({state.fields.join(', ')})</span>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL_CLASSES} htmlFor="ef-cleanedTitle">
              Cleaned title
            </label>
            <input
              id="ef-cleanedTitle"
              name="cleanedTitle"
              type="text"
              defaultValue={enrichment?.cleanedTitle ?? ''}
              maxLength={120}
              className={FIELD_CLASSES}
            />
          </div>

          <div>
            <label className={LABEL_CLASSES} htmlFor="ef-seoTitle">
              SEO title
            </label>
            <input
              id="ef-seoTitle"
              name="seoTitle"
              type="text"
              defaultValue={enrichment?.seoTitle ?? ''}
              maxLength={70}
              className={FIELD_CLASSES}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASSES} htmlFor="ef-shortSummary">
            Short summary
          </label>
          <textarea
            id="ef-shortSummary"
            name="shortSummary"
            rows={3}
            defaultValue={enrichment?.shortSummary ?? ''}
            maxLength={280}
            className={`${FIELD_CLASSES} resize-y`}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES} htmlFor="ef-seoDescription">
            SEO description
          </label>
          <textarea
            id="ef-seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={enrichment?.seoDescription ?? ''}
            maxLength={180}
            className={`${FIELD_CLASSES} resize-y`}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES} htmlFor="ef-suggestedTags">
            Suggested tags{' '}
            <span className="font-normal text-gray-400">(comma-separated, max 8)</span>
          </label>
          <input
            id="ef-suggestedTags"
            name="suggestedTags"
            type="text"
            defaultValue={enrichment?.suggestedTags.join(', ') ?? ''}
            className={FIELD_CLASSES}
          />
        </div>

        <div>
          <label className={LABEL_CLASSES} htmlFor="ef-reviewedBy">
            Reviewed by <span className="text-red-500">*</span>
          </label>
          <input
            id="ef-reviewedBy"
            name="reviewedBy"
            type="text"
            required
            defaultValue={enrichment?.reviewedBy ?? ''}
            maxLength={160}
            placeholder="email or name"
            className={FIELD_CLASSES}
          />
        </div>

        <p className="text-xs text-gray-400">
          reviewedAt is set automatically on save. productId: <code className="font-mono">{productId}</code>
        </p>

        <SubmitButton />
      </form>
    </div>
  )
}
