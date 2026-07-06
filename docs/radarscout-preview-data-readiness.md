# RadarScout Preview Data Readiness Audit

Task: `TD-RADARSCOUT-PREVIEW-DATA-READINESS-0`

Date: 2026-07-06

Mode: read-only observation and docs report

## 1. Purpose

This audit explains why RadarScout can currently smoke-test the deployed AI Trip
Planner UI on protected Vercel previews with a mocked product-search response,
but should not yet rely on preview deployments for real product-detail found-state
smoke.

The core question is whether the remaining gap is product UI behavior or preview
data readiness.

## 2. Scope and boundaries

This task did not:

- deploy anything;
- modify app code;
- mutate preview or production data;
- read or change environment variables;
- run Prisma migrations;
- change schema;
- call the Bókun API;
- add checkout, payment, booking submission, availability, or inventory behavior;
- touch ThaiEleHub or Shopify files.

Read-only sources checked:

- `docs/radarscout-active-execution-status.md`
- `docs/radarscout-ai-trip-planner-release-status.md`
- `docs/radarscout-vercel-preview-bypass-runbook.md`
- `scripts/radarscout-ai-trip-preview-smoke.js`
- `apps/web/app/tours/page.tsx`
- `apps/web/app/tours/[id]/page.tsx`
- `apps/web/app/api/products/route.ts`
- `apps/web/app/api/ai-trip/search/route.ts`
- `apps/web/lib/aiProducts/listAiEligibleThailandProducts.ts`
- `apps/web/lib/aiProducts/buildAiProductContext.ts`
- `apps/web/lib/publicProducts/getPublicThailandProduct.ts`

## 3. Current behavior summary

The current AI Trip Planner preview helper:

- loads a protected Vercel preview URL through a temporary share URL;
- normalizes the path to `/ai-trip-planner`;
- mocks `POST /api/ai-trip/search`;
- verifies the deployed frontend shell and result UI;
- confirms the top-match link includes `source=ai-trip-planner`;
- confirms no horizontal overflow, forbidden copy, or unsafe network calls.

This is intentionally a UI smoke helper. It does not validate preview database
seed state.

## 4. Real data dependency map

Real product result smoke depends on these read paths:

```text
/ai-trip-planner
  -> POST /api/ai-trip/search
  -> listAiEligibleThailandProducts()
  -> db.bokunProduct.findMany()
  -> buildAiProductContext()
  -> product cards with /tours/{id}?source=ai-trip-planner

/tours
  -> GET /api/products?destination=thailand
  -> db.bokunProduct.findMany()
  -> evaluateThailandProductEligibility()
  -> display-ready product cards

/tours/{id}?source=ai-trip-planner
  -> loadPublicThailandProductDetail(id)
  -> db.bokunProduct.findFirst()
  -> evaluateThailandProductEligibility()
  -> optional reviewed enrichment
  -> optional reviewed booking partner handoff mapping
```

The found-state tour detail page requires a matching active product row with:

- matching `id`;
- `active: true`;
- non-null `supplierId`;
- Thailand-eligible title/city/location;
- enough safe public fields to render the page.

If preview has no such rows, the UI correctly falls back to a no-display-ready
or unavailable product-detail state.

## 5. Evidence collected

### Existing preview evidence

The latest documented protected preview helper run passed against:

```text
Preview URL: https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app/ai-trip-planner
Helper: pnpm smoke:ai-trip-preview
Status: passed
```

The helper reported:

```text
status: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: []
forbiddenMatches: []
```

During the PR #266 preview smoke, protected preview `/tours` loaded but returned
no display-ready product rows. The unavailable sourced detail path was smoke
tested, while found-state sourced detail behavior remained covered by unit tests.

### Production read-only comparison

A read-only public production API check against:

```text
https://radarscout.io/api/products?destination=thailand&take=3
```

returned:

```text
status: 200
products: 3
bookingEnabled: false
availabilityEnabled: false
source: signed-bokun-supplier-products
inventoryScope: thailand-first
```

This confirms production currently has display-ready rows for the public product
API, but it does not prove preview has equivalent data.

## 6. Readiness assessment

Classification:

```text
Preview data readiness: not yet proven
Product UI behavior: covered by unit tests and mocked preview smoke
Production public product API: read-only rows observed
Preview real product-detail found-state smoke: blocked until preview has verified display-ready rows
```

The likely limitation is preview data state or preview access, not the AI Trip
Planner frontend shell.

The current helper is still useful and should remain in use because it proves:

- deployed `/ai-trip-planner` UI loads behind protected preview access;
- result UI can render returned products safely;
- source-tagged detail links are generated;
- forbidden copy and unsafe network calls are absent in the mocked flow.

It does not prove:

- preview DB has active Thailand product rows;
- preview DB has reviewed enrichment rows;
- preview DB has reviewed handoff mappings;
- real `/api/ai-trip/search` returns products on preview;
- a real preview `/tours/{id}?source=ai-trip-planner` route reaches found state.

## 7. Required evidence before relying on preview real-data smoke

Before using preview for real product-detail found-state smoke, collect this
evidence on a protected preview URL with temporary Vercel share access:

```text
GET /tours
Expected: 200 and at least one visible product card.

GET /api/products?destination=thailand&take=3
Expected: 200, products.length > 0, bookingEnabled false, availabilityEnabled false.

POST /api/ai-trip/search
Payload: safe Thailand prompt such as "Chiang Mai 3 days elephants temples food"
Expected: status ok, products.length > 0, detailHref values point to /tours/{id}.

GET /tours/{id}?source=ai-trip-planner
Expected: found-state product detail, AI Trip Planner context visible, robots noindex,nofollow.
```

All checks must remain read-only and must not print secrets or persist temporary
share URLs.

## 8. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-PREVIEW-DATA-READINESS-1
```

Goal:

Run a protected-preview read-only real-data smoke against a fresh preview
deployment and document whether preview has display-ready rows.

Boundaries:

- no DB writes;
- no migrations;
- no seed changes;
- no schema/env changes;
- no Bókun API calls;
- no checkout/payment/booking submission;
- no production deploy;
- no ThaiEleHub or Shopify work.

If preview still has zero display-ready rows, the next task should be a separate
preview seed/readiness plan. That plan must define the exact rows needed and stop
before any DB mutation unless explicitly approved.

## 9. Status

Current status:

```text
AI Trip Planner mocked preview smoke: ready
Production public product API rows: observed
Preview real-data readiness: not proven
Preview found-state product-detail smoke: not yet reliable
Blockers: none for UI release evidence; preview data evidence still needed
```
