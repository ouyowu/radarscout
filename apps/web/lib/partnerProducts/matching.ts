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

function searchTokens(search: string): string[] {
  return normalize(search).split(' ').filter(Boolean)
}

function tokenVariants(token: string): string[] {
  const variants = new Set<string>([token])

  if (token.endsWith('s') && token.length > 1) variants.add(token.slice(0, -1))
  if (!token.endsWith('s')) variants.add(`${token}s`)

  return [...variants]
}

function textIncludesToken(text: string, token: string): boolean {
  return tokenVariants(token).some(variant => text.includes(variant))
}

function scoreField(text: string, tokens: string[], weight: number): number {
  return tokens.reduce((score, token) => {
    return score + (textIncludesToken(text, token) ? weight : 0)
  }, 0)
}

function productSearchScore(product: PartnerProduct, search?: string | null): number {
  if (!search) return 1

  const term = normalize(search)
  if (!term) return 1

  const tokens = searchTokens(term)
  if (tokens.length === 0) return 1

  const searchableText = productSearchText(product)
  if (!tokens.every(token => textIncludesToken(searchableText, token))) return 0

  const title = normalize(product.title)
  const slug = normalize(product.slug)
  const tags = normalize(product.tags.join(' '))
  const summary = normalize(product.shortSummary)
  const partner = normalize(product.partnerName)

  let score = 0

  if (searchableText.includes(term)) score += 100
  if (title.includes(term)) score += 50
  if (slug.includes(term)) score += 40
  if (tags.includes(term)) score += 30

  score += scoreField(title, tokens, 12)
  score += scoreField(slug, tokens, 10)
  score += scoreField(tags, tokens, 8)
  score += scoreField(summary, tokens, 4)
  score += scoreField(partner, tokens, 2)

  return score
}

function matchesCity(product: PartnerProduct, city?: string | null): boolean {
  if (!city) return true

  return normalize(product.destination) === normalize(city)
}

function matchesSearch(product: PartnerProduct, search?: string | null): boolean {
  return productSearchScore(product, search) > 0
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
    .sort((a, b) => productSearchScore(b, search) - productSearchScore(a, search))
    .slice(0, take)
    .map(toCandidate)
}
