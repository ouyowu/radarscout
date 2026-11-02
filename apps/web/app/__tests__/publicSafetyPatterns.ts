import { expect } from 'vitest'

export const FORBIDDEN_PUBLIC_COPY_PATTERNS = [
  /Live Bókun/i,
  /Bókun/i,
  /Bokun/i,
  /DMC Portal/i,
  /DMC-style/i,
  /Bókun partner inventory/i,
  /Bókun supplier/i,
  /Bókun backend/i,
  /Bókun database/i,
  /Bókun-powered/i,
  /Bókun supplier partner product database/i,
  /direct-rate/i,
  /supplier inventory/i,
  /live availability/i,
  /live inventory/i,
  /live signed/i,
  /live bookable/i,
  /\bbookable\b/i,
  /live tours/i,
  /available now/i,
  /guaranteed slot/i,
  /instant confirmation/i,
  /Reserve in/i,
  /\bReserve\b/i,
  /reserve faster/i,
  /reservation complete/i,
  /partner rate/i,
  /supplier net rate/i,
  /\bcommission\b/i,
  /\bcheckout\b/i,
  /\bpayment\b/i,
]

export const FORBIDDEN_INTERNAL_BOKUN_PUBLIC_PATTERNS = [
  /\/api\/bokun/i,
  /netSettlementPrice/i,
  /Public est\./i,
  /RadarScout est\./i,
]

const APPROVED_AFFILIATE_DISCLOSURE_COPY = [
  'If you book through them, we may earn a commission at no extra cost to you.',
  'We may earn a commission if you book through this link, at no extra cost to you.',
  'If you book, the partner may pay us a commission. Your price is the same.',
]

export function expectNoForbiddenPublicCopy(source: string) {
  const copyWithoutApprovedDisclosure = APPROVED_AFFILIATE_DISCLOSURE_COPY.reduce(
    (text, sentence) => text.replaceAll(sentence, ''),
    source,
  )

  for (const pattern of FORBIDDEN_PUBLIC_COPY_PATTERNS) {
    expect(copyWithoutApprovedDisclosure).not.toMatch(pattern)
  }
}

export function expectNoInternalBokunPublicWiring(source: string) {
  for (const pattern of FORBIDDEN_INTERNAL_BOKUN_PUBLIC_PATTERNS) {
    expect(source).not.toMatch(pattern)
  }
}
