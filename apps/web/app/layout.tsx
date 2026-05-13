import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  title: 'RadarScout — Thailand Nightlife Intelligence Feed',
  description: 'Monitor Reddit, X, Quora, RSS and travel communities for fresh Thailand nightlife tips, warnings, questions and hidden gems.',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'Thailand nightlife intelligence for travelers',
    description: 'Fresh nightlife tips, warnings, questions and hidden gems from public travel communities.',
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
