'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'radarscout-cookie-consent';
type ConsentValue = 'accepted' | 'rejected';

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === null) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — do nothing
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted' satisfies ConsentValue);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('cookie-consent-accepted'));
    setVisible(false);
  }

  function handleReject() {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected' satisfies ConsentValue);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm text-slate-300 leading-relaxed">
          We use cookies to improve your experience and serve relevant ads. See our{' '}
          <Link
            href="/about/privacy-policy"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white transition-colors"
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
