'use client';

import { useEffect, useState } from 'react';
import { monetizationConfig } from '@/lib/monetization';
import type { AdPlacement } from '@/types';
import { hasCookieConsent } from '@/components/shared/CookieConsent';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

function pushAd() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
    // Script may not have loaded yet — ignore
  }
}

export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const config = monetizationConfig.adSlots[placement];
  const publisherId = monetizationConfig.adsensePublisherId;
  const [consentReady, setConsentReady] = useState(false);

  useEffect(() => {
    if (hasCookieConsent()) {
      setConsentReady(true);
      return;
    }

    function handleConsent() {
      setConsentReady(true);
    }

    window.addEventListener('cookie-consent-accepted', handleConsent);
    return () => {
      window.removeEventListener('cookie-consent-accepted', handleConsent);
    };
  }, []);

  useEffect(() => {
    if (consentReady) {
      pushAd();
    }
  }, [consentReady]);

  if (!monetizationConfig.enableAds || !config?.enabled) {
    return null;
  }

  if (!publisherId || !config.adUnitId) {
    return null;
  }

  return (
    <div className={`ad-slot not-prose overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40 ${className}`}>
      <p className="text-[10px] text-slate-500 text-right mb-1 uppercase tracking-wider px-2 pt-1">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={config.adUnitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
