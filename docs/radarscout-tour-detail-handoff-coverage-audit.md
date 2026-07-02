# RadarScout tour detail handoff coverage audit

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-COVERAGE-AUDIT-0`

## 1. Purpose

This document audits whether RadarScout `/tours/{id}` detail pages have enough safe booking-partner handoff coverage to support a future SEO opening.

This is a read-only audit. It does not change app code, robots metadata, sitemap output, product data, Bókun behavior, database state, environment variables, deployments, or any ThaiEleHub asset.

## 2. Current conclusion

Current classification:

```text
/tours/{id} handoff coverage: not ready for SEO expansion
```

Reason:

- the safe handoff infrastructure exists in source code;
- tour detail UI can render a `Check availability` CTA when `bookingPartnerHandoff` is present;
- handoff validation correctly restricts URLs to safe public HTTPS URLs;
- live public samples show many tour detail products currently have no `bookingPartnerHandoff`;
- sampled tour detail pages therefore lack a consistent next step for SEO traffic.

Recommended policy remains:

```text
Keep /tours/{id} noindex,nofollow.
Keep /tours/{id} excluded from sitemap.
Do not open tour detail SEO until handoff coverage and fallback behavior are explicitly addressed.
```

## 3. Source findings

Relevant files inspected:

```text
apps/web/lib/publicProducts/bookingPartnerHandoff.ts
apps/web/lib/publicProducts/getPublicThailandProduct.ts
apps/web/lib/publicProducts/__tests__/getPublicThailandProduct.test.ts
apps/web/app/tours/[id]/page.tsx
apps/web/app/tours/__tests__/publicCopy.test.tsx
```

### Handoff helper

`apps/web/lib/publicProducts/bookingPartnerHandoff.ts` defines:

```text
PUBLIC_BOOKING_PARTNER_HANDOFF_REL = nofollow sponsored noopener noreferrer
```

It validates public handoff URLs by requiring:

- `https:` protocol;
- no username or password in URL;
- no localhost or private-network hostnames;
- no `.local` or `.internal` hostnames;
- no unsafe admin/backend/database/private/preview/staging path or host patterns;
- no sensitive query keys such as API keys, auth, passwords, secrets, sessions, or tokens.

It resolves owner-managed handoff URLs from:

```text
ownerManagedBokunProfiles
```

using the product's `bokunActivityId`.

### Public product detail loader

`apps/web/lib/publicProducts/getPublicThailandProduct.ts`:

- selects `bokunActivityId`;
- evaluates Thailand eligibility;
- shapes public-safe product detail fields;
- resolves `bookingPartnerHandoff` with `resolveOwnerManagedProfileHandoff(product.bokunActivityId)`;
- includes `bookingPartnerHandoff` only when a safe owner-managed profile match exists.

### Tour detail UI

`apps/web/app/tours/[id]/page.tsx`:

- renders the `Check availability` link only when `product.bookingPartnerHandoff` exists;
- uses the supplied `href`;
- uses the supplied `rel`;
- opens in a new tab;
- avoids rendering a checkout or internal booking submission flow.

### Tests

Current tests cover:

- matching owner-managed activity IDs include a verified `Check availability` handoff;
- non-matching activity IDs do not include a handoff;
- tour detail UI omits `Check availability` when no handoff exists;
- tour detail UI renders `Check availability` with `nofollow sponsored noopener noreferrer` when a handoff exists.

## 4. Public API coverage sample

The public list endpoint was sampled:

```text
https://www.radarscout.io/api/products?take=100&destination=thailand
```

Observed:

```text
list_count: 50
```

The first 12 product detail API responses were checked through:

```text
https://www.radarscout.io/api/products/{id}
```

Observed:

```text
sampled_details: 12
detail_with_handoff: 0
detail_without_handoff: 12
detail_errors: 0
```

Sample products without handoff:

```text
5c51176e-e42e-4bbb-9c4e-9c05666b5e6e — PRIVATE Ayutthaya + SUNSET Boat Tour + Light up The NIGHT
d3196953-37c9-4e2b-ba76-3e7ca6c33159 — Tour in Maeklong Railway, Floating Market and Ayutthaya
ed90d9cc-35fe-4f9e-8cba-b9bf68ae2fda — Private Customized Bangkok Tour With Driver
6a3a91d7-059d-4cec-bf51-23f47609dff8 — 2-hour Bangkok Old City Night CHOB TUK TUK + Talat Noi Street Art
a7944202-0981-4031-b505-9488769167a6 — 2-hour SUNSET Canal Tour + FOODS Tasting with Tour Guide
b8c457e8-f14b-47ae-b004-d3f6426710bc — 4 Hours Private Tour in Bangkok
```

## 5. Chiang Mai / elephant-focused public sample

Additional public samples were checked for likely owner-managed relevance:

```text
https://www.radarscout.io/api/products?take=24&destination=thailand&city=chiang-mai
https://www.radarscout.io/api/products?take=24&destination=thailand&city=Chiang%20Mai
https://www.radarscout.io/api/products?take=24&destination=thailand&q=elephant
```

Observed:

```text
Chiang Mai lowercase query count: 17
Chiang Mai display-case query count: 17
Elephant query count: 24
Unique sampled details: 20
detail_with_handoff: 0
detail_without_handoff: 20
```

Representative products without handoff:

```text
aa4d78d7-4ad2-414b-bae2-59685a8604f6 — Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour
0296469a-0f83-4e75-aa58-7c2dafcf21bb — Chiang Mai: Elephant Sanctuary with Lunch Day Tours
06c72400-c401-4a9d-b772-2aef807e31e8 — Chiang Mai: Ethical Elephant Sanctuary Full Day Tour & Lunch
9cc17fa9-a490-4d24-8417-296294288417 — Chiang Mai: Ethical Elephant Sanctuary Interactive Tour
0c78ee1c-1336-4523-877e-e96d96d76b44 — Chiang Mai: Half day Walk with Elephant Include Lunch
a45c3d00-c64c-414b-9322-3d1d10da0365 — Chiang Mai: Waterfall, Elephant Sanctuary and Bamboo Rafting
d2d4b3af-3b19-456d-b3c9-77bea03e4049 — Chiang Mai:Ethical Elephant Observation Nature Park Visit
```

## 6. Live page behavior sample

Sampled live tour detail page:

```text
https://www.radarscout.io/tours/aa4d78d7-4ad2-414b-bae2-59685a8604f6
```

Observed browser behavior:

- page returned 200;
- no horizontal overflow was detected;
- safe booking-partner boundary copy was visible;
- no `Check availability` CTA was present;
- no `/api/bokun`, OpenAI, checkout, payment, or booking-submission request was observed.

Interpretation:

- this is safe from a transaction-boundary perspective;
- it is not ready for SEO traffic because the page lacks a consistent traveler next step.

## 7. Risk assessment

Current strengths:

- safe handoff helper exists;
- unsafe public URLs are filtered;
- CTA rel is fixed to `nofollow sponsored noopener noreferrer`;
- tour detail pages avoid internal checkout/payment behavior;
- no unsafe network behavior was observed in sampled live interaction.

Current gaps:

- sampled public products have no handoff coverage;
- owner-managed handoff coverage appears limited to products whose `bokunActivityId` matches `ownerManagedBokunProfiles`;
- public catalog product IDs do not guarantee owner-managed handoff eligibility;
- there is no documented product-level policy for when a tour detail page should show a handoff, show a no-handoff fallback, or remain planning-only;
- no SEO candidate policy ties handoff coverage to sitemap/indexing eligibility.

## 8. Recommended product policy

Before any tour detail SEO opening, define product-level states:

```text
State A: verified handoff
The product has a safe public booking partner URL and can show Check availability.

State B: planning-only
The product is display-safe but lacks verified handoff. It may remain visible, but should not be SEO-opened.

State C: blocked
The product is not display-safe or not Thailand-eligible. It should return unavailable state and noindex metadata.
```

Recommended rule:

```text
Only State A products should be considered for future tour detail SEO candidates.
State B products can remain noindex detail pages.
State C products should remain unavailable/noindex.
```

## 9. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-POLICY-0
TD-RADARSCOUT-TOUR-DETAIL-NO-HANDOFF-FALLBACK-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-PREP-0
```

Do not start sitemap candidate work until the handoff policy is defined and tested.

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
