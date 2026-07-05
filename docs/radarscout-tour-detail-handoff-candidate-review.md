# RadarScout tour detail handoff candidate review

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-REVIEW-0`

## 1. Purpose

This document reviews whether any current production product can safely move from planning-only tour detail behavior to verified booking-partner handoff behavior.

This is docs/read-only. It does not change app code, product data, database state, Bókun behavior, sitemap output, robots metadata, environment variables, deployments, or any ThaiEleHub asset.

## 2. Review conclusion

Current conclusion:

```text
No current production public product can be promoted to State A from public evidence alone.
```

Reason:

- public product list samples expose `0` `bookingPartnerHandoff` entries;
- owner-managed source profile IDs are numeric Bókun activity IDs;
- public tour detail product IDs are UUID-style product IDs;
- direct public API checks for all owner-managed numeric IDs returned `404`;
- public `/tours/{numeric-owner-id}` pages return safe unavailable fallback pages, not real product details;
- therefore there is no confirmed public product-to-owner-managed-activity mapping available from public production endpoints.

Policy implication:

```text
Keep all current public tour detail products planning-only unless an explicit, reviewed mapping is added.
Keep /tours/{id} noindex,nofollow.
Keep /tours/{id} excluded from sitemap.
Do not add Check availability to any product by title similarity alone.
```

## 3. Inputs checked

Public production endpoints checked:

```text
https://radarscout.io/api/products?destination=thailand&take=24
https://radarscout.io/api/products?destination=thailand&take=24&city=chiang-mai
https://radarscout.io/api/products?destination=thailand&take=12&city=bangkok
https://radarscout.io/api/products?destination=thailand&take=12&city=pattaya
https://radarscout.io/api/products/{owner-managed-numeric-id}
https://radarscout.io/tours/{owner-managed-numeric-id}
```

Source file inspected:

```text
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
```

No `.env.production` file was read.
No DB query was run.
No Bókun API was called.

## 4. Public product list result

Observed public list counts:

| Query | Count |
| --- | ---: |
| Thailand sample | 24 |
| Chiang Mai sample | 17 |
| Bangkok sample | 12 |
| Pattaya sample | 12 |

Unique public products discovered across samples:

```text
53
```

Observed public handoff coverage:

```text
Products exposing bookingPartnerHandoff: 0
```

The public list API still reports:

```text
bookingEnabled: false
availabilityEnabled: false
inventoryScope: thailand-first
source: signed-bokun-supplier-products
```

## 5. Owner-managed source ID direct-match review

Owner-managed profiles checked:

| Source activity ID | Source title | API status | Tour page status | Review result |
| --- | --- | ---: | ---: | --- |
| `1232729` | Half-Day Morning Elephant Sanctuary Program in Chiang Mai | 404 | 200 | Not a public product ID |
| `1232731` | Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai | 404 | 200 | Not a public product ID |
| `1232733` | Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai | 404 | 200 | Not a public product ID |
| `1232736` | Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai | 404 | 200 | Not a public product ID |
| `1232798` | Inthanon Heaven Trail(Living Green Elephant Sanctuary) | 404 | 200 | Not a public product ID |
| `1232799` | Living Green Elephant Sanctuary Experience near Bangkok & Pattaya | 404 | 200 | Not a public product ID |
| `1236811` | Day for Elephant Half-Day Morning-Bigboy | 404 | 200 | Not a public product ID |
| `1236820` | Day for Elephant Half-Day Afternoon | 404 | 200 | Not a public product ID |
| `1236830` | Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty | 404 | 200 | Not a public product ID |

Interpretation:

```text
The owner-managed source IDs do not directly resolve through the public product API.
The 200 tour page responses are safe unavailable fallback pages, not confirmed product details.
```

## 6. Public review candidates

These products are relevant for future review, but they are not confirmed State A candidates.

| Public product ID | Title | Current result |
| --- | --- | --- |
| `06c72400-c401-4a9d-b772-2aef807e31e8` | Chiang Mai: Ethical Elephant Sanctuary Full Day Tour & Lunch | Planning-only |
| `a45c3d00-c64c-414b-9322-3d1d10da0365` | Chiang Mai: Waterfall, Elephant Sanctuary and Bamboo Rafting | Planning-only |
| `d2d4b3af-3b19-456d-b3c9-77bea03e4049` | Chiang Mai:Ethical Elephant Observation Nature Park Visit | Planning-only |
| `0296469a-0f83-4e75-aa58-7c2dafcf21bb` | Chiang Mai: Elephant Sanctuary with Lunch Day Tours | Planning-only |
| `9cc17fa9-a490-4d24-8417-296294288417` | Chiang Mai: Ethical Elephant Sanctuary Interactive Tour | Planning-only |
| `aa4d78d7-4ad2-414b-bae2-59685a8604f6` | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | Planning-only |
| `0c78ee1c-1336-4523-877e-e96d96d76b44` | Chiang Mai: Half day Walk with Elephant Include Lunch | Planning-only |
| `968514d7-b271-4acf-a534-6a8a4048ebd0` | Pattaya: Ethical Elephant Sanctuary Day Trip (EJS Pattaya) | Planning-only |

These are useful because they fit RadarScout's Thailand experience direction, but they must not be promoted by title matching.

## 7. Missing evidence for State A promotion

State A promotion requires one of the following explicit evidence sources:

```text
1. Public product detail includes bookingPartnerHandoff.
2. A reviewed internal mapping connects a public product UUID to a verified owner-managed activity ID.
3. A reviewed operator/public-link source connects the public product to a validated external handoff URL.
```

Current review found:

```text
Public product detail includes bookingPartnerHandoff: no
Direct owner activity ID resolves as product ID: no
Reviewed internal UUID-to-activity mapping: not available in this read-only public review
Reviewed operator/public-link source: not available in this read-only public review
```

Therefore:

```text
Do not enable Check availability for any current public tour detail product yet.
```

## 8. Safe implementation options for later

### Option A: explicit reviewed mapping

Add a reviewed, code-controlled mapping from public product ID to owner-managed source profile.

Requirements:

- mapping is manually reviewed;
- tests prove only mapped UUIDs return `bookingPartnerHandoff`;
- unmatched products remain planning-only;
- mapping does not expose private supplier fields;
- no Bókun API call is added;
- no DB write is required at request time.

Risk:

```text
Low if mapping is small, explicit, reviewed, and covered by tests.
```

### Option B: operator-verified public link source

Add a separate approved source for operator-verified public URLs.

Requirements:

- URL passes `validatePublicBookingPartnerHandoff`;
- source is `operator_verified_public_link` or `booking_partner_verified_public_widget`;
- no admin/backend/database/private URL is accepted;
- no sensitive query keys are accepted;
- tests cover unsafe URL rejection.

Risk:

```text
Medium until there is a clear intake/review workflow.
```

### Option C: DB-backed reviewed handoff field

Add a reviewed handoff field in data storage later.

Requirements:

- schema proposal first;
- migration approval before any Prisma migrate command;
- write/admin workflow approval;
- audit trail for who reviewed the URL;
- preview DB migration and seed plan before production.

Risk:

```text
Higher because it requires schema/data governance.
```

## 9. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-SPEC-0
```

Goal:

Create a docs-only implementation spec for a small explicit reviewed mapping from public product UUIDs to owner-managed profile activity IDs.

The spec should define:

- mapping shape;
- validation rules;
- test cases;
- forbidden behavior;
- review workflow;
- how to prove no unmatched product receives a CTA;
- how to keep `/tours/{id}` out of sitemap until a separate SEO policy is approved.

Do not implement the mapping until that spec is reviewed.

## 10. Guardrail confirmation

This task did not:

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
