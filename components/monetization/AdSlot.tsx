'use client';

import { useEffect } from 'react';
import { monetizationConfig } from '@/lib/monetization';
import type { AdPlacement } from '@/types';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const config = monetizationConfig.adSlots[placement];

  useEffect(() => {
    if (
      monetizationConfig.enableAds &&
      monetizationConfig.adsensePublisherId &&
      config?.enabled &&
      config.adUnitId
    ) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // Ignore duplicate ad push issues on hydration.
      }
    }
  }, [config?.adUnitId, config?.enabled]);

  if (
    !monetizationConfig.enableAds ||
    !config?.enabled ||
    !monetizationConfig.adsensePublisherId ||
    !config.adUnitId
  ) {
    return null;
  }

  return (
    <div className={`ad-slot overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40 ${className}`}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={monetizationConfig.adsensePublisherId}
        data-ad-slot={config.adUnitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
