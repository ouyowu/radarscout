'use client';

import { ShoppingCart } from 'lucide-react';
import { AffiliateButton } from '@/components/monetization/AffiliateButton';
import type { AffiliateLink } from '@/types';

interface WhereToBuyProps {
  links: AffiliateLink[];
  productName: string;
  className?: string;
}

export function WhereToBuy({ links, productName, className = '' }: WhereToBuyProps) {
  if (links.length === 0) {
    return null;
  }

  const affiliateLinks = links.filter(link => link.isAffiliate);
  const officialLinks = links.filter(link => !link.isAffiliate);

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Where to Buy
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {productName}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {affiliateLinks.map((link, index) => (
          <AffiliateButton
            key={index}
            link={link}
            variant={index === 0 ? 'primary' : 'outline'}
            size="md"
            className="w-full"
          />
        ))}

        {officialLinks.length > 0 && (
          <>
            {affiliateLinks.length > 0 && (
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-50 dark:bg-slate-900 px-3 text-xs text-slate-500 dark:text-slate-400">
                    or
                  </span>
                </div>
              </div>
            )}
            
            {officialLinks.map((link, index) => (
              <AffiliateButton
                key={index}
                link={link}
                variant="outline"
                size="md"
                className="w-full"
              />
            ))}
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Prices and availability subject to change
        </p>
      </div>
    </div>
  );
}
