import { createClient } from '@/lib/supabase/server'
import { db, PLAN_LIMITS, type PlanKey } from '@reddit-monitor/db'
import { createCheckoutSession, openCustomerPortal } from './actions'

const PLAN_LABEL: Record<string, string> = {
  FREE:    'Free',
  STARTER: 'Starter',
  PRO:     'Pro',
  TEAM:    'Team',
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const dbUser = user?.email
    ? await db.user.findUnique({ where: { email: user.email } })
    : null

  const plan = dbUser?.plan ?? 'FREE'
  const keywordCount = dbUser
    ? await db.keyword.count({ where: { userId: dbUser.id, enabled: true } })
    : 0

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold mb-6">Billing</h1>

      {searchParams.success && (
        <div className="mb-6 text-sm bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          You&apos;re now on Pro — thank you!
        </div>
      )}

      {/* Current plan card */}
      <div className="bg-white border rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current plan</p>
            <p className="text-2xl font-semibold text-gray-900">{PLAN_LABEL[plan]}</p>
          </div>
          <span
            className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              plan === 'FREE'    ? 'bg-gray-100 text-gray-600'   :
              plan === 'STARTER' ? 'bg-blue-100 text-blue-700'   :
              plan === 'TEAM'    ? 'bg-purple-100 text-purple-700' :
                                   'bg-orange-100 text-orange-700'
            }`}
          >
            {plan}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-5">
          <span className="font-medium text-gray-900">{keywordCount}</span> keyword
          {keywordCount !== 1 ? 's' : ''} active
          {(plan === 'FREE' || plan === 'STARTER') && (
            <span className="text-gray-400">
              {' '}/ {PLAN_LIMITS[plan as PlanKey]?.keywords ?? 3} limit
            </span>
          )}
        </div>

        {plan === 'FREE' ? (
          <form action={createCheckoutSession}>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors font-medium"
            >
              Upgrade to Pro →
            </button>
          </form>
        ) : (
          <form action={openCustomerPortal}>
            <button
              type="submit"
              className="border text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              Manage subscription
            </button>
          </form>
        )}
      </div>

      {/* Pro upsell */}
      {(plan === 'FREE' || plan === 'STARTER') && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Pro</h3>
            <span className="text-lg font-bold text-gray-900">
              $29<span className="text-sm font-normal text-gray-500">/mo</span>
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>✓ 10 keywords</li>
            <li>✓ Unlimited hits per day</li>
            <li>✓ AI intent scoring</li>
            <li>✓ AI reply drafts</li>
          </ul>
        </div>
      )}
    </div>
  )
}
