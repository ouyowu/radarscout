# TD-RADARSCOUT-AI-TRIP-PLANNER-COPY-SAFETY-REVIEW-0

## Current review target

This review covers the RadarScout AI Trip Planner surface after the recent result-flow increments through:

```text
27b9ee535e6c576fae218211bdc547340177454c
```

Relevant public route:

```text
/ai-trip-planner
```

Related result handoff path:

```text
/tours/{id}?source=ai-trip-planner
```

This is a docs/read-only review. It does not change app code, routes, metadata, sitemap output, environment variables, database state, or deployment state.

## Public positioning status

The current AI Trip Planner copy positions RadarScout as:

- a Thailand AI trip planner;
- a local intent parsing and guided discovery surface;
- a read-only Thailand product comparison flow after local confirmation;
- a product-detail handoff path for current details and booking partner continuation.

The copy intentionally does not position RadarScout as:

- a global OTA;
- a booking engine;
- a checkout/payment system;
- a live availability or inventory system;
- a Bókun backend, database, or supplier product interface.

## Safe wording currently present

The reviewed copy uses safe framing such as:

- `Thailand AI Trip Planner`
- `guided discovery`
- `local trip intent parsing`
- `read-only Thailand product search`
- `comparison-only product results`
- `current product details and booking partner handoff stay on product pages`
- `Open top match details`
- `View details`
- `continue with a booking partner`

This wording matches the current product boundary: RadarScout can help a traveler structure intent and compare eligible Thailand experience records, but final current details and booking partner actions remain outside the planner surface.

## Forbidden public-copy audit

The AI Trip Planner public UI should not contain tourist-facing claims for:

- `AI booked this`
- `live availability`
- `available now`
- `guaranteed slot`
- `instant confirmation`
- `checkout`
- `payment`
- `reservation complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `fake reviews`
- `fake ratings`
- `supplier net rate`
- `partner rate`
- `commission`

The targeted grep found forbidden-term matches only in parser guardrails, test assertions, and type-level disabled capability contracts. It did not identify these terms as intended public AI Trip Planner UI copy.

Notable safe internal/test-only matches:

- `apps/web/lib/ai-trip/parse-intent.ts` filters booking/payment/checkout intent terms rather than rendering them.
- `apps/web/lib/ai-trip/placeholder-itinerary.test.ts` asserts forbidden terms are absent.
- `apps/web/app/api/ai-trip/search/__tests__/route.test.ts` asserts internal commercial fields are not exposed.
- `apps/web/app/ai-trip-planner/__tests__/productSearch.test.ts` asserts availability, checkout, payment, rates, and commission copy are absent.
- `apps/web/app/ai-trip-planner/__tests__/copySafety.test.ts` guards public planner copy.

## Behavior boundary status

The current implementation remains within the approved behavior boundary:

- no LLM/OpenAI integration;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory behavior;
- no DB/schema/env change;
- no SEO index/follow opening in this review;
- no ThaiEleHub/Shopify touch.

The search flow uses `/api/ai-trip/search`, but it is still framed and tested as read-only product comparison.

## Validation evidence

Commands run from a clean worktree based on `origin/codex/travel-mvp-launch`:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- ai-trip-planner
pnpm --filter @reddit-monitor/web test -- publicCopySafety homepageCopy sitemap
rg -n "AI booked this|live availability|available now|guaranteed slot|instant confirmation|checkout|payment|reservation complete|Bókun backend|Bokun backend|Bókun database|Bokun database|Bókun-powered|Bokun-powered|fake reviews|fake ratings|supplier net rate|partner rate|commission" apps/web/app/ai-trip-planner apps/web/lib/ai-trip apps/web/app/api/ai-trip/search || true
```

Results:

- Prisma generate: passed.
- AI Trip Planner related Vitest selection: passed, 58 files / 908 tests.
- Public copy safety / homepage / sitemap selection: passed, 58 files / 908 tests.
- Forbidden-term grep: only internal guardrails/tests/contracts matched; no public-copy blocker found.

## Preview note

The latest preview build for `27b9ee535e6c576fae218211bdc547340177454c` was created successfully:

```text
https://reddit-monitor-rhzvysbab-ouyowus-projects.vercel.app
dpl_JA3eqPjit3YrcJe5wkxrUubKeZQR
READY
```

Anonymous UI smoke is blocked by Vercel SSO protection on preview URLs. This is an operational preview-access issue, not a copy-safety finding.

## Risk classification

Risk level: low.

Reason:

- public copy is already covered by route/component tests;
- result-flow E2E checks continue to cover mobile behavior and product-result boundaries;
- grep findings are explainable as internal deny-lists and tests;
- no unsafe tourist-facing wording was identified in the reviewed public AI Trip Planner copy.

## Recommended next safe task

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-PREVIEW-BYPASS-RUNBOOK-0
```

Purpose:

Document the Vercel preview SSO/bypass workflow so future preview smoke tests can run against the real preview URL instead of falling back to same-SHA local smoke.

Scope:

- docs-only or local-automation-only first;
- no production deploy;
- no environment variable value printed;
- no DB/schema/env mutation unless explicitly approved;
- no app behavior change.

Production deploy for the current AI Trip Planner increments should still require explicit approval for the exact merge SHA.
