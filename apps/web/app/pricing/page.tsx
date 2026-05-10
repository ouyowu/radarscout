import Link from 'next/link'
import { auth } from '@/lib/auth'
import { PricingCards } from './PricingCards'

export default async function PricingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.87)' }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.82)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[0.9375rem] font-semibold text-white/90 hover:text-white transition-colors">
            RadarScout
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-[0.9375rem] font-medium text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[0.9375rem] font-medium text-white/55 hover:text-white/90 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-14">
          <h1 className="text-h2 sm:text-h1 font-bold text-white/95">Simple, transparent pricing</h1>
          <p className="mt-3 text-body-lg text-white/50">
            Monitor Reddit for leads — upgrade when you need more.
          </p>
        </div>

        <PricingCards isLoggedIn={isLoggedIn} />
      </main>

    </div>
  )
}
