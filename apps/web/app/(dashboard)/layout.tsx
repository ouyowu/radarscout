import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@reddit-monitor/db'
import { signOut } from './actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) redirect('/login')

  // Lazy-create DB user on first dashboard visit
  await db.user.upsert({
    where: { email: user.email },
    update: {},
    create: { email: user.email, passwordHash: 'supabase' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-gray-900">Reddit Monitor</span>
          <a href="/monitors" className="text-sm text-gray-600 hover:text-gray-900">
            Monitors
          </a>
          <a href="/billing" className="text-sm text-gray-600 hover:text-gray-900">
            Billing
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <form action={signOut}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-900">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
