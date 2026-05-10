import Link from 'next/link'
import { auth } from '@/lib/auth'
import { PricingCards } from './PricingCards'

export default async function PricingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-gray-900">LeadPulse</Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
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
          <p className="mt-3 text-base text-gray-500">
            Monitor Reddit for leads — upgrade when you need more.
          </p>
        </div>

        <PricingCards isLoggedIn={isLoggedIn} />
      </main>
    </div>
  )
}
