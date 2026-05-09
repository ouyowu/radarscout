import Link from 'next/link'
import { auth } from '@/lib/auth'
import { CheckoutButton } from './CheckoutButton'

const FEATURES = [
  { label: 'Keywords monitored', free: '3', pro: '30', team: '100' },
  { label: 'Reddit /r/all scanning', free: true, pro: true, team: true },
  { label: 'Email alerts', free: true, pro: true, team: true },
  { label: 'Batch digest emails', free: false, pro: true, team: true },
  { label: 'Match history', free: '7 days', pro: '90 days', team: 'Unlimited' },
  { label: 'Team members', free: '1', pro: '1', team: '10' },
  { label: 'Priority support', free: false, pro: false, team: true },
]

function Check() {
  return (
    <svg className="mx-auto h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function Dash() {
  return <span className="block text-center text-gray-300" aria-label="Not included">—</span>
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check />
  if (value === false) return <Dash />
  return <span className="block text-center text-sm text-gray-700">{value}</span>
}

export default async function PricingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-gray-900">Reddit Monitor</Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
                <Link href="/auth/register" className="text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, transparent pricing</h1>
          <p className="mt-3 text-base text-gray-500">Monitor Reddit for the keywords that matter to your business.</p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Free</p>
              <p className="text-4xl font-bold text-gray-900">$0</p>
              <p className="text-sm text-gray-400 mt-1">Forever free</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
              <li className="flex items-center gap-2"><Check /><span>3 keywords</span></li>
              <li className="flex items-center gap-2"><Check /><span>Reddit /r/all scanning</span></li>
              <li className="flex items-center gap-2"><Check /><span>Email alerts</span></li>
              <li className="flex items-center gap-2"><Check /><span>7-day match history</span></li>
            </ul>
            <Link
              href={isLoggedIn ? '/dashboard' : '/auth/register'}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isLoggedIn ? 'Go to dashboard' : 'Get started free'}
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-orange-400 rounded-2xl p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
            </div>
            <div className="mb-6">
              <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">Pro</p>
              <p className="text-4xl font-bold text-gray-900">$19</p>
              <p className="text-sm text-gray-400 mt-1">per month</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
              <li className="flex items-center gap-2"><Check /><span>30 keywords</span></li>
              <li className="flex items-center gap-2"><Check /><span>Reddit /r/all scanning</span></li>
              <li className="flex items-center gap-2"><Check /><span>Batch digest emails</span></li>
              <li className="flex items-center gap-2"><Check /><span>90-day match history</span></li>
            </ul>
            <CheckoutButton plan="PRO" label="Upgrade to Pro" isLoggedIn={isLoggedIn} />
          </div>

          {/* Team */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">Team</p>
              <p className="text-4xl font-bold text-gray-900">$49</p>
              <p className="text-sm text-gray-400 mt-1">per month</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
              <li className="flex items-center gap-2"><Check /><span>100 keywords</span></li>
              <li className="flex items-center gap-2"><Check /><span>Everything in Pro</span></li>
              <li className="flex items-center gap-2"><Check /><span>10 team members</span></li>
              <li className="flex items-center gap-2"><Check /><span>Unlimited history</span></li>
              <li className="flex items-center gap-2"><Check /><span>Priority support</span></li>
            </ul>
            <CheckoutButton plan="TEAM" label="Upgrade to Team" isLoggedIn={isLoggedIn} />
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Feature comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium text-gray-500 w-1/2">Feature</th>
                  <th className="px-4 py-3 font-medium text-gray-700 w-1/6">Free</th>
                  <th className="px-4 py-3 font-medium text-orange-600 w-1/6">Pro</th>
                  <th className="px-4 py-3 font-medium text-purple-600 w-1/6">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FEATURES.map(row => (
                  <tr key={row.label} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-700">{row.label}</td>
                    <td className="px-4 py-3"><Cell value={row.free} /></td>
                    <td className="px-4 py-3"><Cell value={row.pro} /></td>
                    <td className="px-4 py-3"><Cell value={row.team} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
