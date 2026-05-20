// Product types
export interface AffiliateLink {
  label: string;
  merchant: string;
  region: string;
  url: string;
  isAffiliate: boolean;
}

export interface ProductSource {
  title: string;
  url: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  summary: string;
  priceRange: string;
  officialUrl: string;
  releaseYear?: number;
  ecosystems: string[];
  connectivity: string[];
  sensors?: string[];
  features: string[];
  subscriptionRequired?: boolean;
  batteryLife?: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  notBestFor: string[];
  alternatives: string[];
  affiliateLinks: AffiliateLink[];
  sources: ProductSource[];
  lastUpdated: string;
  imageUrl?: string;
}

// Article types
export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
}

// Monetization types
export type AdPlacement = 
  | 'homepage_top'
  | 'homepage_mid'
  | 'article_top'
  | 'article_inline'
  | 'article_sidebar'
  | 'article_bottom'
  | 'category_top'
  | 'product_sidebar'
  | 'comparison_inline'
  | 'buying_guide_inline';

export interface AdSlotConfig {
  placement: AdPlacement;
  enabled: boolean;
  adUnitId?: string;
  className?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
