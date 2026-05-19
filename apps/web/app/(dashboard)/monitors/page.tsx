import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'

type MonitorKeyword = {
  id: string
  text: string
  flags: unknown
}

export default async function MonitorsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const keywords: MonitorKeyword[] = await db.keyword.findMany({
    where: { userId: session.user.id, enabled: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group keywords by subreddit (stored in flags.subreddit)
  const bySubreddit = new Map<string, MonitorKeyword[]>()
  for (const kw of keywords) {
    const subreddit = (kw.flags as { subreddit?: string }).subreddit ?? '(unknown)'
    const group = bySubreddit.get(subreddit) ?? []
    group.push(kw)
    bySubreddit.set(subreddit, group)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Monitors</h1>
        <Link
          href="/monitors/new"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + New monitor
        </Link>
      </div>

      {bySubreddit.size === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-base">No monitors yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6">
            Add a Thailand travel subreddit and 1-3 nightlife keywords to start feeding ThaiNight.
          </p>
          <Link
            href="/monitors/new"
            className="mt-2 inline-block text-sm text-orange-600 hover:underline"
          >
            Create your first monitor →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...bySubreddit.entries()].map(([subreddit, kws]) => (
            <div key={subreddit} className="bg-white border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-gray-900">r/{subreddit}</h2>
                <span className="text-xs text-gray-400">
                  {kws.length} keyword{kws.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {kws.map((kw: MonitorKeyword) => (
                  <span
                    key={kw.id}
                    className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                  >
                    {kw.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
