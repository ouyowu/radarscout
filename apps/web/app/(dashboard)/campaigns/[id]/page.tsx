import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'
import { KeywordsPanel } from './KeywordsPanel'
import { CompetitorsPanel } from './CompetitorsPanel'
import { ReplyButton } from '../../dashboard/matches/ReplyButton'

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const OPP_COLORS: Record<string, string> = {
  buying_intent: 'bg-green-100 text-green-700',
  alternative_seeking: 'bg-blue-100 text-blue-700',
  complaint: 'bg-red-100 text-red-700',
  recommendation_request: 'bg-purple-100 text-purple-700',
  research: 'bg-gray-100 text-gray-600',
}

const OPP_LABELS: Record<string, string> = {
  buying_intent: 'Buying Intent',
  alternative_seeking: 'Alt. Seeking',
  complaint: 'Complaint',
  recommendation_request: 'Rec. Request',
  research: 'Research',
}

const PLATFORM_BADGE: Record<string, string> = {
  REDDIT: 'bg-orange-100 text-orange-700',
  HN: 'bg-amber-100 text-amber-700',
}

const OPP_FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Buying Intent', value: 'buying_intent' },
  { label: 'Alt. Seeking', value: 'alternative_seeking' },
  { label: 'Complaint', value: 'complaint' },
  { label: 'Rec. Request', value: 'recommendation_request' },
]

const MAIN_TABS = [
  { label: 'Opportunities', value: 'opportunities' },
  { label: 'Keywords', value: 'keywords' },
  { label: 'Competitors', value: 'competitors' },
]

type Tab = 'opportunities' | 'keywords' | 'competitors'

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

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string; oppType?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      industry: true,
      targetCustomer: true,
      description: true,
      status: true,
      userId: true,
      keywords: {
        select: { id: true, text: true, enabled: true, dailyHits: true, campaignId: true },
        orderBy: { createdAt: 'asc' },
      },
      competitors: {
        select: { id: true, name: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!campaign || campaign.userId !== session.user.id) {
    notFound()
  }

  const plan = ((session.user.plan as string | undefined) ?? 'FREE') as PlanKey
  const isPro = PLAN_LIMITS[plan]?.aiScoring ?? false

  const rawTab = searchParams.tab
  const activeTab: Tab =
    rawTab === 'keywords' || rawTab === 'competitors' ? rawTab : 'opportunities'

  const rawOppType = searchParams.oppType
  const validOppTypes = ['buying_intent', 'alternative_seeking', 'complaint', 'recommendation_request', 'research']
  const oppType = rawOppType && validOppTypes.includes(rawOppType) ? rawOppType : 'all'

  const matches =
    activeTab === 'opportunities'
      ? await db.match.findMany({
          where: {
            keyword: { campaignId: params.id },
            ...(oppType !== 'all' ? { opportunityType: oppType } : {}),
          },
          take: 50,
          orderBy: { matchedAt: 'desc' },
          select: {
            id: true,
            url: true,
            title: true,
            snippet: true,
            platform: true,
            matchedAt: true,
            intentScore: true,
            aiSummary: true,
            aiReplyDraft: true,
            painPoints: true,
            opportunityType: true,
            competitors: true,
            keyword: { select: { text: true } },
          },
        })
      : []

  const productDesc =
    activeTab === 'opportunities'
      ? (
          await db.user.findUnique({
            where: { id: session.user.id },
            select: { productDescription: true },
          })
        )?.productDescription ?? null
      : null

  const { keywords, competitors } = campaign

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2">
          <Link href="/campaigns" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Campaigns
          </Link>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{campaign.name}</h1>
            {campaign.industry && (
              <p className="text-sm text-gray-500 mt-0.5">{campaign.industry}</p>
            )}
          </div>
          <span
            className={[
              'flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium mt-0.5',
              campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
            ].join(' ')}
          >
            {campaign.status}
          </span>
        </div>
        {campaign.description && (
          <p className="mt-1 text-sm text-gray-500 max-w-xl">{campaign.description}</p>
        )}
      </div>

      {/* Tab nav */}
      <div className="-mx-6 px-6 border-b border-gray-200 overflow-x-auto mb-6">
        <nav className="flex min-w-max" aria-label="Campaign sections">
          {MAIN_TABS.map(tab => {
            const isActive = tab.value === activeTab
            return (
              <Link
                key={tab.value}
                href={`?tab=${tab.value}`}
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
                {tab.value === 'keywords' && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                    {keywords.length}
                  </span>
                )}
                {tab.value === 'competitors' && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                    {competitors.length}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Opportunities tab */}
      {activeTab === 'opportunities' && (
        <div>
          {/* Opp type filter pills */}
          <div className="mb-4 -mx-6 px-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {OPP_FILTER_TABS.map(f => {
                const isActive = f.value === oppType
                return (
                  <Link
                    key={f.value}
                    href={`?tab=opportunities&oppType=${f.value}`}
                    className={[
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    ].join(' ')}
                  >
                    {f.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">
                {oppType !== 'all'
                  ? `No ${OPP_LABELS[oppType] ?? oppType} matches yet.`
                  : 'No matches yet for this campaign.'}
              </p>
              {keywords.length === 0 && (
                <Link
                  href="?tab=keywords"
                  className="mt-2 inline-block text-sm text-orange-600 hover:underline"
                >
                  Add keywords to start monitoring →
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-400">
                {matches.length} result{matches.length !== 1 ? 's' : ''}
              </p>
              <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {matches.map(match => (
                  <div key={match.id} className="px-4 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Meta row */}
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
                          {match.opportunityType && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                OPP_COLORS[match.opportunityType] ?? 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {OPP_LABELS[match.opportunityType] ?? match.opportunityType}
                            </span>
                          )}
                          <time
                            dateTime={match.matchedAt.toISOString()}
                            className="sm:hidden ml-auto text-xs text-gray-400 whitespace-nowrap"
                          >
                            {timeAgo(new Date(match.matchedAt))}
                          </time>
                        </div>

                        {/* Title */}
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

                        {/* AI summary / pain points */}
                        {isPro && match.painPoints && (
                          <p className="mt-1 text-xs text-gray-400 italic">{match.painPoints}</p>
                        )}
                        {isPro && match.aiSummary && !match.painPoints && (
                          <p className="mt-1 text-xs text-gray-400 italic">{match.aiSummary}</p>
                        )}

                        {/* Competitors mentioned */}
                        {match.competitors.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {match.competitors.map(c => (
                              <span
                                key={c}
                                className="px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-500 border border-gray-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Reply button */}
                        <div className="mt-3">
                          <ReplyButton
                            matchId={match.id}
                            postUrl={match.url}
                            existingDraft={match.aiReplyDraft}
                            existingProductDesc={productDesc}
                            isPro={isPro}
                          />
                        </div>
                      </div>

                      {/* Right col: time + badge (sm+) */}
                      <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                        <time
                          dateTime={match.matchedAt.toISOString()}
                          className="text-xs text-gray-400 whitespace-nowrap mt-0.5"
                        >
                          {timeAgo(new Date(match.matchedAt))}
                        </time>
                        {isPro && <IntentBadge score={match.intentScore} />}
                      </div>

                      {isPro && match.intentScore !== null && (
                        <div className="sm:hidden flex-shrink-0 mt-0.5">
                          <IntentBadge score={match.intentScore} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Keywords tab */}
      {activeTab === 'keywords' && (
        <KeywordsPanel campaignId={params.id} initialKeywords={keywords} />
      )}

      {/* Competitors tab */}
      {activeTab === 'competitors' && (
        <CompetitorsPanel campaignId={params.id} initialCompetitors={competitors} />
      )}
    </div>
  )
}
