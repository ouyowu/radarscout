'use client'

import { useState } from 'react'

type Keyword = {
  id: string
  text: string
  enabled: boolean
  dailyHits: number
  campaignId: string | null
}

export function KeywordsPanel({
  campaignId,
  initialKeywords,
}: {
  campaignId: string
  initialKeywords: Keyword[]
}) {
  const [keywords, setKeywords] = useState(initialKeywords)
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setAddError(null)
    setAdding(true)
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), campaignId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setAddError(body.error ?? `Error ${res.status}`)
        return
      }
      const kw = await res.json()
      setKeywords(prev => [...prev, { ...kw, dailyHits: 0 }])
      setText('')
    } catch {
      setAddError('Network error. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(id: string) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/keywords/${id}`, { method: 'PATCH' })
      if (res.ok) {
        const updated = await res.json()
        setKeywords(prev =>
          prev.map(k => (k.id === id ? { ...k, enabled: updated.enabled } : k)),
        )
      }
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/keywords/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setKeywords(prev => prev.filter(k => k.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={100}
            placeholder="Add a keyword…"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          />
          <button
            type="submit"
            disabled={adding || !text.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] cursor-pointer whitespace-nowrap"
          >
            {adding ? 'Adding…' : 'Add keyword'}
          </button>
        </form>
        {addError && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {addError}
          </p>
        )}
      </div>

      {keywords.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">No keywords in this campaign yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {keywords.map(kw => (
            <div key={kw.id} className="flex items-center gap-3 px-4 py-3 min-h-[52px]">
              <button
                type="button"
                onClick={() => handleToggle(kw.id)}
                disabled={togglingId === kw.id}
                aria-label={kw.enabled ? 'Disable keyword' : 'Enable keyword'}
                className={[
                  'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer disabled:opacity-50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                  kw.enabled ? 'bg-orange-500' : 'bg-gray-200',
                ].join(' ')}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    kw.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`flex-1 text-sm ${kw.enabled ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {kw.text}
              </span>

              {kw.dailyHits > 0 && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {kw.dailyHits}/day
                </span>
              )}

              <button
                type="button"
                onClick={() => handleDelete(kw.id)}
                disabled={deletingId === kw.id}
                aria-label="Delete keyword"
                className="ml-1 p-1 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
