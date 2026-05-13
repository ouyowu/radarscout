import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { PricingCards } from './PricingCards'

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  return {
    title: 'Pricing — RadarScout Reddit Monitoring Plans',
    description:
      'Free forever plan with 3 keywords. Pro at $29/month for AI intent scoring and reply drafts. No credit card required to start.',
    alternates: { canonical: `${base}/pricing` },
    openGraph: {
      title: 'RadarScout Pricing — Free Reddit Monitoring to Start',
      description:
        'Free plan with 3 keywords forever. Upgrade to Pro for AI intent scoring, reply drafts, and unlimited alerts.',
      type: 'website',
      url: `${base}/pricing`,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Pricing' }],
    },
  }
}

export default async function PricingPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  return (
    <div className="min-h-screen" style={{ background: 'white', color: '#111827' }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #e5e7eb' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="RadarScout home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="RadarScout" height={36} style={{ width: 'auto' }} />
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-[0.9375rem] font-medium text-[#FF4500] hover:text-[#ff6b35] transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[0.9375rem] font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[0.9375rem] font-semibold bg-[#FF4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-xl transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2 focus:ring-offset-white"
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
          <h1 className="text-h2 sm:text-h1 font-bold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-3 text-body-lg text-gray-500">
            Monitor Reddit for leads — upgrade when you need more.
          </p>
        </div>

        <PricingCards isLoggedIn={isLoggedIn} />
      </main>

    </div>
  )
}
