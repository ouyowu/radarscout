'use client';

import Link from 'next/link';
import { Radar, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Smart Home', href: '/smart-home' },
    { label: 'Health Tech', href: '/health-tech' },
    { label: 'Wearables', href: '/wearables' },
    { label: 'Reviews', href: '/reviews' },
  ],
  content: [
    { label: 'Buying Guides', href: '/buying-guides' },
    { label: 'Comparisons', href: '/comparisons' },
    { label: 'Product Database', href: '/products' },
    { label: 'Latest News', href: '/guides' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/about/contact' },
    { label: 'Affiliate Disclosure', href: '/about/affiliate-disclosure' },
    { label: 'Privacy Policy', href: '/about/privacy-policy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Radar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Radar<span className="text-cyan-400">Scout</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Your radar for smart home, wearables, and health tech.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hello@radarscout.io"
                className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Content
            </h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 RadarScout. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Built with intelligence, not hype
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
