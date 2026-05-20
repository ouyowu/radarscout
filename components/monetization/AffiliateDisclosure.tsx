'use client';

import { Info } from 'lucide-react';
import { monetizationConfig } from '@/lib/monetization';

interface AffiliateDisclosureProps {
  className?: string;
  compact?: boolean;
}

export function AffiliateDisclosure({
  className = '',
  compact = false,
}: AffiliateDisclosureProps) {
  if (!monetizationConfig.enableAffiliateLinks) {
    return null;
  }

  if (compact) {
    return (
      <div className={`flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <p>{monetizationConfig.defaultAffiliateDisclosure}</p>
      </div>
    );
  }

  return (
    <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
          <Info className="w-4 h-4 text-amber-700 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            Affiliate Disclosure
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {monetizationConfig.defaultAffiliateDisclosure}
          </p>
        </div>
      </div>
    </div>
  );
}
