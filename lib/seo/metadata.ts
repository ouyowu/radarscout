import type { Metadata } from 'next';

export const siteConfig = {
  name: 'RadarScout',
  url: 'https://www.radarscout.io',
  description: 'Your radar for smart home, wearables, and health tech. Discover, compare, and track the best smart devices.',
  ogImage: '/opengraph-image',
  logoUrl: 'https://www.radarscout.io/logo.png',
  twitterHandle: '@radarscout',
  foundingYear: 2024,
};

// Map article categories to Schema.org Article sub-types
function articleSchemaType(category?: string): string {
  if (!category) return 'Article';
  const lower = category.toLowerCase();
  if (lower.includes('review')) return 'Review';
  if (lower.includes('guide') || lower.includes('tutorial')) return 'TechArticle';
  if (lower.includes('comparison')) return 'TechArticle';
  return 'Article';
}

export function generateSEO({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 && { keywords }),
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: type === 'article' ? 'article' : 'website',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// --- Structured data schemas ---

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: siteConfig.logoUrl,
      width: 200,
      height: 60,
    },
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundingYear),
    sameAs: [
      'https://twitter.com/radarscout',
    ],
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  heroImage?: string;
  url?: string;
  category?: string;
  tags?: string[];
}) {
  const schemaType = articleSchemaType(article.category);
  const pageUrl = article.url || siteConfig.url;
  const imageUrl = article.heroImage
    ? `${siteConfig.url}${article.heroImage}`
    : siteConfig.ogImage;

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${pageUrl}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author,
          url: `${siteConfig.url}/about`,
          worksFor: {
            '@id': `${siteConfig.url}/#organization`,
          },
        }
      : {
          '@id': `${siteConfig.url}/#organization`,
        },
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    isPartOf: {
      '@id': `${siteConfig.url}/#website`,
    },
    // speakable: sections voice assistants and AI engines extract for answers (GEO)
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        'h1',
        'h2',
        'h3',
        '.quick-answer',
        '.article-summary',
        '.verdict',
        'article > p:first-of-type',
      ],
    },
    ...(article.tags && article.tags.length > 0 && {
      keywords: article.tags.join(', '),
      about: article.tags.map(tag => ({
        '@type': 'Thing',
        name: tag,
      })),
    }),
  };
}

export function generateProductSchema(product: {
  name: string;
  brand: string;
  summary: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    description: product.summary,
    ...(product.imageUrl && { image: product.imageUrl }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      ...(product.priceRange && { description: product.priceRange }),
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateItemListSchema(
  items: { name: string; url: string; description?: string }[],
  listName: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
      ...(item.description && { description: item.description }),
    })),
  };
}

/**
 * Extracts FAQ pairs from markdown content.
 * Detects "**Q: ...**\n answer" and "## Frequently Asked Questions" sections.
 */
export function extractFAQsFromContent(
  content: string,
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  // Pattern: **Q: question text**\nAnswer text (one or more paragraphs until next Q or section)
  const qPattern = /\*\*Q:\s*(.+?)\*\*\s*\n+([\s\S]+?)(?=\*\*Q:|#{1,3} |$)/g;
  let match;
  while ((match = qPattern.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2]
      .trim()
      .replace(/\n+/g, ' ')
      .replace(/\*\*/g, '')
      .substring(0, 600);
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}
