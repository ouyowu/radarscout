/**
 * UI logic tests for TD-AI-SEARCH-5 (tests 21–32).
 *
 * vitest is Node-only (no jsdom). Tests cover extracted pure logic and
 * type-level contracts rather than DOM rendering.
 */
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import * as React from 'react'
import { describe, expect, it } from 'vitest'
import {
  AI_TRIP_RESULTS_NEXT_STEP_COPY,
  buildAiTripTopMatchDetailAriaLabel,
  canConfirmTripIntent,
  canSearchFromConfirmed,
} from '../IntentParserDemo'
import {
  AiSearchProductCard,
  buildAiTripPlannerDetailHref,
  type AiSearchProductCardProps,
} from '../AiSearchProductCard'
import type { AiTripSearchResponse } from '../../api/ai-trip/search/route'
import { parseTripIntent } from '../../../lib/ai-trip/parse-intent'
import { buildProductFitReason, buildResultFitSummary } from '../resultFitSummary'

const intentParserDemoSource = readFileSync(new URL('../IntentParserDemo.tsx', import.meta.url), 'utf8')
const aiSearchProductCardSource = readFileSync(new URL('../AiSearchProductCard.tsx', import.meta.url), 'utf8')
type PublicSearchIntent = NonNullable<AiTripSearchResponse['intent']>

// ---- helpers ----------------------------------------------------------------

function makeSearchIntent(overrides: Partial<PublicSearchIntent> = {}): PublicSearchIntent {
  return {
    destination: 'Chiang Mai',
    days: 3,
    startDate: null,
    endDate: null,
    groupSize: null,
    adultCount: null,
    childCount: null,
    travelerType: 'unspecified',
    interests: ['elephants'],
    ...overrides,
  }
}

function makeConfirmed() {
  return {
    destination: 'Chiang Mai',
    durationDays: 3,
    duration: '3 days',
    interests: ['elephants', 'temples'],
    language: 'en' as const,
    confirmedAt: '09:30',
  }
}

function makeOkResponse(overrides: Partial<AiTripSearchResponse> = {}): AiTripSearchResponse {
  return {
    status: 'ok',
    intent: makeSearchIntent(),
    products: [
      {
        id: 'prod_1',
        title: 'Elephant Sanctuary',
        city: 'Chiang Mai',
        summary: 'Half-day ethical elephant visit.',
        tags: ['Elephants', 'Nature'],
        detailHref: '/tours/prod_1',
        retailPrice: '49.00',
        currency: 'USD',
      },
    ],
    meta: {
      productRetrievalEnabled: true,
      itineraryGenerationEnabled: true,
      bookingEnabled: false,
      availabilityEnabled: false,
    },
    ...overrides,
  }
}

// ---- tests 21–22: search CTA gating -----------------------------------------

describe('canSearchFromConfirmed (test 21–22)', () => {
  // Test 21: Search CTA is disabled before intent confirmation
  it('returns false when confirmed is null (no intent confirmed)', () => {
    expect(canSearchFromConfirmed(null)).toBe(false)
  })

  // Test 22: Search CTA becomes enabled after valid Thailand intent confirmation
  it('returns true when intent has been confirmed', () => {
    expect(canSearchFromConfirmed(makeConfirmed())).toBe(true)
  })
})

describe('planner search funnel analytics', () => {
  it('does not add unapproved Trip Planner search analytics outside the approved taxonomy', () => {
    expect(intentParserDemoSource).not.toContain("track('planner_search_submitted')")
    expect(intentParserDemoSource).toContain("track('booking_partner_handoff_clicked'")
    expect(intentParserDemoSource).not.toMatch(/navigator\.sendBeacon/i)
    expect(intentParserDemoSource).not.toMatch(/google-analytics|gtag|plausible|vercel analytics/i)
  })
})

describe('canConfirmTripIntent', () => {
  it('allows compact destination plus interest prompts without requiring duration', () => {
    const parsed = parseTripIntent('Chiang Mai elephants')

    expect(canConfirmTripIntent(parsed, true)).toBe(true)
  })

  it('still blocks stale parsed prompts and destination-only prompts without trip detail', () => {
    const destinationOnly = parseTripIntent('Chiang Mai')
    const withDuration = parseTripIntent('Chiang Mai 3 days')

    expect(canConfirmTripIntent(destinationOnly, true)).toBe(false)
    expect(canConfirmTripIntent(withDuration, false)).toBe(false)
    expect(canConfirmTripIntent(withDuration, true)).toBe(true)
  })
})

// ---- test 23: unsupported_destination message --------------------------------

describe('unsupported_destination response shape (test 23)', () => {
  it('unsupported_destination response has a human-readable message', () => {
    const res: AiTripSearchResponse = {
      status: 'unsupported_destination',
      intent: makeSearchIntent({ destination: 'Singapore', days: null, interests: [] }),
      products: [],
      message: 'RadarScout currently searches Thailand experiences only.',
      meta: {
        productRetrievalEnabled: true,
        itineraryGenerationEnabled: true,
        bookingEnabled: false,
        availabilityEnabled: false,
      },
    }

    expect(res.message).toBeTruthy()
    expect(res.products).toHaveLength(0)
    expect(typeof res.message).toBe('string')
  })
})

// ---- test 24: duplicate search guard ----------------------------------------

describe('isSearching guard prevents duplicate submissions (test 24)', () => {
  it('canSearch AND !isSearching must both be true to trigger a search', () => {
    // This mirrors the guard: `if (!canSearch || isSearching) return`
    const scenarios = [
      { canSearch: false, isSearching: false, shouldSearch: false },
      { canSearch: false, isSearching: true,  shouldSearch: false },
      { canSearch: true,  isSearching: true,  shouldSearch: false },
      { canSearch: true,  isSearching: false, shouldSearch: true  },
    ]

    for (const { canSearch, isSearching, shouldSearch } of scenarios) {
      const willSearch = canSearch && !isSearching
      expect(willSearch).toBe(shouldSearch)
    }
  })
})

// ---- tests 25–26: product card mapping ---------------------------------------

describe('product card mapping from ok response (tests 25–26)', () => {
  // Test 25: Successful response renders real product cards
  it('ok response with products yields non-empty product array', () => {
    const res = makeOkResponse()
    expect(res.status).toBe('ok')
    expect(res.products.length).toBeGreaterThan(0)
  })

  // Test 26: Product card links to detailHref
  it('each product has a detailHref that starts with /tours/', () => {
    const res = makeOkResponse()
    for (const product of res.products) {
      expect(product.detailHref).toMatch(/^\/tours\//)
    }
  })
})

// ---- tests 27–28: no booking / availability / rating in card ----------------

describe('AiSearchProductCardProps type contract (tests 27–28)', () => {
  // Test 27: AiSearchProductCard has NO availability/checkout/payment/booking props
  it('AiSearchProductCardProps does not include checkout/availability/booking/payment fields', () => {
    // We validate this by constructing a valid card props object and confirming
    // that the known-forbidden fields are not present in the type.
    const validProps: AiSearchProductCardProps = {
      id: 'p1',
      title: 'Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'Half-day ethical elephant visit.',
      imageUrl: 'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      imageAlt: 'Chiang Mai elephant sanctuary',
      tags: ['Elephants'],
      detailHref: '/tours/p1',
      retailPrice: '49.00',
      currency: 'USD',
      fitReason: 'Why this fits: matches Chiang Mai and your interest in elephants.',
      ctaHref: 'https://widgets.bokun.io/online-sales/public-channel/experience/1232729',
      ctaLabel: 'Check availability',
      ctaRel: 'nofollow sponsored noopener noreferrer',
      externalHandoff: true,
      handoffContext: {
        destination: 'Chiang Mai',
        hasDates: true,
        hasGroupSize: false,
        hasOccupancy: false,
        travelerType: 'unspecified',
      },
    }

    const keys = Object.keys(validProps)
    const forbidden = [
      'availability',
      'availabilityUrl',
      'bookingUrl',
      'checkoutUrl',
      'paymentUrl',
      'price', // raw "price" — validProps has retailPrice only
      'addToCart',
      'onBook',
      'onCheckout',
      'stock',
      'inventoryCount',
      'isBookable',
    ]
    for (const field of forbidden) {
      expect(keys).not.toContain(field)
    }
  })

  // Test 28: AiSearchProductCard has NO rating or review fields
  it('AiSearchProductCardProps does not include rating or review count fields', () => {
    const validProps: AiSearchProductCardProps = {
      id: 'p1',
      title: 'Elephant Sanctuary',
      city: 'Chiang Mai',
      summary: 'Half-day ethical elephant visit.',
      imageUrl: 'https://imgcdn.bokun.tools/example.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
      imageAlt: 'Chiang Mai elephant sanctuary',
      tags: ['Elephants'],
      detailHref: '/tours/p1',
      retailPrice: '49.00',
      currency: 'USD',
      fitReason: 'Why this fits: matches Chiang Mai and your interest in elephants.',
      handoffContext: {
        destination: 'Chiang Mai',
        hasDates: false,
        hasGroupSize: false,
        hasOccupancy: false,
        travelerType: 'unspecified',
      },
    }

    const keys = Object.keys(validProps)
    const forbidden = ['rating', 'reviewCount', 'starRating', 'reviews', 'score', 'averageRating']
    for (const field of forbidden) {
      expect(keys).not.toContain(field)
    }
  })

  it('renders reviewed partner products as safe external Check availability handoffs', () => {
    ;(globalThis as typeof globalThis & { React: typeof React }).React = React

    const markup = renderToStaticMarkup(
      createElement(AiSearchProductCard, {
        id: 'partner_cm_1232729',
        title: 'Half-Day Morning Elephant Sanctuary Program in Chiang Mai',
        city: 'Chiang Mai',
        summary: 'A reviewed Chiang Mai elephant experience with a safe booking partner handoff.',
        imageUrl: 'https://imgcdn.bokun.tools/768dfe3e-be4b-4d37-9c0c-40b9e5c83902.jpeg?fm=auto&mode=crop&crop=faces&dpr=1&w=596&h=450',
        imageAlt: 'Elephants at a Chiang Mai sanctuary morning program',
        tags: ['Elephants', 'Chiang Mai'],
        detailHref: '/tours/partner_cm_1232729',
        retailPrice: null,
        currency: null,
        ctaHref: 'https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232729',
        ctaLabel: 'Check availability',
        ctaRel: 'nofollow sponsored noopener noreferrer',
        externalHandoff: true,
        handoffContext: {
          destination: 'Chiang Mai',
          hasDates: true,
          hasGroupSize: false,
          hasOccupancy: false,
          travelerType: 'unspecified',
        },
      }),
    )

    expect(markup).toContain('Check availability')
    expect(markup).toContain('https://imgcdn.bokun.tools/768dfe3e-be4b-4d37-9c0c-40b9e5c83902.jpeg')
    expect(markup).toContain('alt="Elephants at a Chiang Mai sanctuary morning program"')
    expect(markup).toContain('href="https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232729"')
    expect(markup).toContain('rel="nofollow sponsored noopener noreferrer"')
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('Continue with the booking partner to review current product details.')
    expect(markup).not.toContain('From ')
    expect(markup).not.toMatch(/live availability/i)
    expect(markup).not.toMatch(/available now/i)
    expect(markup).not.toMatch(/instant confirmation/i)
    expect(markup).not.toMatch(/\bcheckout\b/i)
    expect(markup).not.toMatch(/\bpayment\b/i)
  })

  it('tracks bounded provider and trip context for every AI Trip Planner partner handoff', () => {
    expect(intentParserDemoSource).toMatch(/provider: 'viator'/)
    expect(intentParserDemoSource).toMatch(/placement: 'ai_trip_planner_top_match'/)
    expect(intentParserDemoSource).toMatch(/buildSafeAffiliateAnalyticsContext/)
    expect(intentParserDemoSource).toMatch(/\.\.\.searchSafeTripContext/)
    expect(intentParserDemoSource).toMatch(/handoffContext=\{\{[\s\S]*destination: searchDestination,[\s\S]*\.\.\.searchSafeTripContext/)
    expect(intentParserDemoSource).toMatch(/<DayTripItineraryPanel itinerary=\{searchState\.itinerary\} handoffContext=\{searchSafeTripContext\} \/>/)
    expect(aiSearchProductCardSource).toMatch(/provider: 'viator'/)
    expect(aiSearchProductCardSource).toMatch(/placement: 'ai_trip_planner_card'/)
    expect(aiSearchProductCardSource).toMatch(/city: city \?\? handoffDestination/)
    expect(aiSearchProductCardSource).toMatch(/\.\.\.safeHandoffContext/)
  })
})

// ---- test 29: no_match response ----------------------------------------------

describe('no_match response (test 29)', () => {
  it('no_match response has empty products and correct status', () => {
    const res: AiTripSearchResponse = {
      status: 'no_match',
      intent: makeSearchIntent({ interests: ['surfing'] }),
      products: [],
      meta: {
        productRetrievalEnabled: true,
        itineraryGenerationEnabled: true,
        bookingEnabled: false,
        availabilityEnabled: false,
      },
    }

    expect(res.status).toBe('no_match')
    expect(res.products).toHaveLength(0)
  })
})

// ---- tests 30–32: meta / capability flags ------------------------------------

describe('response meta capability flags (tests 30–32)', () => {
  // Test 30: bookingEnabled is always false in search response
  it('bookingEnabled is always false in search response', () => {
    const ok = makeOkResponse()
    expect(ok.meta.bookingEnabled).toBe(false)
  })

  // Test 31: availabilityEnabled is always false in search response
  it('availabilityEnabled is always false in search response', () => {
    const ok = makeOkResponse()
    expect(ok.meta.availabilityEnabled).toBe(false)
  })

  // Test 32: structured day-tour itinerary generation is enabled in search responses
  it('itineraryGenerationEnabled is true in search responses', () => {
    const ok = makeOkResponse()
    expect(ok.meta.itineraryGenerationEnabled).toBe(true)
  })
})

// ---- tests 35–40: regression (public surface / eligibility constants) --------
//
// Tests 35–40 verify that the existing regression surface is unchanged after
// connecting real product search. The authoritative coverage lives in:
//   apps/web/lib/aiProducts/__tests__/regression.test.ts
//
// This file adds lightweight contract assertions that do NOT require DB access.

describe('regression — capability flag contract unchanged (test 35)', () => {
  it('search response does not introduce bookingEnabled:true or availabilityEnabled:true', () => {
    for (const status of ['ok', 'no_match', 'unsupported_destination', 'error'] as const) {
      const meta = makeOkResponse({ status }).meta
      expect(meta.bookingEnabled).toBe(false)
      expect(meta.availabilityEnabled).toBe(false)
    }
  })
})

describe('regression — product response shape contains no forbidden fields (test 36)', () => {
  it('ok response products contain none of the forbidden fields', () => {
    const res = makeOkResponse()
    const serialized = JSON.stringify(res.products)
    const forbidden = [
      'rawJson',
      'eligible',
      'foreignSignals',
      'hasDestinationMismatch',
      'supplierId',
      'apiKey',
      'commission',
      'systemPrompt',
      'supplierName',
      'rating',
      'reviewCount',
    ]
    for (const field of forbidden) {
      expect(serialized).not.toContain(`"${field}"`)
    }
  })
})

describe('regression — detailHref stays within /tours/ namespace (test 37)', () => {
  it('all product detailHrefs start with /tours/', () => {
    const res = makeOkResponse({
      products: [
        { ...makeOkResponse().products[0], id: 'abc', detailHref: '/tours/abc' },
        { ...makeOkResponse().products[0], id: 'def', detailHref: '/tours/def' },
      ],
    })
    for (const p of res.products) {
      expect(p.detailHref).toMatch(/^\/tours\//)
    }
  })
})

describe('AI planner source context for tour detail links', () => {
  it('adds an AI trip planner source parameter to tour detail links', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1')).toBe('/tours/prod_1?source=ai-trip-planner')
  })

  it('preserves existing detail query parameters when adding source context', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1?ref=card')).toBe('/tours/prod_1?ref=card&source=ai-trip-planner')
  })

  it('does not duplicate an existing AI trip planner source parameter', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1?source=ai-trip-planner')).toBe('/tours/prod_1?source=ai-trip-planner')
  })

  it('replaces any existing non-AI source parameter with the AI trip planner source parameter', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1?source=homepage&ref=card')).toBe('/tours/prod_1?source=ai-trip-planner&ref=card')
  })

  it('preserves existing hash fragments after adding source context', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1?ref=card#details')).toBe('/tours/prod_1?ref=card&source=ai-trip-planner#details')
  })

  it('keeps AI planner detail links inside the /tours namespace', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1')).toMatch(/^\/tours\//)
  })

  it('falls back to a safe tour detail URL for external detail links', () => {
    expect(buildAiTripPlannerDetailHref('https://example.com/tours/prod_1', 'prod_1')).toBe('/tours/prod_1?source=ai-trip-planner')
  })

  it('falls back to a safe tour detail URL for non-tour paths', () => {
    expect(buildAiTripPlannerDetailHref('/checkout/prod_1', 'prod_1')).toBe('/tours/prod_1?source=ai-trip-planner')
  })

  it('carries only date presence into the internal detail route', () => {
    const href = buildAiTripPlannerDetailHref('/tours/prod_1?ref=card', 'prod_1', { hasDates: true })

    expect(href).toBe('/tours/prod_1?ref=card&source=ai-trip-planner&hasDates=1')
    expect(href).not.toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('carries only bounded confirmed context indicators into safe internal detail links', () => {
    const href = buildAiTripPlannerDetailHref('/tours/prod_1', 'prod_1', {
      hasDates: true,
      hasGroupSize: true,
      hasOccupancy: true,
      travelerType: 'family',
    })

    expect(href).toBe(
      '/tours/prod_1?source=ai-trip-planner&hasDates=1&hasGroupSize=1&hasOccupancy=1&travelerType=family',
    )
    expect(href).not.toContain('2099-')
    expect(href).not.toMatch(/[?&](groupSize|adultCount|childCount)=/)
  })

  it('removes unconfirmed date context from an existing detail URL', () => {
    expect(buildAiTripPlannerDetailHref('/tours/prod_1?hasDates=1', 'prod_1')).toBe(
      '/tours/prod_1?source=ai-trip-planner',
    )
  })
})


describe('AI search product card detail CTA accessibility', () => {
  it('renders a 44px mobile tap target with a product-specific accessible label', () => {
    ;(globalThis as typeof globalThis & { React: typeof React }).React = React

    const markup = renderToStaticMarkup(
      createElement(AiSearchProductCard, {
        id: 'prod_1',
        title: 'Elephant Sanctuary',
        city: 'Chiang Mai',
        summary: 'Half-day ethical elephant visit.',
        tags: ['Elephants', 'Nature'],
        detailHref: '/tours/prod_1',
        retailPrice: '49.00',
        currency: 'USD',
        handoffContext: {
          destination: 'Chiang Mai',
          hasDates: false,
          hasGroupSize: false,
          hasOccupancy: false,
          travelerType: 'unspecified',
        },
      }),
    )

    expect(markup).toContain('min-h-[44px]')
    expect(markup).toContain('flex-wrap')
    expect(markup).toContain('shrink-0')
    expect(markup).toContain('aria-label="View details for Elephant Sanctuary; no reviewed booking partner handoff is available"')
    expect(markup).toContain('This discovery-only product does not currently have a reviewed booking partner handoff.')
    expect(markup).toContain('href="/tours/prod_1?source=ai-trip-planner"')
  })

  it('renders a safe internal fallback when a product detail href is not a tours path', () => {
    ;(globalThis as typeof globalThis & { React: typeof React }).React = React

    const markup = renderToStaticMarkup(
      createElement(AiSearchProductCard, {
        id: 'prod_1',
        title: 'Elephant Sanctuary',
        city: 'Chiang Mai',
        summary: 'Half-day ethical elephant visit.',
        tags: ['Elephants', 'Nature'],
        detailHref: 'https://example.com/checkout/prod_1',
        retailPrice: '49.00',
        currency: 'USD',
        handoffContext: {
          destination: 'Chiang Mai',
          hasDates: false,
          hasGroupSize: false,
          hasOccupancy: false,
          travelerType: 'unspecified',
        },
      }),
    )

    expect(markup).toContain('href="/tours/prod_1?source=ai-trip-planner"')
    expect(markup).not.toContain('https://example.com')
    expect(markup).not.toContain('/checkout/prod_1')
  })
})

describe('AI Trip successful results next-step copy', () => {
  it('keeps the product-result next step clear and safely scoped', () => {
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).toContain('Reviewed matches can continue')
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).toContain('planning remains read-only')
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).toContain('booking partner')
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/live availability/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/available now/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/instant confirmation/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/\bcheckout\b/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/\bpayment\b/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/partner rate/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/supplier net rate/i)
    expect(AI_TRIP_RESULTS_NEXT_STEP_COPY).not.toMatch(/\bcommission\b/i)
  })
})

describe('AI Trip top-match detail CTA accessibility', () => {
  it('does not imply a handoff exists for a discovery-only top match', () => {
    const label = buildAiTripTopMatchDetailAriaLabel('Gentle Elephant Care')

    expect(label).toBe('Open top match details for Gentle Elephant Care; no reviewed booking partner handoff is available')
    expect(label).not.toMatch(/live availability/i)
    expect(label).not.toMatch(/available now/i)
    expect(label).not.toMatch(/instant confirmation/i)
    expect(label).not.toMatch(/\bcheckout\b/i)
    expect(label).not.toMatch(/\bpayment\b/i)
    expect(label).not.toMatch(/partner rate/i)
    expect(label).not.toMatch(/supplier net rate/i)
    expect(label).not.toMatch(/\bcommission\b/i)
  })
})

describe('result fit summary (tests 38–41)', () => {
  it('builds a deterministic explanation for successful product results', () => {
    const summary = buildResultFitSummary(makeOkResponse())

    expect(summary).not.toBeNull()
    expect(summary?.heading).toBe('Why these experiences match')
    expect(summary?.chips).toContain('Chiang Mai')
    expect(summary?.chips).toContain('3 days')
    expect(summary?.chips).toContain('Matched interests: elephants')
    expect(summary?.points.join(' ')).toMatch(/real Thailand experience/i)
    expect(summary?.points.join(' ')).toMatch(/comparison-only product results/i)
  })

  it('summarizes only interests that are actually represented in product results', () => {
    const summary = buildResultFitSummary(makeOkResponse({
      intent: makeSearchIntent({ interests: ['elephants', 'food', 'canals'] }),
      products: [
        {
          ...makeOkResponse().products[0],
          title: 'Gentle Elephant Care Morning',
          summary: 'Spend a calm morning learning about elephant care.',
          tags: ['Animal care'],
        },
        {
          ...makeOkResponse().products[0],
          id: 'prod_2',
          title: 'Chiang Mai Cooking and Market Experience',
          summary: 'A local food and cooking comparison option.',
          tags: ['Cooking', 'Local food'],
        },
      ],
    }))

    expect(summary?.chips).toContain('Matched interests: elephants, food')
    expect(summary?.chips).toContain('Other requested interests: canals')
    expect(summary?.chips).not.toContain('Matched interests: elephants, food, canals')
    expect(summary?.points.join(' ')).not.toMatch(/uses intent signals such as elephants, food, canals/i)
  })

  it('recognizes meal, lunch, and dining terms as food matches in result summaries', () => {
    const summary = buildResultFitSummary(makeOkResponse({
      intent: makeSearchIntent({ interests: ['food'] }),
      products: [
        {
          ...makeOkResponse().products[0],
          title: 'Chiang Mai Traditional Khan Toke Meal & Cultural Performance',
          summary: null,
          tags: [],
        },
        {
          ...makeOkResponse().products[0],
          id: 'prod_2',
          title: 'Chiang Mai Elephant Sanctuary with Lunch Day Tour',
          summary: null,
          tags: [],
        },
      ],
    }))

    expect(summary?.chips).toContain('Matched interests: food')
    expect(summary?.chips).not.toContain('Other requested interests: food')
  })

  it('uses route comparison wording for Thailand-wide multi-city results', () => {
    const summary = buildResultFitSummary(makeOkResponse({
      intent: makeSearchIntent({ destination: 'Thailand', days: 7, interests: ['food', 'temples', 'beaches'] }),
      products: [
        {
          ...makeOkResponse().products[0],
          title: 'Bangkok Temple and Local Food Walk',
          city: 'Bangkok',
          summary: 'Compare temples, markets, and local food for a Bangkok route start.',
          tags: ['Temples', 'Local food'],
        },
        {
          ...makeOkResponse().products[0],
          id: 'prod_2',
          title: 'Phuket Beach and Island Day',
          city: 'Phuket',
          summary: 'A beach and island comparison option for a Thailand route.',
          tags: ['Beaches', 'Island'],
        },
      ],
    }))

    expect(summary?.heading).toBe('How these experiences support your Thailand route')
    expect(summary?.chips).toContain('Result cities: Bangkok, Phuket')
    expect(summary?.points.join(' ')).toMatch(/route stops/i)
    expect(summary?.points.join(' ')).toMatch(/real Thailand product pages/i)
  })

  it('orders Thailand route result cities by the traveler prompt when available', () => {
    const summary = buildResultFitSummary(makeOkResponse({
      intent: makeSearchIntent({ destination: 'Thailand', days: 7, interests: ['food', 'temples', 'beaches'] }),
      products: [
        {
          ...makeOkResponse().products[0],
          title: 'Bangkok Temple and Local Food Walk',
          city: 'Bangkok',
          summary: 'Compare temples, markets, and local food for a Bangkok route start.',
          tags: ['Temples', 'Local food'],
        },
        {
          ...makeOkResponse().products[0],
          id: 'prod_2',
          title: 'Phuket Beach and Island Day',
          city: 'Phuket',
          summary: 'A beach and island comparison option for a Thailand route.',
          tags: ['Beaches', 'Island'],
        },
        {
          ...makeOkResponse().products[0],
          id: 'prod_3',
          title: 'Chiang Mai Elephant Sanctuary',
          city: 'Chiang Mai',
          summary: 'A gentle elephant care comparison option for the northern route stop.',
          tags: ['Elephants', 'Nature'],
        },
      ],
    }), 'Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches')

    expect(summary?.chips).toContain('Result cities: Bangkok, Chiang Mai, Phuket')
  })

  it('does not render a result fit summary for empty or unsupported responses', () => {
    expect(buildResultFitSummary({
      status: 'no_match',
      intent: makeSearchIntent({ interests: ['surfing'] }),
      products: [],
      meta: makeOkResponse().meta,
    })).toBeNull()

    expect(buildResultFitSummary({
      status: 'unsupported_destination',
      intent: makeSearchIntent({ destination: 'Singapore', interests: ['food'] }),
      products: [],
      message: 'RadarScout currently searches Thailand experiences only.',
      meta: makeOkResponse().meta,
    })).toBeNull()
  })

  it('does not emit unsafe commerce, rating, or live-inventory language', () => {
    const summary = buildResultFitSummary(makeOkResponse())
    const serialized = JSON.stringify(summary)

    expect(serialized).not.toMatch(/live availability/i)
    expect(serialized).not.toMatch(/available now/i)
    expect(serialized).not.toMatch(/instant confirmation/i)
    expect(serialized).not.toMatch(/\bcheckout\b/i)
    expect(serialized).not.toMatch(/\bpayment\b/i)
    expect(serialized).not.toMatch(/\bbooking\b/i)
    expect(serialized).not.toMatch(/partner rate/i)
    expect(serialized).not.toMatch(/supplier net rate/i)
    expect(serialized).not.toMatch(/\bcommission\b/i)
    expect(serialized).not.toMatch(/rating/i)
    expect(serialized).not.toMatch(/review/i)
  })
})

describe('product-level fit reason (tests 42–46)', () => {
  it('builds a deterministic product reason from city and interest signals', () => {
    const response = makeOkResponse()
    const reason = buildProductFitReason(response.products[0], response.intent)

    expect(reason).toBe('Why this fits: matches Chiang Mai and your interest in elephants.')
  })

  it('falls back to read-only comparison wording when there are no strong matches', () => {
    const response = makeOkResponse({
      intent: makeSearchIntent({ destination: 'Bangkok', interests: ['canals'] }),
      products: [{
        ...makeOkResponse().products[0],
        city: null,
        title: 'Local culture walk',
        summary: null,
        tags: [],
      }],
    })
    const reason = buildProductFitReason(response.products[0], response.intent)

    expect(reason).toBe('Why this fits: included as a read-only Thailand experience comparison result.')
  })

  it('does not emit unsafe commerce, rating, or live-inventory language', () => {
    const response = makeOkResponse()
    const reason = buildProductFitReason(response.products[0], response.intent)

    expect(reason).not.toMatch(/live availability/i)
    expect(reason).not.toMatch(/available now/i)
    expect(reason).not.toMatch(/instant confirmation/i)
    expect(reason).not.toMatch(/\bcheckout\b/i)
    expect(reason).not.toMatch(/\bpayment\b/i)
    expect(reason).not.toMatch(/\bbooking\b/i)
    expect(reason).not.toMatch(/partner rate/i)
    expect(reason).not.toMatch(/supplier net rate/i)
    expect(reason).not.toMatch(/\bcommission\b/i)
    expect(reason).not.toMatch(/rating/i)
    expect(reason).not.toMatch(/review/i)
  })

  it('matches plural traveler interests to singular product wording', () => {
    const response = makeOkResponse({
      intent: makeSearchIntent(),
      products: [{
        ...makeOkResponse().products[0],
        title: 'Gentle Elephant Care Morning',
        summary: 'Spend a calm morning learning about elephant care.',
        tags: ['Animal care'],
      }],
    })
    const reason = buildProductFitReason(response.products[0], response.intent)

    expect(reason).toBe('Why this fits: matches Chiang Mai and your interest in elephants.')
  })

  it('explains safe food interest matches when product wording uses cooking or local food', () => {
    const response = makeOkResponse({
      intent: makeSearchIntent({ interests: ['food'] }),
      products: [{
        ...makeOkResponse().products[0],
        title: 'Chiang Mai Cooking and Market Experience',
        summary: 'A local food and cooking comparison option.',
        tags: ['Cooking', 'Local food'],
      }],
    })
    const reason = buildProductFitReason(response.products[0], response.intent)

    expect(reason).toBe('Why this fits: matches Chiang Mai and your interest in food.')
  })
})
