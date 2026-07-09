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

function searchTokens(search?: string | null): string[] {
  if (!search) return []

  const stopWords = new Set([
    'a',
    'an',
    'and',
    'chiang',
    'for',
    'in',
    'mai',
    'of',
    'sanctuary',
    'the',
    'thailand',
    'to',
    'tour',
    'trip',
    'with',
  ])

  return normalize(search)
    .split(' ')
    .filter(token => token.length > 1 && !stopWords.has(token))
}

function tokenVariants(token: string): string[] {
  if (token.endsWith('s')) return [token, token.slice(0, -1)]

  return [token, `${token}s`]
}

function textContainsToken(text: string, token: string): boolean {
  return tokenVariants(token).some(variant => text.includes(variant))
}

function scoreProduct(product: PartnerProduct, search?: string | null): number {
  const tokens = searchTokens(search)
  if (tokens.length === 0) return 1

  const title = normalize(product.title)
  const tags = normalize(product.tags.join(' '))
  const slug = normalize(product.slug)
  const summary = normalize(product.shortSummary)
  const partnerName = normalize(product.partnerName)
  const allText = productSearchText(product)

  return tokens.reduce((score, token) => {
    if (!textContainsToken(allText, token)) return score

    return score +
      (textContainsToken(title, token) ? 4 : 0) +
      (textContainsToken(tags, token) ? 3 : 0) +
      (textContainsToken(slug, token) ? 2 : 0) +
      (textContainsToken(summary, token) ? 1 : 0) +
      (textContainsToken(partnerName, token) ? 1 : 0)
  }, 0)
}

function matchesCity(product: PartnerProduct, city?: string | null): boolean {
  if (!city) return true

  return normalize(product.destination) === normalize(city)
}

function matchesSearch(product: PartnerProduct, search?: string | null): boolean {
  return scoreProduct(product, search) > 0
}

function toCandidate(product: PartnerProduct): AiProductCandidate {
  return {
    id: product.id,
    title: product.title,
    cleanedTitle: product.title,
    city: product.destination,
    location: product.destination,
    summary: product.shortSummary,
    imageUrl: product.imageUrl ?? null,
    imageAlt: product.imageAlt ?? product.title,
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
    .map((product, index) => ({ product, index, score: scoreProduct(product, search) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ product }) => product)
    .slice(0, take)
    .map(toCandidate)
}
