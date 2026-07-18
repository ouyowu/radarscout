import type { AiProductCandidate } from '@/lib/aiProducts/listAiEligibleThailandProducts'

import {
  loadReviewedViatorProducts,
  VIATOR_AFFILIATE_PID,
  type ReviewedViatorProduct,
} from './reviewedViatorProducts'

const PUBLIC_HANDOFF_REL = 'nofollow sponsored noopener noreferrer' as const

type ListMatchingReviewedViatorProductCandidatesOptions = {
  city?: string | null
  search?: string | null
  take: number
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ')
}

function searchTokens(search?: string | null): string[] {
  if (!search) return []

  const stopWords = new Set([
    'a',
    'an',
    'and',
    'bangkok',
    'chiang',
    'day',
    'days',
    'for',
    'in',
    'koh',
    'krabi',
    'mai',
    'night',
    'nights',
    'of',
    'pattaya',
    'phuket',
    'samui',
    'thailand',
    'to',
    'tour',
    'trip',
    'with',
  ])

  return normalize(search)
    .split(' ')
    .filter(token => token.length > 1 && !/^\d+$/.test(token) && !stopWords.has(token))
}

function tokenVariants(token: string): string[] {
  return token.endsWith('s') ? [token, token.slice(0, -1)] : [token, `${token}s`]
}

function textContainsToken(text: string, token: string): boolean {
  return tokenVariants(token).some(variant => text.includes(variant))
}

function productSearchText(product: ReviewedViatorProduct): string {
  return normalize([
    product.city,
    product.title,
    product.shortSummary,
    product.tags.join(' '),
  ].join(' '))
}

function scoreProduct(product: ReviewedViatorProduct, search?: string | null): number {
  const tokens = searchTokens(search)
  if (tokens.length === 0) return 0

  const title = normalize(product.title)
  const tags = normalize(product.tags.join(' '))
  const summary = normalize(product.shortSummary)
  const allText = productSearchText(product)

  return tokens.reduce((score, token) => {
    if (!textContainsToken(allText, token)) return score

    return score +
      (textContainsToken(title, token) ? 4 : 0) +
      (textContainsToken(tags, token) ? 3 : 0) +
      (textContainsToken(summary, token) ? 1 : 0)
  }, 0)
}

function matchesCity(product: ReviewedViatorProduct, city?: string | null): boolean {
  return !city || normalize(product.city) === normalize(city)
}

export function isReviewedViatorAffiliateUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return url.protocol === 'https:' &&
      (url.hostname === 'viator.com' || url.hostname.endsWith('.viator.com')) &&
      url.searchParams.get('pid') === VIATOR_AFFILIATE_PID
  } catch {
    return false
  }
}

function toCandidate(product: ReviewedViatorProduct): AiProductCandidate {
  if (!isReviewedViatorAffiliateUrl(product.productUrl)) {
    throw new Error(`Reviewed Viator handoff is invalid for ${product.id}`)
  }

  return {
    id: product.id,
    title: product.title,
    cleanedTitle: product.title,
    city: product.city,
    location: product.city,
    summary: product.shortSummary,
    imageUrl: product.imageUrl,
    imageAlt: product.title,
    suggestedTags: [...product.tags],
    detailHref: `/tours/${encodeURIComponent(product.id)}`,
    retailPrice: null,
    currency: null,
    ctaHref: product.productUrl,
    ctaLabel: 'Check availability',
    ctaRel: PUBLIC_HANDOFF_REL,
    externalHandoff: true,
  }
}

export function listMatchingReviewedViatorProductCandidates({
  city,
  search,
  take,
}: ListMatchingReviewedViatorProductCandidatesOptions): AiProductCandidate[] {
  if (take <= 0) return []

  const matchingCity = loadReviewedViatorProducts().filter(product => matchesCity(product, city))
  const tokens = searchTokens(search)
  const scored = matchingCity
    .map((product, index) => ({ product, index, score: scoreProduct(product, search) }))
    .filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ product }) => product)

  const products = scored.length > 0
    ? scored
    : tokens.length === 0 || city
      ? matchingCity
      : []

  return products.slice(0, take).map(toCandidate)
}
