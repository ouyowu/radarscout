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
  /private backend/i,
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
    content.intakeGuide?.title ?? '',
    content.intakeGuide?.body ?? '',
    ...(content.intakeGuide?.items ?? []),
    content.reviewNote,
    ...content.nextSteps,
    content.ctaLabel,
    content.ctaHref,
    ...content.relatedLinks.flatMap(link => [link.label, link.description, link.href]),
    content.operatorUrlRequest?.eyebrow ?? '',
    content.operatorUrlRequest?.title ?? '',
    content.operatorUrlRequest?.body ?? '',
    ...(content.operatorUrlRequest?.items ?? []),
    content.operatorUrlRequest?.ctaLabel ?? '',
    content.operatorUrlRequest?.ctaHref ?? '',
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
    expect(content.operatorUrlRequest?.ctaHref ?? '').not.toContain('/api/')
    expect(content.operatorUrlRequest?.ctaHref ?? '').not.toContain('/checkout')
  })

  it.each(pages)('$route links only to other static B2B interest pages', ({ route, content }) => {
    expect(content.relatedLinks).toHaveLength(2)

    const hrefs = content.relatedLinks.map(link => link.href)

    expect(hrefs).not.toContain(route)
    expect(hrefs).toEqual(
      expect.arrayContaining(
        ['/partners', '/suppliers', '/destination-partners'].filter(path => path !== route),
      ),
    )

    for (const href of hrefs) {
      expect(href).toMatch(/^\/(partners|suppliers|destination-partners)$/)
      expect(href).not.toContain('/api/')
      expect(href).not.toContain('/checkout')
      expect(href).not.toContain('/tours/')
      expect(href).not.toContain('/chiang-mai/elephant-camp-finder')
    }
  })

  it.each(pages)('$route keeps B2B crosslink labels safe and non-transactional', ({ content }) => {
    const serializedLinks = content.relatedLinks
      .flatMap(link => [link.label, link.description, link.href])
      .join(' ')

    expect(serializedLinks).not.toMatch(/live availability/i)
    expect(serializedLinks).not.toMatch(/available now/i)
    expect(serializedLinks).not.toMatch(/instant confirmation/i)
    expect(serializedLinks).not.toMatch(/\bcheckout\b/i)
    expect(serializedLinks).not.toMatch(/\bpayment\b/i)
    expect(serializedLinks).not.toMatch(/Bókun/i)
    expect(serializedLinks).not.toMatch(/partner rate/i)
    expect(serializedLinks).not.toMatch(/supplier net rate/i)
    expect(serializedLinks).not.toMatch(/\bcommission\b/i)
  })

  it.each(pages)('$route sets manual review expectations before public recommendation', ({ content }) => {
    expect(content.reviewNote).toContain('destination focus')
    expect(content.reviewNote).toContain('public booking link')
    expect(content.reviewNote).toContain('manually checks partner inquiries')
    expect(content.reviewNote).toContain('before any public recommendation')
    expect(content.reviewNote).not.toMatch(/guaranteed placement/i)
    expect(content.reviewNote).not.toMatch(/live availability/i)
    expect(content.reviewNote).not.toMatch(/\bpayment\b/i)
  })

  it.each(pages)('$route explains the manual next-step process without promises', ({ content }) => {
    expect(content.nextSteps).toHaveLength(4)
    expect(content.nextSteps.join(' ')).toContain('read your message')
    expect(content.nextSteps.join(' ')).toContain('traveler-facing links manually')
    expect(content.nextSteps.join(' ')).toContain('public-safe details')
    expect(content.nextSteps.join(' ')).toContain('Nothing is published')
    expect(content.nextSteps.join(' ')).toContain('separate manual check')
    expect(content.nextSteps.join(' ')).not.toMatch(/\binternal\b/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/private backend/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/guaranteed placement/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/guaranteed leads/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/guaranteed sales/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/live availability/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/\bcheckout\b/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/\bpayment\b/i)
    expect(content.nextSteps.join(' ')).not.toMatch(/Bókun/i)
  })

  it.each(pages)('$route gives safe visible guidance for what to send first', ({ content }) => {
    expect(content.intakeGuide?.title).toBe('What to send first')
    expect(content.intakeGuide?.body).toContain('public-safe')
    expect(content.intakeGuide?.items).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/Organization name/i),
        expect.stringMatching(/Destination focus/i),
        expect.stringMatching(/Public traveler-facing URL/i),
      ]),
    )

    const serialized = [
      content.intakeGuide?.title ?? '',
      content.intakeGuide?.body ?? '',
      ...(content.intakeGuide?.items ?? []),
    ].join(' ')

    expect(serialized).not.toMatch(/private backend/i)
    expect(serialized).not.toMatch(/supplier net rate/i)
    expect(serialized).not.toMatch(/partner rate/i)
    expect(serialized).not.toMatch(/\bcommission\b/i)
    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
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

  it('lets suppliers submit a public traveler-facing URL for a manual handoff check', () => {
    const request = SUPPLIERS_PAGE_CONTENT.operatorUrlRequest

    expect(request).toBeTruthy()
    expect(request?.title).toContain('traveler-facing page')
    expect(request?.body).toContain('manual handoff check')
    expect(request?.ctaLabel).toBe('Submit public link for check')
    expect(request?.items).toContain('Public traveler-facing URL')

    const mailto = decodedMailto(request?.ctaHref ?? '')

    expect(mailto.protocol).toBe('mailto:')
    expect(mailto.email).toBe('hello@radarscout.io')
    expect(mailto.subject).toContain('[RadarScout supplier public link check]')
    expect(mailto.subject).toContain('Public handoff URL check')
    expect(mailto.body).toContain('Public traveler-facing URL:')
    expect(mailto.body).toContain('Experience name and destination:')
    expect(mailto.body).toContain('Operator public name:')
    expect(mailto.body).toContain('Contact person for link check:')
    expect(mailto.body).not.toMatch(/backend/i)
    expect(mailto.body).not.toMatch(/database/i)
    expect(mailto.body).not.toMatch(/partner rate/i)
    expect(mailto.body).not.toMatch(/supplier net rate/i)
    expect(mailto.body).not.toMatch(/\bcheckout\b/i)
    expect(mailto.body).not.toMatch(/\bpayment\b/i)
    expect(mailto.body).not.toMatch(/\breviews?\b/i)
  })

  it('does not add DB, API, or service-backed form dependencies to the page routes', () => {
    const routeSources = [
      readFileSync(new URL('../page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../suppliers/page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../destination-partners/page.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../_components/PartnerInterestPage.tsx', import.meta.url), 'utf8'),
      readFileSync(new URL('../../_components/partnerInterestContent.ts', import.meta.url), 'utf8'),
    ].join('\n')

    expect(routeSources).toContain('What to send first')
    expect(routeSources).toContain('intakeGuide')
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
