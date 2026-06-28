# RadarScout tour detail data safety audit

Task: `TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-0`

Date: 2026-06-29

## 1. Purpose

This document reviews whether RadarScout should expand the public `/tours/{id}` detail experience beyond its current conservative preview state.

This is a docs-only audit. It does not change app code, routes, sitemap, SEO metadata, database schema, Bókun behavior, checkout behavior, or deployment state.

## 2. Current implementation summary

Current relevant surfaces:

- `/tours`
- `/tours/[id]`
- `/api/products`
- `/api/products/[id]`
- `lib/publicProducts/getPublicThailandProduct.ts`
- `lib/publicProducts/listPublicThailandProducts.ts`
- `app/sitemap.ts`

Current behavior:

- `/tours` is a dynamic display-only marketplace preview.
- `/tours/[id]` is a dynamic display-only tour detail page.
- `/tours/[id]` renders a safe unavailable state when the product cannot be loaded.
- `/tours/[id]` fetches product detail through `/api/products/[id]`.
- `/api/products/[id]` reads from `bokunProduct` and returns a public product shape.
- `/api/products/[id]` does not call the Bókun API.
- `/api/products/[id]` does not write to the database.
- `/api/products/[id]` returns metadata with `bookingEnabled: false` and `availabilityEnabled: false`.
- Tour detail pages remain `noindex,nofollow`.
- `/tours/{id}` URLs remain excluded from `sitemap.xml`.

## 3. Current safety status

### SEO and sitemap

Safe:

- `/tours` metadata uses `robots: { index: false, follow: false }`.
- `/tours/[id]` generated metadata uses `robots: { index: false, follow: false }` for both found and unavailable products.
- `app/sitemap.ts` emits only the intended static non-tour URLs.
- `/tours/{id}` detail URLs are not in the sitemap.
- `/chiang-mai/elephant-camp-finder` is not in the sitemap while it remains `noindex,nofollow`.

### Transaction boundary

Safe:

- No checkout, payment, cart, or booking submission is implemented on `/tours/[id]`.
- No live availability or inventory claim is implemented.
- No Bókun API call is made by `/tours/[id]` or `/api/products/[id]`.
- The detail page copy frames the page as display-only and asks users to review current details on the booking partner page.

### Public data exposure

Mostly safe:

- `/api/products/[id]` selects `rawJson` internally, but tests confirm `rawJson` is not returned in the public response.
- Public response tests cover forbidden keys such as `rawJson`, `supplier`, `rating`, `bookingUrl`, `checkout`, `payment`, and AI candidate fields.
- Reviewed enrichment is included only after the product passes product eligibility.

## 4. Gaps and risks

### Gap A: product eligibility logic is split

There are two detail-loading paths:

- `/api/products/[id]` uses a hardcoded `THAILAND_CITIES` list before calling `evaluateThailandProductEligibility`.
- `getPublicThailandProduct` does not use that same hardcoded city list and relies more directly on `evaluateThailandProductEligibility`.

Risk:

- Metadata and page rendering may disagree for eligible products outside the API route's city list.
- New Thailand destinations may be supported by eligibility logic but blocked by the detail API.

Recommended future fix:

- Align `/api/products/[id]` with `getPublicThailandProduct` or extract one shared public product detail loader.
- Keep output fields and tests conservative.

### Gap B: detail API is public and DB-backed

`/api/products/[id]` is a public read-only API route.

Risk:

- Even without writes, a public detail API can expose unintended fields if future changes widen the selected or returned shape.
- Tests reduce this risk but should be expanded before making tour detail pages indexable.

Recommended future fix:

- Keep the route read-only.
- Add response-shape allowlist tests that assert exact top-level product keys and exact reviewed-enrichment keys.
- Keep ineligible products indistinguishable from missing products.

### Gap C: detail pages show product prices when present

The detail page can render `Price detail` from `retailPrice` and `currency`.

Risk:

- Price display is acceptable only if clearly framed as product-record data and not as a live quote, booking guarantee, checkout amount, or payment request.
- Opening SEO while price copy remains prominent could create trust risk if partner records are stale.

Recommended future fix:

- Keep price display conservative.
- Add copy stating that details should be reviewed on the booking partner page.
- Do not add price claims such as "available now", "instant confirmation", or "guaranteed slot".

### Gap D: detail pages have no safe external handoff CTA yet

The current detail page is display-only and includes planning/back links, but it does not expose a clearly scoped partner handoff CTA for a specific product.

Risk:

- If users land on `/tours/[id]`, the page can compare details but does not guide them to a safe next step.
- Adding a CTA is only safe if a public partner URL already exists in the reviewed product shape and uses the same external handoff guardrails as the Chiang Mai finder.

Recommended future fix:

- Do not add a product-specific CTA until the safe public URL source is audited.
- If added later, CTA copy should be `Check availability`.
- CTA must use external booking partner handoff only.
- CTA rel must include `nofollow sponsored noopener noreferrer`.
- No Bókun backend wording should be shown.

### Gap E: tour detail pages are not ready for index/follow

Current tour detail behavior is safer than the old stale PR, but it is not yet SEO-ready.

Reasons:

- Public detail data is DB-backed and needs stronger shape guarantees.
- Product detail copy still depends on variable partner records.
- The product-specific handoff path is not fully defined.
- The page remains intentionally conservative and display-only.

Recommendation:

- Keep `/tours/[id]` as `noindex,nofollow`.
- Keep `/tours/{id}` excluded from `sitemap.xml`.
- Do not open SEO for tour detail pages until a separate SEO readiness audit passes.

## 5. What not to merge from old PR #8

PR #8 was closed as superseded and should not be merged as-is.

Do not restore stale behavior such as:

- `Contact for partner rate`
- partner rate or supplier net rate copy
- broad real product preview expansion without current tests
- new product API behavior without a fresh response-shape audit
- booking, payment, checkout, or availability language
- Bókun backend, Bókun database, or Bókun-powered wording

## 6. Recommended next implementation task

Recommended next task:

```text
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1
```

Goal:

Make the public tour detail data path more internally consistent without changing SEO or transaction boundaries.

Suggested scope:

- Extract or reuse one shared public product detail loader for both metadata and detail API.
- Remove the hardcoded city-list mismatch in `/api/products/[id]` if the shared eligibility helper already covers Thailand scope.
- Add exact response-shape allowlist tests for `/api/products/[id]`.
- Add tests proving ineligible products and missing products return the same 404 shape.
- Add tests proving forbidden commerce and backend terms are absent from `/tours/[id]` rendered HTML.
- Keep `/tours/[id]` `noindex,nofollow`.
- Keep `/tours/{id}` out of `sitemap.xml`.

Forbidden in that task:

- no Bókun API calls
- no Bókun product edits or sync
- no checkout/payment/cart/booking submission
- no live availability or inventory behavior
- no DB schema/env changes
- no SEO `index,follow` opening
- no sitemap addition for `/tours/{id}`
- no ThaiEleHub or Shopify work

## 7. Future optional task after safety-1

Optional later task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-0
```

Only start this after the product detail URL source is audited.

Possible scope:

- Add a product-specific `Check availability` CTA only when a safe public booking partner URL is present.
- Use external handoff only.
- Preserve `nofollow sponsored noopener noreferrer`.
- Keep page `noindex,nofollow` until a separate SEO readiness gate passes.

## 8. Current recommendation

Do not make `/tours/[id]` indexable yet.

Do not add `/tours/{id}` to sitemap yet.

Do not merge old PR #8.

Proceed with `TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1` as a small implementation PR focused on shared loading logic and stronger public response-shape tests.

## 9. Non-actions in this task

This task did not:

- modify app code
- deploy preview or production
- open SEO indexing
- change sitemap output
- call Bókun API
- add checkout, payment, cart, or booking behavior
- write to the database
- change schema or environment files
- touch ThaiEleHub files
- run Shopify commands
