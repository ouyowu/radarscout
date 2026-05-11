'use client'

import { useState } from 'react'

type Competitor = { id: string; name: string }

export function CompetitorsPanel({
  campaignId,
  initialCompetitors,
}: {
  campaignId: string
  initialCompetitors: Competitor[]
}) {
  const [competitors, setCompetitors] = useState(initialCompetitors)
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setAddError(null)
    setAdding(true)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setAddError(body.error ?? `Error ${res.status}`)
        return
      }
      const comp = await res.json()
      setCompetitors(prev => [...prev, { id: comp.id, name: comp.name }])
      setName('')
    } catch {
      setAddError('Network error. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/competitors/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setCompetitors(prev => prev.filter(c => c.id !== id))
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
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={100}
            placeholder="Competitor name (e.g. HubSpot)"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px]"
          />
          <button
            type="submit"
            disabled={adding || !name.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] cursor-pointer whitespace-nowrap"
          >
            {adding ? 'Adding…' : 'Add competitor'}
          </button>
        </form>
        {addError && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {addError}
          </p>
        )}
      </div>

      {competitors.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">No competitors tracked yet.</p>
          <p className="text-xs mt-1">
            Add competitors to see when they&apos;re mentioned in matches.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {competitors.map(comp => (
            <div key={comp.id} className="flex items-center gap-3 px-4 py-3 min-h-[52px]">
              <span className="flex-1 text-sm font-medium text-gray-900">{comp.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(comp.id)}
                disabled={deletingId === comp.id}
                aria-label={`Delete ${comp.name}`}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
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
