import Link from 'next/link';
import { Menu, Radar, Search } from 'lucide-react';

const navigation = [
  { label: 'Buying Guides', href: '/buying-guides' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Comparisons', href: '/comparisons' },
  { label: 'Guides', href: '/guides' },
  { label: 'Products', href: '/products' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 supports-[backdrop-filter]:bg-slate-950/80 supports-[backdrop-filter]:backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Radar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Radar<span className="text-cyan-400">Scout</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>

          <details className="group md:hidden">
            <summary className="list-none rounded-lg p-2 text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white [&::-webkit-details-marker]:hidden">
              <Menu className="h-6 w-6" />
            </summary>
            <div className="absolute inset-x-0 top-16 border-b border-slate-800 bg-slate-950 px-4 py-4 shadow-2xl">
              <div className="mx-auto max-w-7xl space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/search"
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white"
                >
                  <Search className="h-5 w-5" />
                  Search
                </Link>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
