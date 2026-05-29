'use client';

import { useEffect, useState } from 'react';
import { CookieConsent } from '@/components/shared/CookieConsent';

export function DeferredClientFeatures() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CookieConsent />
    </>
  );
}
