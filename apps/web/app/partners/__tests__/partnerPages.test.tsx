import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import PartnersPage, { metadata as partnersMetadata } from '../page'
import SuppliersPage, { metadata as suppliersMetadata } from '../../suppliers/page'
import DestinationPartnersPage, {
  metadata as destinationPartnersMetadata,
} from '../../destination-partners/page'
import {
  DESTINATION_PARTNERS_PAGE_CONTENT,
  PARTNERS_PAGE_CONTENT,
  SUPPLIERS_PAGE_CONTENT,
} from '../../_components/partnerInterestContent'
import type { PartnerInterestPageContent } from '../../_components/PartnerInterestPage'

const pages: {
  route: string
  component: () => unknown
  content: PartnerInterestPageContent
  metadata: { title?: unknown; robots?: unknown }
  headline: string
  ctaLabel: string
  sourceLabel: string
}[] = [
  {
    route: '/partners',
    component: PartnersPage,
    content: PARTNERS_PAGE_CONTENT,
    metadata: partnersMetadata,
    headline: 'Sell trusted Thailand experiences with AI-guided discovery',
    ctaLabel: 'Contact RadarScout about partnerships',
    sourceLabel: '[RadarScout partners page]',
  },
  {
    route: '/suppliers',
    component: SuppliersPage,
    content: SUPPLIERS_PAGE_CONTENT,
    metadata: suppliersMetadata,
    headline: 'List your Thailand experience with RadarScout',
    ctaLabel: 'Share your experience details',
    sourceLabel: '[RadarScout suppliers page]',
  },
  {
    route: '/destination-partners',
    component: DestinationPartnersPage,
    content: DESTINATION_PARTNERS_PAGE_CONTENT,
    metadata: destinationPartnersMetadata,
    headline: 'Help travelers discover the best local experiences in your destination',
    ctaLabel: 'Discuss a destination partnership',
    sourceLabel: '[RadarScout destination partners page]',
  },
]

const forbiddenPhrases = [
  /Bókun database/i,
  /Bókun backend/i,
  /Bókun-powered/i,
  /Bókun supplier products/i,
  /supplier net rate/i,
  /partner rate/i,
  /\bcommission\b/i,
  /live availability/i,
  /available now/i,
  /guaranteed slot/i,
  /instant confirmation/i,
  /\bcheckout\b/i,
  /\bpayment\b/i,
  /\bbooked\b/i,
  /reservation complete/i,
  /\bratings?\b/i,
  /\breviews?\b/i,
]

function contentText(content: PartnerInterestPageContent) {
  return [
    content.eyebrow,
    content.headline,
    content.intro,
    ...content.audience,
    ...content.helps,
    ...content.doesNotReplace,
    ...content.intake,
    content.ctaLabel,
    content.ctaHref,
  ].join(' ')
}

function decodedMailto(href: string) {
  const url = new URL(href)

  return {
    protocol: url.protocol,
    email: url.pathname,
    subject: url.searchParams.get('subject') ?? '',
    body: url.searchParams.get('body') ?? '',
  }
}

describe('RadarScout partner interest pages', () => {
  it.each(pages)('$route renders as a static page component', ({ component }) => {
    expect(component()).toBeTruthy()
  })

  it.each(pages)('$route has the expected headline and CTA', ({ content, headline, ctaLabel }) => {
    expect(content.headline).toBe(headline)
    expect(content.ctaLabel).toBe(ctaLabel)
    expect(content.ctaHref).toMatch(/^mailto:hello@radarscout\.io\?subject=/)
  })

  it.each(pages)('$route keeps conservative noindex/nofollow metadata', ({ metadata }) => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false })
  })

  it.each(pages)('$route avoids forbidden public and tourist-facing claims', ({ content }) => {
    const serialized = contentText(content)

    for (const phrase of forbiddenPhrases) {
      expect(serialized).not.toMatch(phrase)
    }
  })

  it.each(pages)('$route keeps contact collection as mailto only', ({ content }) => {
    expect(content.ctaHref).toMatch(/^mailto:/)
    expect(content.ctaHref).not.toContain('/api/')
    expect(content.ctaHref).not.toContain('/checkout')
  })

  it.each(pages)('$route pre-fills safe source-specific mailto prompts', ({ content, sourceLabel }) => {
    const mailto = decodedMailto(content.ctaHref)

    expect(mailto.protocol).toBe('mailto:')
    expect(mailto.email).toBe('hello@radarscout.io')
    expect(mailto.subject).toContain(sourceLabel)
    expect(mailto.body).toContain(sourceLabel)
    expect(mailto.body).toContain('Name:')
    expect(mailto.body).toContain('Organization:')
    expect(mailto.body).toContain('Destination focus:')
    expect(mailto.body).toContain('What you want to discuss:')
    expect(mailto.body).not.toMatch(/traveler name/i)
    expect(mailto.body).not.toMatch(/payment/i)
    expect(mailto.body).not.toMatch(/booking reference/i)
    expect(mailto.body).not.toMatch(/private supplier/i)
  })

  it('does not add DB, API, or service-backed form dependencies to the page routes', () => {
    const routeSources = [
      readFileSync(new URL('../page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../suppliers/page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../destination-partners/page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../_components/PartnerInterestPage.tsx', import.meta.url), 'utf8'),
    ].join('\n')

    expect(routeSources).not.toMatch(/@reddit-monitor\/db/)
    expect(routeSources).not.toMatch(/\bdb\./)
    expect(routeSources).not.toMatch(/\bprisma\b/i)
    expect(routeSources).not.toMatch(/\bfetch\(/)
    expect(routeSources).not.toMatch(/<form\b/i)
    expect(routeSources).not.toMatch(/action=/i)
    expect(routeSources).not.toMatch(/resend/i)
    expect(routeSources).not.toMatch(/crm/i)
  })

  it('keeps arbitrary content constants out of App Router page module exports', () => {
    const routeSources = [
      readFileSync(new URL('../page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../suppliers/page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../destination-partners/page.tsx', import.meta.url), 'utf8'),
    ].join('\n')

    expect(routeSources).not.toMatch(/export const .*PAGE_CONTENT/)
  })
})
