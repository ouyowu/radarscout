import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
  display: 'swap',
})

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'RadarScout — Thailand Experience Planner',
    template: '%s',
  },
  description:
    'Plan Thailand experiences with guided discovery, trip-fit matching, and trusted booking partner handoff.',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'RadarScout — Thailand Experience Planner',
    description: 'Ask for Thailand experience ideas, compare trip-fit options, and continue with a trusted booking partner.',
    type: 'website',
    url: base,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout — Thailand Experience Planner',
    description: 'Plan Thailand experiences, compare trip-fit options, and continue with a booking partner.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="bg-rs-sand-50 font-rs-body text-rs-ink">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
