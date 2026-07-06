# RadarScout Preview Data Readiness Audit

Task: `TD-RADARSCOUT-PREVIEW-DATA-READINESS-CURRENT-0`

Date: 2026-07-06

Mode: read-only observation and docs report

## 1. Purpose

This audit explains the current state of RadarScout Preview data for real
DB-backed AI Trip Planner and `/tours/{id}` smoke tests.

The key question is no longer whether Preview has any database configuration.
It does. The current question is whether the latest deployed preview can prove
real product-search and product-detail behavior using the current preview seed
data.

## 2. Scope and boundaries

This task did not:

- deploy anything;
- modify app code;
- mutate preview or production data;
- read or change environment variable values;
- run Prisma migrations;
- change schema;
- call the Bókun API;
- add checkout, payment, booking submission, availability, or inventory behavior;
- touch ThaiEleHub or Shopify files.

Read-only sources checked:

- `docs/radarscout-active-execution-status.md`
- `docs/radarscout-ai-trip-planner-release-status.md`
- `docs/radarscout-vercel-preview-bypass-runbook.md`
- `docs/radarscout-ai-trip-planner-production-readiness.md`
- `scripts/radarscout-ai-trip-preview-smoke.js`
- `apps/web/app/api/ai-trip/search/route.ts`
- `apps/web/app/tours/[id]/page.tsx`
- `apps/web/lib/aiProducts/listAiEligibleThailandProducts.ts`
- `apps/web/lib/aiProducts/buildAiProductContext.ts`
- `apps/web/lib/publicProducts/getPublicThailandProduct.ts`
- `apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts`

## 3. Current Vercel Preview environment status

Vercel project:

```text
ouyowus-projects / reddit-monitor
```

Read-only `vercel env ls` currently shows:

```text
DATABASE_URL: configured for Preview
DATABASE_URL: configured for Production
```

No environment values were pulled or printed.

This supersedes older Preview DB docs that recorded Preview `DATABASE_URL` as
missing.

## 4. Preview DB read-only result

Credential source:

```text
macOS Keychain item: radarscout-preview-database-url
```

The database URL was not printed.

The query used `BEGIN READ ONLY` and selected only aggregate counts and safe
public-facing fields for preview seed products. It did not select `rawJson`,
rates, commission, backend URLs, supplier private fields, credentials, customer
data, or booking data.

Preview DB result:

```text
total_products: 2
active_products: 2
active_with_supplier: 2
likely_thailand_display_candidates: 2
reviewed_enrichment_rows: 0
```

Seed products present:

| id | title | city | location | bokunActivityId | active | supplierIdPresent |
| --- | --- | --- | --- | --- | --- | --- |
| `preview-tour-handoff-1232729` | Preview Chiang Mai Elephant Care Morning | Chiang Mai | Chiang Mai, Thailand | `1232729` | true | true |
| `preview-tour-no-handoff-999999999` | Preview Chiang Mai Local Nature Experience | Chiang Mai | Chiang Mai, Thailand | `999999999` | true | true |

## 5. Real data dependency map

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

## 6. Protected-preview runtime evidence

Checked existing protected preview:

```text
https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app
```

This preview is not the latest branch HEAD. A fresh preview deployment from the
latest HEAD was attempted but blocked by Vercel daily deployment quota:

```text
api-deployments-free-per-day
```

Existing protected preview results:

```text
/ai-trip-planner page load: 200
/tours/preview-tour-handoff-1232729?source=ai-trip-planner: rendered seed product detail
unsafe network calls: none observed
```

The seed tour detail rendered:

```text
Preview Chiang Mai Elephant Care Morning
```

This proves the existing protected preview can read the Preview DB for at least
one seeded `/tours/{id}` page.

## 7. Current gaps

### Existing preview AI search returns no-match for seeded data

Observed real `POST /api/ai-trip/search` responses on the existing protected
preview:

```text
Prompt: Chiang Mai elephants
Result: no_match
Product count: 0

Prompt: 3 days in Chiang Mai with elephants and food
Result: no_match
Product count: 0

Prompt: Thailand elephants
Result: no_match
Product count: 0
```

Most likely causes:

- the existing preview deployment is stale relative to the latest branch;
- a fresh preview deploy is currently blocked by Vercel daily deployment quota;
- the seed data is minimal and has no reviewed enrichment rows;
- search behavior depends on exact destination and interest parsing.

This is not evidence that the latest branch code is broken. Same-SHA local E2E
and build validation passed.

### Preview seed tour detail does not show `Check availability`

`/tours/preview-tour-handoff-1232729` rendered the seed product detail, but did
not render `Check availability`.

Reason in current code:

```text
ownerManagedProductHandoffMappings: []
```

The resolver requires an explicitly reviewed public product ID to owner-managed
Bókun ID mapping before it will show a public booking partner handoff on a DB
product detail page.

This is intentional. It prevents a preview seed row from being treated as an
approved production handoff mapping.

## 8. Production read-only comparison

A read-only public production API check against:

```text
https://radarscout.io/api/products?destination=thailand&take=3
```

previously returned:

```text
status: 200
products: 3
bookingEnabled: false
availabilityEnabled: false
source: signed-bokun-supplier-products
inventoryScope: thailand-first
```

This confirms production has display-ready rows for the public product API, but
it does not prove preview has equivalent search behavior.

## 9. Readiness assessment

Classification:

```text
Preview DATABASE_URL: configured
Preview DB seed rows: present
Preview tour detail found-state: partially proven on existing protected preview
Preview AI search real-data result: not proven
Preview DB-backed Check availability handoff: intentionally not approved
Fresh latest-preview deployment: blocked by Vercel daily deploy quota
Product UI behavior: covered by unit tests and mocked protected-preview smoke
```

The remaining limitation is not basic Preview DB availability. It is a
combination of fresh preview deployment quota, minimal preview seed data, and
the intentionally empty reviewed handoff mapping list.

## 10. Required evidence before relying on preview real-data smoke

After the Vercel deploy quota resets, collect this evidence on a fresh protected
preview URL with temporary Vercel share access:

```text
GET /tours
Expected: 200 and at least one visible product card.

GET /api/products?destination=thailand&take=3
Expected: 200, products.length > 0, bookingEnabled false, availabilityEnabled false.

POST /api/ai-trip/search
Payload: safe Thailand prompt such as "3 days in Chiang Mai with elephants and food"
Expected: status ok, products.length > 0, detailHref values point to /tours/{id}.

GET /tours/preview-tour-handoff-1232729?source=ai-trip-planner
Expected: found-state product detail and AI Trip Planner context visible.

GET /tours/preview-tour-no-handoff-999999999?source=ai-trip-planner
Expected: found-state product detail and planning-only fallback visible.
```

All checks must remain read-only and must not print secrets or persist temporary
share URLs.

## 11. Recommended next tasks

Recommended after Vercel deploy quota resets:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-LATEST-HEAD-PREVIEW-SMOKE-1
```

Goal:

- deploy latest `origin/codex/travel-mvp-launch` to Vercel Preview;
- generate a temporary share URL;
- run `pnpm smoke:ai-trip-preview`;
- run one real-network `/api/ai-trip/search` check against seeded Preview DB;
- run both seeded `/tours/{id}?source=ai-trip-planner` smoke checks.

Recommended before any DB-backed `Check availability` implementation:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING
```

Only start this after a reviewed evidence packet identifies a real production
public product ID and matching owner-managed Bókun ID. Do not use preview seed
IDs as production mapping evidence.

## 12. Status

Current status:

```text
AI Trip Planner mocked preview smoke: ready
Preview DATABASE_URL: configured
Preview DB seed rows: present
Preview tour detail found-state: partially proven
Preview AI search real-data readiness: not proven
Preview DB-backed handoff readiness: intentionally gated by empty mapping list
Blockers: Vercel daily deploy quota for fresh preview
```

## 13. Guardrail confirmation

This task did not:

- write to the database;
- run migrations;
- change Prisma schema;
- change environment variables;
- print database credentials;
- read `.env.production`;
- select `rawJson`;
- select supplier private fields;
- select rates or commission;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or
  inventory behavior;
- change robots metadata;
- add `/tours/{id}` to sitemap;
- deploy preview or production;
- touch ThaiEleHub or Shopify files.
