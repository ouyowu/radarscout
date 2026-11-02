import { isTourDetailSeoCandidate } from './tourDetailSeoCandidates'

const DEFAULT_SITE_BASE = 'https://www.radarscout.io'

const cityPaths: Record<string, string> = {
  Bangkok: 'thailand/bangkok',
  'Chiang Mai': 'thailand/chiang-mai',
  Phuket: 'thailand/phuket',
}

export type TourDetailJsonLdInput = {
  id: string
  title: string
  city?: string | null
  summary?: string | null
  reviewedEnrichment?: {
    cleanedTitle?: string | null
    shortSummary?: string | null
    suggestedTags?: readonly string[] | null
  } | null
  supplierName?: string | null
}

function reviewedText(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function buildTourDetailJsonLd(
  product: TourDetailJsonLdInput,
  siteBase = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_SITE_BASE,
): Record<string, unknown> | null {
  if (!isTourDetailSeoCandidate(product.id)) return null

  const productTitle = reviewedText(product.reviewedEnrichment?.cleanedTitle) ?? reviewedText(product.title)
  if (!productTitle) return null

  const base = siteBase.replace(/\/$/, '')
  const reviewerNote = reviewedText(product.reviewedEnrichment?.shortSummary) ?? reviewedText(product.summary)
  const supplierName = reviewedText(product.supplierName)
  const cityName = reviewedText(product.city)
  const cityPath = cityName ? cityPaths[cityName] : undefined

  const itemListElement: Record<string, unknown>[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${base}/`,
    },
  ]

  if (cityName && cityPath) {
    itemListElement.push({
      '@type': 'ListItem',
      position: itemListElement.length + 1,
      name: cityName,
      item: `${base}/${cityPath}`,
    })
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: itemListElement.length + 1,
    name: productTitle,
  })

  const touristTrip: Record<string, unknown> = {
    '@type': 'TouristTrip',
    name: productTitle,
    url: `${base}/tours/${encodeURIComponent(product.id.trim())}`,
  }

  if (reviewerNote) touristTrip.description = reviewerNote
  if (supplierName) {
    touristTrip.provider = {
      '@type': 'Organization',
      name: supplierName,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      touristTrip,
    ],
  }
}
