'use client';

import { monetizationConfig } from '@/lib/monetization';
import type { AdPlacement } from '@/types';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export function AdSlot({ placement, className = '' }: AdSlotProps) {
  const config = monetizationConfig.adSlots[placement];
  
  if (!monetizationConfig.enableAds || !config?.enabled) {
    return null;
  }

  // Placeholder for development - replace with real AdSense code
  return (
    <div className={`ad-slot ${className}`}>
      <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))] opacity-20" />
        <div className="relative z-10 text-center space-y-2">
          <div className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Advertisement
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {placement.replace(/_/g, ' ')}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-600">
            728 × 90 • Leaderboard
          </div>
        </div>
      </div>
    </div>
  );
}
