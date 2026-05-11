import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  return [
    { url: base,                                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,                          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/f5bot-alternative`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gummysearch-alternative`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/social-listening-reddit`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reddit-keyword-monitor`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reddit-mention-alerts`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reddit-lead-finder`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/reddit-monitoring-tool`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auth/login`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${base}/auth/register`,                    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
  ]
}
