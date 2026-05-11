import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-gray-100 text-gray-500',
}

const OPP_LABELS: Record<string, string> = {
  buying_intent: 'Buying Intent',
  alternative_seeking: 'Alt. Seeking',
  complaint: 'Complaint',
  recommendation_request: 'Rec. Request',
  research: 'Research',
}

export default async function CampaignsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const plan = ((session.user.plan as string | undefined) ?? 'FREE') as PlanKey
  const limit = PLAN_LIMITS[plan]?.campaigns ?? 1
  const limitDisplay = limit === Infinity ? '∞' : String(limit)

  const campaigns = await db.campaign.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      industry: true,
      status: true,
      _count: { select: { keywords: true, competitors: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayMatches =
    campaigns.length > 0
      ? await db.match.findMany({
          where: {
            keyword: { userId: session.user.id, campaignId: { not: null } },
            matchedAt: { gte: todayStart },
          },
          select: { keyword: { select: { campaignId: true } }, opportunityType: true },
        })
      : []

  const matchStats = new Map<string, { count: number; oppCounts: Record<string, number> }>()
  for (const m of todayMatches) {
    const cid = m.keyword.campaignId!
    if (!matchStats.has(cid)) matchStats.set(cid, { count: 0, oppCounts: {} })
    const s = matchStats.get(cid)!
    s.count++
    if (m.opportunityType) {
      s.oppCounts[m.opportunityType] = (s.oppCounts[m.opportunityType] ?? 0) + 1
    }
  }

  const atLimit = limit !== Infinity && campaigns.length >= limit

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {campaigns.length} / {limitDisplay} ({plan} plan)
          </p>
        </div>
        <Link
          href={atLimit ? '/pricing' : '/campaigns/new'}
          className={[
            'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
            atLimit
              ? 'bg-gray-100 text-gray-500 pointer-events-none'
              : 'bg-orange-500 hover:bg-orange-600 text-white',
          ].join(' ')}
        >
          + New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-3xl mb-3">🎯</p>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No campaigns yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Group your keywords by goal to track opportunities and competitors in one place.
          </p>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            Create your first campaign →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {campaigns.map(c => {
            const stats = matchStats.get(c.id)
            const topOpp = stats
              ? Object.entries(stats.oppCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
              : null
            return (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                      {c.name}
                    </h2>
                    {c.industry && (
                      <p className="text-xs text-gray-500 mt-0.5">{c.industry}</p>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_BADGE[c.status] ?? STATUS_BADGE.active
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                  <span>{c._count.keywords} keywords</span>
                  <span>{c._count.competitors} competitors</span>
                  {stats && stats.count > 0 && (
                    <span className="text-orange-600 font-medium">
                      {stats.count} match{stats.count !== 1 ? 'es' : ''} today
                    </span>
                  )}
                </div>
                {topOpp && (
                  <p className="mt-2 text-xs text-gray-400">
                    Top signal: {OPP_LABELS[topOpp] ?? topOpp}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {atLimit && (
        <p className="mt-5 text-sm text-center text-gray-400">
          You&apos;ve reached your plan limit.{' '}
          <Link href="/pricing" className="text-orange-600 hover:underline">
            Upgrade to add more →
          </Link>
        </p>
      )}
    </div>
  )
}
