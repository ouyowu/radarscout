import type { Metadata } from 'next'
import Link from 'next/link'
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
      <body className="font-sans" style={{ background: 'white', color: '#111', overscrollBehavior: 'none' }}>
        {/* Header */}
        <header className="border-b border-black/10 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-sm">🌙</div>
              <span className="font-black text-sm">THAI<span className="text-amber-400">NIGHT</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-black/60 transition-colors">
                Home
              </Link>
              <Link href="/about-us" className="hover:text-black/60 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-black/60 transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="hover:text-black/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-black/60 transition-colors">
                Terms of Service
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Bangkok nightlife, rooftop bars, nightclubs, happy hour..."
                  className="w-64 rounded-md bg-black/5 border border-black/10 px-3 py-1.5 text-white placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-black/10 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row md:justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-bold text-black/60 mb-2">RadarScout</h3>
              <p className="text-black/50 text-sm">
                Thailand Nightlife Intelligence [Updated May 31, 2026]
              </p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-black/60 mb-2">Resources</h4>
              <nav className="space-y-0.5">
                <Link href="/about-us" className="text-black/50 hover:text-black transition-colors text-sm">
                  About Us
                </Link>
                <Link href="/contact" className="text-black/50 hover:text-black transition-colors text-sm">
                  Contact
                </Link>
                <Link href="/privacy-policy" className="text-black/50 hover:text-black transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-black/50 hover:text-black transition-colors text-sm">
                  Terms of Service
                </Link>
              </nav>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-black/60 mb-2">Core Cities</h4>
              <nav className="space-y-0.5">
                <Link href="/" className="text-black/50 hover:text-black transition-colors text-sm">
                  Home
                </Link>
                <Link href="/bangkok" className="text-black/50 hover:text-black transition-colors text-sm">
                  Bangkok
                </Link>
                <Link href="/pattaya" className="text-black/50 hover:text-black transition-colors text-sm">
                  Pattaya
                </Link>
                <Link href="/phuket" className="text-black/50 hover:text-black transition-colors text-sm">
                  Phuket
                </Link>
                <Link href="/chiang-mai" className="text-black/50 hover:text-black transition-colors text-sm">
                  Chiang Mai
                </Link>
              </nav>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-black/60 mb-2">Stay Updated</h4>
              <p className="text-black/50 text-sm">
                No spam. Built for travelers checking tonight before they leave.
              </p>
              <div className="flex gap-2 mt-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-md bg-black/5 border border-black/10 px-3 py-1.5 text-white placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-black/10 mt-8 pt-6 text-center text-black/50 text-xs">
            © {new Date().getFullYear()} RadarScout. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
