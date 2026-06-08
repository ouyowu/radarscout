import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/auth/',
          '/demo',
          '/use-cases',
          '/pricing',
          '/f5bot-alternative',
          '/gummysearch-alternative',
          '/reddit-monitoring-tool',
          '/reddit-keyword-monitor',
          '/reddit-mention-alerts',
          '/reddit-lead-finder',
          '/social-listening-reddit',
          '/reddit-competitor-monitoring',
          '/reddit-customer-discovery',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
