# RadarScout AI Trip Planner copy safety review 1

Task: `TD-RADARSCOUT-AI-TRIP-PLANNER-COPY-SAFETY-REVIEW-1`

Date: 2026-07-06

Scope: docs-only review of RadarScout AI Trip Planner public copy and related regression coverage.

## 1. Reviewed surfaces

- `apps/web/app/ai-trip-planner/page.tsx`
- `apps/web/app/ai-trip-planner/IntentParserDemo.tsx`
- `apps/web/app/ai-trip-planner/IntentParserPanels.tsx`
- `apps/web/app/ai-trip-planner/AiSearchProductCard.tsx`
- `apps/web/app/ai-trip-planner/resultFitSummary.ts`
- `apps/web/lib/ai-trip/placeholder-itinerary.ts`
- `apps/web/app/api/ai-trip/search/route.ts`
- `apps/web/e2e/ai-trip-planner.spec.ts`
- `apps/web/app/ai-trip-planner/__tests__/copySafety.test.ts`
- `apps/web/app/ai-trip-planner/__tests__/productSearch.test.ts`

## 2. Current public copy posture

The AI Trip Planner public copy remains inside the approved boundary:

- product results are described as `comparison-only`;
- product search appears only after local confirmation;
- current product details and handoff stay on product pages;
- booking partner language is used only for handoff context;
- Thailand-wide route wording is framed as route comparison, not booking;
- non-Thailand ideas remain planning-only.

The current wording supports the product direction without implying live inventory, payment, checkout, confirmation, or direct booking behavior.

## 3. Safe wording found

Examples of currently safe wording:

- `comparison-only product results`
- `comparison-only route results`
- `Open product pages for current details`
- `continue through the public partner handoff path`
- `current product details and booking partner handoff stay on product pages`
- `No booking partner action or current status claim`
- `This planner understands your travel intent locally first`
- `Returns real eligible products from trusted local operators`

These phrases preserve the separation between RadarScout planning/recommendation and external booking partner actions.

## 4. Forbidden copy audit

Reviewed visible AI Trip Planner source areas and tests for:

- `live availability`
- `available now`
- `instant confirmation`
- `checkout`
- `payment`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `partner rate`
- `supplier net rate`
- `commission`
- `fake reviews`
- `fake ratings`

Result:

- no unsafe tourist-facing AI Trip Planner copy was found;
- forbidden terms appear in test assertions, safety guardrails, or parser-deny logic where appropriate;
- public product-card and result-summary copy does not expose backend, rate, payment, checkout, or live-availability claims.

## 5. Current regression coverage

Existing coverage is strong for the current release stage:

- public planner copy safety test checks backend, checkout, and payment wording;
- product-search unit tests verify product card props do not include checkout, payment, booking, availability, rating, or review fields;
- result fit summary tests reject commerce, rating, and live-inventory wording;
- placeholder itinerary tests reject checkout, payment, booking, ratings, and fake availability claims;
- E2E coverage verifies no live availability, checkout, payment, booking-complete, or instant-confirmation copy in key flows;
- E2E coverage now includes Thailand route summary wording and Thailand route result-city chip rendering.

## 6. Risk notes

Current risk level: low.

Remaining risks are operational rather than copy-specific:

- production still serves an older AI Trip Planner until Vercel deployment quota allows deployment;
- fresh preview deployment is also blocked by Vercel quota;
- future copy changes should continue to update both unit and E2E guardrails when adding visible planner text.

## 7. Recommended next task

Recommended next safe task:

```text
TD-RADARSCOUT-AI-TRIP-PRODUCTION-QUOTA-RETRY-0
```

Run only after the Vercel deployment quota resets or project plan capacity changes.

If deployment remains blocked, continue with local-only work:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-1
```

That task should be scoped to local tests or docs unless a clean preview deployment becomes available.

## 8. Safety confirmations

- No app code changed in this review.
- No production deploy.
- No SEO index/follow opening.
- No LLM/OpenAI integration.
- No Bókun API/edit/sync.
- No booking/checkout/payment/submission behavior.
- No DB/schema/env changes.
- ThaiEleHub and Shopify files untouched.
