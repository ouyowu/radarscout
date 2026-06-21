import type { MetadataRoute } from 'next'
import { listPublicThailandProducts } from '@/lib/publicProducts/listPublicThailandProducts'

const routes = [
  ['', 'weekly', 1.0],
  ['/contact', 'monthly', 0.6],
  ['/privacy-policy', 'yearly', 0.3],
  ['/terms-of-service', 'yearly', 0.3],
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = routes.map(([path, changeFrequency, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const products = await listPublicThailandProducts()
  const productRoutes: MetadataRoute.Sitemap = products.map(product => ({
    url: `${base}/tours/${encodeURIComponent(product.id)}`,
    lastModified: product.lastSyncedAt ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
