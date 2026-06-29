# RadarScout tour detail handoff source audit

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-AUDIT-0`

## 1. Purpose

This audit determines whether RadarScout can safely add a product-specific `Check availability` CTA to `/tours/{id}` detail pages.

This is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Current tour detail state

Current `/tours/{id}` behavior:

- loads public product detail through the shared public Thailand product detail path;
- stays `noindex,nofollow`;
- remains excluded from `sitemap.xml`;
- renders traveler-safe product detail and fallback copy;
- does not create checkout, payment, booking submission, reservation, inventory, or live availability behavior;
- does not call Bókun API;
- does not expose an external product-specific booking partner URL.

Current CTA state:

```text
/tours list cards -> View details -> /tours/{id}
/tours/{id} page -> Back to tours / planning links only
```

There is no product-specific `Check availability` CTA on `/tours/{id}` today.

## 3. Public product detail source

The public product detail type currently exposes:

```text
id
title
destination
city
location
imageUrl
summary
description
retailPrice
currency
detailHref
facts
reviewedEnrichment
```

The relevant source is:

```text
apps/web/lib/publicProducts/getPublicThailandProduct.ts
```

`detailHref` is generated as an internal RadarScout path:

```text
/tours/{productId}
```

It is not an external booking partner URL.

The public product detail response intentionally does not expose fields such as:

```text
bookingUrl
rawJson
supplier
rating
checkout
payment
candidate
aiRawResponse
```

## 4. Current safe external handoff pattern

The known safe external handoff pattern is currently limited to the Chiang Mai finder owner-managed profile flow.

Relevant source:

```text
apps/web/lib/elephantFinder/scoreElephantCamp.ts
```

Safe pattern:

```text
bookingHandoffUrl present
CTA label: Check availability
externalHandoff: true
rel: nofollow sponsored noopener noreferrer
```

If a profile has a real internal product ID, the current pattern uses:

```text
CTA label: View experience
href: /tours/{internalProductId}
externalHandoff: false
```

This separation is important:

- internal product detail links are not treated as external booking handoffs;
- external handoff URLs are only used when explicitly supplied by the owner-managed profile;
- Bókun IDs are not converted into `/tours/{id}` URLs for owner-managed external profiles.

## 5. Generated and reviewed enrichment guardrails

The reviewed enrichment and local AI candidate paths currently reject `bookingUrl`.

Relevant source areas:

```text
apps/web/lib/localAi/productEnrichment.ts
apps/web/lib/productEnrichmentReview.ts
apps/web/app/api/internal/product-enrichment/*
```

This is correct. LLM or enrichment output must not invent or widen booking partner URLs.

Implication:

```text
Do not use AI-generated, reviewed-enrichment, or candidate fields as the source of a public booking partner URL.
```

## 6. Current risk assessment

Risk classification:

```text
Do not implement product-specific /tours/{id} Check availability yet.
```

Reasons:

1. The public product detail shape has no audited external booking partner URL field.
2. `detailHref` is an internal `/tours/{id}` URL, not a booking handoff.
3. `bookingUrl` is intentionally rejected from generated/enrichment paths.
4. Raw Bókun or supplier data is not safe to expose directly.
5. The Preview environment currently lacks `DATABASE_URL`, so DB-backed product detail smoke cannot fully validate public detail behavior in Preview.

## 7. What not to do

Do not:

- convert Bókun product IDs into public widget URLs by string guessing;
- expose `rawJson` URL-like fields directly;
- expose supplier backend URLs;
- use LLM, reviewed-enrichment, or candidate output as a booking URL source;
- add `Check availability` for `/tours/{id}` unless the URL is a verified external booking partner URL;
- add checkout, payment, cart, booking submission, reservation, live availability, or inventory behavior;
- call Bókun API;
- edit or sync Bókun products;
- write DB records;
- change Prisma schema or env;
- open SEO `index,follow`;
- add `/tours/{id}` back to sitemap;
- touch ThaiEleHub or Shopify files.

## 8. Safe future implementation model

The next implementation should introduce an explicit, audited handoff source instead of reusing generic product fields.

Recommended future data contract:

```ts
type PublicBookingPartnerHandoff = {
  href: string
  label: 'Check availability'
  rel: 'nofollow sponsored noopener noreferrer'
  source: 'owner_managed_profile' | 'operator_verified_public_link'
}
```

Rules:

- `href` must be absolute `https://`.
- `href` must be a public booking partner or operator URL.
- `href` must not be generated from a product ID.
- `href` must not come from LLM output.
- `href` must not come from unaudited `rawJson`.
- `href` must not expose private backend, admin, supplier, or tokenized URLs.
- `rel` must always include `nofollow sponsored noopener noreferrer`.
- CTA copy must be `Check availability`.

## 9. Recommended next implementation task

Recommended task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-0
```

Safe scope:

- add a typed `bookingPartnerHandoff` field only to the owner-managed or explicitly verified public product path;
- keep it optional;
- render `Check availability` on `/tours/{id}` only when `bookingPartnerHandoff` is present;
- preserve `noindex,nofollow`;
- keep `/tours/{id}` out of sitemap;
- add tests proving products without verified handoff show no external CTA;
- add tests proving verified handoff links use `nofollow sponsored noopener noreferrer`;
- add tests proving no Bókun API, checkout, payment, booking submission, live availability, or inventory behavior is introduced.

Do not start this task until the source of verified product-specific handoff URLs is explicit.

## 10. Preview environment dependency

The Preview environment currently lacks `DATABASE_URL`.

This blocks full DB-backed product detail API success smoke in Preview.

Before any production deploy involving DB-backed tour detail behavior, configure a cloud-accessible Preview/Staging `DATABASE_URL` and rerun:

```text
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1-POSTMERGE-PREVIEW-RETRY
```

## 11. Current recommendation

Keep `/tours/{id}` as a traveler-safe product detail page without product-specific external `Check availability` for now.

Next best step:

```text
Configure Preview DATABASE_URL, then rerun DB-backed product detail preview smoke.
```

If the Preview DB blocker is not resolved yet, continue with docs/spec work or non-DB UI safety work only.
