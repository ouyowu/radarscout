import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[0.9375rem] font-semibold text-gray-900">RadarScout</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
          <Link href="/pricing" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/f5bot-alternative" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">F5Bot alternative</Link>
          <Link href="/reddit-competitor-monitoring" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">Competitor monitoring</Link>
          <Link href="/reddit-customer-discovery" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">Customer discovery</Link>
          <Link href="/auth/login" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
          <Link href="/auth/register" className="text-[0.9375rem] text-gray-500 hover:text-gray-900 transition-colors">Register</Link>
        </nav>
        <p className="text-label text-gray-400">© {new Date().getFullYear()} RadarScout</p>
      </div>
    </footer>
  )
}
