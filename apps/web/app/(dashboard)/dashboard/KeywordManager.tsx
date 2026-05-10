'use client'

import { useState } from 'react'
import { PLAN_LIMITS } from '@reddit-monitor/db'

type Plan = 'FREE' | 'STARTER' | 'PRO' | 'TEAM'
type Keyword = { id: string; text: string; enabled: boolean; dailyHits: number }

const PACKS = [
  {
    name: 'SaaS Founder',
    desc: 'Catch buyers comparing tools and venting about competitors',
    keywords: ['alternative to [competitor]', 'looking for [category] tool', 'recommend SaaS', 'frustrated with [tool]'],
  },
  {
    name: 'Marketing Agency',
    desc: 'Find businesses actively seeking agency services',
    keywords: ['looking for agency', 'recommend SEO', 'need marketing help'],
  },
  {
    name: 'B2B Sales',
    desc: 'Intercept companies in active vendor evaluation',
    keywords: ['vendor recommendation', 'software comparison', 'switching from'],
  },
]

function OnboardingModal({
  limit,
  onUsePack,
  onSkip,
  loading,
}: {
  limit: number
  onUsePack: (keywords: string[]) => void
  onSkip: () => void
  loading: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 id="onboarding-title" className="text-lg font-semibold text-gray-900">
            Start monitoring in one click
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pick a keyword pack for your use case. You can edit or add more anytime.
          </p>
        </div>

        <div className="p-6 grid gap-4 sm:grid-cols-3">
          {PACKS.map(pack => (
            <div
              key={pack.name}
              className="flex flex-col rounded-xl border border-gray-200 p-4"
            >
              <p className="font-semibold text-sm text-gray-900 mb-1">{pack.name}</p>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{pack.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pack.keywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-100"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => onUsePack(pack.keywords.slice(0, limit))}
                className="mt-auto w-full rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 transition-colors cursor-pointer"
              >
                {loading ? 'Adding…' : 'Use this pack →'}
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            I&apos;ll set up my own keywords
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const [showModal, setShowModal] = useState(initialKeywords.length === 0)
  const [packLoading, setPackLoading] = useState(false)

  const limit = PLAN_LIMITS[plan].keywords
  const atLimit = keywords.length >= limit

  async function handleUsePack(packKeywords: string[]) {
    setPackLoading(true)
    const slots = limit - keywords.length
    const toAdd = packKeywords.slice(0, slots > 0 ? slots : 0)
    const added: Keyword[] = []

    for (const text of toAdd) {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        const kw = await res.json()
        added.push({ ...kw, dailyHits: 0 })
      }
    }

    setKeywords(prev => [...prev, ...added])
    setPackLoading(false)
    setShowModal(false)
  }

  function fillKeyword(kw: string) {
    setInput(kw)
    document.getElementById('keyword-input')?.focus()
  }

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
      {showModal && (
        <OnboardingModal
          limit={limit}
          onUsePack={handleUsePack}
          onSkip={() => setShowModal(false)}
          loading={packLoading}
        />
      )}
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
          <h1 className="text-h3 font-semibold text-gray-900">Keywords</h1>
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

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          id="keyword-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={atLimit || loading}
          maxLength={100}
          placeholder={atLimit ? 'Upgrade to add more keywords' : 'e.g. alternative to baremetrics'}
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

      {/* Keyword inspiration panel */}
      <details className="group mb-6">
        <summary className="flex items-center gap-2 py-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors min-h-[44px]">
          <svg className="h-4 w-4 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Keyword ideas for your niche</span>
          <svg className="h-4 w-4 ml-auto text-gray-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="pt-3 pb-2 space-y-4">
          {[
            {
              category: 'SaaS Tools',
              keywords: ['alternative to', 'looking for tool', 'recommend software', 'too expensive'],
            },
            {
              category: 'Agencies',
              keywords: ['looking for agency', 'recommend SEO', 'need help with marketing', 'hiring'],
            },
            {
              category: 'B2B Sales',
              keywords: ['vendor recommendation', 'software comparison', 'switching from', 'frustrated with'],
            },
          ].map(({ category, keywords: ideas }) => (
            <div key={category}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {ideas.map(kw => (
                  <button
                    key={kw}
                    type="button"
                    disabled={atLimit}
                    onClick={() => fillKeyword(kw)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-orange-100"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1">Click any chip to fill the input above, then customize and add.</p>
        </div>
      </details>

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
