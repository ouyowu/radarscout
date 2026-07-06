# RadarScout active execution status

Task: `TD-RADARSCOUT-ACTIVE-EXECUTION-STATUS-10`

Updated: 2026-07-06

## 1. Execution mode

RadarScout is being advanced through a semi-automatic, safety-gated execution flow.

Default rules:

- use `origin/codex/travel-mvp-launch` as the safe base;
- use clean worktrees under `/private/tmp/<task-name>`;
- keep changes narrow and testable;
- create PRs for implementation or docs changes;
- run validation before merge;
- use preview smoke for app changes when Vercel capacity allows;
- do not production deploy without explicit approval for a merge SHA;
- do not touch ThaiEleHub or Shopify files.

## 2. Product boundary

RadarScout is a Thailand-first AI-guided travel discovery and itinerary product.

RadarScout owns:

- guided discovery;
- deterministic planning;
- itinerary draft;
- safe recommendation presentation;
- booking partner handoff.

Booking partners/operators own:

- current operating details;
- checkout;
- payment;
- confirmation;
- inventory and availability workflows.

RadarScout must not behave like a live inventory system, payment system, booking engine, or Bókun backend.

## 3. Current branch state

Latest `origin/codex/travel-mvp-launch` before this status refresh:

```text
d769e9d167fe80ae7cb3f63d558b5aa5432e17fc
```

Latest AI Trip and homepage product-code increments:

- PR #356: AI Trip Planner successful result action shows the top matched product title.
- PR #357: AI Trip Planner refine links include clearer accessible context.
- PR #361: deterministic planning outline links directly to the experience search section.
- PR #366: successful AI Trip searches include a direct `Review comparison cards` jump to the real product comparison-card area.
- PR #368: AI Trip product cards label each result's matched route stop.
- PR #370: loaded route search feedback can jump directly to the comparison-card area.
- PR #372: AI Trip product-card detail CTA accessible labels include booking partner handoff context.
- PR #377: sourced tour detail pages explain that the AI Trip return link goes to the matching experiences section without storing partner action or current status.
- PR #380: sourced tour detail pages use more traveler-facing AI Trip return-context copy.
- PR #385: unavailable sourced tour detail pages use the same `Back to AI Trip Planner results` label as available tour detail pages.
- PR #388: unavailable sourced tour detail pages explain that travelers can return to AI Trip Planner results and that no partner action or current status is recorded from the unavailable page.
- PR #394: successful AI Trip product results show a compact next-step helper explaining the safe path from comparison cards to one product detail page and then to the booking partner.
- PR #397: the successful-result top-match detail CTA accessible label now explains that the booking partner handoff continues from the product page.
- PR #400: ordinary AI Trip product-card handoff copy now uses the same product-page-scoped boundary as the top-match CTA.
- PR #409: AI Trip example prompt chips and the `Clear trip idea` chip now use 44px minimum tap targets.
- PR #411: AI Trip intent summary mobile density is tighter.
- PR #413: AI Trip product-card action rows can wrap on mobile while preserving the product-detail CTA tap target.
- PR #418: homepage hero and prompt chips now route users more directly into AI-guided Thailand planning.
- PR #421: homepage prompt chips now prefill the AI Trip Planner trip idea via a safe URL parameter without automatic search.

Latest tooling increment:

- PR #373: Vercel preview deploy helper reports the daily deployment quota blocker more clearly.
- PR #404: Vercel preview link cleanup helper was added.
- PR #406: preview deploy wrapper runs cleanup before the guard.
- PR #407: preview cleanup accepts the current Vercel CLI `.env*` gitignore addition.

Latest status-doc increment:

- PR #358 refreshed the active status after the refine-link accessibility work.
- PR #360 documented Vercel deployment quota handling.
- PR #363 refreshed active status after PR #361.
- PR #364 recorded the PR #361 Vercel preview evidence.
- PR #365 documented the AI Trip release-gate decision while preview deploys remain quota-limited.
- PR #367 refreshed active status after PR #366.
- PR #369 refreshed active status after PR #368.
- PR #371 refreshed active status after PR #370.
- PR #374 refreshed active status after PR #372 and PR #373.
- PR #376 recorded the latest local validation after PR #373.
- PR #378 refreshed active status after PR #377.
- PR #379 recorded the traveler funnel analytics vendor decision.
- PR #381 documented the AI Trip production deploy candidate and kept production behind explicit approval.
- PR #382 refreshed active status after PR #380 and PR #381.
- PR #383 refreshed the AI Trip production deploy candidate after the latest return-copy validation.
- PR #384 refreshed active status after PR #383 and the latest preview-quota retry.
- PR #386 recorded latest-head local validation after PR #384.
- PR #387 corrected active status after PR #385 and PR #386.
- PR #389 recorded preview smoke passing for `7717e79f94909c5d350066364a5a5ffb7bf5d7d6`.
- PR #391 corrected active status after PR #388 and the latest-head preview retry.
- PR #392 archived AI Trip status after PR #391.
- PR #393 recorded latest-head local validation after PR #392.
- PR #395 recorded PR #394 post-merge validation and the latest preview quota blocker.
- PR #396 corrected the preview guard command and recorded the dirty-metadata caveat from the latest successful protected preview smoke.
- PR #401 recorded the clean protected-preview smoke pass for `c04b0399b03f8fcb479a1a44da744487c12267df`.
- PR #402 refreshed active status after PR #400 and documented the PR #400 preview quota blocker.
- PR #403 recorded AI Trip deploy candidate status after PR #400 and PR #402.
- PR #405 refreshed active status and the production deploy candidate after PR #402.
- PR #410 refreshed active status after PR #409.
- PR #412 refreshed active status after PR #411.
- PR #415 refreshed active status after PR #413.
- PR #417 documented the homepage AI planner concept.
- Current status update records post-merge validation for `d769e9d167fe80ae7cb3f63d558b5aa5432e17fc` and the protected Vercel preview state for PR #421.

Open PRs against `codex/travel-mvp-launch` at the time of this update:

```text
none at the start of this status refresh
```

## 4. Latest validation evidence

Clean worktree:

```text
/private/tmp/radarscout-homepage-ai-planner-prefill-postmerge
```

Validated latest branch HEAD after PR #421:

```text
d769e9d167fe80ae7cb3f63d558b5aa5432e17fc
```

Latest merge before this status refresh:

```text
d769e9d167fe80ae7cb3f63d558b5aa5432e17fc
```

Validation results:

- Prisma generate: passed.
- Focused homepage/sitemap/SEO Vitest coverage (`pnpm --filter @reddit-monitor/web test -- homepageCopy sitemap seo`): passed, 58 files / 924 tests.
- Full Vitest (`pnpm --filter @reddit-monitor/web test`): passed, 58 files / 924 tests.
- TypeScript (`pnpm --filter @reddit-monitor/web exec tsc --noEmit`): passed.
- Next build: passed.
- Playwright E2E (`pnpm --filter @reddit-monitor/web test:e2e`): passed, 54 tests.
- `git diff --check`: passed.
- Worktree status: clean.

## 5. Latest preview status

Vercel project confirmed:

```text
ouyowus-projects / reddit-monitor
```

Current latest-head result:

```text
PR #421 Vercel preview reached READY, but anonymous smoke is blocked by Vercel Authentication
```

Meaning:

- Vercel linked to the correct project: `ouyowus-projects / reddit-monitor`.
- PR #421 preview deployment reached `READY`.
- deployment ID: `dpl_G8MdZ5PBEhc6WAtH78L35H8TXA55`.
- preview URL: `https://reddit-monitor-dafx67ghj-ouyowus-projects.vercel.app`.
- target: preview.
- production aliases: none observed.
- Anonymous preview smoke redirects to Vercel SSO, so public page-content smoke could not be completed from this shell.
- The post-merge local E2E suite covers the same URL-prefill behavior and confirmed that the homepage prompt URL prefill does not call `/api/ai-trip/search` automatically.
- The Vercel CLI `.env.local` and `.gitignore` side effects from read-only project linking were removed from the clean worktree after inspection.
- The later clean latest-head retry for `ff9d9a33d993f9aaaa9cd2d96a79b24d13caebfe` passed the local Vercel preview guard, then failed because the current Vercel plan hit the daily deployment quota.
- The latest clean-head retry for `8c344b1233c0b2ed6e2053dbb592842640aeb876` passed local validation and the Vercel preview guard, then failed because the current Vercel plan hit the daily deployment quota.
- The 20 most recent Vercel deployments did not include a `READY` preview for `8c344b1233c0b2ed6e2053dbb592842640aeb876`.
- The latest clean-head retry for `0a00697021dc190304fec5be84e82e139162d550` confirmed the preview wrapper now removes Vercel CLI `.env.local` / `.env*` side effects, passes the guard, and then fails only on the Vercel daily deployment quota.
- The latest clean-head retry for `f77574a836b4ad4fd3336b96736cd18eef18f581` also passed cleanup and guard, then hit the same Vercel daily deployment quota.
- The latest clean-head retry for `b7afbb5c65ef00e4d096a302829f5e4abf9b0d4c` also passed cleanup and guard, then hit the same Vercel daily deployment quota.
- The latest clean-head retry for `3ac1068ead0681db3578c38fd9422672982b0f98` also passed cleanup and guard, then hit the same Vercel daily deployment quota.
- This is not a code, TypeScript, test, or build failure.

Recent preview evidence:

- A preview for `5c9daf626f2156c4b8a049612c56c5f2b501d9e3` reached `READY`.
- That preview URL was public-smoke blocked by Vercel Authentication.
- A latest-head retry after PR #359 confirmed the correct Vercel project and clean preview guard, then hit `api-deployments-free-per-day`.
- The PR #361 GitHub-triggered preview deployment reached `READY`:
  - deployment ID: `dpl_9UhfrZemwViWhLYMdBdt4zXQx5qG`;
  - preview URL: `https://reddit-monitor-aq4kz9v0o-ouyowus-projects.vercel.app`;
  - deployed commit: `b8af9476bf0ffa814033c8929cf50d725e1f5d3b`;
  - target: preview / `null`;
  - production aliases: none observed.
- Anonymous Playwright smoke against that preview is blocked by Vercel Authentication.
- Authenticated Vercel fetch for `/ai-trip-planner` returned 200 with:
  - title `Thailand AI Trip Planner | RadarScout`;
  - robots `noindex, nofollow`;
  - AI Trip Planner static page content;
  - safe public copy.
- The PR #377 product-code head `85e25156fdae83b367d324cc7389116d541cb547` has clean local dynamic validation.
- The PR #380 product-code head `56b91395f97c32c53bb79c37bc0b3e3e97dece1a` has clean local dynamic validation.
- A clean latest-head manual preview retry for `5b0c447aa715e8d0d60fa9c7d07c7debede971ee` still hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `90658452fff5f0a5db3f18ce9be500428eef2058` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `8ae92f753a0bc31c97b865be1cbd157e5c13c648` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `05e3d0c05fcf0bd3cfad8e2d1a758f74d2d2f440` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `03991696b94e31f110374e93877fa99abf1034cb` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `85e25156fdae83b367d324cc7389116d541cb547` also hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `bafb4ca1173d4f1dea39d69779ee65c57b7c105c` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `56b91395f97c32c53bb79c37bc0b3e3e97dece1a` also hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `444cfb17ab2871584b6785407fc20663e3b6d081` also hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `7c3b2d5711197a532e8f5de3a96e29af29b5249d` also hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `bcb637c3cb542da83ead211a84856f18832d998d` also hit `api-deployments-free-per-day`.
- A clean latest-head preview for `7717e79f94909c5d350066364a5a5ffb7bf5d7d6` reached `READY`:
  - deployment ID: `dpl_A8sLi6eAksSRFPbRLT1yWZvjLXJs`;
  - preview URL: `https://reddit-monitor-rnac2afi7-ouyowus-projects.vercel.app`;
  - target: preview / `null`;
  - Vercel project: `ouyowus-projects / reddit-monitor`.
- Protected-preview AI Trip smoke passed against that deployment:
  - status: 200;
  - title: `Thailand AI Trip Planner | RadarScout`;
  - robots: `noindex, nofollow`;
  - top match href: `/tours/prod_cm_1?source=ai-trip-planner`;
  - product card count: 3;
  - result summary visible: true;
  - mobile horizontal overflow: none;
  - unsafe network calls: none;
  - forbidden visible copy matches: none.
- A clean latest-head manual preview retry for `e677d50fe8bae620ed738a144727b7fef535e3de` hit `api-deployments-free-per-day`.
- A preview for `6f79e2a7b62db98cbda297ed044cfef8682dcf37` reached `READY` and protected-preview smoke passed, but Vercel metadata reported `gitDirty=1` because the Vercel CLI had written temporary local config before the deploy. The temporary worktree was cleaned afterward and the guard passed.
- A clean latest-head manual preview retry for `08629a6410483db1a9975aa95d46899915747125` passed the local Vercel preview guard, then hit `api-deployments-free-per-day`.
- A clean post-merge manual preview retry for `705337b4d557d1910ff9fd1a46393bed51f5e8ef` passed the local Vercel preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head preview for `c04b0399b03f8fcb479a1a44da744487c12267df` reached `READY`:
  - deployment ID: `dpl_CFw3GQE4Dasc6h7gFXaMPyz7xzs1`;
  - preview URL: `https://reddit-monitor-5j4fonb66-ouyowus-projects.vercel.app`;
  - target: preview / `null`;
  - Vercel project: `ouyowus-projects / reddit-monitor`;
  - deployment commit SHA: `c04b0399b03f8fcb479a1a44da744487c12267df`;
  - production aliases: none observed.
- Protected-preview AI Trip smoke passed against that deployment:
  - status: 200;
  - title: `Thailand AI Trip Planner | RadarScout`;
  - robots: `noindex, nofollow`;
  - top match href: `/tours/prod_cm_1?source=ai-trip-planner`;
  - product card count: 3;
  - result summary visible: true;
  - mobile horizontal overflow: none;
  - unsafe network calls: none;
  - forbidden visible copy matches: none.
- PR #373 improved the preview helper's quota-blocker output but did not change product code.
- A clean latest-head manual preview retry for `ff9d9a33d993f9aaaa9cd2d96a79b24d13caebfe` passed the local Vercel preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `8c344b1233c0b2ed6e2053dbb592842640aeb876` passed the local Vercel preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `0a00697021dc190304fec5be84e82e139162d550` passed the local cleanup helper and preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `f77574a836b4ad4fd3336b96736cd18eef18f581` passed the local cleanup helper and preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `b7afbb5c65ef00e4d096a302829f5e4abf9b0d4c` passed the local cleanup helper and preview guard, then hit `api-deployments-free-per-day`.
- A clean latest-head manual preview retry for `3ac1068ead0681db3578c38fd9422672982b0f98` passed the local cleanup helper and preview guard, then hit `api-deployments-free-per-day`.

## 6. Production status

Production deploys remain gated.

Decision:

- do not production deploy without explicit approval naming the merge SHA;
- do not treat quota failures as product-code failures;
- latest-head PR #421 preview reached `READY`, but anonymous content smoke is blocked by Vercel Authentication;
- production deploy remains blocked until the operator explicitly approves deploying merge SHA `d769e9d167fe80ae7cb3f63d558b5aa5432e17fc` with the known preview-auth limitation and the clean local validation evidence.

## 7. Safety status

Current confirmations:

- no SEO `index,follow` opening;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability or inventory behavior;
- no DB/schema/env changes;
- no ThaiEleHub or Shopify work.

## 8. Already-present product surfaces

The current codebase already includes:

- homepage link to `/ai-trip-planner`;
- homepage link to `/chiang-mai/elephant-camp-finder`;
- homepage hero and prompt chips route users into AI-guided Thailand planning;
- homepage prompt chips safely prefill `/ai-trip-planner?idea=...` without automatic search or API calls;
- Chiang Mai deterministic chat planner;
- itinerary summary;
- compact mobile summary;
- AI trip planner route;
- read-only Thailand product search from confirmed trip intent;
- comparison-only product result cards;
- compact successful-result action and fit-summary spacing on mobile;
- top-match title in the successful result action;
- direct `Review comparison cards` jump after successful AI Trip product search;
- matched-route-stop labels on AI Trip product cards;
- loaded route search feedback can jump directly to comparison cards;
- booking-partner handoff context in AI Trip product-card detail CTA accessible labels;
- product-card handoff visible copy explicitly says the booking partner handoff continues from the product page;
- AI Trip prompt chips use 44px minimum tap targets;
- AI Trip intent summary uses tighter mobile spacing;
- AI Trip product-card actions wrap on mobile while preserving the detail CTA tap target;
- traveler-facing AI Trip return-context copy on sourced tour detail pages;
- deterministic planning outline link to the experience search section;
- `/tours/{id}?source=ai-trip-planner` return context;
- AI Trip Planner context card on sourced tour detail pages;
- local protected-preview smoke helper for `/ai-trip-planner`;
- tour detail no-handoff fallback copy;
- static partner/supplier/destination partner pages;
- B2B mailto-only manual intake guidance.

Do not create duplicate tasks for these already-present surfaces unless the change has a concrete gap and test target.

## 9. Recommended next safe task

Recommended next task:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-PREFILL-PRODUCTION-GATE
```

Type:

```text
production approval gate or explicit skip-to-next-product-task decision
```

Goal:

Decide whether to production deploy merge SHA `d769e9d167fe80ae7cb3f63d558b5aa5432e17fc` for the homepage prompt prefill work, or skip production for now and continue with another non-production product task.

Why this is the right next step:

- latest product-code changes are already merged;
- latest product-code head has clean local validation;
- Vercel preview reached `READY`;
- anonymous preview content smoke is blocked by Vercel Authentication;
- production deploy still requires explicit approval for the exact merge SHA.

## 10. Candidate follow-up tasks after preview

Only after the production gate is resolved or explicitly skipped:

```text
TD-RADARSCOUT-AI-TRIP-PRODUCTION-DEPLOY-CANDIDATE
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-DECISION-2
```

Guardrails:

- no LLM/OpenAI integration;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory;
- no DB/schema/env changes;
- no SEO index/follow opening without explicit approval;
- no ThaiEleHub/Shopify work.
