import type { MetadataRoute } from 'next'

const routes = [
  ['', 'weekly', 1.0],
  ['/pricing', 'monthly', 0.9],
  ['/demo', 'monthly', 0.7],
  ['/use-cases', 'monthly', 0.8],
  ['/f5bot-alternative', 'weekly', 0.9],
  ['/gummysearch-alternative', 'weekly', 0.85],
  ['/reddit-monitoring-tool', 'weekly', 0.9],
  ['/reddit-keyword-monitor', 'weekly', 0.85],
  ['/reddit-mention-alerts', 'weekly', 0.85],
  ['/reddit-lead-finder', 'weekly', 0.85],
  ['/social-listening-reddit', 'weekly', 0.8],
  ['/reddit-competitor-monitoring', 'weekly', 0.85],
  ['/reddit-customer-discovery', 'weekly', 0.85],
  ['/about-us', 'yearly', 0.4],
  ['/contact', 'yearly', 0.4],
  ['/privacy-policy', 'yearly', 0.3],
  ['/terms-of-service', 'yearly', 0.3],
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://radarscout.io'
  const now = new Date()

  return routes.map(([path, changeFrequency, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
