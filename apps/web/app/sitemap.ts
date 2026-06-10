import type { MetadataRoute } from 'next'
import { globalDestinations } from '@/lib/global-destinations'
import { itineraries } from '@/lib/itineraries'
import { worldCupHostCities, worldCupHostCountries } from '@/lib/world-cup-2026'

const routes = [
  ['', 'weekly', 1.0],
  ['/ai-trip-planner', 'weekly', 0.8],
  ['/contact', 'monthly', 0.6],
  ['/privacy-policy', 'yearly', 0.3],
  ['/terms-of-service', 'yearly', 0.3],
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.radarscout.io'
  const now = new Date()

  const staticRoutes = routes.map(([path, changeFrequency, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // Coming Soon destination and World Cup planning pages are intentionally included
  // for SEO discovery. They are not bookable product pages. Page metadata and
  // InventoryAlert must clearly state that bookable partner tours are currently
  // available only in Thailand.
  const destinationRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...globalDestinations.map(destination => ({
      url: `${base}/destinations/${destination.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: destination.hasLiveInventory ? 0.75 : 0.45,
    })),
  ]

  const worldCupRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/world-cup-2026`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.65,
    },
    ...worldCupHostCountries.map(country => ({
      url: `${base}/world-cup-2026/${country.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    })),
    ...worldCupHostCities.map(city => ({
      url: `${base}/world-cup-2026/${city.countrySlug}/${city.citySlug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]

  const itineraryRoutes: MetadataRoute.Sitemap = itineraries.map(itinerary => ({
    url: `${base}/itineraries/${itinerary.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: itinerary.hasLiveInventory ? 0.75 : 0.5,
  }))

  return [...staticRoutes, ...destinationRoutes, ...worldCupRoutes, ...itineraryRoutes]
}
