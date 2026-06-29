# RadarScout tour detail handoff source audit 1

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-1`

## 1. Purpose

Identify the first safe source path for product-specific booking partner handoff URLs on `/tours/{id}`.

This is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Current conclusion

RadarScout still should not add generic product-specific `Check availability` to every `/tours/{id}` page.

The first safe source path is narrower:

```text
BokunProduct.bokunActivityId
-> match ownerManagedBokunProfiles[].bokunId
-> use ownerManagedBokunProfiles[].bookingHandoffUrl
-> validate as PublicBookingPartnerHandoff
-> render Check availability only for matched products
```

This uses an existing manually curated RadarScout source and does not require:

- Bókun API calls;
- URL guessing;
- raw JSON exposure;
- LLM output;
- DB schema changes;
- checkout, payment, booking submission, inventory, or live availability behavior.

## 3. Evidence inspected

Relevant source files:

```text
apps/web/lib/publicProducts/getPublicThailandProduct.ts
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
apps/web/lib/elephantFinder/scoreElephantCamp.ts
apps/web/lib/elephantFinder/types.ts
apps/web/lib/bokunCatalog.ts
apps/web/lib/productEnrichmentReview.ts
apps/web/lib/localAi/productEnrichment.ts
packages/db/prisma/schema.prisma
docs/radarscout-tour-detail-handoff-source-audit.md
docs/radarscout-tour-detail-handoff-contract.md
docs/radarscout-preview-env-database-url-runbook.md
```

Current public product detail type:

```text
PublicThailandProduct:
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

It does not expose:

```text
bookingPartnerHandoff
bookingUrl
bokunActivityId
rawJson
supplier backend fields
```

Current product detail loader selects `rawJson` only to derive safe public facts and descriptions. It does not return `rawJson` and does not return any booking URL.

The DB model has:

```text
BokunProduct.bokunActivityId
```

This is useful as a server-side match key, but it should not become a public booking URL source by itself.

## 4. Source candidates assessed

### Candidate A: owner-managed Bókun profiles

Current source:

```text
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
```

Evidence:

- profiles are manually curated for Chiang Mai owner-managed experiences;
- each relevant profile has `bokunId`;
- each relevant profile has explicit `bookingHandoffUrl`;
- the Chiang Mai finder already uses these URLs with:

```text
CTA: Check availability
externalHandoff: true
rel: nofollow sponsored noopener noreferrer
```

Assessment:

```text
Safe first source for matched products only.
```

Required constraint:

```text
Match by BokunProduct.bokunActivityId === ownerManagedBokunProfiles[].bokunId.
```

Do not match by:

- internal RadarScout product ID;
- product title;
- URL substring;
- raw JSON;
- guessed Bókun widget path.

### Candidate B: raw Bókun catalog JSON

Current source:

```text
BokunProduct.rawJson
```

Assessment:

```text
Not approved.
```

Reasons:

- raw JSON may contain backend, private, supplier, or non-public fields;
- current public product readers intentionally do not expose `rawJson`;
- the existing read-only catalog sets `bookingEnabled: false` and `availabilityEnabled: false`;
- extracting URL-like fields from raw JSON would widen the public data surface without manual verification.

### Candidate C: generated or reviewed enrichment

Current sources:

```text
apps/web/lib/localAi/productEnrichment.ts
apps/web/lib/productEnrichmentReview.ts
```

Assessment:

```text
Not approved.
```

Evidence:

- `bookingUrl` is a forbidden generated/reviewed field;
- `rawJson`, `availability`, `checkout`, and `payment` are also rejected;
- LLM or enrichment output must remain content-only, not a booking URL source.

### Candidate D: Bókun API or sync

Current source areas:

```text
apps/web/lib/bokun.ts
apps/web/lib/bokunSync.ts
apps/web/app/api/internal/bokun/sync/route.ts
```

Assessment:

```text
Not approved for this phase.
```

Reasons:

- this would require Bókun API behavior;
- user boundaries explicitly prohibit Bókun API/edit/sync for current work;
- API-derived availability, checkout, payment, confirmation, or inventory behavior would cross RadarScout's transaction boundary.

### Candidate E: manual operator public link registry

Potential future source:

```text
operator_verified_public_link
```

Assessment:

```text
Good future source, but not present today.
```

This would require a separate intake/review workflow and likely a persistence decision. It should not be invented in code or derived from existing unsafe fields.

## 5. Recommended first implementation path

Recommended next implementation task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-VALIDATION-1
```

Safe scope:

1. Add a pure validation helper:

```text
validatePublicBookingPartnerHandoff(input) -> PublicBookingPartnerHandoff | null
```

2. Add a server-side resolver:

```text
resolveOwnerManagedProfileHandoff(bokunActivityId) -> PublicBookingPartnerHandoff | null
```

3. Use only:

```text
BokunProduct.bokunActivityId
ownerManagedBokunProfiles[].bokunId
ownerManagedBokunProfiles[].bookingHandoffUrl
```

4. Do not render the CTA yet unless the task explicitly includes UI.

This keeps the next PR testable and narrow:

- no UI behavior change;
- no DB schema change;
- no Bókun API call;
- no checkout/payment/booking submission;
- no SEO or sitemap change.

## 6. Future UI path

After validation/resolver tests pass, a separate UI task may:

- extend `PublicThailandProduct` with optional `bookingPartnerHandoff`;
- select `bokunActivityId` server-side in the detail loader;
- resolve owner-managed handoff server-side;
- render `Check availability` on `/tours/{id}` only when `bookingPartnerHandoff` is present;
- keep unmatched products without product-specific handoff CTA;
- keep `/tours/{id}` excluded from sitemap;
- preserve current SEO state.

Required visible link behavior:

```text
text: Check availability
target: _blank
rel: nofollow sponsored noopener noreferrer
```

Allowed helper copy:

```text
Continue with a booking partner to review current details.
```

## 7. Required tests for validation task

Future validation-only tests should prove:

- owner-managed profile `bokunId` matches a product `bokunActivityId`;
- a matched profile returns a `PublicBookingPartnerHandoff`;
- unmatched products return `null`;
- invalid URLs return `null`;
- internal `/tours/{id}` URLs return `null`;
- guessed Bókun widget URLs are not generated from IDs;
- `bookingUrl` from enrichment/candidate paths remains ignored;
- raw JSON is not read for handoff resolution;
- returned handoff always uses:

```text
label: Check availability
rel: nofollow sponsored noopener noreferrer
source: owner_managed_profile
```

## 8. Required tests for later UI task

Future UI tests should prove:

- products without verified handoff do not show product-specific `Check availability`;
- products with verified owner-managed handoff show `Check availability`;
- CTA links open externally;
- CTA rel includes `nofollow sponsored noopener noreferrer`;
- no `/api/bokun` call is introduced;
- no checkout, payment, booking submission, live availability, or inventory behavior is introduced;
- forbidden tourist-facing copy remains absent;
- `/tours/{id}` remains excluded from sitemap unless a later explicit SEO task changes it.

## 9. Still blocked before Preview smoke

The Preview environment still needs a safe cloud-accessible `DATABASE_URL` before DB-backed product detail success smoke can be completed on Vercel Preview.

Do not:

- use a local `localhost` DB in Vercel Preview;
- read or print production secrets;
- copy production `DATABASE_URL` into Preview without explicit user approval;
- treat docs-only or local tests as proof that Preview DB-backed product detail works.

Relevant runbook:

```text
docs/radarscout-preview-env-database-url-runbook.md
```

## 10. Current recommendation

Proceed in this order:

```text
1. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-1
   Merge this source audit.

2. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-VALIDATION-1
   Add pure helper/resolver tests for owner-managed profile handoff.

3. TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-0
   Resolve or re-check Preview DB availability before Preview smoke.

4. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-UI-1
   Add optional /tours/{id} CTA only for verified matched products.
```

Do not implement generic tour detail handoff until an operator-verified public link registry exists.
