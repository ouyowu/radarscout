import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-gray-900">LeadPulse</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/f5bot-alternative" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">F5Bot Alternative</Link>
          <Link href="/reddit-keyword-monitor" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Keyword Monitor</Link>
          <Link href="/reddit-mention-alerts" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Mention Alerts</Link>
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
          <Link href="/auth/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Register</Link>
        </nav>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} LeadPulse</p>
      </div>
    </footer>
  )
}
