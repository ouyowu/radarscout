import type { MetadataRoute } from 'next';
import { getAllArticles, getArticleCategories } from '@/lib/data/articles';
import { getAllProducts } from '@/lib/data/products';

const siteUrl = 'https://www.radarscout.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/products',
    '/search',
    '/about',
    '/about/affiliate-disclosure',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getArticleCategories().map(
    (category) => ({
      url: `${siteUrl}/${category}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  const articleRoutes: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${siteUrl}/${article.category}/${article.slug}`,
    lastModified: article.frontmatter.updatedAt || article.frontmatter.publishedAt,
    changeFrequency: 'monthly',
    priority: article.frontmatter.featured ? 0.9 : 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.lastUpdated || now.toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...productRoutes,
  ];
}
