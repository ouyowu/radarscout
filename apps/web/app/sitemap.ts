import type { MetadataRoute } from 'next'
import { listTourDetailSeoCandidates } from '@/lib/publicProducts/tourDetailSeoCandidates'

const routes = [
  ['', 'weekly', 1.0],
  ['/chiang-mai/elephant-camp-finder', 'weekly', 0.8],
  ['/contact', 'monthly', 0.6],
  ['/privacy-policy', 'yearly', 0.3],
  ['/terms-of-service', 'yearly', 0.3],
] as const

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = routes.map(([path, changeFrequency, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const tourDetailCandidates: MetadataRoute.Sitemap = listTourDetailSeoCandidates().map(candidate => ({
    url: `${base}${candidate.expectedCanonicalPath}`,
    lastModified: new Date(candidate.approvedAt),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...tourDetailCandidates]
}
