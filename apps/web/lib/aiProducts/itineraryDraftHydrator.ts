import 'server-only'
import type { AiProductContextItem } from './buildAiProductContext'
import type { ItineraryDraft } from './itineraryDraftSchema'

export const EXPERIENCE_DESCRIPTION_FALLBACK =
  'View this experience for verified details.'

export function hydrateItineraryExperienceFacts(params: {
  draft: ItineraryDraft
  allowedProducts: Map<string, AiProductContextItem>
}): ItineraryDraft {
  const { draft, allowedProducts } = params

  return {
    ...draft,
    days: draft.days.map(day => ({
      ...day,
      items: day.items.map(item => {
        if (item.type !== 'experience' || !item.productId) return { ...item }

        const product = allowedProducts.get(item.productId)
        if (!product) {
          throw new Error('Validated itinerary references an unavailable product')
        }

        return {
          ...item,
          title: product.title,
          description: product.summary?.trim() ? product.summary : EXPERIENCE_DESCRIPTION_FALLBACK,
        }
      }),
    })),
    warnings: [...draft.warnings],
  }
}
