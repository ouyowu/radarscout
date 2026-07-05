# RadarScout destination scope audit

Task: `TD-RADARSCOUT-DESTINATION-SCOPE-AUDIT-0`

Status: audit completed; copy guardrails implemented on `codex/travel-mvp-launch`

Latest implementation status:

- `TD-RADARSCOUT-DESTINATION-SCOPE-1-THAILAND-FIRST-COPY`: completed and merged.
- `TD-RADARSCOUT-THAILAND-FIRST-PUBLIC-COPY-2`: completed and merged.
- `TD-RADARSCOUT-COVERAGE-FAQ-COPY-3`: completed and merged.
- Latest merged branch head at the time of this refresh: `c246bc0ceade38dbff7b722b6a391b73acb1f050`.
- Production deploy for these copy guardrail changes remains a separate approval gate.

## Current state

RadarScout is positioned as an AI-guided Thailand travel discovery and booking-partner handoff product, with Thailand as the first focused experience destination.

The current destination system still contains a broader destination planning layer:

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

The main product mismatch identified by this audit was not functionality; it was scope perception.

RadarScout's target product direction is Thailand-first, but the presence of many generated non-Thailand destination pages could make the product feel broader than current product coverage if users enter through `/destinations`.

This remains safe only while non-Thailand pages stay clearly planning-only. It becomes risky if:

- non-Thailand pages are added to sitemap before product coverage exists;
- non-Thailand pages use language that implies live products;
- AI planner prompts imply global product matching;
- homepage or navigation makes RadarScout sound like a broad worldwide OTA.

Follow-up copy work has reduced that perception risk:

- `/destinations` now uses explicit Thailand-first and planning-only wording.
- Non-Thailand destination detail pages now state that product recommendations stay off until supplier coverage is reviewed.
- Homepage and tours FAQ copy no longer frames RadarScout as a broad marketplace or every-destination product.
- Supplier CTA copy now references trusted Thailand suppliers and future destination partners instead of broad selected destination coverage.

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

Status: completed and merged.

Polish `/destinations` and `/destinations/[slug]` copy so non-Thailand pages are unmistakably planning-only.

Scope:

- copy and tests only;
- no route deletion;
- no sitemap expansion;
- no SEO index/follow opening;
- no product data changes.

Completed changes:

- made `/destinations` hero more explicitly Thailand-first;
- reduced wording such as "selected high-demand travel countries" where it could feel like live broad coverage;
- added tests that non-Thailand destination pages contain planning-only copy and do not imply traveler-ready products.

### 1A. `TD-RADARSCOUT-THAILAND-FIRST-PUBLIC-COPY-2`

Status: completed and merged.

Cleaned remaining public runtime copy in homepage, tours, and supplier CTA surfaces:

- removed broad "selected top/high-demand destination" phrasing from visible product-positioning copy;
- reframed supplier CTA around trusted Thailand suppliers and future destination partners;
- added regression tests for the old wording.

### 1B. `TD-RADARSCOUT-COVERAGE-FAQ-COPY-3`

Status: completed and merged.

Cleaned FAQ prompts that could still suggest marketplace-style breadth:

- homepage FAQ now asks "How broad is RadarScout coverage today?";
- tours FAQ now asks "Why are some destinations still planning-only?";
- tours destination banner now states that non-Thailand destinations stay planning-only until trusted product records are ready.

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

`TD-DEPLOY-DESTINATION-SCOPE-COPY-PRODUCTION`

Reason:

The copy/test work is merged and validated, but production still needs an explicit deploy approval. Deployment should use merge SHA `c246bc0ceade38dbff7b722b6a391b73acb1f050` or a newer verified branch head if more safe work is merged before deployment.
