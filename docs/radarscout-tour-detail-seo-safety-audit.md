# RadarScout tour detail SEO safety audit

Task: `TD-RADARSCOUT-TOUR-DETAIL-SEO-SAFETY-0`

## 1. Purpose

This document reviews whether RadarScout `/tours/{id}` detail pages are ready for SEO expansion after the controlled Chiang Mai finder opening.

This is a read-only audit. It does not change app code, robots metadata, sitemap output, product data, Bókun behavior, database state, environment variables, deployments, or any ThaiEleHub asset.

## 2. Current conclusion

Current classification:

```text
/tours/{id}: safer than the original sitemap audit, but not ready for index/follow or sitemap inclusion yet
```

Reason:

- tour detail pages are currently excluded from the sitemap;
- sampled tour detail pages now return `noindex,nofollow`;
- sampled tour detail pages no longer expose the older unsafe phrases such as `partner rate`, `payment`, or `Bókun supplier partner product database`;
- current source-level metadata keeps found and not-found tour detail pages closed to indexing;
- at least one sampled tour detail page did not show a `Check availability` handoff CTA, so conversion/handoff coverage is not yet consistent enough for SEO expansion.

Recommended policy:

```text
Keep /tours/{id} excluded from sitemap.
Keep /tours/{id} noindex,nofollow.
Do not open tour detail SEO until a separate opening-prep task verifies copy, metadata, CTA coverage, and route-level behavior.
```

## 3. Current source findings

Relevant files inspected:

```text
apps/web/app/sitemap.ts
apps/web/app/tours/[id]/page.tsx
apps/web/app/tours/[id]/__tests__/metadata.test.ts
apps/web/app/__tests__/sitemap.test.ts
```

### Sitemap

Current `apps/web/app/sitemap.ts` emits only static routes:

```text
/
/chiang-mai/elephant-camp-finder
/contact
/privacy-policy
/terms-of-service
```

It does not emit product-derived `/tours/{id}` URLs.

### Tour detail metadata

Current `apps/web/app/tours/[id]/page.tsx` sets:

```text
robots: { index: false, follow: false }
```

for eligible product detail pages.

Unknown or unavailable products return generic blocked metadata with:

```text
robots: { index: false, follow: false }
```

### Tests

Current tests cover:

- eligible tour detail pages remain noindex while tour pages are being remediated;
- unknown product detail metadata is generic and noindex;
- generic metadata avoids Bókun wording;
- sitemap excludes `/tours/{id}`;
- sitemap includes the Chiang Mai finder as the controlled SEO candidate;
- sitemap excludes B2B pages while they remain closed.

## 4. Live sample checks

Sampled live URLs:

```text
https://www.radarscout.io/tours/5c51176e-e42e-4bbb-9c4e-9c05666b5e6e
https://www.radarscout.io/tours/aa4d78d7-4ad2-414b-bae2-59685a8604f6
https://www.radarscout.io/tours/7da857ee-f4d2-4785-91ee-da884d5a2fa3
https://www.radarscout.io/tours/7a119353-9eb6-4339-91dd-61b8d393ed51
https://www.radarscout.io/tours/b8c42a27-f29c-4c71-a401-118543be2cc5
```

Observed result:

| URL sample | Status | Robots | Unsafe phrase matches |
| --- | --- | --- | --- |
| Ayutthaya sample | 200 | `noindex,nofollow` | 0 |
| Chiang Mai / Doi Inthanon sample | 200 | `noindex,nofollow` | 0 |
| Pattaya sample | 200 | `noindex,nofollow` | 0 |
| Phuket sample | 200 | `noindex,nofollow` | 0 |
| Chiang Rai transfer sample | 200 | `noindex,nofollow` | 0 |

Observed titles were product-specific and canonical URLs pointed to the corresponding `/tours/{id}` pages.

## 5. Unsafe copy audit

Sampled live tour detail pages were checked for:

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

Observed result:

```text
0 unsafe matches across sampled live pages
```

This is a material improvement versus the earlier sitemap safety audit.

## 6. Handoff and network sample

One sampled tour detail page was checked in a mobile browser:

```text
https://www.radarscout.io/tours/aa4d78d7-4ad2-414b-bae2-59685a8604f6
```

Observed:

- page returned 200;
- no horizontal overflow was detected;
- no `/api/bokun`, OpenAI, checkout, payment, or booking-submission request was observed;
- page used safe booking-partner boundary copy;
- no `Check availability` CTA was present for this sampled product.

Interpretation:

- absence of a CTA is not a transaction-safety problem;
- it is a readiness gap for SEO expansion because an indexed tour detail page should have a consistent and safe next step where a verified public handoff exists, or a clear no-handoff fallback when it does not.

## 7. Risk assessment

Current risks are lower than before, but tour detail SEO should remain closed.

Reduced risks:

- `/tours/{id}` is not in the sitemap;
- sampled pages are `noindex,nofollow`;
- sampled visible copy no longer includes the older unsafe supplier/backend/rate/payment phrases;
- route metadata has explicit noindex behavior;
- sampled interaction did not trigger unsafe network requests.

Remaining gaps:

- CTA/handoff coverage is not consistent across sampled products;
- tour detail pages are product-specific and would need stronger snippet governance before indexing;
- no Search Console evidence exists for tour detail behavior because these pages remain intentionally closed;
- broad tour indexing could expose many product records, so opening should be controlled by product eligibility rather than all `/tours/{id}` routes at once.

## 8. Opening criteria for future tour detail SEO

Before any `/tours/{id}` page is opened to indexing or added back to the sitemap, require:

1. A product-level eligibility rule for SEO candidates.
2. Confirmed safe metadata title and description.
3. `robots: index, follow` only for explicitly approved candidates.
4. Sitemap inclusion only for explicitly approved candidates.
5. No unsafe tourist-facing wording.
6. No Bókun backend, database, powered-by, supplier-rate, net-rate, or commission wording.
7. No live availability, available-now, guaranteed-slot, instant-confirmation, checkout, payment, or booking-complete claims.
8. Safe `Check availability` handoff where a verified public booking partner URL exists.
9. Clear no-handoff fallback when no verified public handoff exists.
10. No `/api/bokun`, OpenAI/LLM, checkout, payment, booking submission, or DB-write behavior from public interaction.
11. Tests covering metadata, sitemap inclusion/exclusion, forbidden copy, CTA rel, and unsafe route behavior.
12. Preview smoke before any production deploy.

## 9. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-COVERAGE-AUDIT-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-PREP-0
TD-RADARSCOUT-TOUR-DETAIL-SITEMAP-CANDIDATES-0
```

Keep the current state unchanged until those tasks pass:

```text
/tours/{id}: noindex,nofollow
/tours/{id}: excluded from sitemap
```

## 10. Guardrail confirmation

This audit did not:

- modify app code;
- change robots metadata;
- change sitemap generation;
- open any tour detail page to `index, follow`;
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
- deploy production.
