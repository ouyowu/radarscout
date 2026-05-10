'use client'

import { useState } from 'react'
import { PLAN_LIMITS } from '@reddit-monitor/db'

type Plan = 'FREE' | 'STARTER' | 'PRO' | 'TEAM'
type Keyword = { id: string; text: string; enabled: boolean; dailyHits: number }

const PLAN_BADGE: Record<Plan, string> = {
  FREE:    'bg-gray-100 text-gray-600',
  STARTER: 'bg-blue-100 text-blue-700',
  PRO:     'bg-orange-100 text-orange-700',
  TEAM:    'bg-purple-100 text-purple-700',
}

export function KeywordManager({
  initialKeywords,
  plan,
}: {
  initialKeywords: Keyword[]
  plan: Plan
}) {
  const [keywords, setKeywords] = useState(initialKeywords)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const limit = PLAN_LIMITS[plan].keywords
  const atLimit = keywords.length >= limit

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setError('')
    setLoading(true)

    const res = await fetch('/api/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.trim() }),
    })
    setLoading(false)

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Something went wrong.')
      return
    }
    const kw = await res.json()
    setKeywords(prev => [...prev, { ...kw, dailyHits: 0 }])
    setInput('')
  }

  async function handleToggle(id: string) {
    const res = await fetch(`/api/keywords/${id}`, { method: 'PATCH' })
    if (!res.ok) return
    const { enabled } = await res.json()
    setKeywords(prev => prev.map(k => (k.id === id ? { ...k, enabled } : k)))
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/keywords/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setKeywords(prev => prev.filter(k => k.id !== id))
  }

  return (
    <div>
      {(plan === 'FREE' || plan === 'STARTER') && keywords.length >= 2 && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
          <p className="text-sm text-orange-800">
            <span className="font-semibold">You&apos;re using {keywords.length} of {PLAN_LIMITS[plan].keywords} keywords.</span>{' '}
            Upgrade to Pro for 10 keywords, AI scoring, and reply drafts.
          </p>
          <a
            href="/pricing"
            className="flex-shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Upgrade to Pro
          </a>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">Keywords</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${PLAN_BADGE[plan]}`}>
            {plan}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          <span className={`font-medium ${atLimit ? 'text-red-500' : 'text-gray-900'}`}>
            {keywords.length}
          </span>{' '}
          / {limit === Infinity ? '∞' : limit} keywords
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={atLimit || loading}
          maxLength={100}
          placeholder={atLimit ? 'Upgrade to add more keywords' : 'e.g. rust programming'}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-3 sm:py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        />
        <button
          type="submit"
          disabled={atLimit || loading || !input.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer min-h-[44px]"
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {keywords.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No keywords yet. Add one above to start monitoring.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {keywords.map(kw => (
            <div key={kw.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggle(kw.id)}
                  aria-label={kw.enabled ? `Disable "${kw.text}"` : `Enable "${kw.text}"`}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 ${
                    kw.enabled ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block mt-0.5 h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      kw.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className={`text-sm truncate ${kw.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                  {kw.text}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                {kw.dailyHits > 0 && (
                  <span className="text-xs text-gray-400">{kw.dailyHits} today</span>
                )}
                <button
                  onClick={() => handleDelete(kw.id)}
                  aria-label={`Delete "${kw.text}"`}
                  className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer p-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
