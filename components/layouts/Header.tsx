'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Radar, Search } from 'lucide-react';

const navigation = [
  { label: 'Buying Guides', href: '/buying-guides' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Comparisons', href: '/comparisons' },
  { label: 'Guides', href: '/guides' },
  { label: 'Products', href: '/products' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-slate-950/95 border-b border-slate-800 transition-shadow duration-200 ${
        scrolled ? 'backdrop-blur-sm shadow-lg shadow-slate-950/50' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Radar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Radar<span className="text-cyan-400">Scout</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
