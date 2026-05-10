import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function SiteNav() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6">
        <input type="checkbox" id="nav-open" className="peer sr-only" aria-label="Toggle navigation" />

        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 text-[0.9375rem] flex-shrink-0">
            LeadPulse
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/pricing" className="text-[0.9375rem] font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[0.9375rem] font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>

          <label
            htmlFor="nav-open"
            className="lg:hidden flex items-center justify-center h-11 w-11 -mr-2 cursor-pointer text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>

        <div className="hidden peer-checked:block lg:hidden border-t border-gray-100 pb-4">
          <div className="flex flex-col pt-3 gap-1">
            <Link href="/pricing" className="text-[0.9375rem] font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center">
              Pricing
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-[0.9375rem] font-semibold text-orange-600 px-3 py-2.5 rounded-lg hover:bg-orange-50 transition-colors min-h-[44px] flex items-center">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="mt-1 text-[0.9375rem] font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-center transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
