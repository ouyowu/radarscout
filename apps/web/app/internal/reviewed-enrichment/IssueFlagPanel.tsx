'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { flagProduct, clearProductFlag, type FlagState } from './actions'

type IssueFlagData = {
  id: string
  reason: string
  note: string | null
  flaggedBy: string
  flaggedAt: string
}

type Props = {
  productId: string
  issueFlag: IssueFlagData | null
}

const REASON_LABELS: Record<string, string> = {
  destination_mismatch: 'Destination mismatch',
  bad_source_data: 'Bad source data',
  duplicate_product: 'Duplicate product',
  not_relevant: 'Not relevant',
  needs_manual_research: 'Needs manual research',
  other: 'Other',
}

export function IssueFlagPanel({ productId, issueFlag }: Props) {
  const router = useRouter()
  const [flagState, flagAction] = useFormState<FlagState, FormData>(flagProduct, null)
  const [clearState, clearAction] = useFormState<FlagState, FormData>(clearProductFlag, null)

  useEffect(() => {
    if (flagState?.ok || clearState?.ok) {
      router.refresh()
    }
  }, [flagState, clearState, router])

  if (issueFlag) {
    return (
      <div className="overflow-hidden rounded border border-red-200 bg-red-50">
        <div className="border-b border-red-200 bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800">
          Product flagged
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <span className="text-xs font-semibold text-gray-500">Reason</span>
            <span className="font-medium text-red-800">
              {REASON_LABELS[issueFlag.reason] ?? issueFlag.reason}
            </span>
            {issueFlag.note && (
              <>
                <span className="text-xs font-semibold text-gray-500">Note</span>
                <span className="text-red-800">{issueFlag.note}</span>
              </>
            )}
            <span className="text-xs font-semibold text-gray-500">Flagged by</span>
            <span className="text-gray-700">{issueFlag.flaggedBy}</span>
            <span className="text-xs font-semibold text-gray-500">Flagged at</span>
            <span className="text-gray-700">{issueFlag.flaggedAt.slice(0, 10)}</span>
          </div>

          {clearState && !clearState.ok && (
            <div className="rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-800">
              Error: {clearState.error}
            </div>
          )}

          <form action={clearAction}>
            <input type="hidden" name="productId" value={productId} />
            <button
              type="submit"
              className="rounded border border-red-300 bg-white px-4 py-1.5 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Clear issue flag
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded border border-red-100 bg-white">
      <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600">
        Mark as issue
      </div>
      <form action={flagAction} className="space-y-3 p-4">
        <input type="hidden" name="productId" value={productId} />

        {flagState && !flagState.ok && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Error: {flagState.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500">Reason</label>
          <select
            name="reason"
            required
            defaultValue=""
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="" disabled>Select reason…</option>
            {Object.entries(REASON_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500">Note (optional)</label>
          <textarea
            name="note"
            rows={2}
            maxLength={500}
            placeholder="Optional context…"
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500">Flagged by</label>
          <input
            type="text"
            name="flaggedBy"
            required
            placeholder="reviewer@example.com"
            maxLength={100}
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-red-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
        >
          Mark as issue
        </button>
      </form>
    </div>
  )
}
