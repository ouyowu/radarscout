import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@reddit-monitor/db'
import { KeywordManager } from './KeywordManager'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const [keywords, campaigns] = await Promise.all([
    db.keyword.findMany({
      where: { userId: session.user.id },
      select: { id: true, text: true, enabled: true, dailyHits: true },
      orderBy: { createdAt: 'asc' },
    }),
    db.campaign.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        status: true,
        _count: { select: { keywords: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 3,
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Campaigns section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Your Campaigns</h2>
          <Link href="/campaigns" className="text-sm text-orange-600 hover:text-orange-700 transition-colors">
            View all →
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl px-6 py-8 text-center">
            <p className="text-sm text-gray-500 mb-3">
              Campaigns let you group keywords by goal and track opportunities together.
            </p>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              Create your first campaign →
            </Link>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-3">
            {campaigns.map(c => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-orange-300 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 truncate">
                  {c.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{c._count.keywords} keywords</p>
              </Link>
            ))}
            <Link
              href="/campaigns/new"
              className="bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center text-sm text-gray-400 hover:text-orange-600 hover:border-orange-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              + New campaign
            </Link>
          </div>
        )}
      </section>

      {/* Keywords section */}
      <section>
        <KeywordManager
          initialKeywords={keywords}
          plan={session.user.plan as 'FREE' | 'PRO' | 'TEAM'}
        />
      </section>
    </div>
  )
}
