import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/data/articles';
import { getAllProducts } from '@/lib/data/products';

const BASE_URL = 'https://radarscout.io';
const CATEGORIES = ['buying-guides', 'comparisons', 'reviews', 'guides'];

/** Normalise any date string to a valid ISO 8601 date (YYYY-MM-DD).
 *  Google Sitemap validator rejects dates with microseconds (>3 decimal places)
 *  and undefined/empty values. Falls back to today's date when invalid. */
function toSitemapDate(value: string | undefined): string {
  if (!value) return new Date().toISOString().split('T')[0];
  // Strip time component entirely — YYYY-MM-DD is always safe
  const datePart = value.split('T')[0];
  const parsed = new Date(datePart);
  if (isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
  return datePart;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: toSitemapDate(now),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: toSitemapDate(now),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about/affiliate-disclosure`,
      lastModified: toSitemapDate(now),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: toSitemapDate(now),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/${category}`,
    lastModified: toSitemapDate(now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Article pages
  const articles = getAllArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/${article.category}/${article.slug}`,
    lastModified: toSitemapDate(article.frontmatter.updatedAt || article.frontmatter.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: article.frontmatter.featured ? 0.9 : 0.7,
  }));

  // Product pages
  const products = getAllProducts();
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: toSitemapDate(product.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages, ...productPages];
}
