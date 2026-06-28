# RadarScout tour public-safety remediation plan

Task: `TD-RADARSCOUT-TOUR-PUBLIC-SAFETY-AUDIT-0`

## 1. Current state

RadarScout now has the correct defensive SEO posture for tour surfaces:

- `/tours` is `noindex,nofollow`.
- `/tours/{id}` metadata is `noindex,nofollow` for both missing and eligible products.
- `/tours/{id}` entries are excluded from `sitemap.xml`.
- `/chiang-mai/elephant-camp-finder` remains `noindex,nofollow`.
- B2B pages remain `noindex,nofollow`.
- The homepage has a live entry point to the Chiang Mai finder.

Production currently should not be treated as ready for broad tour-page SEO indexing.

## 2. Why tour pages are still not public-safe

The tour routes are useful internally as a display-only product preview, but their copy still mixes public traveler language with supplier/source-boundary language.

Examples found in current source:

- `Contact for partner rate`
- `Partner rate`
- `signed Bókun supplier partner product database`
- `Booking and payment are not enabled`
- `Availability is not checked on this preview page`
- `commission terms`
- `supplier rates`

This wording is acceptable as internal guardrail language, but it is not suitable for tourist-facing indexed pages or search snippets.

## 3. Current safe policy

Keep this policy until a dedicated remediation PR passes:

```text
/tours: noindex,nofollow
/tours/{id}: noindex,nofollow
/tours/{id}: excluded from sitemap
```

Do not:

- open `index,follow` for tour pages;
- add `/tours/{id}` back to sitemap;
- add broad homepage/nav promotion to `/tours`;
- claim live availability;
- claim checkout, payment, or reservation completion;
- expose supplier net rate, partner rate, commission, or backend wording to tourists.

## 4. Recommended copy model

Tour pages should move from supplier/backend language to traveler-safe handoff language.

Use:

- `Compare experience details`
- `Trusted local experience`
- `Booking partner`
- `Check availability with the booking partner`
- `Price shown when provided by the booking partner`
- `Details are shown only when available from the product record`
- `Continue with booking partner`

Avoid:

- `partner rate`
- `supplier net rate`
- `commission`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `Bókun supplier partner product database`
- `payment`
- `checkout`
- `reservation complete`
- `live availability`
- `available now`
- `instant confirmation`

## 5. Recommended `/tours` remediation

The `/tours` index page should remain a preview surface for now, but it can be made safer for future public evaluation.

Recommended changes for a later implementation PR:

1. Replace supplier/backend labels with traveler-facing labels.
2. Replace `Partner rate` filter and price copy with a safer label such as `Price not listed`.
3. Replace `signed Bókun supplier partner data` with `booking partner product data` or `trusted partner product data`.
4. Remove supplier-rate and commission email copy from tourist-facing page sections.
5. Keep supplier partnership CTA on B2B pages instead of the tourist-facing tour index.
6. Add tests that serialize `/tours` source/rendered output and reject forbidden tourist-facing phrases.

Do not change product retrieval logic in this remediation task.

## 6. Recommended `/tours/{id}` remediation

The product detail route should be cleaned before any SEO opening.

Recommended changes for a later implementation PR:

1. Keep metadata `noindex,nofollow`.
2. Replace `Partner rate` with `Price not listed` or `Price shown when provided`.
3. Replace `Booking and payment are not enabled` with `RadarScout helps you compare details before you continue with a booking partner`.
4. Replace `Availability is not checked on this preview page` with `Use the booking partner page to review current details`.
5. Replace `Bókun supplier partner product database` with `trusted partner product record`.
6. Keep the page honest when data is missing, but avoid backend/source implementation language.
7. Add tests for eligible product detail visible copy, not only metadata.

Do not add checkout, booking submission, live availability, or Bókun API behavior.

## 7. Suggested tests for implementation

Future implementation should add or update tests covering:

- `/tours` remains `noindex,nofollow`;
- `/tours/{id}` remains `noindex,nofollow`;
- sitemap still excludes `/tours/{id}`;
- `/tours` visible/source copy excludes forbidden tourist-facing phrases;
- `/tours/{id}` visible/source copy excludes forbidden tourist-facing phrases;
- route rendering still handles missing product data safely;
- no `/api/bokun` call is added;
- no checkout, payment, cart, booking submission, or live availability behavior is added.

Forbidden phrase fixtures should include:

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
supplier net rate
partner rate
commission
fake reviews
fake ratings
```

## 8. Recommended task queue

Recommended next tasks:

```text
TD-RADARSCOUT-TOUR-PAGE-NOINDEX-0-PRODUCTION
TD-RADARSCOUT-TOUR-PUBLIC-COPY-0
TD-RADARSCOUT-TOUR-PUBLIC-COPY-0-PREVIEW-SMOKE
TD-RADARSCOUT-TOUR-PUBLIC-COPY-0-MERGE-POSTMERGE-PREVIEW
TD-RADARSCOUT-TOUR-PUBLIC-COPY-0-PRODUCTION only after explicit approval
```

The noindex production deploy should be approved separately because it is already merged and preview-tested, but production is currently behind that merge SHA.

## 9. Safety gates

Every implementation task must preserve:

- no SEO `index,follow` opening;
- no tour sitemap re-addition;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory claims;
- no DB/schema/env changes;
- no ThaiEleHub or Shopify work.

Production deploy remains a separate explicit approval gate.
