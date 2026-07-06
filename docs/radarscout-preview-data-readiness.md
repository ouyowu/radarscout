# RadarScout Preview Data Readiness

Task: `TD-RADARSCOUT-PREVIEW-DATA-READINESS-1`

Last updated: 2026-07-06

## Purpose

Audit whether Vercel Preview can support real DB-backed AI Trip Planner and
`/tours/{id}` smoke tests, without changing data, environment variables, schema,
app code, deployment state, Bókun behavior, checkout/payment behavior, SEO, or
ThaiEleHub files.

## Read-only evidence sources

This report used:

- current repository code on `origin/codex/travel-mvp-launch`;
- Vercel environment name listing only;
- macOS Keychain item `radarscout-preview-database-url` without printing the URL;
- read-only Preview DB SQL;
- protected Vercel preview browser smoke using a temporary `_vercel_share` URL.

No secrets were printed, committed, or copied into docs.

## Current Vercel Preview env status

Vercel project:

```text
ouyowus-projects / reddit-monitor
```

Read-only `vercel env ls` currently shows:

```text
DATABASE_URL: configured for Preview
DATABASE_URL: configured for Production
```

This supersedes older docs that recorded Preview `DATABASE_URL` as missing.

## Preview DB read-only result

Read-only query scope:

- aggregate product counts;
- allowed public-facing fields for preview seed products;
- enrichment row count;
- no `rawJson`;
- no rates, commission, backend URLs, supplier private fields, credentials,
  customer data, or booking data.

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

## Existing protected-preview runtime check

Checked existing protected preview:

```text
https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app
```

Result:

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

## Current gaps

### 1. Existing preview AI search returns no-match for seeded data

Observed real `/api/ai-trip/search` responses on the existing protected preview:

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

- the existing preview deployment is stale relative to the latest AI search
  matching code;
- a fresh preview deploy is currently blocked by Vercel daily deployment quota;
- the seed data is minimal and has no reviewed enrichment rows;
- search behavior depends on exact destination and interest parsing.

This is not evidence that the latest branch code is broken. Same-SHA local E2E
and build validation passed, and the existing preview deployment predates some
recent helper/status work.

### 2. Preview handoff path is intentionally not approved

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

## What is now ready

Preview now has enough DB state to test:

- product detail found state;
- product detail planning-only fallback;
- AI Trip Planner sourced return link;
- no unsafe network calls;
- no checkout/payment/booking behavior;
- no fabricated product fallback.

## What is not ready

Preview is not yet ready to prove:

- real AI Trip Planner DB-backed product search results on a fresh latest
  deployment;
- `Check availability` handoff on DB-backed `/tours/{id}` pages;
- any production owner-managed handoff mapping.

## Required next gates

### Gate A: fresh preview after Vercel quota reset

Run:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-LATEST-HEAD-PREVIEW-SMOKE-1
```

Goal:

- deploy latest `origin/codex/travel-mvp-launch` to Vercel Preview;
- generate a temporary share URL;
- run `pnpm smoke:ai-trip-preview`;
- run one real-network `/api/ai-trip/search` check against seeded Preview DB;
- run `/tours/preview-tour-handoff-1232729?source=ai-trip-planner` and
  `/tours/preview-tour-no-handoff-999999999?source=ai-trip-planner` smoke.

### Gate B: mapping evidence before handoff implementation

Before implementing `Check availability` for DB-backed tour details, complete a
reviewed evidence packet for a real public product ID.

Do not use preview seed IDs as production mapping evidence.

Required evidence:

- real `BokunProduct.id`;
- matching `bokunActivityId`;
- allowed public fields only;
- reviewed source for the public booking partner handoff;
- no raw Bókun backend URLs, rates, commission, secrets, or private supplier
  fields.

## Recommendation

Do not seed more data yet.

Do not implement a production handoff mapping from preview seed evidence.

Next best task after the Vercel quota resets:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-LATEST-HEAD-PREVIEW-SMOKE-1
```

If the fresh preview still returns no DB-backed AI search products after quota
reset, then create a narrow code/data diagnosis task focused on search matching
against the two preview seed products.

## Guardrail confirmation

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
