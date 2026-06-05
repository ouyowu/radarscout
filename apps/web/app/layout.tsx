import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'RadarScout — Real-Time Reddit Monitoring',
    template: '%s',
  },
  description:
    'Monitor Reddit for brand mentions, competitor complaints, product alternatives, and high-intent buyer conversations.',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'RadarScout — Real-Time Reddit Monitoring',
    description: 'Find Reddit leads, mentions, and competitor conversations before they go cold.',
    type: 'website',
    url: base,
    images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: 'RadarScout Reddit monitoring' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarScout — Real-Time Reddit Monitoring',
    description: 'Find Reddit leads, mentions, and competitor conversations before they go cold.',
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
