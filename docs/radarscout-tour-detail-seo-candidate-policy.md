# RadarScout tour detail SEO candidate policy

Task: `TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0`

## 1. Purpose

This document defines when a RadarScout `/tours/{id}` page may become a future SEO candidate.

It is a policy document only. It does not change app code, robots metadata, sitemap generation, product data, Bókun behavior, database state, schema, environment variables, deployments, or ThaiEleHub / Shopify files.

## 2. Current route status

Current route family:

```text
/tours
/tours/{id}
```

Current safe state:

```text
/tours/{id}: noindex,nofollow
/tours/{id}: excluded from sitemap.xml
```

This should remain unchanged until a separate implementation task explicitly opens a reviewed subset.

Current reason:

- tour detail pages are product-specific and DB-backed;
- public copy is safer than the original sitemap audit, but still needs product-level governance before indexing;
- verified booking partner handoff coverage is not universal;
- broad route-wide indexing could expose many product records before each record has safe copy, metadata, and handoff status.

## 3. Candidate principle

Tour detail SEO must be candidate-based, not route-wide.

Do not open:

```text
all /tours/{id}
```

Instead, only a reviewed product may move through a future SEO candidate pipeline.

Candidate status means:

```text
This product may be reviewed for index/follow and sitemap inclusion.
```

Candidate status does not mean:

```text
The product is already indexable.
The product is already in sitemap.
The product is bookable on RadarScout.
RadarScout has checked live availability.
```

## 4. Required candidate state

A product can become an SEO candidate only if it is State A from the handoff policy.

Required handoff state:

```text
State A: verified handoff
```

State A requirements:

- product is active;
- product is Thailand-eligible;
- public product fields are display-safe;
- product has a verified public booking partner handoff URL;
- CTA label is exactly `Check availability`;
- CTA rel includes `nofollow sponsored noopener noreferrer`;
- handoff is external or otherwise explicitly reviewed as a booking partner handoff;
- no internal checkout, payment, cart, booking submission, live inventory, or availability behavior is introduced.

State B products remain closed:

```text
State B: planning-only detail
robots: noindex,nofollow
sitemap: excluded
```

State C products remain closed:

```text
State C: unavailable / blocked
robots: noindex,nofollow
sitemap: excluded
```

## 5. Candidate allowlist fields

A future SEO candidate registry should use an explicit allowlist.

Recommended fields:

```ts
type TourDetailSeoCandidate = {
  publicProductId: string
  reviewedBy: 'operator_manual_review'
  reviewNote: string
  approvedAt: string
  expectedCanonicalPath: `/tours/${string}`
}
```

Do not infer SEO candidates from:

- all active products;
- all Thailand-eligible products;
- all products with a price;
- all products with images;
- all products that appear in AI Trip Planner search results;
- all products with an owner-managed activity ID;
- Bókun supplier data alone.

## 6. Metadata requirements

Before a product candidate can be opened, verify metadata output.

Required:

- title is product-specific and traveler-facing;
- description is product-specific or safe generic fallback;
- metadata does not expose raw supplier/backend/source concepts;
- canonical URL points to the expected `/tours/{id}` path;
- no unavailable product ID is leaked into generic unavailable metadata;
- robots changes apply only to explicitly approved candidate IDs.

Forbidden in metadata:

```text
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
Bókun supplier partner product database
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

## 7. Visible copy requirements

Before opening a candidate, rendered HTML must pass a visible-copy audit.

Allowed direction:

- trusted local experience;
- compare Thailand experiences;
- guided discovery;
- operator-provided details;
- continue with a booking partner;
- check availability;
- review current details on the booking partner page.

Forbidden public copy:

```text
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
Bókun supplier partner product database
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

Do not use internal safety-boundary language as public tourist-facing copy.

## 8. Network and behavior requirements

Candidate opening must not introduce transaction behavior inside RadarScout.

Required public interaction behavior:

- no `/api/bokun`;
- no Bókun API call;
- no OpenAI/LLM request;
- no checkout request;
- no payment request;
- no booking submission;
- no cart behavior;
- no DB write from public page interaction;
- external booking partner handoff only when the user clicks `Check availability`.

## 9. Sitemap policy

Sitemap inclusion must use the same explicit candidate allowlist.

Rules:

```text
Do not add all /tours/{id}.
Do not add State B products.
Do not add State C products.
Only add explicitly approved State A candidates.
```

If a candidate is removed from the allowlist:

```text
Remove it from sitemap.
Revert robots to noindex,nofollow.
Keep the route available as a planning/detail page if still display-safe.
```

## 10. Required tests for future opening

A future implementation task must add or preserve tests for:

- non-candidate `/tours/{id}` remains `noindex,nofollow`;
- State B `/tours/{id}` remains `noindex,nofollow`;
- State C `/tours/{id}` remains `noindex,nofollow`;
- candidate State A can be opened only by explicit allowlist;
- candidate metadata excludes forbidden wording;
- rendered candidate HTML excludes forbidden wording;
- candidate CTA is `Check availability`;
- candidate CTA rel includes `nofollow sponsored noopener noreferrer`;
- sitemap excludes all non-candidate `/tours/{id}`;
- sitemap includes only explicitly approved candidates;
- no route introduces `/api/bokun`, OpenAI/LLM, checkout, payment, booking submission, DB write, schema change, or env dependency.

## 11. Preview and production gates

Before any tour detail SEO opening PR is merged:

1. Run full unit and E2E validation.
2. Run a clean preview deployment when Vercel quota allows.
3. Smoke candidate and non-candidate tour detail pages.
4. Confirm sitemap candidate output.
5. Confirm robots behavior per candidate state.
6. Confirm no unsafe visible copy.
7. Confirm no unsafe network requests.

Before production deploy:

```text
Production approval must name the exact merge SHA.
```

Post-production smoke must check:

- candidate URL returns 200;
- candidate robots are the approved value;
- non-candidates remain `noindex,nofollow`;
- sitemap includes only approved candidates;
- no unsafe visible copy;
- no unsafe network behavior;
- no Bókun API/edit/sync;
- no checkout/payment/booking submission;
- no DB/schema/env changes.

## 12. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-PREP-0
TD-RADARSCOUT-TOUR-DETAIL-SITEMAP-CANDIDATES-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-1-FIRST-CANDIDATE
```

`TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-PREP-0` should create tests and implementation scaffolding for an empty candidate allowlist first.

It should not open any product to indexing yet.

## 13. Guardrail confirmation

This policy task did not:

- modify app code;
- change robots metadata;
- change sitemap generation;
- open any tour detail page to `index,follow`;
- add `/tours/{id}` to the sitemap;
- change product data;
- change Bókun widget URLs;
- call Bókun APIs;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write to the database;
- change schema or environment variables;
- add LLM/OpenAI behavior;
- touch ThaiEleHub files;
- run Shopify commands;
- deploy preview or production.
