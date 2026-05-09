import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const PLATFORM_BADGE: Record<string, string> = {
  REDDIT: 'bg-orange-100 text-orange-700',
  HN: 'bg-amber-100 text-amber-700',
}

export default async function MatchesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const matches = await db.match.findMany({
    where: { keyword: { userId: session.user.id } },
    take: 50,
    orderBy: { matchedAt: 'desc' },
    include: { keyword: { select: { text: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Recent Matches</h1>
        {matches.length > 0 && (
          <span className="text-sm text-gray-400">
            {matches.length} result{matches.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No matches yet.</p>
          <a href="/dashboard" className="mt-2 inline-block text-sm text-orange-600 hover:underline">
            Manage keywords →
          </a>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {matches.map(match => (
            <div key={match.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        PLATFORM_BADGE[match.platform] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {match.platform}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded font-mono">
                      {match.keyword.text}
                    </span>
                  </div>
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                  >
                    {match.title}
                  </a>
                  {match.snippet && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{match.snippet}</p>
                  )}
                </div>
                <time
                  dateTime={match.matchedAt.toISOString()}
                  className="flex-shrink-0 text-xs text-gray-400 mt-0.5 whitespace-nowrap"
                >
                  {timeAgo(new Date(match.matchedAt))}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
