import type { MetadataRoute } from 'next'

const routes = [
  ['', 'weekly', 1.0],
  ['/contact', 'monthly', 0.6],
  ['/privacy-policy', 'yearly', 0.3],
  ['/terms-of-service', 'yearly', 0.3],
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  const now = new Date()

  return routes.map(([path, changeFrequency, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
