# RadarScout destination scope audit

Task: `TD-RADARSCOUT-DESTINATION-SCOPE-AUDIT-0`

Status: docs-only audit

## Current state

RadarScout is positioned as an AI-guided Thailand travel discovery and booking-partner handoff product, with Thailand as the first focused experience destination.

The current destination system still contains a broader global destination planning layer:

- `/destinations`
- `/destinations/[slug]`
- `apps/web/lib/global-destinations.ts`

The implementation already separates destinations into two states:

- `hasLiveInventory: true`: currently only Thailand.
- `comingSoon: true`: non-Thailand destinations remain planning-only.

## Current live destination model

Thailand is the only focused destination with live product coverage:

- Thailand

Planning-only destination records include:

- United States
- Canada
- Mexico
- Italy
- France
- United Kingdom
- Spain
- Portugal
- Germany
- Austria
- Netherlands
- Greece
- Switzerland
- Japan

These non-Thailand records do not currently represent traveler-ready product coverage. They are planning pages and supplier-onboarding placeholders.

## What is safe today

The current destination pages use guardrail copy that keeps the product boundary clear:

- Thailand is described as RadarScout's first focused experience destination.
- Non-Thailand destinations are described as planning-only.
- Non-Thailand destination pages send users to the AI planner, not to fake product inventory.
- Destination pages state that traveler-facing recommendations require enough product detail and a safe booking partner handoff path.
- The sitemap currently includes only controlled public URLs and does not include all destination pages.

## Remaining mismatch

The main remaining product mismatch is not functionality; it is scope perception.

RadarScout's target product direction is Thailand-first, but the presence of many generated non-Thailand destination pages can still make the product feel like a global travel portal if users enter through `/destinations`.

This is safe only while non-Thailand pages remain clearly planning-only. It becomes risky if:

- non-Thailand pages are added to sitemap before product coverage exists;
- non-Thailand pages use language that implies live products;
- AI planner prompts imply global product matching;
- homepage or navigation makes RadarScout sound like a broad worldwide OTA.

## SEO and sitemap status

Current sitemap policy is conservative:

- `/chiang-mai/elephant-camp-finder` is the controlled SEO candidate.
- `/ai-trip-planner` is not in sitemap while it remains closed.
- B2B pages are not in sitemap while closed.
- `/tours/{id}` pages are excluded from sitemap until tour pages are public-safe.
- `/destinations/[slug]` pages are not currently sitemap-expanded.

This is aligned with the current safety strategy.

## Recommended next product-safe tasks

### 1. `TD-RADARSCOUT-DESTINATION-SCOPE-1-THAILAND-FIRST-COPY`

Polish `/destinations` and `/destinations/[slug]` copy so non-Thailand pages are unmistakably planning-only.

Scope:

- copy and tests only;
- no route deletion;
- no sitemap expansion;
- no SEO index/follow opening;
- no product data changes.

Recommended changes:

- make `/destinations` hero more explicitly Thailand-first;
- reduce wording such as "selected high-demand travel countries" where it can feel like live global coverage;
- add tests that non-Thailand destination pages contain planning-only copy and do not imply traveler-ready products.

### 2. `TD-RADARSCOUT-DESTINATION-SCOPE-2-AI-PLANNER-THAILAND-BOUNDARY`

Audit AI Trip Planner copy and no-match guidance so users understand current product matching is Thailand-only.

Scope:

- copy and tests only;
- no LLM;
- no product retrieval behavior change unless a test exposes misleading copy;
- no booking partner behavior change.

### 3. `TD-RADARSCOUT-DESTINATION-SCOPE-3-SITEMAP-GUARDRAIL-TESTS`

Add explicit tests that destination pages are not added to sitemap until approved.

Scope:

- tests only unless sitemap currently violates policy;
- no SEO opening.

## Do not do yet

Do not:

- delete non-Thailand destination routes without a migration plan;
- add non-Thailand destination pages to sitemap;
- mark non-Thailand pages as live;
- add fake products or generic affiliate products;
- add live availability, checkout, booking submission, payment, or inventory behavior;
- call Bókun API;
- change DB/schema/env;
- touch ThaiEleHub or Shopify files.

## Recommended immediate next task

Recommended next task:

`TD-RADARSCOUT-DESTINATION-SCOPE-1-THAILAND-FIRST-COPY`

Reason:

It is a low-risk copy/test task that improves product clarity without changing routing, SEO indexing, sitemap, product data, DB, Bókun, or booking behavior.
