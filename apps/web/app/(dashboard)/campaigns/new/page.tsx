'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      industry:
        (form.elements.namedItem('industry') as HTMLInputElement).value.trim() || undefined,
      targetCustomer:
        (form.elements.namedItem('targetCustomer') as HTMLInputElement).value.trim() || undefined,
      description:
        (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim() || undefined,
    }
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          res.status === 429
            ? "You've reached your plan's campaign limit. Upgrade to add more."
            : (body.error ?? `Something went wrong (${res.status})`),
        )
        return
      }
      const campaign = await res.json()
      router.push(`/campaigns/${campaign.id}`)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link
          href="/campaigns"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to campaigns
        </Link>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New Campaign</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Campaign name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Q3 CRM Leads"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px] bg-white"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1.5">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            maxLength={100}
            placeholder="e.g. SaaS, B2B, E-commerce"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px] bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="targetCustomer"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Target customer
          </label>
          <input
            id="targetCustomer"
            name="targetCustomer"
            type="text"
            maxLength={200}
            placeholder="e.g. Founders switching from HubSpot"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent min-h-[44px] bg-white"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={500}
            placeholder="Optional context about this campaign's goal"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none bg-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Link
            href="/campaigns"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center min-h-[44px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] cursor-pointer"
          >
            {loading ? 'Creating…' : 'Create campaign →'}
          </button>
        </div>
      </form>
    </div>
  )
}
