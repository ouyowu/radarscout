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
- Latest clean local validation passed for the current AI Trip candidate. The previous protected Vercel preview smoke passed before PR #301; a fresh preview for PR #301 is blocked by the Vercel daily deployment quota.

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

Status: partially passed; latest local validation passed, latest fresh preview blocked by Vercel quota.

Known state:

- latest `origin/codex/travel-mvp-launch`: `8b3123703e493175847b944bee55ed7b8a67dfb3`;
- latest merged AI Trip app-code increment: PR #301, merge SHA `8b3123703e493175847b944bee55ed7b8a67dfb3`;
- latest merged AI Trip status-doc increment: PR #298, merge SHA `b41834b197d1f9a107a3e63eb2b6dddfeb79ee1e`;
- clean local validation passed after PR #297 and after the current release-gate docs refresh;
- clean local validation passed after PR #301 with Prisma generate, AI Trip Vitest, AI Trip E2E, TypeScript, Next build, and `git diff --check`;
- Vercel PR preview deployment `https://reddit-monitor-qp4o01w65-ouyowus-projects.vercel.app` completed successfully for PR #298 head `58c0b89c4f47f183a1eddd205b5683cfbc0eafa4`;
- PR #298 head and merge commit `b41834b197d1f9a107a3e63eb2b6dddfeb79ee1e` have the same tree hash `2b86ef7de933477c02ee2f47c3041f9b5fe2a37d`;
- protected preview smoke passed for `/ai-trip-planner` through an approved temporary Vercel share URL;
- PR #301 Vercel check returned `api-deployments-free-per-day`, so no fresh protected preview is available for the latest merge SHA yet;
- an accidentally created non-RadarScout Vercel project named `radarscout-ai-trip-search-partial-match-0-postmerge` was removed;
- future preview attempts must run `pnpm guard:vercel-preview` before `npx vercel --yes`.

Decision:

- do not treat the Vercel quota error as a product-code failure;
- the latest AI Trip app-code increment has clean local validation, but still needs fresh latest-head preview smoke when quota allows or an equivalent approved gate;
- production deploy remains gated by explicit approval for a merge SHA.

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
- five-card desktop destination starter layout;
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

- latest product-code changes are merged;
- clean local validation passed;
- Vercel quota, not code behavior, is currently blocking the fresh preview;
- the next reliable gate is to retry latest-head preview smoke after quota reset.

If Vercel quota remains blocked, continue only with local/docs/read-only tasks
that do not require preview deployment or production changes.

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
