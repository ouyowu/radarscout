# RadarScout AI Trip Planner Mobile Results UX Audit

Task: `TD-RADARSCOUT-AI-TRIP-PLANNER-MOBILE-RESULTS-UX-AUDIT-0`

Last updated: 2026-07-06

## 1. Audit scope

This audit reviews the current mobile result flow for:

```text
/ai-trip-planner
```

Current clean `codex/travel-mvp-launch` HEAD:

```text
3d6f1e3a1ad6daee7e3105d49e929ddf30647afb
```

Relevant recent increments:

```text
PR #255: pending search feedback
PR #256: results-ready feedback
PR #257: top-match detail action
PR #259: mobile viewport result-flow E2E coverage
```

This is an audit and planning document only. It does not change app code,
production, SEO, database, schema, environment variables, Bókun behavior, or
ThaiEleHub assets.

## 2. Current mobile result flow

On mobile, the traveler flow is:

1. enter a Thailand trip idea
2. parse the trip idea locally
3. confirm the interpreted intent
4. run read-only Thailand product search
5. see a pending search status while the request is in flight
6. see a results-ready status after products return
7. see the top-match action
8. see the result fit summary
9. see product cards
10. open product detail links tagged with `source=ai-trip-planner`

The current behavior remains comparison-only. Booking partner actions stay on
product detail pages and external partner surfaces.

## 3. Current automated coverage

PR #259 added mobile viewport coverage to:

```text
apps/web/e2e/ai-trip-planner.spec.ts
```

The mobile test verifies:

- viewport size `390 x 844`
- results-ready status appears after search
- `Open top match details` is visible
- product cards are visible
- three product cards render in the mocked valid flow
- no horizontal overflow

Related existing tests verify:

- pending search disabled state
- pending status message
- results-ready message
- top-match detail link carries `source=ai-trip-planner`
- every product card detail link carries `source=ai-trip-planner`
- planner results contain no checkout/payment/booking buttons
- booking partner action remains disabled in the planner capability panel
- unsupported destinations do not show product cards
- no-match state does not invent products

## 4. UX findings

### What is working

- Mobile horizontal overflow is covered by E2E.
- The result flow has explicit feedback before and after search.
- The top-match action reduces the distance from search result to product detail.
- Product cards still expose comparison-only language.
- Product detail links preserve the AI planner source parameter.
- The planner avoids booking, checkout, payment, and live-availability claims.

### Remaining mobile UX risk

The result stack is now clear but still vertically dense on mobile:

```text
results count
refine link
top-match action
results-ready status
result fit summary
product card grid
```

This is safe, but it may push the first product card lower than ideal on small
screens. The current implementation prioritizes clarity and safety over compact
layout.

### Current recommendation

Do not remove safety copy yet. The safer next step is a small layout-only
polish that keeps all safety boundaries while making the result header more
compact on mobile.

## 5. Recommended next implementation

Recommended task:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-MOBILE-RESULTS-TIGHTEN-1
```

Goal:

```text
Make the successful AI Trip Planner results header more compact on mobile
without changing product matching, product cards, source-tagged links, booking
handoff behavior, SEO, DB, schema, env, or Bókun behavior.
```

Suggested narrow changes:

- keep `Results ready`
- keep `Open top match details`
- keep result fit summary
- reduce mobile vertical spacing between the result header, ready message, and
  result fit summary
- keep tap targets at least 44px high
- keep desktop layout unchanged or equivalent

Do not:

- remove safety copy entirely
- add sticky UI
- change product matching
- change product card content
- change product detail routes
- add analytics
- add LLM/OpenAI
- call Bókun APIs
- add checkout/payment/booking submission
- open SEO indexing

## 6. Proposed test coverage for next implementation

Future implementation should update or add E2E assertions for:

- mobile results still show `Results ready`
- mobile top-match link remains visible
- mobile top-match link keeps `source=ai-trip-planner`
- first product card remains visible after search
- no horizontal overflow
- checkout/payment/booking copy remains absent from planner results
- result fit summary remains visible

If a class-level test is added, keep it non-brittle. Prefer behavior assertions
over exact Tailwind class matching.

## 7. Safety boundaries

The next implementation must preserve:

```text
No production deploy by default
No SEO index/follow opening
No Bókun API/edit/sync
No checkout/payment/cart/booking submission
No live availability/inventory behavior
No DB/schema/env changes
No ThaiEleHub/Shopify changes
```

Forbidden public wording remains:

```text
live availability
available now
instant confirmation
checkout
payment
booking complete
reservation complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

## 8. Production note

The current clean HEAD is not automatically approved for production deploy.

Production deploy remains a separate gate and should only run after explicit
approval for a specific SHA.
