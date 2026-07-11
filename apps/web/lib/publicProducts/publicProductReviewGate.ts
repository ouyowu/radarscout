import type { ReviewedEnrichmentOutput } from '@/lib/reviewedEnrichmentReader'
import type { PublicBookingPartnerHandoff } from './bookingPartnerHandoff'

type PublishGateInput = {
  enrichment: ReviewedEnrichmentOutput | null
  handoff: PublicBookingPartnerHandoff | null
}

function hasText(value: string | null): boolean {
  return Boolean(value?.trim())
}

export function isDatabaseProductPublishReady({
  enrichment,
  handoff,
}: PublishGateInput): boolean {
  if (!enrichment || !handoff) return false

  return hasText(enrichment.cleanedTitle) &&
    hasText(enrichment.shortSummary) &&
    enrichment.suggestedTags.length > 0 &&
    hasText(enrichment.reviewedBy) &&
    hasText(enrichment.reviewedAt)
}
