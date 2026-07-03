# RadarScout tour detail handoff candidate list

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-LIST-0`

## 1. Purpose

This document lists safe candidate groups for future `/tours/{id}` booking-partner handoff coverage.

It is docs/read-only. It does not change app code, product data, database state, Bókun behavior, sitemap output, robots metadata, environment variables, deployments, or any ThaiEleHub asset.

## 2. Current production inputs checked

Public production endpoints checked:

```text
https://radarscout.io/api/products?destination=thailand&take=24
https://radarscout.io/api/products?destination=thailand&take=24&city=chiang-mai
https://radarscout.io/api/products?destination=thailand&take=12&city=bangkok
https://radarscout.io/api/products?destination=thailand&take=12&city=pattaya
```

Observed:

```text
All-products sample: 24 products
Chiang Mai sample: 17 products
Bangkok sample: 12 products
Pattaya sample: 12 products
Unique public products discovered across samples: 53
Products exposing bookingPartnerHandoff in public list output: 0
```

The public list API reports:

```text
bookingEnabled: false
availabilityEnabled: false
inventoryScope: thailand-first
source: signed-bokun-supplier-products
```

Interpretation:

```text
No current public product can be treated as a confirmed State A handoff candidate from public API evidence alone.
```

## 3. Current confirmed State A list

Confirmed State A products:

```text
None
```

Reason:

- no sampled public product exposes `bookingPartnerHandoff`;
- the public product list intentionally does not expose internal activity IDs;
- State A requires a verified public handoff URL and fixed `Check availability` contract;
- a candidate cannot be promoted from public title matching alone.

## 4. Public product review candidates

These products are useful review candidates because their public titles fit RadarScout's Chiang Mai / Thailand experience direction. They are not approved handoff products yet.

### High-priority review candidates

| Public product ID | Title | Why review | Current state |
| --- | --- | --- | --- |
| `06c72400-c401-4a9d-b772-2aef807e31e8` | Chiang Mai: Ethical Elephant Sanctuary Full Day Tour & Lunch | Elephant, sanctuary/care, planner-fit wording | State B candidate only |
| `a45c3d00-c64c-414b-9322-3d1d10da0365` | Chiang Mai: Waterfall, Elephant Sanctuary and Bamboo Rafting | Elephant, sanctuary/care, planner-fit wording | State B candidate only |
| `d2d4b3af-3b19-456d-b3c9-77bea03e4049` | Chiang Mai:Ethical Elephant Observation Nature Park Visit | Elephant, sanctuary/care, planner-fit wording | State B candidate only |
| `0296469a-0f83-4e75-aa58-7c2dafcf21bb` | Chiang Mai: Elephant Sanctuary with Lunch Day Tours | Elephant, sanctuary/care wording | State B candidate only |
| `9cc17fa9-a490-4d24-8417-296294288417` | Chiang Mai: Ethical Elephant Sanctuary Interactive Tour | Elephant, sanctuary/care wording | State B candidate only |
| `968514d7-b271-4acf-a534-6a8a4048ebd0` | Pattaya: Ethical Elephant Sanctuary Day Trip (EJS Pattaya) | Elephant, sanctuary/care wording | State B candidate only |

### Medium-priority review candidates

| Public product ID | Title | Why review | Current state |
| --- | --- | --- | --- |
| `aa4d78d7-4ad2-414b-bae2-59685a8604f6` | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | Elephant, nature/planner-fit wording | State B candidate only |
| `0c78ee1c-1336-4523-877e-e96d96d76b44` | Chiang Mai: Half day Walk with Elephant Include Lunch | Elephant, half-day/planner-fit wording | State B candidate only |

Recommended handling:

```text
Keep these products planning-only until a verified handoff source is reviewed and connected.
Do not show Check availability for these products until the handoff contract is satisfied.
Do not add these product detail pages to sitemap.
Do not open these product detail pages to index,follow.
```

## 5. Owner-managed profile source candidates

The current codebase contains owner-managed profile records that already define public handoff source candidates for the Chiang Mai planner.

Source inspected:

```text
apps/web/lib/elephantFinder/ownerManagedBokunProfiles.ts
```

Profile candidates:

| Activity ID | Public profile title | Camp | City | Category | Duration |
| --- | --- | --- | --- | --- | --- |
| `1232729` | Half-Day Morning Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | elephant_care | half_day |
| `1232731` | Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | elephant_care | half_day |
| `1232733` | Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | elephant_care | full_day |
| `1232736` | Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai | Living Green Elephant Sanctuary | Chiang Mai | cooking_or_food | full_day |
| `1232798` | Inthanon Heaven Trail(Living Green Elephant Sanctuary) | Living Green Elephant Sanctuary | Chiang Mai | nature_day_trip | full_day |
| `1232799` | Living Green Elephant Sanctuary Experience near Bangkok & Pattaya | Living Green Elephant Sanctuary | Bangkok & Pattaya | elephant_care | flexible |
| `1236811` | Day for Elephant Half-Day Morning-Bigboy | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | elephant_care | half_day |
| `1236820` | Day for Elephant Half-Day Afternoon | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | elephant_care | half_day |
| `1236830` | Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty | Big Boy Elephant Sanctuary Chiang Mai | Chiang Mai | local_experience | full_day |

Important distinction:

```text
These are source candidates, not confirmed production tour detail candidates.
```

They become confirmed State A tour detail candidates only if a production public product record can be safely matched to the owner-managed activity ID through the existing loader contract.

## 6. Candidate promotion rules

A product may move from State B to State A only when all checks pass:

```text
Product is active.
Product is Thailand-eligible.
Product detail page uses display-safe public fields only.
Product has a verified public booking partner handoff URL.
The URL passes validatePublicBookingPartnerHandoff.
CTA label is exactly Check availability.
CTA rel is exactly nofollow sponsored noopener noreferrer.
No live availability, inventory, checkout, payment, cart, booking submission, or confirmation behavior is introduced.
No Bókun API call is introduced.
No supplier backend, rate, commission, or private fields are exposed.
```

Promotion must not be based on:

- public title similarity alone;
- fuzzy match between product titles and owner-managed profile names;
- inferred availability;
- inferred operator ownership;
- unreviewed URL fields;
- scraped booking links;
- private/admin/backend URLs.

## 7. Recommended review workflow

Use a three-step review before enabling more handoff coverage.

### Step 1: candidate matching review

Read-only objective:

```text
Determine whether any production public product maps to an owner-managed profile activity ID.
```

Allowed evidence:

- public product ID;
- public title;
- public destination/city;
- public detail page behavior;
- owner-managed profile activity ID/title from source code;
- approved internal mapping evidence only if explicitly authorized.

Forbidden:

- DB writes;
- Bókun API calls;
- Bókun product edits or sync;
- exposing private supplier/backend/rate fields;
- printing secrets or private URLs.

### Step 2: handoff contract test

Implementation objective:

```text
Add or extend tests proving matched State A products return bookingPartnerHandoff and unmatched products remain planning-only.
```

Required tests:

- matched owner-managed activity ID returns `bookingPartnerHandoff`;
- unmatched public product omits `bookingPartnerHandoff`;
- invalid or unsafe URL fails validation;
- tour detail page renders `Check availability` only for State A;
- CTA rel remains `nofollow sponsored noopener noreferrer`;
- no checkout/payment/booking/live-availability wording appears.

### Step 3: production observation

Observation objective after deploy approval:

```text
Verify at least one real production State A tour detail page renders the handoff CTA safely.
```

Expected:

- page returns 200;
- page remains noindex,nofollow;
- `Check availability` appears only for verified handoff product;
- CTA href is external public booking partner URL;
- no `/api/bokun`;
- no checkout/payment/booking submission request;
- no live availability or inventory claim;
- `/tours/{id}` remains excluded from sitemap.

## 8. SEO policy

Current policy remains unchanged:

```text
/tours/{id} remains noindex,nofollow.
/tours/{id} remains excluded from sitemap.
State B products are not SEO candidates.
State C products are never SEO candidates.
State A products are only candidates for later SEO review, not automatic index/follow opening.
```

Do not start tour-detail SEO opening until there is stable State A production coverage and a separate SEO candidate policy.

## 9. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-REVIEW-0
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CONTRACT-TEST-1
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-COVERAGE-1
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0
```

Immediate next task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-CANDIDATE-REVIEW-0
```

Recommended scope:

- read-only review first;
- confirm whether any current production product can be matched to a source candidate;
- if no match exists, document the missing data/mapping requirement;
- do not implement handoff coverage until the match evidence is explicit.

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
