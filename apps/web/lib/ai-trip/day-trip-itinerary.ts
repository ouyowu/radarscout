import type { AiProductContextItem } from '../aiProducts/buildAiProductContext'
import { isReviewedViatorAffiliateUrl } from '../viator/reviewedViatorMatching'
import type { DayTripItinerary, DayTripSpec } from './itinerary-contract'

const MAX_ITINERARY_DAYS = 7
const SAFE_HANDOFF_REL = 'nofollow sponsored noopener noreferrer'

type DayTripIntentInput = Omit<DayTripSpec, 'contentScope'>

function isSafeDayTripProduct(product: AiProductContextItem) {
  return product.externalHandoff === true
    && product.ctaLabel === 'Check availability'
    && product.ctaRel === SAFE_HANDOFF_REL
    && typeof product.ctaHref === 'string'
    && isReviewedViatorAffiliateUrl(product.ctaHref)
}

export function buildDayTripItinerary(
  intent: DayTripIntentInput,
  products: AiProductContextItem[],
): DayTripItinerary | null {
  if (!intent.destination || !Number.isInteger(intent.durationDays) || intent.durationDays <= 0) {
    return null
  }

  const durationDays = Math.min(intent.durationDays, MAX_ITINERARY_DAYS)
  const safeProducts = products.filter(isSafeDayTripProduct).slice(0, durationDays)

  if (safeProducts.length === 0) return null

  return {
    version: 1,
    tripSpec: {
      ...intent,
      durationDays,
      interests: [...intent.interests],
      contentScope: 'day_tours_only',
    },
    days: safeProducts.map((product, index) => ({
      dayNumber: index + 1,
      experience: {
        productId: product.id,
        title: product.title,
        city: product.city,
        summary: product.summary,
        imageUrl: product.imageUrl ?? null,
        imageAlt: product.imageAlt ?? null,
        tags: [...product.tags],
        detailHref: product.detailHref,
        handoff: {
          label: 'Check availability',
          href: product.ctaHref as string,
          rel: SAFE_HANDOFF_REL,
        },
      },
    })),
    unfilledDayCount: durationDays - safeProducts.length,
    safety: {
      availabilityChecked: false,
      bookingCompleted: false,
      paymentHandled: false,
    },
  }
}
