# RadarScout tour page public-safety remediation plan

Task: `TD-RADARSCOUT-TOUR-PAGE-PUBLIC-SAFETY-PLAN-0`

Date: 2026-06-28

## 1. Purpose

This document defines the remediation path for making RadarScout tour listing and tour detail pages public-safe before they are considered for sitemap inclusion or SEO indexing.

Current route family:

```text
/tours
/tours/{id}
```

This is a docs-only plan. It does not change app code, page rendering, metadata, robots, sitemap output, product data, Bókun URLs, database schema, environment variables, analytics, production deployment, or ThaiEleHub/Shopify files.

## 2. Current state

RadarScout has already completed the first sitemap safety fix:

```text
/tours/{id} URLs are excluded from sitemap.xml.
```

Current sitemap policy:

- keep safe static public URLs only;
- keep `/tours/{id}` out of sitemap;
- keep `/chiang-mai/elephant-camp-finder` out of sitemap while it remains `noindex,nofollow`;
- keep `/partners`, `/suppliers`, and `/destination-partners` out of sitemap while they remain `noindex,nofollow`.

Current tour route behavior:

- `/tours` is a display-only marketplace preview;
- `/tours/{id}` displays product detail data for eligible Thailand products;
- unknown or ineligible product detail pages return generic `noindex,nofollow` metadata;
- eligible product detail pages currently return product-specific metadata and canonical URLs;
- neither route should be treated as public-safe SEO content yet.

## 3. Why tour pages remain blocked

The previous sitemap safety audit identified that sampled `/tours/{id}` pages returned 200, had no page-level `noindex,nofollow` for eligible products, and contained tourist-facing wording that is unsafe for search snippets.

Confirmed source-level risks remain in the current tour page implementation:

- `payment`;
- `partner rate`;
- `Bókun supplier partner product database`;
- `signed Bókun supplier partners`;
- `display-only preview`;
- `availability is not checked`;
- `Booking and payment are not enabled`;
- `Bókun order`;
- `purchase flow remains disabled`.

These phrases are useful internal boundary language, but they are not appropriate for public tourist-facing SEO pages. They can create confusing snippets, imply unavailable transaction behavior, or expose supplier/backend implementation concepts.

## 4. Public-safe target state

Before `/tours` or `/tours/{id}` can be considered public-safe, the visible copy and metadata should use traveler-facing discovery language:

Allowed direction:

- trusted local experiences;
- compare Thailand experiences;
- guided discovery;
- product-page handoff;
- booking partner;
- check availability;
- operator-provided details;
- review what is included;
- continue with a booking partner.

Forbidden public tourist-facing wording:

- live availability;
- available now;
- guaranteed slot;
- instant confirmation;
- checkout;
- payment;
- reservation complete;
- Bókun backend;
- Bókun database;
- Bókun-powered;
- Bókun supplier partner product database;
- supplier net rate;
- partner rate;
- commission;
- fake reviews;
- fake ratings.

The public-safe target does not require RadarScout to become a booking engine. The transaction boundary remains:

```text
RadarScout = discovery / recommendation / comparison / handoff
Booking partner = availability / checkout / payment / confirmation
```

## 5. Route-specific remediation

### `/tours`

Current risk:

- The route is framed as a display-only marketplace preview.
- It exposes supplier/source boundary wording.
- It mentions booking and payment are disabled.
- Product cards can show `partner rate` when price is missing.
- It links to `/tours/{id}` detail previews.

Recommended future safe state:

- Reframe as a Thailand experience discovery index, not a marketplace preview.
- Avoid all `display-only`, `payment disabled`, `partner rate`, and backend/source wording.
- Replace missing price with a neutral phrase such as:

```text
See product details
```

or:

```text
Details provided by the booking partner
```

- Keep product cards factual and non-transactional.
- Keep CTA language as `View details` or `Check availability` only if it leads to an external booking partner handoff.

### `/tours/{id}`

Current risk:

- Eligible product pages are product-specific and can expose public metadata.
- Visible copy contains backend/source and transaction-boundary wording.
- FAQ mentions booking, payment, availability, Bókun supplier database, and partner-rate placeholders.
- Trust bar includes supplier source language.
- Price panel labels missing prices as `partner rate`.

Recommended future safe state:

- Add page-level `noindex,nofollow` until each detail page passes public-safety review.
- Reframe detail pages as product information and handoff pages.
- Remove backend/source terms from public UI.
- Replace transaction-boundary block with a traveler-safe handoff explanation:

```text
RadarScout helps you compare experience details. Final availability, booking details, and confirmation are handled by the booking partner.
```

- Use `Check availability` only for real external booking partner links.
- Do not create a booking submission, checkout, payment flow, or reservation state inside RadarScout.

## 6. Metadata and robots policy

Recommended near-term policy:

```text
/tours: noindex,nofollow until public-safe copy is complete
/tours/{id}: noindex,nofollow until public-safe copy and metadata are complete
```

Reasoning:

- Tour pages are not in sitemap, but eligible product detail pages can still be crawled through internal links or direct URLs.
- Product-specific metadata may produce unsafe snippets if crawled.
- Noindex should remain until the route family is intentionally opened.

Do not open `index,follow` on tour pages until:

1. visible copy is public-safe;
2. metadata is public-safe;
3. CTA/handoff behavior is safe;
4. sitemap policy is decided;
5. rendered-page forbidden-copy audit passes;
6. production smoke passes;
7. the user explicitly approves SEO opening.

## 7. Product data and handoff boundaries

Do not change product data in the remediation task unless separately approved.

Future implementation should not:

- edit Bókun products;
- call Bókun APIs;
- sync inventory;
- create booking submissions;
- add checkout, payment, cart, or reservation behavior;
- invent product titles, descriptions, ratings, reviews, availability, pickup facts, or prices;
- write to the database;
- change Prisma schema;
- change environment variables.

If a product field is missing, use neutral traveler-facing absence copy or omit the field.

## 8. Recommended implementation sequence

### Task 1: Tour route noindex containment

Recommended task:

```text
TD-RADARSCOUT-TOUR-PAGE-NOINDEX-0
```

Scope:

- add or confirm `noindex,nofollow` for `/tours`;
- add `noindex,nofollow` for eligible `/tours/{id}` metadata;
- do not change visible copy yet;
- keep sitemap unchanged;
- add metadata tests.

This is the lowest-risk containment step.

### Task 2: Tour public-copy rewrite

Recommended task:

```text
TD-RADARSCOUT-TOUR-PAGE-PUBLIC-COPY-0
```

Scope:

- remove tourist-facing unsafe copy from `/tours`;
- remove tourist-facing unsafe copy from `/tours/{id}`;
- replace backend/source language with traveler-facing handoff language;
- preserve routes and product data;
- preserve transaction boundaries;
- add forbidden-copy tests.

### Task 3: Tour CTA and handoff review

Recommended task:

```text
TD-RADARSCOUT-TOUR-PAGE-HANDOFF-REVIEW-0
```

Scope:

- decide whether detail pages should link directly to external booking partner widgets;
- keep CTA as `Check availability` only if it is an external handoff;
- confirm `rel="nofollow sponsored noopener noreferrer"` where applicable;
- do not add internal checkout or booking submission.

### Task 4: Tour sitemap re-evaluation

Recommended task:

```text
TD-RADARSCOUT-TOUR-SITEMAP-REEVALUATION-0
```

Scope:

- audit rendered pages after noindex/copy/handoff remediation;
- decide whether `/tours` or selected `/tours/{id}` pages should enter sitemap;
- keep SEO closed unless explicitly approved.

## 9. Test plan for future implementation

Future tests should cover:

- `/tours` metadata remains `noindex,nofollow` during remediation;
- eligible `/tours/{id}` metadata remains `noindex,nofollow` during remediation;
- unknown `/tours/{id}` metadata remains generic and `noindex,nofollow`;
- sitemap excludes `/tours/{id}`;
- sitemap excludes `/chiang-mai/elephant-camp-finder` while it remains `noindex,nofollow`;
- rendered `/tours` copy excludes forbidden tourist-facing wording;
- rendered `/tours/{id}` copy excludes forbidden tourist-facing wording;
- no fake ratings or reviews are rendered;
- no live availability, instant confirmation, checkout, payment, reservation, or completion claim is rendered;
- no Bókun backend/database/powered-by wording is rendered;
- no Bókun API call is introduced;
- no DB write, schema change, env change, OpenAI/LLM call, checkout/payment/booking request, or ThaiEleHub/Shopify change is introduced.

Recommended validation commands:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- tours
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

## 10. Safety gates

Every future implementation task must stop before production deployment unless the user explicitly approves an exact merge SHA.

Do not:

- open SEO indexing;
- add tour pages back to sitemap;
- add homepage/nav links to tour pages;
- add analytics;
- add LLM/OpenAI;
- call or sync Bókun;
- add checkout/payment/cart/booking submission;
- add live availability or inventory behavior;
- write to the database;
- change schema or env;
- touch ThaiEleHub files;
- run Shopify commands.

## 11. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-TOUR-PAGE-NOINDEX-0
```

Reason:

Eligible `/tours/{id}` pages can still produce product-specific metadata. Adding `noindex,nofollow` to the route family is the safest first remediation step before rewriting public copy or revisiting sitemap inclusion.
