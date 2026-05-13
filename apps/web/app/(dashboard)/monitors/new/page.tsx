import Link from 'next/link'
import { createMonitor } from '../actions'

export default function NewMonitorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/monitors" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Monitors
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-semibold text-gray-900">New monitor</h1>
      </div>

      {searchParams.error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {searchParams.error}
        </p>
      )}

      <form action={createMonitor} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subreddit">
            Subreddit
          </label>
          <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400">
            <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r select-none">
              r/
            </span>
            <input
              id="subreddit"
              name="subreddit"
              type="text"
              required
              placeholder="ThailandTourism"
              className="flex-1 px-3 py-2 text-sm outline-none bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="keywords">
            Keywords
          </label>
          <p className="text-xs text-gray-400 mb-1.5">
            One per line — matched case-insensitively in post titles and body.
          </p>
          <textarea
            id="keywords"
            name="keywords"
            required
            rows={6}
            placeholder={'Bangkok nightlife tonight\nsolo traveler Bangkok tonight\nThailand nightlife scam'}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors font-medium"
          >
            Create monitor
          </button>
          <Link
            href="/monitors"
            className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 text-gray-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
