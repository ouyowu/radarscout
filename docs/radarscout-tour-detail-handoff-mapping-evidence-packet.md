# RadarScout tour detail handoff mapping evidence packet

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PACKET-0`

## 1. Purpose

Create the review packet needed before RadarScout can add the first entry to:

```text
apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts
```

This document is docs-only. It does not change app code, route behavior, product data, sitemap output, robots metadata, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub assets.

## 2. Current blocker

The current reviewed mapping registry is intentionally empty:

```ts
export const ownerManagedProductHandoffMappings = []
```

The next code task, `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING`, must not start until at least one evidence packet is approved.

Reason:

```text
The owner-managed profile gives a reviewed ownerManagedBokunId and public handoff URL.
It does not prove which DB-backed publicProductId should receive that handoff.
```

## 3. Evidence required for one approved mapping

Each approved mapping needs one completed record:

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
reviewStatus: needs-info
reviewNote:
evidenceSource:
```

Allowed `reviewStatus` values:

```text
approved
rejected
needs-info
```

Allowed `evidenceSource` values:

```text
read_only_preview_db_query
read_only_production_db_query_with_explicit_approval
operator_manual_confirmation
public_booking_partner_page_review
manual_catalog_review
```

Disallowed evidence sources:

```text
title_similarity_only
public_search_result_only
raw_product_json_without_review
guessed_url
ai_generated_match
bokun_backend_url
supplier_admin_url
partner_rate_page
```

## 4. Approval checklist

All checks must pass before `reviewStatus` can be set to `approved`.

| Check | Required result | Notes |
| --- | --- | --- |
| Public product ID exists in reviewed environment | Pass | The ID must be a real `BokunProduct.id`, not an owner-managed activity ID. |
| Product is active | Pass | Do not map inactive records. |
| Product is Thailand-eligible | Pass | Use current public product eligibility rules. |
| Product has `supplierId` | Pass | Current public product loader requires supplier-backed records. |
| `BokunProduct.bokunActivityId` equals `ownerManagedBokunId` | Pass | This is the core mapping proof. |
| Product title reasonably matches owner-managed profile title | Pass | Similarity is supporting evidence only, not sufficient by itself. |
| Operator/camp identity is consistent | Pass | Use public-safe operator/camp names only. |
| Handoff URL comes from owner-managed profile | Pass | Do not infer URLs from raw product data. |
| Handoff URL passes `validatePublicBookingPartnerHandoff` | Pass | Must be public `https://` and non-private. |
| `/tours/{publicProductId}` remains `noindex,nofollow` | Pass | Mapping does not open SEO. |
| `/tours/{publicProductId}` remains excluded from sitemap | Pass | Mapping does not add sitemap entries. |

## 5. Owner-managed candidates still needing evidence

| Owner-managed Bókun ID | Owner-managed profile title | Camp | Candidate status |
| --- | --- | --- | --- |
| `1232729` | Half-Day Morning Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Needs public product ID evidence |
| `1232731` | Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Needs public product ID evidence |
| `1232733` | Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai | Living Green Elephant Sanctuary | Needs public product ID evidence |
| `1232736` | Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai | Living Green Elephant Sanctuary | Needs public product ID evidence |
| `1232798` | Inthanon Heaven Trail(Living Green Elephant Sanctuary) | Living Green Elephant Sanctuary | Needs public product ID evidence |
| `1232799` | Living Green Elephant Sanctuary Experience near Bangkok & Pattaya | Living Green Elephant Sanctuary | Needs separate Bangkok/Pattaya review |
| `1236811` | Day for Elephant Half-Day Morning-Bigboy | Big Boy Elephant Sanctuary Chiang Mai | Needs public product ID evidence |
| `1236820` | Day for Elephant Half-Day Afternoon | Big Boy Elephant Sanctuary Chiang Mai | Needs public product ID evidence |
| `1236830` | Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty | Big Boy Elephant Sanctuary Chiang Mai | Needs public product ID evidence |

## 6. Public API spot check

A public API search was run against:

```text
https://www.radarscout.io/api/products
```

Queries checked:

```text
elephant
living green
bigboy
big boy
pad thai
inthanon
bamboo rafting
```

Observed candidate-like public products:

| Public product ID | Title | City | Why it matched | Review status |
| --- | --- | --- | --- | --- |
| `011b5629-f233-43fe-aa79-0125aff362a6` | From Bangkok: Pattaya Ethical Elephant Jungle Sanctuary Day Trip | Bangkok | Title contains elephant | Not enough evidence |
| `9d1d653a-9ba9-4cd9-920f-eb478aaeaca6` | From Bangkok: Pattaya Ethical Elephant Sanctuary Day Trip | Bangkok | Title contains elephant | Not enough evidence |

Conclusion:

```text
Public API evidence is not enough to approve an owner-managed mapping.
```

Reason:

- public product responses do not expose `bokunActivityId`;
- title similarity is explicitly not an approved evidence source;
- the two candidate-like products are Bangkok/Pattaya results, not confirmed owner-managed Chiang Mai products;
- neither product can be tied to an owner-managed Bókun ID from public data alone.

## 7. First candidate worksheet

Use this section when a real mapping candidate is ready.

```yaml
recordId: owner-managed-mapping-candidate-001
publicProductId:
ownerManagedBokunId:
publicProductTitle:
ownerManagedProfileTitle:
operatorPublicName:
destination:
handoffUrl:
reviewedBy:
reviewedAt:
reviewStatus: needs-info
reviewNote: Pending proof that the public product ID has the matching bokunActivityId.
evidenceSource:
```

Checklist:

| Check | Result | Notes |
| --- | --- | --- |
| Public product ID exists in reviewed environment | Pending |  |
| Product is active | Pending |  |
| Product is Thailand-eligible | Pending |  |
| Product has `supplierId` | Pending |  |
| `BokunProduct.bokunActivityId` equals `ownerManagedBokunId` | Pending |  |
| Product title reasonably matches owner-managed profile title | Pending |  |
| Operator/camp identity is consistent | Pending |  |
| Handoff URL comes from owner-managed profile | Pending |  |
| Handoff URL passes `validatePublicBookingPartnerHandoff` | Pending |  |
| `/tours/{publicProductId}` remains `noindex,nofollow` | Pending |  |
| `/tours/{publicProductId}` remains excluded from sitemap | Pending |  |

## 8. Safe ways to collect the missing proof

Preferred next operational task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-READONLY-1
```

Goal:

```text
Run a read-only query against an approved non-production database to find active Thailand products whose bokunActivityId is in the owner-managed candidate list.
```

Required query output should be limited to:

```text
id
title
city
location
bokunActivityId
active
supplierId present/absent
```

Do not output:

```text
rawJson
supplier private fields
rates
commission
backend URLs
credentials
customer data
booking data
```

If the non-production database does not contain real synced product records, the next safe option is:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PROD-READONLY-PLAN
```

That task should plan a tightly scoped production read-only query and require explicit approval before accessing production data.

## 9. What not to do

Do not:

- add mapping entries from public title similarity alone;
- use public search results as proof of `bokunActivityId`;
- read or expose raw Bókun JSON for handoff purposes;
- guess public product IDs;
- guess Bókun widget URLs;
- add `Check availability` to unmatched products;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- change robots metadata;
- add `/tours/{id}` to sitemap.

## 10. Recommendation

Keep the reviewed mapping registry empty until at least one worksheet record is approved.

Current status:

```text
approved owner-managed mappings: 0
first candidate worksheet: needs-info
blocking missing proof: publicProductId -> bokunActivityId equality
```

Next safe step:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-READONLY-1
```

Only after that returns one approved record should RadarScout start:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING
```
