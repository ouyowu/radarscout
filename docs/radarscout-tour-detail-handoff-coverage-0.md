# RadarScout tour detail handoff coverage snapshot

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-COVERAGE-0`

## 1. Purpose

This document records the current production coverage state for `/tours/{id}` booking-partner handoff behavior.

It is a docs-only snapshot. It does not change app code, product data, database state, Bókun behavior, sitemap output, robots metadata, environment variables, deployments, or any ThaiEleHub asset.

## 2. Production state checked

Current production deployment used for this review:

```text
Production HEAD: 229c4cf3bbb821171b65a374a90a1989c31e1608
Deployment ID: dpl_G71F6nuUqxLKtHLyiWg57Bqq2fUZ
Project: reddit-monitor
Target: production
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Live production endpoints checked:

```text
https://radarscout.io/api/products?destination=thailand
https://radarscout.io/sitemap.xml
https://radarscout.io/robots.txt
https://radarscout.io/tours/{sampled-product-id}
https://www.radarscout.io/tours/{sampled-product-id}
https://radarscout.io/tours/nonexistent-radarscout-product
```

## 3. Current coverage result

Observed public product coverage:

```text
Public Thailand products returned: 12
Products with bookingPartnerHandoff: 0
Products without bookingPartnerHandoff: 12
```

Classification:

```text
Tour detail handoff coverage: not ready for SEO expansion
```

Reason:

- the tour detail UI can render `Check availability` when a verified `bookingPartnerHandoff` exists;
- current production public product data exposes no products with `bookingPartnerHandoff`;
- sampled valid tour detail pages therefore render planning-only fallback behavior;
- the fallback behavior is safe, but it does not provide a consistent traveler conversion path for SEO traffic.

## 4. Sampled production products

Sampled products without handoff:

```text
5c51176e-e42e-4bbb-9c4e-9c05666b5e6e — PRIVATE Ayutthaya + SUNSET Boat Tour + Light up The NIGHT
d3196953-37c9-4e2b-ba76-3e7ca6c33159 — Tour in Maeklong Railway, Floating Market and Ayutthaya
ed90d9cc-35fe-4f9e-8cba-b9bf68ae2fda — Private Customized Bangkok Tour With Driver
6a3a91d7-059d-4cec-bf51-23f47609dff8 — 2-hour Bangkok Old City Night CHOB TUK TUK + Talat Noi Street Art
a7944202-0981-4031-b505-9488769167a6 — 2-hour SUNSET Canal Tour + FOODS Tasting with Tour Guide
b8c457e8-f14b-47ae-b004-d3f6426710bc — 4 Hours Private Tour in Bangkok
```

For each sampled valid product:

```text
API status: 200
Tour detail page status: 200
API product present: yes
bookingPartnerHandoff present: no
rawJson exposed: no
netSettlementPrice exposed: no
commissionPercent exposed: no
planning-only fallback visible: yes
Check availability visible: no
Bókun widget URL visible: no
noindex metadata present: yes
forbidden visible copy matches: 0
```

A sampled `www.radarscout.io` tour detail page also returned `200`.

## 5. Invalid product behavior

Invalid product checked:

```text
https://radarscout.io/tours/nonexistent-radarscout-product
```

Observed:

```text
API status: 404
Page status: 200
Safe unavailable fallback visible: yes
noindex metadata present: yes
forbidden visible copy matches: 0
```

This remains the correct behavior for unknown, inactive, unsupported, or not-display-safe tour IDs.

## 6. Sitemap and robots status

Observed:

```text
https://radarscout.io/sitemap.xml: 200
/tours/{id} entries in sitemap: 0
https://radarscout.io/robots.txt: 200
```

Policy remains:

```text
Keep /tours/{id} excluded from sitemap.
Keep /tours/{id} noindex,nofollow.
Do not add tour detail pages to sitemap until handoff coverage and SEO safety are intentionally approved.
```

## 7. Handoff state model

RadarScout should keep using three product states.

### State A: verified handoff

Definition:

```text
Display-safe product with a verified public booking partner handoff URL.
```

Allowed behavior:

- show `Check availability`;
- use only the verified public handoff URL;
- include `rel="nofollow sponsored noopener noreferrer"`;
- open externally;
- keep RadarScout out of checkout, payment, inventory, and booking submission.

SEO status:

```text
Candidate for future SEO review only.
Not automatically indexable.
Not automatically added to sitemap.
```

### State B: planning-only

Definition:

```text
Display-safe product without a verified public handoff URL.
```

Observed production state:

```text
All 12 current public products are State B.
```

Allowed behavior:

- show product details that are display-safe;
- show planning-only fallback copy;
- do not show `Check availability`;
- do not invent a booking URL;
- do not expose Bókun widget URLs.

SEO status:

```text
Remain noindex,nofollow.
Remain excluded from sitemap.
Not eligible for SEO opening.
```

### State C: blocked

Definition:

```text
Unknown, inactive, unsupported, or not-display-safe product.
```

Allowed behavior:

- return safe unavailable state;
- avoid product-specific unsafe fallback content;
- keep noindex metadata;
- do not invent product details.

SEO status:

```text
Never sitemap.
Never index.
```

## 8. Safety audit result

Forbidden visible copy audit returned zero matches for sampled production pages:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
booking complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

Sensitive field/API audit:

```text
rawJson: not exposed
netSettlementPrice: not exposed
commissionPercent: not exposed
/api/bokun: not observed
OpenAI/LLM: not observed in fetched HTML/API artifacts
checkout/payment/booking submission: not observed in fetched HTML/API artifacts
```

Browser request tracing was not completed in this observation because Playwright was not resolvable in the current shell context. No dependency installation was performed for this docs-only task.

## 9. Product gap

The runtime behavior is safe, but the product coverage gap is clear:

```text
There is currently no production public tour detail product that exercises the verified Check availability handoff path.
```

This means RadarScout has a safe display layer but lacks production handoff coverage for tour detail conversion.

## 10. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-LIST-0
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-REVIEW-0
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-COVERAGE-1
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0
```

### Recommended immediate next task

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-LIST-0
```

Goal:

Produce a docs/read-only list of production products that could become State A candidates, using only public-safe fields and without writing DB, calling Bókun API, editing product data, or exposing private supplier/backend/rate fields.

Candidate review should answer:

- Which current products are destination/category appropriate?
- Which products are owner-managed or operator-approved for public handoff?
- Which products have public partner URLs that can pass validation?
- Which products should stay planning-only?
- Which products should be blocked from future SEO consideration?

## 11. Guardrail confirmation

This task did not:

- modify app code;
- create a booking flow;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, or booking submission;
- add live availability or inventory behavior;
- write DB;
- change schema or environment variables;
- change robots metadata;
- change sitemap generation;
- add `/tours/{id}` to sitemap;
- open SEO `index,follow`;
- deploy;
- touch ThaiEleHub files;
- run Shopify commands.
