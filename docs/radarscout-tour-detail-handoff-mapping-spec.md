# RadarScout tour detail handoff mapping spec

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-SPEC-0`

## 1. Purpose

Define a safe implementation approach for connecting selected public `/tours/{id}` detail products to verified booking-partner handoff URLs.

This is a docs-only specification. It does not implement the mapping, change runtime behavior, write the database, change schema, call Bókun, change sitemap output, open SEO indexing, deploy, or touch ThaiEleHub.

## 2. Current source behavior

Relevant implementation surfaces:

```text
apps/web/lib/publicProducts/getPublicThailandProduct.ts
apps/web/lib/publicProducts/bookingPartnerHandoff.ts
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
apps/web/app/tours/[id]/page.tsx
apps/web/app/sitemap.ts
```

Current behavior:

- `loadPublicThailandProductDetail(id)` loads active, Thailand-eligible products by public product UUID.
- Public product output includes `bookingPartnerHandoff` only when `resolveOwnerManagedProfileHandoff(product.bokunActivityId)` returns a valid handoff.
- `resolveOwnerManagedProfileHandoff` matches numeric `bokunActivityId` against `ownerManagedBokunProfiles`.
- Handoff URL validation requires public HTTPS URLs and rejects private/admin/backend/database/staging/preview/internal/credential-bearing URLs.
- Tour detail UI renders `Check availability` only when `product.bookingPartnerHandoff` exists.
- CTA `rel` is fixed to `nofollow sponsored noopener noreferrer`.
- `/tours/{id}` metadata remains `noindex,nofollow`.
- `sitemap.ts` currently returns static routes only and does not emit `/tours/{id}` URLs.

## 3. Current production gap

Recent read-only reviews found:

```text
Public products sampled: 53 unique public products
Public products exposing bookingPartnerHandoff: 0
Owner-managed numeric activity IDs checked: 9
Owner-managed numeric IDs resolving through public product API: 0
```

Reason:

- public tour detail IDs are product UUIDs;
- owner-managed source IDs are numeric Bókun activity IDs;
- public API output does not expose `bokunActivityId`;
- title similarity is not safe enough to promote a product to `Check availability`.

Therefore:

```text
No current product should receive Check availability from title matching alone.
```

## 4. Recommended design

Implement a small, explicit, code-reviewed mapping from public product UUID to owner-managed activity ID.

Recommended concept:

```ts
type PublicProductOwnerManagedHandoffMapping = {
  publicProductId: string
  ownerManagedBokunId: string
  reviewedBy: 'operator_manual_review'
  reviewNote: string
}
```

Recommended file:

```text
apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts
```

Recommended helper:

```text
resolveReviewedProductHandoff(publicProductId, bokunActivityId)
```

Behavior:

1. The helper receives the public product UUID and the DB product `bokunActivityId`.
2. It looks for an exact reviewed mapping by public product UUID.
3. If a mapping exists, the mapping's `ownerManagedBokunId` must exactly match the DB product `bokunActivityId`.
4. Only then should it call `resolveOwnerManagedProfileHandoff(ownerManagedBokunId)`.
5. If any check fails, return `null`.

Required exact-match rule:

```text
public product UUID match AND bokunActivityId match are both required.
```

This prevents a stale UUID mapping or a title-only match from enabling a CTA.

## 5. Why not title matching

Do not map by:

- title contains;
- fuzzy title similarity;
- same city;
- same category;
- same price;
- same image;
- same supplier title;
- public page wording alone.

Reason:

```text
Tour titles can be duplicated, translated, edited, syndicated, or supplied by multiple operators. A false positive would expose a booking partner CTA on the wrong product.
```

Only exact reviewed identifiers should control public handoff behavior.

## 6. Proposed resolver contract

Recommended public contract:

```ts
export function resolveReviewedProductHandoff(input: {
  publicProductId: string
  bokunActivityId: string | null | undefined
}): PublicBookingPartnerHandoff | null
```

Required resolver behavior:

- trim both IDs;
- reject empty values;
- require public product ID to match a reviewed mapping;
- require mapped owner-managed ID to equal the current product `bokunActivityId`;
- call existing `resolveOwnerManagedProfileHandoff`;
- return `null` if the owner-managed profile URL fails validation;
- return `null` for all unmatched products.

Do not:

- expose the mapping through public API metadata;
- include review notes in public output;
- expose internal/source identifiers in visible UI;
- add a new public route;
- call Bókun API;
- write DB;
- change schema.

## 7. Loader integration point

Current loader code in `getPublicThailandProduct.ts` resolves handoff through:

```text
resolveOwnerManagedProfileHandoff(product.bokunActivityId)
```

Future implementation should replace direct resolution with the reviewed mapping helper:

```text
resolveReviewedProductHandoff({
  publicProductId: product.id,
  bokunActivityId: product.bokunActivityId,
})
```

Expected result:

- mapped products can become State A;
- unmapped products remain State B planning-only;
- blocked/unavailable products remain State C;
- public output shape stays the same.

## 8. Data shape rules

Mapping records should be small and explicit:

```ts
export const ownerManagedProductHandoffMappings = [
  {
    publicProductId: 'uuid-from-public-product-record',
    ownerManagedBokunId: '1232729',
    reviewedBy: 'operator_manual_review',
    reviewNote: 'Public product UUID confirmed to match owner-managed half-day morning profile.',
  },
] as const
```

Rules:

- `publicProductId` must be the UUID-style public product ID used in `/tours/{id}`;
- `ownerManagedBokunId` must be numeric and must exist in `ownerManagedBokunProfiles`;
- `reviewedBy` must be fixed to `operator_manual_review` for this mapping layer;
- `reviewNote` must remain internal and must not be rendered publicly;
- no prices, supplier rates, commission, credentials, backend URLs, or private notes should be stored here.

## 9. Required tests

Add focused unit tests for the mapping helper.

Required cases:

```text
mapped publicProductId + matching bokunActivityId returns Check availability handoff
mapped publicProductId + different bokunActivityId returns null
unmapped publicProductId returns null
empty publicProductId returns null
empty bokunActivityId returns null
mapping to missing owner-managed profile returns null
mapping to unsafe owner-managed URL returns null if such a case is testable through dependency injection or fixture
```

Add public product loader tests:

```text
mapped product includes bookingPartnerHandoff
unmapped product omits bookingPartnerHandoff
inactive product remains not-found
non-Thailand product remains not-found
public API does not expose rawJson
public API does not expose netSettlementPrice
public API does not expose commissionPercent
```

Add tour detail rendering tests:

```text
mapped product renders Check availability
CTA href is the verified external handoff URL
CTA rel is nofollow sponsored noopener noreferrer
unmapped product renders planning-only fallback
unmapped product does not render Check availability
forbidden copy remains absent
```

Add sitemap/SEO regression tests:

```text
sitemap still excludes /tours/{id}
tour detail metadata remains noindex,nofollow
no index/follow opening occurs
```

## 10. Forbidden behavior

Implementation must not add:

- Bókun API calls;
- Bókun edit/sync behavior;
- checkout;
- payment;
- cart;
- booking submission;
- reservation creation;
- live availability;
- inventory checks;
- instant confirmation;
- fake ratings;
- fake reviews;
- supplier backend wording;
- Bókun database wording;
- supplier net rate;
- partner rate;
- commission.

Implementation must not:

- add `/tours/{id}` to sitemap;
- open `/tours/{id}` to `index,follow`;
- make B2B pages indexable;
- add homepage/nav links to specific tour details;
- change product/profile data;
- change DB schema;
- write DB;
- read or print production secrets.

## 11. Candidate approval workflow

Before a mapping is added, the reviewer must produce a short approval note containing:

```text
public product UUID
public product title
owner-managed profile ID
owner-managed profile title
evidence that these refer to the same operator/product
reviewer
review date
decision: approve mapping / reject mapping / needs more evidence
```

Allowed evidence:

- operator-owned catalog record;
- manually reviewed internal source;
- public booking partner page that matches the product;
- existing owner-managed profile;
- product detail page output from RadarScout.

Disallowed evidence:

- title similarity alone;
- search result snippets;
- guessed operator ownership;
- unavailable/private/admin/backend URLs;
- unreviewed Bókun API response;
- rate/commission/private supplier data.

## 12. Preview and production gates

Implementation task should stop at PR first.

Preview gate:

```text
clean worktree
Prisma generate
focused public product tests
focused tour detail tests
focused sitemap/SEO tests
full Vitest
Playwright E2E
TypeScript
Next build
preview deployment only
tour detail smoke for mapped and unmapped product behavior
```

Production gate:

```text
explicit user approval for exact merge SHA
fresh clean production worktree
same validation set
npx vercel --prod --yes only after approval
post-production smoke
```

Production smoke must confirm:

- mapped product page returns `200`;
- mapped product shows `Check availability`;
- CTA opens external public booking partner URL;
- CTA `rel` remains `nofollow sponsored noopener noreferrer`;
- unmapped product remains planning-only;
- invalid product remains safe unavailable fallback;
- no `/api/bokun`;
- no OpenAI/LLM;
- no checkout/payment/booking submission;
- `/tours/{id}` remains excluded from sitemap;
- tour detail pages remain `noindex,nofollow`.

## 13. Recommended next implementation task

Recommended next task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1
```

Scope:

- add the mapping helper and empty mapping list or one explicitly approved mapping if provided;
- wire loader to use the reviewed helper;
- add tests for mapped/unmapped behavior;
- do not deploy;
- stop at PR.

If no explicit mapping is available, start with:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1A-EMPTY-INFRA
```

Scope:

- add empty mapping infrastructure and tests proving no current product gets a CTA by default;
- no production behavior change expected;
- stop at PR.

## 14. Guardrail confirmation

This spec does not:

- modify app code;
- change product data;
- write DB;
- change schema or environment variables;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, or booking submission;
- add live availability or inventory behavior;
- change Bókun widget URLs;
- change robots metadata;
- change sitemap generation;
- add `/tours/{id}` to sitemap;
- open SEO `index,follow`;
- deploy;
- touch ThaiEleHub files;
- run Shopify commands.
