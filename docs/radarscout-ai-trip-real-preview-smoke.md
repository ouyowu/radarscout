# RadarScout AI Trip Planner Real Preview Smoke

Task: `TD-RADARSCOUT-AI-TRIP-REAL-PREVIEW-SMOKE-0`

Date: 2026-07-06

Mode: read-only protected-preview browser smoke

## 1. Goal

Verify the AI Trip Planner preview path with real preview product data, without
mocking `POST /api/ai-trip/search`.

This task followed the preview-data readiness reports:

- `docs/radarscout-preview-data-readiness.md`
- `docs/radarscout-preview-data-readiness-real-smoke.md`

## 2. Deployment checked

```text
Project: ouyowus-projects / reddit-monitor
Deployment ID: dpl_5GqVXoBzC2J3G8MDWtBatAuc4rLe
Preview host: reddit-monitor-2ymuqznwt-ouyowus-projects.vercel.app
Commit SHA: c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
Target: preview / null
State: READY
Production aliases: none
```

Temporary Vercel share access was used for browser access. The temporary share
URL was not committed, persisted, or copied into this report.

## 3. Read-only API precheck

Preview product API:

```text
GET /api/products?destination=thailand&take=3
```

Result:

```text
HTTP status: 200
products.length: 2
source: signed-bokun-supplier-products
inventoryScope: thailand-first
bookingEnabled: false
availabilityEnabled: false
```

Preview product IDs observed:

```text
preview-tour-handoff-1232729
preview-tour-no-handoff-999999999
```

## 4. Prompt calibration

The broad prompt:

```text
Chiang Mai 3 days elephants temples food
```

returned:

```text
HTTP status: 200
status: no_match
products.length: 0
```

The narrower prompt:

```text
Chiang Mai 3 days elephant care
```

returned:

```text
HTTP status: 200
status: ok
products.length: 1
product ID: preview-tour-handoff-1232729
bookingEnabled: false
availabilityEnabled: false
```

Interpretation:

```text
Preview data is present, but the real AI Trip search is sensitive to interest
terms and available preview seed titles. This is a prompt/data coverage issue,
not a UI shell failure.
```

## 5. Browser smoke result

Flow tested:

```text
Open /ai-trip-planner on protected preview
Enter: Chiang Mai 3 days elephant care
Submit local trip intent parsing
Confirm trip intent
Run real Search real Thailand experiences action
Open top match details
Verify sourced product detail context
```

Result:

```text
ok: true
initialStatus: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
aiTripSearchStatus: 200
aiTripSearchResultStatus: ok
aiTripProductCount: 1
aiTripProductIds: preview-tour-handoff-1232729
productCardCount: 1
topMatchHref: /tours/preview-tour-handoff-1232729?source=ai-trip-planner
detailUrlPath: /tours/preview-tour-handoff-1232729?source=ai-trip-planner
detailTitle: Preview Chiang Mai Elephant Care Morning | RadarScout Thailand Tours
detailContextVisible: true
backLinkVisible: true
noHorizontalOverflow: true
unsafeNetwork: []
plannerForbiddenMatches: []
detailForbiddenMatches: []
```

The detail page found-state smoke passed with AI Trip Planner context visible and
the `Back to AI Trip Planner results` return path available.

## 6. CTA observation

The checked detail page did not show a `Check availability` CTA:

```text
ctaVisible: false
```

This is acceptable for the current smoke because the product-detail handoff
policy only renders the booking partner CTA when a reviewed handoff mapping is
present. The page still reached found state and did not introduce unsafe booking,
payment, availability, or Bókun backend claims.

## 7. Safety result

Confirmed in the real preview smoke:

```text
No production deploy
No SEO index/follow opening
No Bókun API/edit/sync
No checkout/payment/cart/booking submission
No live availability/inventory behavior
No DB writes
No schema/env changes
No OpenAI/LLM calls
No ThaiEleHub/Shopify work
No unsafe network calls
No forbidden visible copy
```

Forbidden copy audit checked:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
fake reviews
fake ratings
supplier net rate
partner rate
commission
```

Result:

```text
0 visible matches
```

## 8. Remaining gap

The real preview smoke is now valid for:

- real preview product API rows;
- real AI Trip search success with a calibrated prompt;
- real sourced product-detail found state;
- AI Trip Planner context card;
- safe return path;
- no unsafe copy/network behavior.

The remaining product gap is not preview data readiness. The next useful product
step should improve search resilience so broader multi-interest prompts can still
surface relevant partial matches instead of returning `no_match` when only one
interest has preview coverage.

## 9. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-SEARCH-PARTIAL-MATCH-0
```

Goal:

Improve the read-only AI Trip product search fallback so a prompt such as:

```text
Chiang Mai 3 days elephants temples food
```

can still return safe relevant Thailand products when one or more interests do
not have exact preview/product coverage.

Safety gates:

- no LLM/OpenAI;
- no Bókun API;
- no checkout/payment/booking submission;
- no live availability/inventory;
- no DB/schema/env changes;
- no SEO index/follow opening;
- no production deploy without explicit approval;
- no ThaiEleHub/Shopify work.
