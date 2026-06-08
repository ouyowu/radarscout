import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'RadarScout — Thailand Day Tour AI Concierge',
    template: '%s',
  },
  description:
    'Plan Thailand day tours with an AI concierge that matches local supplier products, compares direct-rate pricing, and simplifies booking.',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'RadarScout — Thailand Day Tour AI Concierge',
    description: 'Ask for Thailand day tours like a chat, compare direct-rate prices, and reserve with simple concierge support.',
    type: 'website',
    url: base,
    images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Thailand day tour AI concierge' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout — Thailand Day Tour AI Concierge',
    description: 'Plan Thailand day tours, compare direct-rate prices, and reserve faster.',
    images: [`${base}/og-image.png`],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white font-sans text-gray-900">{children}</body>
    </html>
  )
}
