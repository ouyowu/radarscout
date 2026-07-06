# RadarScout tour detail handoff first production evidence

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-FIRST-PROD-EVIDENCE-0`

This document records a public-only production evidence check for the first possible `/tours/{id}` handoff mapping candidate.

No source code, database state, schema, environment variables, Bókun behavior, sitemap, robots metadata, deployment, or ThaiEleHub files were changed.

## 1. Review goal

Determine whether public production endpoints currently expose enough evidence to approve one real product for a reviewed tour-detail handoff mapping.

Required evidence for an approved mapping:

- production public product ID used by `/tours/{id}`;
- matching owner-managed Bókun activity ID;
- verified public handoff URL;
- safe product detail rendering;
- safe `Check availability` handoff with `nofollow sponsored noopener noreferrer`.

## 2. Public endpoints checked

Checked production endpoints:

```text
https://radarscout.io/api/products?destination=thailand&city=chiang-mai&take=12
https://radarscout.io/api/products/{sampled-public-product-id}
https://radarscout.io/api/ai-trip/search
```

The checks were public HTTP reads only.

## 3. Product list sample

The public Chiang Mai product list returned 12 products.

Sampled products:

| Public product ID | Title | Public handoff exposed |
| --- | --- | --- |
| `58478fa9-bd4f-4987-8c38-1235cdd49379` | Chiang Mai International Airport: Private Hotel Transfer | No |
| `aa4d78d7-4ad2-414b-bae2-59685a8604f6` | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | No |
| `0a07032a-7642-438f-a242-f63508587334` | Chiang Mai Traditional Khan Toke Meal & Cultural Performance | No |
| `95d61ecb-9fcc-435c-9768-8dd62dd823c7` | Chiang Mai Trekking and Bamboo Rafting Day Adventure | No |
| `0296469a-0f83-4e75-aa58-7c2dafcf21bb` | Chiang Mai: Elephant Sanctuary with Lunch Day Tours | No |
| `06c72400-c401-4a9d-b772-2aef807e31e8` | Chiang Mai: Ethical Elephant Sanctuary Full Day Tour & Lunch | No |
| `9cc17fa9-a490-4d24-8417-296294288417` | Chiang Mai: Ethical Elephant Sanctuary Interactive Tour | No |
| `0c78ee1c-1336-4523-877e-e96d96d76b44` | Chiang Mai: Half day Walk with Elephant Include Lunch | No |
| `4d5d64f7-fea1-49f0-8b33-31fead59947b` | Chiang Mai: Private Airport Transfer to or from Chiang Rai | No |
| `a45c3d00-c64c-414b-9322-3d1d10da0365` | Chiang Mai: Waterfall, Elephant Sanctuary and Bamboo Rafting | No |
| `d2d4b3af-3b19-456d-b3c9-77bea03e4049` | Chiang Mai:Ethical Elephant Observation Nature Park Visit | No |
| `1d938585-e212-44c2-ae7d-d4e3d3eba193` | Chiang Rai: Private Hotel Transfer to Chiang Mai airport or Chiang Mai Town, Mae Rim | No |

## 4. Product detail sample

Sampled detail endpoints returned product records, but no public `bookingPartnerHandoff`.

| Public product ID | Detail status | Public handoff exposed |
| --- | --- | --- |
| `58478fa9-bd4f-4987-8c38-1235cdd49379` | 200 / product loaded | No |
| `aa4d78d7-4ad2-414b-bae2-59685a8604f6` | 200 / product loaded | No |
| `0296469a-0f83-4e75-aa58-7c2dafcf21bb` | 200 / product loaded | No |
| `06c72400-c401-4a9d-b772-2aef807e31e8` | 200 / product loaded | No |
| `9cc17fa9-a490-4d24-8417-296294288417` | 200 / product loaded | No |

## 5. AI Trip Planner sample

Public AI Trip Planner searches were checked with Chiang Mai elephant prompts.

Observed result:

```text
status: no_match
product count: 0
```

This does not provide handoff evidence for a production mapping candidate.

## 6. Evidence decision

Decision:

```text
No production handoff mapping should be approved from public-only evidence.
```

Reason:

- sampled public list records expose no `bookingPartnerHandoff`;
- sampled public detail records expose no `bookingPartnerHandoff`;
- public product responses do not expose owner-managed activity IDs;
- public-only evidence cannot prove a public product ID matches an owner-managed Bókun activity ID;
- approving a mapping from title similarity would violate the handoff mapping policy.

## 7. SEO candidate impact

No `/tours/{id}` page should be added to the SEO candidate registry from this evidence.

Current safe state should remain:

- handoff mapping registry empty;
- tour detail SEO candidate registry empty;
- `/tours/{id}` pages stay `noindex,nofollow` by default;
- `/tours/{id}` URLs stay out of sitemap by default.

## 8. Recommended next task

Recommended next task:

`TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-FIRST-APPROVED-MAPPING-INPUT-0`

Scope:

- obtain one exact production public product ID to owner-managed activity ID pairing from an approved non-public evidence source;
- evidence source may be a reviewed production read-only query or an operator-provided mapping record;
- do not add the mapping until the evidence record is complete;
- do not open SEO;
- do not deploy.

The next implementation PR should only happen after this input exists.
