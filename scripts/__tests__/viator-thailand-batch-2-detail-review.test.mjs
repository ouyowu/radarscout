import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildViatorThailandBatch2DetailReview,
  fetchViatorProductDetailForReview,
} from '../viator-thailand-batch-2-detail-review.mjs'

const candidate = {
  city: 'Bangkok',
  destinationId: '343',
  productCode: '5553790P1',
  title: 'Floating market day trip',
  productUrl: 'https://www.viator.com/tours/Bangkok/floating-market/d343-5553790P1?pid=P00309837',
  imageUrl: 'https://images.example.test/floating-market.jpg',
  disposition: 'requires_detail_review',
  reason: 'requires_product_detail_review',
}

test('keeps only non-commercial product detail fields in the private detail review', async () => {
  const result = await fetchViatorProductDetailForReview(candidate, {
    apiKey: 'production-test-key',
    fetchFn: async () => new Response(JSON.stringify({
      productCode: '5553790P1',
      destinations: [{ ref: '343', primary: true }, { ref: '764', primary: false }],
      description: 'A market and canal day trip from Bangkok.',
      inclusions: [{ otherDescription: 'Lunch' }],
      exclusions: [{ description: 'Personal expenses' }],
      itinerary: { duration: { fixedDurationInMinutes: 420 } },
      logistics: {
        travelerPickup: {
          pickupOptionType: 'PICKUP_EVERYONE',
          allowCustomTravelerPickup: false,
          locations: [{ locationName: 'Central Bangkok hotels' }],
          minutesBeforeDepartureTimeForPickup: 30,
        },
        start: [{ time: '18:00' }],
        end: [{ time: '22:00' }],
      },
      pricingInfo: { pricingType: 'PER_PERSON' },
      bookingRequirements: { minTravelers: 1 },
      supplier: { name: 'Not public' },
      reviews: { totalReviews: 100 },
    }), { status: 200 }),
  })

  assert.deepEqual(result, {
    ok: true,
    detail: {
      city: 'Bangkok',
      destinationId: '343',
      productCode: '5553790P1',
      title: 'Floating market day trip',
      productUrl: 'https://www.viator.com/tours/Bangkok/floating-market/d343-5553790P1?pid=P00309837',
      imageUrl: 'https://images.example.test/floating-market.jpg',
      primaryDestinationId: '343',
      description: 'A market and canal day trip from Bangkok.',
      inclusionHighlights: ['Lunch'],
      exclusionHighlights: ['Personal expenses'],
      durationMinutes: 420,
      pickup: {
        optionType: 'PICKUP_EVERYONE',
        allowCustomTravelerPickup: false,
        locations: ['Central Bangkok hotels'],
        leadMinutes: 30,
      },
      schedule: {
        startTimes: ['18:00'],
        endTimes: ['22:00'],
      },
      pendingHumanReviewFields: [
        'childPolicy',
        'ethicalAttributes',
        'fitnessLevel',
        'pickupTravelTimeFromUserLocation',
        'returnBeforeTime',
      ],
    },
  })
})

test('omits unsupported logistics values instead of preserving provider raw fields', async () => {
  const result = await fetchViatorProductDetailForReview(candidate, {
    apiKey: 'production-test-key',
    fetchFn: async () => new Response(JSON.stringify({
      productCode: '5553790P1',
      logistics: {
        travelerPickup: {
          pickupOptionType: 'PICKUP_EVERYONE',
          locations: [{ locationName: 'Central Bangkok hotels', raw: { supplier: 'private' } }],
          raw: { internal: true },
        },
        start: [{ time: '18:00', price: 99 }],
        end: [{ time: '22:00', availability: true }],
      },
      raw: { supplier: { name: 'private' } },
    }), { status: 200 }),
  })

  assert.deepEqual(result, {
    ok: true,
    detail: {
      city: 'Bangkok',
      destinationId: '343',
      productCode: '5553790P1',
      title: 'Floating market day trip',
      productUrl: 'https://www.viator.com/tours/Bangkok/floating-market/d343-5553790P1?pid=P00309837',
      imageUrl: 'https://images.example.test/floating-market.jpg',
      primaryDestinationId: null,
      description: null,
      inclusionHighlights: [],
      exclusionHighlights: [],
      durationMinutes: null,
      pickup: {
        optionType: 'PICKUP_EVERYONE',
        allowCustomTravelerPickup: null,
        locations: ['Central Bangkok hotels'],
        leadMinutes: null,
      },
      schedule: {
        startTimes: ['18:00'],
        endTimes: ['22:00'],
      },
      pendingHumanReviewFields: [
        'childPolicy',
        'ethicalAttributes',
        'fitnessLevel',
        'pickupTravelTimeFromUserLocation',
        'returnBeforeTime',
      ],
    },
  })
})

test('fails closed when the Viator product code does not match the reviewed candidate', async () => {
  const result = await fetchViatorProductDetailForReview(candidate, {
    apiKey: 'production-test-key',
    fetchFn: async () => new Response(JSON.stringify({ productCode: 'OTHER' }), { status: 200 }),
  })

  assert.deepEqual(result, { ok: false, reason: 'mismatched_product' })
})

test('waits for Retry-After and retries a rate-limited product detail once', async () => {
  const waits = []
  let requestCount = 0
  const result = await fetchViatorProductDetailForReview(candidate, {
    apiKey: 'production-test-key',
    sleepFn: async (milliseconds) => waits.push(milliseconds),
    fetchFn: async () => {
      requestCount += 1
      if (requestCount === 1) {
        return new Response(null, { status: 429, headers: { 'Retry-After': '2' } })
      }
      return new Response(JSON.stringify({
        productCode: '5553790P1',
        description: 'A market and canal day trip from Bangkok.',
      }), { status: 200 })
    },
  })

  assert.equal(result.ok, true)
  assert.equal(requestCount, 2)
  assert.deepEqual(waits, [2_000])
})

test('fails closed when the Viator detail request exceeds its timeout', async () => {
  const result = await fetchViatorProductDetailForReview(candidate, {
    apiKey: 'production-test-key',
    requestTimeoutMs: 5,
    fetchFn: (_url, options) => new Promise((_, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')))
    }),
  })

  assert.deepEqual(result, { ok: false, reason: 'upstream_timeout' })
})

test('builds a private detail-review bundle only for candidates that passed title triage', async () => {
  const result = await buildViatorThailandBatch2DetailReview({
    status: 'detail_review_required',
    candidates: [
      candidate,
      { ...candidate, productCode: '5567417P3', disposition: 'already_public' },
    ],
  }, {
    apiKey: 'production-test-key',
    fetchedAt: '2026-07-16T00:00:00.000Z',
    fetchProduct: async (value) => ({
      ok: true,
      detail: { ...value, description: 'Safe summary source.', inclusionHighlights: [], exclusionHighlights: [], durationMinutes: null },
    }),
  })

  assert.equal(result.ok, true)
  assert.equal(result.review.status, 'pending_human_detail_review')
  assert.equal(result.review.candidateCount, 1)
  assert.equal(result.review.candidates[0].productCode, '5553790P1')
})

test('accepts the expanded title-review pool status without weakening candidate gating', async () => {
  const result = await buildViatorThailandBatch2DetailReview({
    status: 'title_review_complete_detail_review_pending',
    candidates: [candidate],
  }, {
    apiKey: 'production-test-key',
    fetchProduct: async (value) => ({
      ok: true,
      detail: { ...value, description: 'Safe summary source.', inclusionHighlights: [], exclusionHighlights: [], durationMinutes: null },
    }),
  })

  assert.equal(result.ok, true)
  assert.equal(result.review.candidateCount, 1)
})
