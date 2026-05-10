import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadPulse — Reddit Lead Finder for Indie Hackers & Agencies',
  description: 'Monitor Reddit for buying signals. AI scores every mention for purchase intent. Find customers before your competitors. Free to start.',
  openGraph: {
    title: 'Find customers on Reddit before your competitors do',
    description: 'Monitor Reddit for buying signals. AI scores every mention for purchase intent. Find customers before your competitors. Free to start.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
