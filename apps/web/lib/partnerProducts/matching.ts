import type { AiProductCandidate } from '@/lib/aiProducts/listAiEligibleThailandProducts'

import { pilotPartnerProducts } from './seed/pilotPartnerProducts'
import type { PartnerProduct } from './partnerProduct'

const PUBLIC_HANDOFF_REL = 'nofollow sponsored noopener noreferrer' as const

type ListMatchingPartnerProductCandidatesOptions = {
  city?: string | null
  search?: string | null
  take: number
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ')
}

function productSearchText(product: PartnerProduct): string {
  return normalize([
    product.destination,
    product.title,
    product.shortSummary,
    product.tags.join(' '),
    product.partnerName,
    product.slug,
  ].join(' '))
}

function matchesCity(product: PartnerProduct, city?: string | null): boolean {
  if (!city) return true

  return normalize(product.destination) === normalize(city)
}

function matchesSearch(product: PartnerProduct, search?: string | null): boolean {
  if (!search) return true

  const term = normalize(search)
  if (!term) return true

  const text = productSearchText(product)
  const singularTerm = term.endsWith('s') ? term.slice(0, -1) : term
  const pluralTerm = `${term}s`

  return text.includes(term) || text.includes(singularTerm) || text.includes(pluralTerm)
}

function toCandidate(product: PartnerProduct): AiProductCandidate {
  return {
    id: product.id,
    title: product.title,
    cleanedTitle: product.title,
    city: product.destination,
    location: product.destination,
    summary: product.shortSummary,
    suggestedTags: product.tags,
    detailHref: `/tours/${encodeURIComponent(product.id)}`,
    retailPrice: null,
    currency: null,
    ctaHref: product.bookingWidgetUrl,
    ctaLabel: 'Check availability',
    ctaRel: PUBLIC_HANDOFF_REL,
    externalHandoff: true,
  }
}

export function listMatchingPartnerProductCandidates({
  city,
  search,
  take,
}: ListMatchingPartnerProductCandidatesOptions): AiProductCandidate[] {
  if (take <= 0) return []

  return pilotPartnerProducts
    .filter(product => matchesCity(product, city))
    .filter(product => matchesSearch(product, search))
    .slice(0, take)
    .map(toCandidate)
}
