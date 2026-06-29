# RadarScout tour detail handoff source 2: operator verified public links

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2`

## 1. Purpose

Define the next safe source path for product-specific tour detail handoff URLs after the owner-managed profile source.

This document is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Current state

RadarScout now has one narrow verified handoff path:

```text
BokunProduct.bokunActivityId
-> ownerManagedBokunProfiles[].bokunId
-> ownerManagedBokunProfiles[].bookingHandoffUrl
-> resolveOwnerManagedProfileHandoff
-> optional PublicBookingPartnerHandoff
-> /tours/{id} Check availability CTA only when verified
```

That path is intentionally limited to owner-managed profiles already curated by RadarScout.

It does not solve broader operator coverage for normal `/tours/{id}` pages where:

- the product is public-safe enough for a detail page;
- no owner-managed profile exists;
- there may be an operator or booking partner public URL;
- the URL has not been manually verified.

RadarScout should not derive handoff URLs from raw Bókun JSON, generated enrichment, supplier backend fields, or guessed URL patterns.

## 3. Source 2 recommendation

The next safe source should be:

```text
operator_verified_public_link
```

Definition:

```text
A manually reviewed public URL supplied by, or verified against, an operator or booking partner page and approved for tourist-facing handoff use.
```

This source is different from:

- owner-managed profile links;
- raw Bókun catalog data;
- Bókun API responses;
- AI/LLM-generated `bookingUrl`;
- supplier admin or backend links;
- partner-rate or net-rate links;
- guessed links from product IDs.

## 4. Required data contract

The existing public handoff contract remains sufficient:

```ts
type PublicBookingPartnerHandoff = {
  href: string
  label: 'Check availability'
  rel: 'nofollow sponsored noopener noreferrer'
  source:
    | 'owner_managed_profile'
    | 'operator_verified_public_link'
    | 'booking_partner_verified_public_widget'
  verifiedBy: 'operator_manual_review' | 'owner_managed_catalog'
}
```

For Source 2, the expected values are:

```text
source: operator_verified_public_link
verifiedBy: operator_manual_review
label: Check availability
rel: nofollow sponsored noopener noreferrer
```

The handoff object must remain optional. Products without a verified public link must not render a product-specific `Check availability` CTA.

## 5. Manual intake requirements

Before a URL can be used as Source 2, collect at minimum:

```text
RadarScout product ID
Product title
Operator or supplier display name, if public-safe
Destination / city
Candidate public URL
URL source
Reviewer
Review date
Review notes
```

Allowed URL sources:

- operator email explicitly providing a public booking/product URL;
- operator website product page;
- public booking partner widget or public product page;
- manually reviewed public marketplace page, if it is intended for travelers.

Disallowed URL sources:

- supplier backend;
- admin dashboard;
- Bókun backend;
- Bókun database pages;
- private extranet;
- partner-rate or supplier-net-rate pages;
- tokenized preview links;
- staging or preview URLs;
- AI/LLM output;
- unaudited raw product JSON;
- guessed URLs.

## 6. URL validation checklist

Every candidate Source 2 URL must pass:

- absolute `https://` URL;
- public internet page intended for travelers;
- no localhost, private network, internal, staging, preview, or admin host;
- no embedded username/password;
- no access token, session token, API key, or private signed parameter;
- no partner-rate, supplier-rate, commission, backend, database, or extranet wording in the URL;
- no query parameters containing secrets or private tracking identifiers;
- no dependency on logged-in supplier/admin sessions;
- no visible claim that RadarScout itself completes checkout, payment, booking, or confirmation.

If any check fails, the product should omit `bookingPartnerHandoff`.

## 7. Review checklist for visible page copy

The destination page behind a Source 2 URL should be reviewed for obvious tourist-facing safety problems.

Reject or hold for manual decision if the handoff page prominently depends on:

- private supplier/admin context;
- live availability claims that RadarScout would appear to repeat;
- payment or checkout wording that could be mistaken as RadarScout checkout;
- fake reviews or fake ratings;
- unverified awards;
- partner-rate or net-rate language;
- backend, database, powered-by, or supplier portal language.

Acceptable handoff context:

- public product details;
- public booking partner page;
- public operator product page;
- current price/details handled by the partner page;
- external handoff where RadarScout remains discovery/recommendation only.

## 8. Storage options

Source 2 should not be added directly to random code paths.

Safe implementation options:

### Option A: Static reviewed registry

Add a small server-only reviewed registry, for example:

```text
apps/web/lib/publicProducts/operatorVerifiedHandoffs.ts
```

Characteristics:

- fastest safe MVP;
- reviewed through normal PR workflow;
- no DB write required;
- easy to audit in code review;
- suitable for the first small batch of operator links.

Recommended first implementation if the number of links is small.

### Option B: Reviewed database table

Add a persistence-backed review table later.

This requires:

- schema design;
- migration approval;
- explicit DB write authorization;
- admin/review workflow;
- rollback plan.

Not recommended for the next implementation unless product volume requires it.

### Option C: External spreadsheet/manual catalog

Use a controlled external source that exports to a reviewed static registry.

This may be useful for operations, but the public app should still consume a reviewed and validated artifact, not live unaudited spreadsheet rows.

## 9. Recommended first implementation shape

Recommended task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY
```

Scope:

- add a server-only static registry for `operator_verified_public_link`;
- add validation tests using the existing `validatePublicBookingPartnerHandoff` helper;
- extend product detail handoff resolution to check Source 2 after Source 1;
- render the existing CTA with no UI copy change;
- keep `bookingPartnerHandoff` optional;
- keep `/tours/{id}` out of sitemap;
- keep robots unchanged.

Resolution order:

```text
1. owner_managed_profile
2. operator_verified_public_link
3. no handoff
```

Do not let Source 2 override Source 1 unless a future task explicitly defines conflict resolution.

## 10. Tests for future implementation

Required tests:

- valid operator URL resolves to `PublicBookingPartnerHandoff`;
- invalid http URL is rejected;
- localhost/private/internal/admin/staging URL is rejected;
- URL with token/API key/session-like query parameter is rejected;
- unmatched product does not get handoff;
- owner-managed source still takes precedence;
- `/tours/{id}` renders `Check availability` only when `bookingPartnerHandoff` exists;
- external CTA keeps `target="_blank"`;
- external CTA keeps `rel="nofollow sponsored noopener noreferrer"`;
- forbidden copy remains absent;
- sitemap still excludes `/tours/{id}`;
- robots remain `noindex,nofollow`;
- no Bókun API, checkout, payment, booking submission, DB write, schema, env, LLM, or ThaiEleHub behavior is introduced.

## 11. Production and preview gates

Preview limitation remains:

```text
Vercel Preview currently has no public product data for DB-backed smoke.
```

Do not use production deploy as a substitute for preview data configuration.

Before production deployment of Source 2 implementation:

- run full validation;
- use clean worktree;
- create preview deployment only;
- smoke what preview can prove;
- document any preview data limitation;
- require explicit production approval.

## 12. Guardrails

Source 2 does not authorize:

- Bókun API calls;
- Bókun product edits;
- Bókun sync;
- live availability;
- inventory behavior;
- checkout;
- payment;
- cart;
- booking submission;
- confirmation;
- supplier dashboard;
- agent portal;
- login/account expansion;
- DB writes;
- schema changes;
- env changes;
- SEO `index,follow` opening;
- `/tours/{id}` sitemap re-entry;
- ThaiEleHub or Shopify work.

## 13. Recommended next task

Recommended next step:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY
```

But only after at least one real operator public URL has been manually collected and reviewed.

If no real reviewed operator URL is available yet, the safer next task is:

```text
TD-RADARSCOUT-OPERATOR-HANDOFF-INTAKE-FORM-DOCS
```

That task should define the manual intake form fields and review workflow before any Source 2 code is written.
