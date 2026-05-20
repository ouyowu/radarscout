'use client';

import { ExternalLink } from 'lucide-react';
import { trackOutboundClick } from '@/lib/monetization';
import type { AffiliateLink } from '@/types';

interface AffiliateButtonProps {
  link: AffiliateLink;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AffiliateButton({
  link,
  variant = 'primary',
  size = 'md',
  className = '',
}: AffiliateButtonProps) {
  const handleClick = () => {
    trackOutboundClick(link.url, link.merchant);
  };

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white shadow-lg shadow-slate-900/50',
    outline: 'border-2 border-slate-300 dark:border-slate-600 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 bg-white dark:bg-slate-900',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <a
      href={link.url || '#'}
      target="_blank"
      rel={link.isAffiliate ? 'sponsored nofollow' : 'noopener noreferrer'}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span>{link.label}</span>
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}
