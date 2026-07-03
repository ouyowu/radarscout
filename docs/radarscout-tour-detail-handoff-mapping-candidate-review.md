# RadarScout tour detail handoff mapping candidate review

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1B-CANDIDATE-REVIEW`

## 1. Purpose

Review whether RadarScout has enough evidence to add real entries to:

```text
apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts
```

This is a docs-only review. It does not change app code, route behavior, product data, sitemap output, robots metadata, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub assets.

## 2. Current implementation baseline

PR #186 added the conservative mapping gate:

```text
publicProductId + BokunProduct.bokunActivityId
-> reviewed owner-managed product mapping
-> ownerManagedBokunProfiles[].bookingHandoffUrl
-> validatePublicBookingPartnerHandoff
-> optional bookingPartnerHandoff
```

Current registry state:

```ts
export const ownerManagedProductHandoffMappings = []
```

This is intentional. A public tour detail page must not render `Check availability` just because its `bokunActivityId` matches an owner-managed profile. The public product ID also has to be reviewed and explicitly mapped.

## 3. Evidence reviewed

Source files reviewed:

```text
apps/web/lib/publicProducts/getPublicThailandProduct.ts
apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts
apps/web/lib/publicProducts/bookingPartnerHandoff.ts
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
apps/web/app/tours/[id]/page.tsx
```

Policy and audit docs reviewed:

```text
docs/radarscout-tour-detail-handoff-policy.md
docs/radarscout-tour-detail-handoff-source-1.md
docs/radarscout-tour-detail-handoff-source-2.md
docs/radarscout-operator-handoff-url-collection.md
docs/radarscout-operator-handoff-outreach-request.md
docs/radarscout-tour-detail-data-safety-audit.md
docs/radarscout-tour-detail-handoff-coverage-audit.md
```

Public production API spot check:

```text
GET https://www.radarscout.io/api/products?take=100&destination=thailand
```

Observed:

```text
list_count: 50
sampled_details: 20
sampled_detail_with_handoff: 0
sampled_detail_without_handoff: 20
detail_errors: 0
```

Additional public samples:

```text
GET /api/products?take=24&destination=thailand&city=chiang-mai
GET /api/products?take=24&destination=thailand&q=elephant
```

Observed:

```text
Chiang Mai sample: 17 list results, 10 checked details, 0 handoffs.
Elephant sample: 24 list results, 10 checked details, 0 handoffs.
```

This confirms that public product detail responses currently do not expose reviewed handoff candidates.

## 4. Candidate source reviewed

The owner-managed profile source currently includes these possible activity-level candidates:

| Owner-managed Bókun ID | Title | Camp | City | Category | Review status |
| --- | --- | --- | --- | --- | --- |
| `1232729` | Half-Day Morning Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | `elephant_care` | Needs public product ID evidence |
| `1232731` | Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | `elephant_care` | Needs public product ID evidence |
| `1232733` | Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | `elephant_care` | Needs public product ID evidence |
| `1232736` | Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | `cooking_or_food` | Needs public product ID evidence |
| `1232798` | Inthanon Heaven Trail(Living Green Elephant Sanctuary) | Living Green Elephant Sanctuary | Chiang Mai | `nature_day_trip` | Needs public product ID evidence |
| `1232799` | Living Green Elephant Sanctuary Experience near Bangkok & Pattaya | Living Green Elephant Sanctuary | Bangkok & Pattaya | `elephant_care` | Not a Chiang Mai candidate; needs separate Bangkok/Pattaya review |
| `1236811` | Day for Elephant Half-Day Morning-Bigboy | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | `elephant_care` | Needs public product ID evidence |
| `1236820` | Day for Elephant Half-Day Afternoon | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | `elephant_care` | Needs public product ID evidence |
| `1236830` | Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | `local_experience` | Needs public product ID evidence |

These are activity-level handoff candidates only. They are not approved mapping entries yet.

## 5. Why no mapping should be added yet

The mapping registry requires both:

```text
publicProductId
ownerManagedBokunId
```

The owner-managed profile gives the reviewed `ownerManagedBokunId` and handoff URL, but it does not prove which DB-backed `BokunProduct.id` should receive that handoff in the public `/tours/{id}` route.

Do not infer the public product ID from:

- product title similarity;
- public list ordering;
- search results;
- URL guessing;
- `rawJson`;
- Bókun widget URL patterns;
- AI/LLM output;
- any backend/admin/supplier URL.

The next mapping PR should only add entries after a reviewer has a concrete evidence record that ties:

```text
BokunProduct.id
BokunProduct.bokunActivityId
public product title
operator/camp identity
approved public handoff URL
reviewer/date/note
```

## 6. Candidate classification

Current classification:

```text
approved mapping candidates: 0
needs-info owner-managed candidates: 9
blocked candidates: 0
```

Reason:

- the owner-managed profile URLs are already curated;
- the URL validator accepts owner-managed public widget URLs;
- the missing evidence is the reviewed public product ID mapping;
- public API responses intentionally do not expose `bokunActivityId`;
- reading production DB data was not required for this docs-only review.

## 7. Required evidence packet for the first approved mapping

Before adding the first registry entry, create or attach a review record with:

```yaml
recordId:
publicProductId:
ownerManagedBokunId:
publicProductTitle:
ownerManagedProfileTitle:
operatorPublicName:
destination:
handoffUrl:
reviewedBy:
reviewedAt:
reviewStatus: approved
reviewNote:
evidenceSource:
```

Minimum approval checks:

| Check | Required result |
| --- | --- |
| Public product exists in the reviewed environment | Pass |
| Public product is active | Pass |
| Product is Thailand-eligible | Pass |
| `BokunProduct.bokunActivityId` equals `ownerManagedBokunId` | Pass |
| Product title/operator reasonably match owner-managed profile | Pass |
| Handoff URL is the owner-managed profile URL | Pass |
| URL passes `validatePublicBookingPartnerHandoff` | Pass |
| Page remains noindex/nofollow | Pass |
| `/tours/{id}` remains excluded from sitemap | Pass |

## 8. Safe future implementation

Recommended next implementation only after at least one evidence packet is approved:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING
```

Scope:

- add one or more reviewed entries to `ownerManagedProductHandoffMappings`;
- add tests proving the exact public product ID and owner-managed Bókun ID pair resolves;
- add tests proving wrong product ID or wrong Bókun ID does not resolve;
- keep products without mapping planning-only;
- keep `/tours/{id}` `noindex,nofollow`;
- keep `/tours/{id}` out of sitemap;
- no Bókun API calls;
- no checkout, payment, booking submission, live availability, or inventory behavior.

If no evidence packet exists, the correct next action is operational, not code:

```text
Collect reviewed public product ID mapping evidence for one owner-managed Bókun ID.
```

## 9. Guardrail confirmation

This review did not:

- modify app behavior;
- add mapping entries;
- add product-specific CTAs;
- change Bókun widget URLs;
- call Bókun API;
- write to the database;
- change Prisma schema or migrations;
- change environment variables;
- open SEO `index,follow`;
- add `/tours/{id}` to sitemap;
- deploy preview or production;
- touch ThaiEleHub or Shopify files.

## 10. Recommendation

Do not add any mapping entries yet.

The safe path is:

```text
1. Keep PR #186 behavior: reviewed mapping registry stays empty.
2. Collect one reviewed evidence packet for a real public product ID.
3. Add the first approved mapping in a narrow code PR.
4. Preview-smoke the exact product page.
5. Consider production only after explicit approval.
```
