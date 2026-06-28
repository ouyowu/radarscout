# RadarScout open PR triage

Task: `TD-RADARSCOUT-OPEN-PR-TRIAGE-0`

Date: 2026-06-28

## Current baseline

Current safe base branch:

```text
origin/codex/travel-mvp-launch
```

Current base HEAD:

```text
49e174897ea0bef0ca3b78dec296aa1d1c1f4aee
```

This base already includes the tour public-copy cleanup from PR #104.

Production status remains a separate gate. This triage document does not approve or perform a production deploy.

## Scope

This is a docs-only triage of old open RadarScout PRs that still target `codex/travel-mvp-launch`.

Reviewed PRs:

- PR #70: `Add guarded Thailand itinerary draft engine`
- PR #25: `Improve AI trip planner frontend conversion page`
- PR #8: `Display real product detail previews`

This task did not merge, close, rebase, or modify those PRs.

## Global safety boundaries

Do not merge stale PRs without a fresh review because current RadarScout boundaries are:

- no LLM/OpenAI integration unless explicitly scoped
- no Bókun API/edit/sync
- no checkout/payment/cart/booking submission
- no live availability/inventory claims
- no DB/schema/env changes
- no SEO `index,follow` opening
- no ThaiEleHub or Shopify work

## PR #70: Add guarded Thailand itinerary draft engine

Status:

```text
State: open
Head: codex/td-ai-itinerary-7
Head SHA: cb99030a80eb265378be807b4f20deb7d099a659
Changed files: 18
Additions: 4285
Deletions: 20
```

Observed scope:

- adds an itinerary draft API route
- adds itinerary draft schema, validator, hydrator, provider, input builder
- changes AI trip planner UI
- modifies feature flags
- adds a large handoff document

Risk classification:

```text
High risk / stale / too broad to merge directly
```

Reasons:

- The PR is large and was created before the current deterministic Chiang Mai planner flow matured.
- It adds a new API surface for itinerary drafts.
- It touches planner UI and feature flags.
- It includes many references to booking, availability, checkout, payment, commission, supplier data, and LLM boundaries in the diff. Some may be guardrails, but the PR needs a fresh product and safety review before reuse.
- Current RadarScout strategy favors deterministic planner improvements first, with any LLM parser or itinerary engine behind a separate disabled flag and explicit approval.

Recommendation:

```text
Do not merge PR #70.
Replace with a smaller fresh spec or close after extracting reusable tests/guardrails.
```

Suggested replacement task:

```text
TD-RADARSCOUT-ITINERARY-DRAFT-REVIEW-0
```

Scope for replacement:

- docs-only review first
- identify whether any schema/validator tests are worth preserving
- no API route implementation
- no LLM/OpenAI
- no booking/availability/checkout/payment behavior

## PR #25: Improve AI trip planner frontend conversion page

Status:

```text
State: open
Head: td-9a-ai-trip-planner-frontend-conversion
Head SHA: 5112fb5a3cc68e67eb442870ab0439bf2e3e5e02
Changed files: 1
Additions: 64
Deletions: 23
```

Observed scope:

- modifies `apps/web/app/ai-trip-planner/page.tsx`
- updates AI trip planner landing-page copy and positioning

Risk classification:

```text
Medium risk / stale / potentially salvageable
```

Reasons:

- The diff is small.
- The changed page is likely older than the current Chiang Mai finder / homepage entry strategy.
- It includes copy around itinerary generation, supplier matching, availability, pricing, booking, checkout, and payment not being connected. Some of this is safety copy, but current RadarScout public copy should avoid over-emphasizing forbidden transaction terms on tourist-facing pages.
- The current product direction is now more specific: AI-guided Thailand experience discovery and booking-partner handoff, not a broad global trip-planner promise.

Recommendation:

```text
Do not merge PR #25 as-is.
Close or replace with a fresh homepage / AI planner concept task.
```

Suggested replacement task:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-0
```

Scope for replacement:

- design/copy proposal first
- no production UI change unless later approved
- no SEO opening
- no LLM/OpenAI
- no checkout/payment/availability claims

## PR #8: Display real product detail previews

Status:

```text
State: open
Head: td-4-tour-detail-preview-plan
Head SHA: ba246f9a4312a6d2b65d1cff56d913f8945afa64
Changed files: 2
Additions: 409
Deletions: 115
```

Observed scope:

- adds `apps/web/app/api/products/[id]/route.ts`
- modifies `apps/web/app/tours/[id]/page.tsx`

Risk classification:

```text
High risk / stale / conflicts with current tour safety direction
```

Reasons:

- It overlaps directly with the current tour detail route, which has now been cleaned and kept `noindex,nofollow`.
- Its diff contains stale tourist-facing terms such as partner rate, booking/payment disabled wording, availability checks, and Bókun/order language.
- It adds a product detail API route that should not be merged without a fresh API and data-safety review.
- Current tour-page policy is conservative: routes may exist, but tour detail URLs remain out of sitemap and noindexed until public-safety work is complete.

Recommendation:

```text
Close PR #8.
Create a fresh tour detail data task only after the current public-copy cleanup is deployed and observed.
```

Suggested replacement task:

```text
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-0
```

Scope for replacement:

- docs/read-only audit first
- confirm whether detail pages should load real product data
- preserve `noindex,nofollow`
- keep `/tours/{id}` excluded from sitemap
- no Bókun API/edit/sync
- no checkout/payment/availability behavior

## Recommended queue

Recommended immediate queue:

1. Deploy the already merged tour public-copy cleanup only after explicit approval:

```text
Approve TD-DEPLOY-TOUR-PUBLIC-COPY-0-PRODUCTION for merge SHA 49e174897ea0bef0ca3b78dec296aa1d1c1f4aee
```

2. After production smoke passes, close or supersede stale PRs:

```text
TD-RADARSCOUT-OPEN-PR-CLEANUP-0
```

3. Create fresh replacement tasks instead of merging stale branches:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-0
TD-RADARSCOUT-ITINERARY-DRAFT-REVIEW-0
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-0
```

## Triage decision summary

| PR | Decision | Reason |
| --- | --- | --- |
| #70 | Do not merge; replace with fresh review | Too broad, stale, adds API/feature-flag itinerary draft work |
| #25 | Do not merge as-is; salvage via fresh homepage/AI planner task | Small but stale and overlaps current copy strategy |
| #8 | Close or replace | Stale, overlaps cleaned tour detail safety work, adds API route |

## Non-actions in this task

This task did not:

- merge PRs
- close PRs
- deploy preview or production
- open SEO indexing
- change app code
- call Bókun API
- add checkout/payment/booking behavior
- change DB/schema/env
- touch ThaiEleHub files
- run Shopify commands
