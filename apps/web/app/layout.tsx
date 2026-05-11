import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'RadarScout — Reddit Lead Finder for Indie Hackers & Agencies',
  description: 'Monitor Reddit for buying signals and pain points. AI intent scoring + campaign mode + reply drafts. Free plan available.',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'Find customers on Reddit before your competitors do',
    description: 'Monitor Reddit for buying signals. AI scores every mention for purchase intent. Find customers before your competitors. Free to start.',
    type: 'website',
    images: ['https://radarscout.io/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} style={{ colorScheme: 'light', background: 'white' }}>
      <body className="font-sans" style={{ background: 'white', color: '#111', overscrollBehavior: 'none' }}>{children}</body>
    </html>
  )
}
