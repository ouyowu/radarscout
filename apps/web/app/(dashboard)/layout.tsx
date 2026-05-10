import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { handleSignOut } from './actions'
import { ManageSubButton } from './ManageSubButton'

const PLAN_BADGE: Record<string, string> = {
  FREE:    'bg-gray-100 text-gray-600',
  STARTER: 'bg-blue-100 text-blue-700',
  PRO:     'bg-orange-100 text-orange-700',
  TEAM:    'bg-purple-100 text-purple-700',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const plan = (session.user.plan as string | undefined) ?? 'FREE'
  const isPaid = plan !== 'FREE'
  const badgeCls = PLAN_BADGE[plan] ?? PLAN_BADGE.FREE

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-[0.9375rem] text-gray-900">RadarScout</span>
          <a href="/monitors" className="text-[0.9375rem] font-medium text-gray-600 hover:text-gray-900">
            Monitors
          </a>
          <a href="/billing" className="text-[0.9375rem] font-medium text-gray-600 hover:text-gray-900">
            Billing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeCls}`}>
            {plan}
          </span>
          {isPaid ? (
            <ManageSubButton className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-60 cursor-pointer" />
          ) : (
            <Link href="/pricing" className="text-[0.9375rem] font-medium text-orange-600 hover:text-orange-700">
              Upgrade to Pro →
            </Link>
          )}
          <span className="text-[0.9375rem] text-gray-500">{session.user.email}</span>
          <form action={handleSignOut}>
            <button type="submit" className="text-[0.9375rem] text-gray-500 hover:text-gray-900">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
