import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'
import { ReplyButton } from './ReplyButton'

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
  X: 'bg-gray-900 text-white',
  QUORA: 'bg-red-100 text-red-700',
  RSS: 'bg-blue-100 text-blue-700',
  FORUM: 'bg-emerald-100 text-emerald-700',
}

type Intent = 'all' | 'high' | 'medium' | 'low'

const TABS: { label: string; value: Intent }[] = [
  { label: 'All', value: 'all' },
  { label: 'High Travel Value (7+)', value: 'high' },
  { label: 'Medium (4-6)', value: 'medium' },
  { label: 'Low (1–3)', value: 'low' },
]

function buildIntentWhere(intent: Intent) {
  if (intent === 'high') return { travelIntentScore: { gte: 7 } }
  if (intent === 'medium') return { travelIntentScore: { gte: 4, lt: 7 } }
  if (intent === 'low') return { travelIntentScore: { lt: 4 } }
  return {}
}

function IntentBadge({ score }: { score: number | null }) {
  if (score === null) return null
  if (score >= 7) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">
        🔥 {score}
      </span>
    )
  }
  if (score >= 4) {
    return (
      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
        ⚡ {score}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200 whitespace-nowrap">
      {score}
    </span>
  )
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { intent?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const plan = ((session.user.plan as string | undefined) ?? 'FREE') as PlanKey
  const isPro = PLAN_LIMITS[plan]?.aiScoring ?? false

  // FREE users always see all; PRO/TEAM default to 'high' when no param is set
  const raw = searchParams.intent
  const effectiveIntent: Intent =
    !isPro
      ? 'all'
      : raw === 'all' || raw === 'high' || raw === 'medium' || raw === 'low'
      ? raw
      : 'high'

  const currentUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { productDescription: true },
  })

  const matches = await db.match.findMany({
    where: { keyword: { userId: session.user.id }, ...buildIntentWhere(effectiveIntent) },
    take: 50,
    orderBy: { matchedAt: 'desc' },
    include: { keyword: { select: { text: true } } },
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Nightlife Intelligence Feed</h1>
        {matches.length > 0 && (
          <span className="text-sm text-gray-400">
            {matches.length} result{matches.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filter tabs — PRO/TEAM only */}
      {isPro && (
        <div className="mb-4 -mx-6 px-6 border-b border-gray-200 overflow-x-auto">
          <nav className="flex min-w-max" aria-label="Intent filter">
            {TABS.map(tab => {
              const isActive = tab.value === effectiveIntent
              return (
                <Link
                  key={tab.value}
                  href={`?intent=${tab.value}`}
                  className={[
                    'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset',
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Upgrade banner — FREE users only */}
      {!isPro && (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="flex-1 text-sm text-amber-800 leading-snug">
            🔒{' '}
            <span className="font-semibold">AI travel intelligence scoring is a Pro feature.</span>{' '}
            Upgrade to see which nightlife tips, warnings, and traveler questions matter most.
          </p>
          <Link
            href="/pricing"
            className="flex-shrink-0 inline-flex items-center justify-center text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-lg min-h-[44px] sm:min-h-0"
          >
            Upgrade to Pro →
          </Link>
        </div>
      )}

      {/* Match list */}
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
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Meta row: platform pill, keyword chip, timestamp (mobile) */}
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
                    {match.location && (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {match.location}
                      </span>
                    )}
                    {match.contentCategory && (
                      <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {match.contentCategory}
                      </span>
                    )}
                    <time
                      dateTime={match.matchedAt.toISOString()}
                      className="sm:hidden ml-auto text-xs text-gray-400 whitespace-nowrap"
                    >
                      {timeAgo(new Date(match.matchedAt))}
                    </time>
                  </div>

                  {/* Post title */}
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                  >
                    {match.title}
                  </a>

                  {/* Snippet */}
                  {match.snippet && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{match.snippet}</p>
                  )}

                  {/* AI summary — PRO/TEAM only */}
                  {isPro && match.aiSummary && (
                    <p className="mt-1.5 text-xs text-gray-400 italic">{match.aiSummary}</p>
                  )}

                  {isPro && (match.credibilityScore !== null || match.commercialScore !== null) && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Credibility {match.credibilityScore ?? 'n/a'}/10 · thainight value {match.commercialScore ?? 'n/a'}/10
                    </p>
                  )}

                  {/* Reply button */}
                  <div className="mt-3">
                    <ReplyButton
                      matchId={match.id}
                      postUrl={match.url}
                      existingDraft={match.aiReplyDraft}
                      existingProductDesc={currentUser?.productDescription ?? null}
                      isPro={isPro}
                    />
                  </div>
                </div>

                {/* Right column: timestamp + badge (sm+) */}
                <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                  <time
                    dateTime={match.matchedAt.toISOString()}
                    className="text-xs text-gray-400 whitespace-nowrap mt-0.5"
                  >
                    {timeAgo(new Date(match.matchedAt))}
                  </time>
                  {isPro && <IntentBadge score={match.travelIntentScore ?? match.intentScore} />}
                </div>

                {/* Badge only on mobile (timestamp is already in the flex-wrap row) */}
                {isPro && (match.travelIntentScore !== null || match.intentScore !== null) && (
                  <div className="sm:hidden flex-shrink-0 mt-0.5">
                    <IntentBadge score={match.travelIntentScore ?? match.intentScore} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
