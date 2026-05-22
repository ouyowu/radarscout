'use client';

import { useEffect, useState } from 'react';
import { CookieConsent } from '@/components/shared/CookieConsent';
import { GoogleAdSense } from '@/components/monetization/GoogleAdSense';

interface DeferredClientFeaturesProps {
  publisherId: string;
}

export function DeferredClientFeatures({ publisherId }: DeferredClientFeaturesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CookieConsent />
      <GoogleAdSense publisherId={publisherId} />
    </>
  );
}
