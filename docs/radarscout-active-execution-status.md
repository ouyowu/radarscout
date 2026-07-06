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
- Latest clean local validation for the current AI Trip candidate passed, but a fresh Vercel preview deployment is temporarily blocked by the Vercel daily deployment quota.

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

Status: gated.

Decision:

- no production deploy without explicit approval naming the merge SHA.

### Latest fresh preview deployment

Status: temporarily blocked by Vercel quota.

Known state:

- latest `origin/codex/travel-mvp-launch`: `0301c9f492e0fb7e3495031fdb636eacc46befae`;
- latest merged AI Trip product-code increments include PR #279, PR #280, and PR #283;
- clean local validation passed after PR #283;
- Vercel returned `api-deployments-free-per-day` when attempting a fresh preview;
- an accidentally created non-RadarScout Vercel project named `radarscout-ai-trip-search-partial-match-0-postmerge` was removed;
- future preview attempts must run `pnpm guard:vercel-preview` before `npx vercel --yes`.

Decision:

- do not treat the Vercel quota error as a product-code failure;
- retry latest-head preview smoke only after the deployment quota resets;
- do not production deploy the latest AI Trip increments until a fresh preview or equivalent approved validation gate passes.

## 5. Already-present product surfaces

The current codebase already includes:

- homepage link to `/ai-trip-planner`;
- homepage link to `/chiang-mai/elephant-camp-finder`;
- Chiang Mai deterministic chat planner;
- itinerary summary;
- compact mobile summary;
- AI trip planner route;
- read-only Thailand product search from confirmed trip intent;
- comparison-only product result cards;
- compact successful-result action and fit-summary spacing on mobile;
- `/tours/{id}?source=ai-trip-planner` return context;
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
preview smoke after Vercel quota reset
```

Goal:

Create a clean latest-head preview from `origin/codex/travel-mvp-launch`, confirm
the Vercel project is `ouyowus-projects / reddit-monitor`, and run the protected
AI Trip preview smoke helper against `/ai-trip-planner`.

Why this is the right next step:

- the latest product-code changes are already merged;
- local validation is not a substitute for the final preview smoke gate;
- Vercel quota, not code behavior, is currently blocking the fresh preview;
- the next reliable gate is to retry preview deployment after quota reset.

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
