# RadarScout Preview Data Readiness Real-Smoke Check

Task: `TD-RADARSCOUT-PREVIEW-DATA-READINESS-1`

Date: 2026-07-06

Mode: read-only preview observation and docs report

## 1. Goal

Check whether the latest available RadarScout preview environment has real
display-ready Thailand product rows, without changing database, environment,
schema, deployment, or production state.

## 2. Deployment checked

Latest available `codex/travel-mvp-launch` preview deployment found through
Vercel:

```text
Project: ouyowus-projects / reddit-monitor
Deployment ID: dpl_5GqVXoBzC2J3G8MDWtBatAuc4rLe
Preview host: reddit-monitor-2ymuqznwt-ouyowus-projects.vercel.app
Commit SHA: c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
Target: preview / null
State: READY
Production aliases: none
```

Note:

```text
Newer docs-only branch deploys were blocked by Vercel build-rate limiting.
The checked preview is the latest available READY preview from the product-code
candidate that added the protected-preview smoke helper.
```

## 3. Read-only checks performed

### Preview product API

Checked:

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

Preview display-ready product IDs observed:

```text
preview-tour-handoff-1232729
preview-tour-no-handoff-999999999
```

This means the checked preview environment does have at least two display-ready
Thailand product rows for the public product API.

### Preview page routes

Checked routes:

```text
GET /tours
GET /tours/preview-tour-handoff-1232729?source=ai-trip-planner
```

Result:

```text
HTTP status: 302
Reason: Vercel preview authentication redirect
```

This is expected for protected preview page routes without browser session
cookies. It does not indicate an app regression.

## 4. Assessment

Previous status:

```text
Preview real-data readiness: not proven
```

Updated status from this check:

```text
Preview product API data readiness: proven for the checked c9b5406 preview
Preview page-level found-state smoke: still needs browser/share-URL smoke
Preview AI Trip real POST search: not checked in this task
```

The main blocker has narrowed:

```text
Not a missing preview product row problem for the checked preview.
Remaining gap is authenticated browser smoke coverage for real page routes and
real POST /api/ai-trip/search behavior.
```

## 5. What this proves

This check proves:

- the checked preview deployment is READY;
- it belongs to the RadarScout `reddit-monitor` project;
- it is a preview deployment, not production;
- the checked preview has display-ready Thailand rows through the public product
  API;
- those rows keep `bookingEnabled: false`;
- those rows keep `availabilityEnabled: false`;
- no Bókun API, checkout, payment, booking submission, DB write, schema, env, or
  production deploy action was required.

## 6. What this does not prove yet

This check does not yet prove:

- `/tours` renders visible cards inside an authenticated preview browser session;
- `/tours/preview-tour-handoff-1232729?source=ai-trip-planner` reaches found
  state in an authenticated preview browser session;
- the AI Trip Planner real `POST /api/ai-trip/search` returns these preview rows;
- the product-detail page shows the AI Trip Planner context card in a real
  preview browser session.

Those are browser/API smoke checks, not data-seeding tasks.

## 7. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-REAL-PREVIEW-SMOKE-0
```

Goal:

Use a temporary Vercel share URL for the checked preview deployment and run a
browser smoke without mocking `POST /api/ai-trip/search`.

Required checks:

```text
/ai-trip-planner loads with robots noindex,nofollow
real POST /api/ai-trip/search returns products for a safe Thailand prompt
/tours renders at least one preview product card
/tours/preview-tour-handoff-1232729?source=ai-trip-planner reaches found state
AI Trip Planner context card appears on sourced product detail
CTA/handoff remains safe
no forbidden copy
no unsafe network calls
```

Safety gates:

- no deploy;
- no production deploy;
- no DB writes;
- no migrations;
- no seed changes;
- no schema/env changes;
- no Bókun API/edit/sync;
- no checkout/payment/booking submission;
- no live availability/inventory behavior;
- no ThaiEleHub or Shopify work.

## 8. Current status

```text
Task status: completed
Preview product API rows: present
Page-level authenticated smoke: pending
Blockers: none for data readiness; browser smoke remains next
```
