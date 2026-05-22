import type { AdSlotConfig } from '@/types';

function normalizeAdsensePublisherId(value: string) {
  if (!value) return '';
  return value.startsWith('ca-pub-') ? value : `ca-${value}`;
}

const defaultAdsensePublisherId = 'ca-pub-5538837787017019';

export const monetizationConfig = {
  enableAds: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
  enableAffiliateLinks: process.env.NEXT_PUBLIC_ENABLE_AFFILIATE === 'true',
  adsensePublisherId: normalizeAdsensePublisherId(
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || defaultAdsensePublisherId
  ),
  
  defaultAffiliateDisclosure: `RadarScout may earn a commission when you buy through links on our site. This does not affect our editorial recommendations.`,
  
  healthDisclaimer: `RadarScout provides general information about consumer health technology. It is not medical advice. Always consult a qualified healthcare professional for medical decisions.`,
  
  adSlots: {
    // Paste your numeric AdSense slot IDs into the adUnitId fields below.
    homepage_top: {
      placement: 'homepage_top',
      enabled: true,
      adUnitId: '',
    },
    homepage_mid: {
      placement: 'homepage_mid',
      enabled: true,
      adUnitId: '',
    },
    article_top: {
      placement: 'article_top',
      enabled: true,
      adUnitId: '',
    },
    article_inline: {
      placement: 'article_inline',
      enabled: true,
      adUnitId: '',
    },
    article_sidebar: {
      placement: 'article_sidebar',
      enabled: true,
      adUnitId: '',
    },
    article_bottom: {
      placement: 'article_bottom',
      enabled: true,
      adUnitId: '',
    },
    category_top: {
      placement: 'category_top',
      enabled: true,
      adUnitId: '',
    },
    product_sidebar: {
      placement: 'product_sidebar',
      enabled: true,
      adUnitId: '',
    },
    comparison_inline: {
      placement: 'comparison_inline',
      enabled: false,
      adUnitId: '',
    },
    buying_guide_inline: {
      placement: 'buying_guide_inline',
      enabled: true,
      adUnitId: '',
    },
  } as Record<string, AdSlotConfig>,
  
  affiliateRegions: ['US', 'SG', 'JP', 'Global'] as const,
};

// Analytics helper for tracking outbound clicks
export const trackOutboundClick = (url: string, merchant: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'click', {
      event_category: 'outbound',
      event_label: merchant,
      value: url,
    });
  }
};
