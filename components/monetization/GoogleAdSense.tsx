'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasCookieConsent } from '@/components/shared/CookieConsent';

interface GoogleAdSenseProps {
  publisherId: string;
}

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!publisherId) return;

    if (hasCookieConsent()) {
      setShouldLoad(true);
      return;
    }

    function handleConsent() {
      setShouldLoad(true);
    }

    window.addEventListener('cookie-consent-accepted', handleConsent);
    return () => {
      window.removeEventListener('cookie-consent-accepted', handleConsent);
    };
  }, [publisherId]);

  if (!publisherId || !shouldLoad) return null;

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
