# RadarScout tour detail booking partner handoff contract

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CONTRACT-0`

## 1. Purpose

Define the safe data contract and implementation gates required before RadarScout can add a product-specific `Check availability` CTA to `/tours/{id}` pages.

This document is intentionally docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Current state

Current `/tours/{id}` pages:

- load public Thailand product detail through `apps/web/lib/publicProducts/getPublicThailandProduct.ts`;
- remain excluded from `sitemap.xml`;
- are not part of the current SEO opening path;
- do not call Bókun API;
- do not create checkout, payment, booking submission, reservation, inventory, or live availability behavior;
- do not expose a product-specific external booking partner URL.

The current public product detail shape exposes traveler-safe product fields:

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

`detailHref` is an internal RadarScout route:

```text
/tours/{id}
```

It is not a booking partner handoff URL and must not be treated as one.

## 3. Existing safe handoff precedent

The current safe external handoff pattern exists in the Chiang Mai finder owner-managed profile flow.

Safe external handoff behavior:

```text
bookingHandoffUrl: explicit absolute public URL
ctaLabel: Check availability
externalHandoff: true
linkRel: nofollow sponsored noopener noreferrer
```

Fallback internal behavior:

```text
ctaLabel: View experience
href: /tours/{internalProductId}
externalHandoff: false
```

This separation should be preserved:

- internal RadarScout product detail routes are discovery/detail links;
- external booking partner URLs are handoff links;
- Bókun IDs are not converted into booking URLs by string guessing.

## 4. Problem to solve

RadarScout needs a verified product-specific handoff model before `/tours/{id}` can render `Check availability`.

The unsafe shortcut would be:

```text
product id -> guessed Bókun widget URL -> Check availability
```

That must not be implemented.

Reasons:

- product IDs are not proof of a public booking widget URL;
- raw supplier or Bókun-like data may include private, backend, tokenized, or partner-only fields;
- AI/reviewed enrichment output intentionally rejects `bookingUrl`;
- `/tours/{id}` currently lacks Preview DB-backed success smoke because Preview `DATABASE_URL` is not configured;
- `/tours/{id}` is intentionally excluded from sitemap until product detail pages are public-safe.

## 5. Proposed public handoff contract

Introduce an optional, explicit handoff object only after a verified source exists.

Recommended type:

```ts
type PublicBookingPartnerHandoff = {
  href: string
  label: 'Check availability'
  rel: 'nofollow sponsored noopener noreferrer'
  source:
    | 'owner_managed_profile'
    | 'operator_verified_public_link'
    | 'booking_partner_verified_public_widget'
  verifiedAt: string
  verifiedBy: 'operator_manual_review' | 'owner_managed_catalog'
}
```

Recommended product detail extension:

```ts
type PublicThailandProduct = {
  // existing public fields
  bookingPartnerHandoff?: PublicBookingPartnerHandoff
}
```

The field must be optional. Products without a verified handoff continue to show product detail and planning links only.

## 6. Source rules

Allowed sources:

- owner-managed RadarScout profiles that explicitly define a public `bookingHandoffUrl`;
- manually reviewed operator public links;
- manually verified public booking partner widget URLs.

Disallowed sources:

- generated LLM output;
- reviewed enrichment candidate text;
- `bookingUrl` from AI, local AI, enrichment, or candidate paths;
- unaudited `rawJson`;
- supplier backend fields;
- admin URLs;
- tokenized URLs;
- partner-rate or supplier-rate URLs;
- URLs guessed from Bókun product IDs;
- URLs guessed from internal RadarScout product IDs.

## 7. URL validation rules

Every handoff URL must pass these checks before rendering:

- absolute `https://` URL;
- public booking partner or operator URL;
- no localhost, private network, admin, staging, preview, or internal domain;
- no embedded credentials;
- no access token, API key, session token, or signed private download URL;
- no query parameters that expose supplier, partner-rate, backend, or private campaign data;
- no Bókun backend, database, supplier admin, or powered-by backend wording in visible UI;
- no live availability, instant confirmation, checkout, payment, booking complete, or reservation complete claims on RadarScout.

Suggested helper behavior for a future implementation:

```text
validatePublicBookingPartnerHandoff(input) -> PublicBookingPartnerHandoff | null
```

If validation fails, omit the CTA entirely and log only a non-secret diagnostic in development/test contexts.

## 8. Rendering rules

`/tours/{id}` may render product-specific `Check availability` only when:

```text
product.bookingPartnerHandoff exists
product.bookingPartnerHandoff.href passes validation
product.bookingPartnerHandoff.label === "Check availability"
product.bookingPartnerHandoff.rel === "nofollow sponsored noopener noreferrer"
```

Required link behavior:

```text
target="_blank"
rel="nofollow sponsored noopener noreferrer"
```

Required visible CTA:

```text
Check availability
```

Safe helper copy:

```text
Continue with a booking partner to review current details.
```

Do not say:

```text
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
booking complete
reservation complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
```

## 9. API and database boundaries

This contract does not authorize:

- Bókun API calls;
- Bókun sync or product edits;
- checkout, payment, cart, reservation, or booking submission;
- live availability or inventory behavior;
- DB writes;
- Prisma schema changes;
- environment variable changes;
- SEO `index,follow` opening;
- adding `/tours/{id}` back to sitemap.

If a future implementation needs a persisted verified handoff field, it must be a separate task with:

- explicit schema proposal;
- migration SQL shown before execution;
- user approval before any migration;
- safe Preview/Staging `DATABASE_URL` configured before preview smoke;
- no production deploy without explicit approval.

## 10. Test requirements for future implementation

Future implementation must add tests proving:

- products without `bookingPartnerHandoff` do not show `Check availability`;
- products with a verified handoff show `Check availability`;
- handoff links use `target="_blank"`;
- handoff links use `rel="nofollow sponsored noopener noreferrer"`;
- invalid URLs are rejected and do not render;
- internal `/tours/{id}` paths are not treated as handoff URLs;
- Bókun IDs are not converted into URLs;
- LLM/reviewed-enrichment/candidate `bookingUrl` is ignored;
- forbidden tourist-facing copy remains absent;
- no `/api/bokun`, checkout, payment, booking submission, live availability, or DB write behavior is introduced;
- `/tours/{id}` remains excluded from sitemap unless a later explicit SEO task changes that policy.

## 11. Preview dependency

Before implementing or deploying DB-backed `/tours/{id}` handoff behavior, RadarScout still needs a safe Preview/Staging `DATABASE_URL`.

The required follow-up is:

```text
TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-0
```

Then rerun:

```text
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1-POSTMERGE-PREVIEW-RETRY
```

Do not use a local `localhost` database for Vercel Preview.

Do not read, print, copy, or repurpose production secrets.

## 12. Recommended next implementation sequence

Recommended order:

```text
1. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CONTRACT-0
   Docs-only contract and safety gates.

2. TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-0
   Verify Preview/Staging DATABASE_URL setup without exposing secrets.

3. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-1
   Identify the first verified source of product-specific public booking partner URLs.

4. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-VALIDATION-1
   Add validation helpers and tests only.

5. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-UI-1
   Render optional Check availability on /tours/{id} only when the validated handoff exists.

6. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-PREVIEW-SMOKE
   Validate from clean Preview deployment.

7. Production deploy
   Only after explicit approval.
```

## 13. Current recommendation

Do not add product-specific `Check availability` to `/tours/{id}` yet.

Proceed only after:

- the handoff source is explicit and verified;
- the URL validator exists;
- Preview DB-backed smoke is available;
- tests prove unsafe sources are ignored;
- SEO and sitemap remain closed for `/tours/{id}`.
