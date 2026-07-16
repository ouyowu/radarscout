import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  isReviewedHandoffReadyProduct,
  runGatedItineraryPipeline,
} from './gated-itinerary-pipeline'

function handoffProduct(ctaHref: string) {
  return {
    id: 'viator_5567417p3',
    title: 'Reviewed Thailand experience',
    city: 'Bangkok',
    summary: 'A reviewed day-trip result.',
    tags: ['culture'],
    detailHref: '/tours/viator_5567417p3',
    retailPrice: null,
    currency: null,
    ctaHref,
    ctaLabel: 'Check availability' as const,
    ctaRel: 'nofollow sponsored noopener noreferrer' as const,
    externalHandoff: true,
  }
}

describe('isReviewedHandoffReadyProduct', () => {
  it('keeps reviewed Bókun widget handoffs eligible', () => {
    expect(isReviewedHandoffReadyProduct(handoffProduct(
      'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
    ))).toBe(true)
  })

  it('allows only reviewed Viator affiliate handoffs with an affiliate id', () => {
    expect(isReviewedHandoffReadyProduct(handoffProduct(
      'https://www.viator.com/tours/Bangkok/example/d343-5567417P3?pid=P00309837',
    ))).toBe(true)
    expect(isReviewedHandoffReadyProduct(handoffProduct(
      'https://www.viator.com/tours/Bangkok/example/d343-5567417P3',
    ))).toBe(false)
  })

  it('rejects arbitrary external links even when the card copy is otherwise safe', () => {
    expect(isReviewedHandoffReadyProduct(handoffProduct(
      'https://example.com/tours/bangkok?pid=P00309837',
    ))).toBe(false)
  })

  it('returns reviewed Viator products for a Phuket plan without live catalog retrieval', async () => {
    const result = await runGatedItineraryPipeline('Phuket 3 days Phi Phi islands by boat')

    expect(result.status).toBe('ok')
    if (result.status !== 'ok') return

    expect(result.handoffReadyProducts).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'viator_27424p2',
        city: 'Phuket',
        retailPrice: null,
        currency: null,
        ctaLabel: 'Check availability',
        ctaRel: 'nofollow sponsored noopener noreferrer',
        externalHandoff: true,
      }),
    ]))
    expect(result.handoffReadyProducts.every(product =>
      product.ctaHref?.startsWith('https://www.viator.com/'),
    )).toBe(true)
    expect(result.handoffReadyProducts.every(product =>
      product.retailPrice === null && product.currency === null,
    )).toBe(true)
    expect(result.handoffReadyProducts.every(product =>
      !Object.keys(product).some(key =>
        ['availability', 'inventory', 'reviews', 'rating', 'raw', 'supplier'].includes(key),
      ),
    )).toBe(true)
  })
})
