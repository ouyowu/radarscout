'use client'

import { useRef, useState } from 'react'

interface Props {
  matchId: string
  postUrl: string
  existingDraft: string | null
  existingProductDesc: string | null
  isPro: boolean
}

type State = 'idle' | 'modal' | 'loading' | 'draft'

export function ReplyButton({ matchId, postUrl, existingDraft, existingProductDesc, isPro }: Props) {
  const [state, setState] = useState<State>(existingDraft ? 'draft' : 'idle')
  const [draft, setDraft] = useState(existingDraft ?? '')
  const [productDesc, setProductDesc] = useState(existingProductDesc ?? '')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  if (!isPro) {
    return (
      <a
        href="/pricing"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-pointer"
        title="Upgrade to Pro to draft replies"
      >
        <LockIcon />
        Draft Reply
      </a>
    )
  }

  async function generate() {
    if (!productDesc.trim()) return
    setState('loading')
    setError(null)

    try {
      const res = await fetch(`/api/matches/${matchId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDescription: productDesc.trim() }),
      })
      const data = await res.json() as { draft?: string; error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        setState('modal')
        return
      }

      setDraft(data.draft ?? '')
      setState('draft')
    } catch {
      setError('Network error — please try again')
      setState('modal')
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function copyAndOpen() {
    await navigator.clipboard.writeText(draft)
    window.open(postUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Trigger button */}
      {state === 'idle' && (
        <button
          type="button"
          onClick={() => setState('modal')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:border-orange-400 hover:text-orange-600 transition-colors cursor-pointer"
        >
          ✍️ Draft Reply
        </button>
      )}

      {state === 'draft' && (
        <button
          type="button"
          onClick={() => setState('modal')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
        >
          ✍️ Draft Reply
        </button>
      )}

      {/* Modal backdrop */}
      {(state === 'modal' || state === 'loading' || state === 'draft') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800/40"
          onClick={e => {
            if (e.target === e.currentTarget && state !== 'loading') setState('idle')
          }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Draft a Reddit reply"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Draft a Reddit reply</h2>
              {state !== 'loading' && (
                <button
                  type="button"
                  onClick={() => setState('idle')}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 rounded"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Product description input */}
              {(state === 'modal' || state === 'loading') && (
                <>
                  <div>
                    <label
                      htmlFor="product-desc"
                      className="block text-xs font-medium text-gray-700 mb-1.5"
                    >
                      Describe your product in 1–2 sentences
                    </label>
                    <textarea
                      id="product-desc"
                      rows={3}
                      value={productDesc}
                      onChange={e => setProductDesc(e.target.value)}
                      disabled={state === 'loading'}
                      placeholder="e.g. Acme is an async standup tool that helps remote teams stay aligned without meetings."
                      className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400 disabled:opacity-50"
                    />
                    {error && (
                      <p className="mt-1.5 text-xs text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={generate}
                    disabled={state === 'loading' || !productDesc.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
                  >
                    {state === 'loading' ? (
                      <>
                        <SpinnerIcon />
                        Generating…
                      </>
                    ) : (
                      'Generate draft'
                    )}
                  </button>
                </>
              )}

              {/* Draft output */}
              {state === 'draft' && (
                <>
                  <div>
                    <label
                      htmlFor="reply-draft"
                      className="block text-xs font-medium text-gray-700 mb-1.5"
                    >
                      Your draft
                    </label>
                    <textarea
                      id="reply-draft"
                      ref={textareaRef}
                      rows={6}
                      readOnly
                      value={draft}
                      className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
                    >
                      {copied ? '✓ Copied' : 'Copy draft'}
                    </button>
                    <button
                      type="button"
                      onClick={copyAndOpen}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors min-h-[44px]"
                    >
                      Copy &amp; Open Reddit →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setState('modal')}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Generate again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
