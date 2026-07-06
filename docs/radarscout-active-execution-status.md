# RadarScout active execution status

Task: `TD-RADARSCOUT-ACTIVE-EXECUTION-STATUS-0`

Updated: 2026-07-06

## 1. Current execution mode

RadarScout is being advanced through a semi-automatic, safety-gated execution flow.

Default working rules:

- use `origin/codex/travel-mvp-launch` as the safe base;
- use clean worktrees under `/private/tmp/<task-name>`;
- keep changes narrow and testable;
- create PRs for implementation or docs changes;
- run validation before merge;
- use preview smoke for app changes;
- do not production deploy without explicit approval for a merge SHA;
- do not touch ThaiEleHub or Shopify files.

## 2. Current product direction

RadarScout is a Thailand-first AI-guided travel discovery and itinerary product.

Current intended boundary:

- RadarScout owns guided discovery, deterministic planning, itinerary draft, safe recommendation presentation, and booking partner handoff;
- booking partners/operators own current details, checkout, payment, confirmation, and operating workflows;
- RadarScout must not behave like a live inventory system, payment system, booking engine, or Bókun backend.

## 3. Completed current-track work

Recent completed items:

- AI trip planner public copy boundary clarified;
- AI planner product matching explicitly limited to Thailand records;
- non-Thailand ideas remain planning text only;
- destination sitemap guardrail tests added;
- sitemap guardrail post-merge preview passed;
- traveler funnel analytics preview spec aligned with approved event names;
- Plausible comparison documented because Vercel custom events are blocked by current Hobby plan.
- AI Trip Planner result-flow release status documented;
- mobile AI Trip Planner result-flow audit documented;
- mobile AI Trip Planner successful-result spacing tightened through PR #263;
- latest `codex/travel-mvp-launch` preview for AI Trip Planner result-flow polish passed.
- AI Trip Planner copy safety review documented through PR #265;
- AI Trip Planner tour-detail return context tightened through PR #266;
- protected Vercel preview bypass runbook documented through PR #267;
- local `pnpm smoke:ai-trip-preview` helper added through PR #268 and verified against a protected preview share URL.
- AI Trip preview data readiness and real preview smoke evidence documented through PRs #271, #273, #276, and #278.
- AI Trip multi-interest search now uses broader round-robin term coverage through PR #279.
- AI Trip Thailand destination prefix normalization merged through PR #280.
- Vercel preview guard added through PR #282 to prevent accidental temporary-project deploys.
- Compact AI Trip interest prompts now search safely through PR #283.
- AI Trip release gate status was refreshed through PR #284, PR #285, PR #290, PR #291, and PR #293.
- AI Trip detail return path E2E coverage was added through PR #286.
- Compact example prompt chip `Chiang Mai elephants` was added through PR #287.
- Thailand multi-city route starter was added through PR #288.
- AI Trip destination starter grid was tightened to fit five desktop cards through PR #289.
- Thailand multi-city route fallback suggestion was added to unsupported-destination and no-match flows through PR #297.
- Thailand multi-city route example prompt was added to the AI Trip Planner input area through PR #301.
- Thailand-wide result summaries now use route-comparison wording through PR #302.
- AI Trip active status was refreshed after route-summary work through PR #304.
- Thailand route-summary E2E coverage was added through PR #307.
- AI Trip active status was refreshed after route-summary E2E work through PR #308.
- Thailand route city-chip E2E coverage was added through PR #309.
- AI Trip detail links were hardened to stay on safe internal `/tours` paths through PR #313.
- AI Trip detail links now normalize existing non-AI `source` parameters to `source=ai-trip-planner` through PR #314.
- AI Trip detail source normalization E2E coverage was added through PR #319.
- AI Trip multi-city results now show a compact route stop overview through PR #321.
- AI Trip multi-city result cards are now grouped by route stop / city through PR #324.
- AI Trip route-stop grouped result detail links now have E2E coverage through PR #326.
- AI Trip route-stop grouped result mobile overflow coverage was added through PR #327.
- Latest clean post-merge local validation passed for the current AI Trip candidate after PR #327.

## 4. Current blocked or deferred items

### Analytics implementation

Status: deferred.

Reason:

- Vercel project is `ouyowus-projects / reddit-monitor`;
- current Vercel team plan checked through the Vercel API is `hobby`;
- official Vercel docs currently mark custom events as Pro/Enterprise.

Decision:

- do not implement Vercel custom-event analytics on the current plan;
- do not add a workaround analytics endpoint;
- do not write analytics events to RadarScout DB;
- keep the approved event taxonomy ready for a future vendor decision.

### SEO index/follow opening

Status: gated.

Reason:

- opening `index,follow` is a hard safety gate;
- it requires explicit user approval for the exact controlled-opening PR/merge SHA.

Decision:

- no automatic SEO opening;
- no sitemap expansion beyond approved public-safe URLs;
- no `/tours/{id}` sitemap re-entry without a separate tour detail SEO candidate process.

### Production deploys

Status: blocked by Vercel quota.

Known state:

- current production deployment: `dpl_7B5U2ZeMAfhLQX9m2MZvZv1sbRUo`;
- current production URL inspected: `https://radarscout.io/ai-trip-planner`;
- production still serves the older AI Trip Planner without the Thailand route-summary section;
- production page still returns 200 and keeps `noindex, nofollow`;
- `npx vercel --prod --yes` was blocked by Vercel quota with `api-deployments-free-per-day`;
- `npx vercel promote dpl_72ku3BtQKfh2k9gCoecpEqGXHv5b --yes` was also blocked by the same quota;
- a latest-head preview retry after PR #317 passed `pnpm guard:vercel-preview`, confirmed the `reddit-monitor` Vercel project, then was blocked by the same `api-deployments-free-per-day` quota;
- a latest-head preview retry after PR #321 passed `pnpm guard:vercel-preview`, confirmed the `reddit-monitor` Vercel project, then was blocked by the same `api-deployments-free-per-day` quota;
- no fresh Vercel preview has been created yet for the PR #324 route-result grouping candidate because the quota gate remains active;
- no production deployment or alias change completed.

Decision:

- do not keep retrying deployment while Vercel returns `api-deployments-free-per-day`;
- retry after the Vercel daily deployment quota resets or after plan capacity changes;
- use a clean worktree and deploy the latest `origin/codex/travel-mvp-launch` SHA when quota is available.
- latest production-deploy branch candidate is `3322d3f32bcadf842e0e7c984af8e9708a8ac4aa`.
- latest merged AI Trip app-code candidate is PR #324, merge SHA `77aeb5c5a12c9609eea9ffb585f3322e3510e356`.
- latest branch HEAD after PR #328 docs refresh is `3322d3f32bcadf842e0e7c984af8e9708a8ac4aa`.

### Latest fresh preview deployment

Status: prior preview passed; latest-head preview blocked by Vercel quota.

Known state:

- latest `origin/codex/travel-mvp-launch`: `3322d3f32bcadf842e0e7c984af8e9708a8ac4aa`;
- latest merged AI Trip app-code increment: PR #302, merge SHA `9585a27b80a27d8a0b8e2014419bd4267d2ad5bd`;
- latest merged AI Trip status-doc increment: PR #304, merge SHA `56ebefaa646d972fa92b925282f842fdd71609fc`;
- latest merged AI Trip test-only increment: PR #307, merge SHA `812d803603f518b7236b42b06b3cc8676c0171b8`;
- latest merged AI Trip status-doc increment after PR #307: PR #308, merge SHA `344a6a176e5ebbb554c3199c18790de7626ece42`;
- latest merged AI Trip test-only increment: PR #309, merge SHA `636f6d67a45b434071463a0b7d4b475ff27838a9`;
- latest merged AI Trip app-code safety increment: PR #313, merge SHA `fc86b033be081497d22f6e3bef2b1f50a5011ac5`;
- latest merged AI Trip app-code return-source increment: PR #314, merge SHA `a59efe81c222d6c86b819b30e73fc4bcdac5e45d`;
- latest merged AI Trip status-doc increment after PR #314: PR #317, merge SHA `db286cce602bfd27645576b5878b0a249d1e0a12`;
- latest merged AI Trip test-only source-normalization increment: PR #319, merge SHA `0c368bbf683ab1ecf353c9462a80f59a37016a60`;
- latest merged AI Trip app-code route-stop overview increment: PR #321, merge SHA `b0a612d566616428d639e0411302cb495651b30e`;
- latest merged AI Trip app-code route-result grouping increment: PR #324, merge SHA `77aeb5c5a12c9609eea9ffb585f3322e3510e356`;
- latest merged AI Trip status-doc increment after PR #324: PR #323, merge SHA `d0bd35714560b3c00f4a559625d96e7eb683a004`;
- latest merged AI Trip test-only grouped-link increment: PR #326, merge SHA `8ac3a51b0760cf4a5c8a1d19a709b1abb977ab2e`;
- latest merged AI Trip test-only mobile grouped-result increment: PR #327, merge SHA `ac7e31bac0e5b89905c8aa6e80a98d3c0d732dcc`;
- latest merged AI Trip status-doc increment after PR #326: PR #328, merge SHA `3322d3f32bcadf842e0e7c984af8e9708a8ac4aa`;
- clean local validation passed after PR #297 and after the current release-gate docs refresh;
- clean local validation passed after PR #301 with Prisma generate, AI Trip Vitest, AI Trip E2E, TypeScript, Next build, and `git diff --check`;
- clean local validation passed after PR #302 with Prisma generate, `productSearch` Vitest, AI Trip Vitest, TypeScript, Next build, and `git diff --check`;
- clean local validation passed after PR #307 with Prisma generate, AI Trip E2E, AI Trip Vitest, TypeScript, Next build, and `git diff --check`;
- PR #309 is test-only and extends AI Trip E2E coverage for Thailand route city chips;
- clean local validation passed after PR #313 with Prisma generate, `productSearch` Vitest, AI Trip Vitest, AI Trip E2E, TypeScript, Next build, and `git diff --check`;
- clean post-merge local validation passed after PR #314 with Prisma generate, `productSearch` Vitest, AI Trip Vitest, AI Trip E2E, TypeScript, Next build, and `git diff --check`;
- clean post-merge local validation passed after PR #319 with Prisma generate, AI Trip E2E, TypeScript, and `git diff --check`;
- clean post-merge local validation passed after PR #321 with Prisma generate, AI Trip E2E, AI Trip Vitest, TypeScript, Next build, and `git diff --check`;
- clean post-merge local validation passed after PR #324 with Prisma generate, AI Trip E2E, AI Trip Vitest, TypeScript, Next build, and `git diff --check`;
- clean post-merge local validation passed after PR #326 with Prisma generate, AI Trip E2E, TypeScript, and `git diff --check`;
- clean post-merge local validation passed after PR #327 with Prisma generate, AI Trip E2E, TypeScript, and `git diff --check`;
- latest Vercel branch preview deployment is `dpl_72ku3BtQKfh2k9gCoecpEqGXHv5b`;
- latest Vercel branch preview URL is `https://reddit-monitor-75zhctjlo-ouyowus-projects.vercel.app`;
- protected preview smoke passed for `/ai-trip-planner` through an approved temporary Vercel share URL;
- generic AI Trip preview smoke passed with status 200, title `Thailand AI Trip Planner | RadarScout`, robots `noindex, nofollow`, three mocked product cards, no unsafe network requests, no forbidden copy matches, and no mobile horizontal overflow;
- targeted Thailand route summary smoke passed on the same preview with `How these experiences support your Thailand route`, `possible route stops`, `Result cities: Bangkok, Phuket`, no unsafe network requests, no forbidden copy matches, and no mobile horizontal overflow;
- an accidentally created non-RadarScout Vercel project named `radarscout-ai-trip-search-partial-match-0-postmerge` was removed;
- future preview attempts must run `pnpm guard:vercel-preview` before `npx vercel --yes`.
- latest fresh Vercel preview, production deploy, and production promotion attempts are blocked by the Vercel free daily deployment quota (`api-deployments-free-per-day`), not by a code/build failure.
- latest PR #321 preview retry is also blocked by the same Vercel quota after passing the local preview guard.
- latest PR #324 app-code candidate has not received a fresh Vercel preview because the same quota gate remains active.
- latest PR #326 is test-only and has not received a fresh Vercel preview because the same quota gate remains active.
- latest PR #327 is test-only and has not received a fresh Vercel preview because the same quota gate remains active.

Decision:

- latest AI Trip app-code increment has clean local validation and previous latest-head protected preview smoke evidence;
- latest AI Trip test-only increment has clean post-merge local validation;
- new preview deployment should be retried after Vercel quota resets or plan capacity changes;
- production deploy remains blocked until Vercel quota resets or plan capacity changes.

## 5. Already-present product surfaces

The current codebase already includes:

- homepage link to `/ai-trip-planner`;
- homepage link to `/chiang-mai/elephant-camp-finder`;
- Chiang Mai deterministic chat planner;
- itinerary summary;
- compact mobile summary;
- AI trip planner route;
- compact AI Trip example prompt chip;
- Thailand multi-city route example prompt chip;
- Thailand multi-city route starter;
- multi-city route stop overview for returned AI Trip product cards;
- multi-city AI Trip product cards grouped by route stop / city;
- Thailand-wide route-comparison result summary wording;
- E2E coverage for Thailand-wide route-comparison result summary wording;
- E2E coverage for Thailand route city-chip visibility;
- E2E coverage for mobile route-stop grouped results without horizontal overflow;
- five-card desktop destination starter layout;
- read-only Thailand product search from confirmed trip intent;
- comparison-only product result cards;
- compact successful-result action and fit-summary spacing on mobile;
- `/tours/{id}?source=ai-trip-planner` return context;
- AI Trip detail CTAs fallback to safe internal `/tours/{id}?source=ai-trip-planner` links if product detail hrefs are malformed or external;
- AI Trip detail CTAs replace existing non-AI `source` parameters with `source=ai-trip-planner` instead of appending duplicate source values;
- E2E coverage verifies product-card detail links preserve safe query params while replacing non-AI `source` values;
- AI Trip Planner context card on sourced tour detail pages;
- local protected-preview smoke helper for `/ai-trip-planner`;
- tour detail no-handoff fallback copy;
- static partner/supplier/destination partner pages;
- B2B mailto-only manual intake guidance.

Do not create duplicate tasks for these already-present surfaces unless the change has a concrete gap and test target.

## 6. Recommended next safe task

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Type:

```text
preview retry / smoke
```

Goal:

After Vercel deployment quota resets, deploy the latest
`origin/codex/travel-mvp-launch` SHA to a clean Vercel preview from a clean
worktree, then smoke-test `/ai-trip-planner`.

Why this is the right next step:

- latest product-code changes are merged;
- latest test-only coverage is merged;
- clean post-merge local validation passed;
- previous protected preview smoke passed for the app-code candidate;
- PR #324 still needs a fresh latest-head preview once quota permits;
- production still serves the older page without route-summary copy;
- preview and production deployment attempts are currently blocked only by
  Vercel quota;
- production deploy remains a separate explicit approval gate after preview
  evidence is available.

## 7. Candidate follow-up tasks after audit

Only after the audit identifies a concrete gap:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-COPY-SAFETY-REVIEW-1
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-1
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-PREVIEW-SMOKE
TD-RADARSCOUT-PREVIEW-DATA-READINESS-0
TD-DEPLOY-AI-TRIP-PLANNER-RESULT-FLOW-PRODUCTION
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
