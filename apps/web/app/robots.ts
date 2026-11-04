import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Only paths that must stay uncrawled: the API, and the signed-in
        // surfaces behind /auth/login (which still returns 200).
        //
        // The legacy marketing and comparison routes are deliberately NOT
        // listed. They return 410 Gone, and a crawler that is blocked by
        // robots.txt never fetches them, so it never sees the 410 and leaves
        // them in the index — usually as "indexed, though blocked by
        // robots.txt". Disallow and 410 were cancelling each other out.
        disallow: [
          '/api/',
          '/dashboard',
          '/auth/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
