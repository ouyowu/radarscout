# RadarScout AI Trip Planner release gate status

Task: `TD-RADARSCOUT-AI-TRIP-RELEASE-GATE-STATUS-1`

Last updated: 2026-07-07

## Current branch state

Safe base branch:

```text
origin/codex/travel-mvp-launch
```

Latest checked branch HEAD:

```text
f94317d515b5b9f55ba76a1ea6f5501c435ff6bc
```

Latest application-code candidate in this branch:

```text
e6d9ecf559e5658e3798b053e6f6c409ea12a6c2
```

The latest overall branch HEAD is newer because docs-only status updates were
merged after the application-code candidate, and tooling-only local smoke helpers
were added after those status updates.

## Current product candidate

The current AI Trip Planner candidate includes:

- AI Trip result flow and safe return links from product detail pages;
- read-only Thailand product matching;
- destination and compact-prompt parser coverage;
- homepage prompt boundary clarification;
- mobile result-flow and result-card layout coverage;
- positive public boundary labels:

```text
Read-only comparison
Product-page details
Thailand-only matching
Reviewed coverage first
```

The candidate remains a guarded discovery and comparison surface. It does not
enable LLM/OpenAI calls, Bókun API calls, checkout, payment, booking submission,
inventory behavior, or availability claims.

## Latest validation evidence

Latest clean validation worktree:

```text
/private/tmp/radarscout-ai-trip-production-drift-0-postmerge
```

Validated HEAD:

```text
bca4a504729ce9a1be1639b82c252137e669e2b8
```

Results:

```text
Prisma generate: passed
Focused copySafety Vitest: passed, 59 files / 932 tests
AI Trip Planner Playwright E2E: passed on retry, 54/54
TypeScript: clean
Next build: passed
Full Playwright E2E: passed, 60/60
git diff --check: clean
```

Validation note:

The first focused AI Trip Playwright run hit a local dev-server/test-runner flake
after test 19. The immediate focused rerun passed all 54 tests, and the
subsequent full E2E suite passed all 60 tests. This is recorded as a local test
runner flake, not a product-code failure.

## Latest preview retry

Latest clean preview retry:

```text
Worktree: /private/tmp/radarscout-ai-trip-latest-head-preview-3
HEAD: 5fc5e617ab19ca910966f9142c7fc04f5532441d
Project: ouyowus-projects / reddit-monitor
Guard: pnpm guard:vercel-preview passed
Command: npx vercel --yes
Result: blocked
```

Vercel blocker:

```text
api-deployments-free-per-day
```

This is an external Vercel daily deployment quota blocker. It is not a code,
build, TypeScript, test, project-linking, DB, Bókun, SEO, or production-deploy
failure.

Do not run production deploy to bypass this blocker.

## Local fallback smoke helper

When Vercel preview deploy is blocked by quota, use a local production-build
smoke helper as supporting evidence. This does not replace a real Vercel preview
smoke, but it validates the built frontend shell with the same read-only
AI Trip browser flow.

Start a local production build/server, then run:

```bash
pnpm --filter @reddit-monitor/web build
pnpm --filter @reddit-monitor/web exec next start -p 3456
pnpm smoke:ai-trip-local http://localhost:3456/ai-trip-planner
```

Or run the full local production-build smoke in one command:

```bash
pnpm smoke:ai-trip-local:production
```

The helper:

- refuses RadarScout production domains;
- accepts only `localhost` or `127.0.0.1`;
- mocks `/api/ai-trip/search`;
- checks title, robots, result cards, safe source parameter, mobile overflow,
  unsafe network requests, and forbidden public copy.

Latest helper evidence:

```text
Worktree: /private/tmp/radarscout-ai-trip-local-smoke-helper-0-postmerge
HEAD: 5fc5e617ab19ca910966f9142c7fc04f5532441d
Script tests: passed, 8/8
Next build: passed
Local production smoke: passed
```

Latest one-command helper evidence:

```text
Worktree: /private/tmp/radarscout-ai-trip-local-production-smoke-0-postmerge
HEAD: f94317d515b5b9f55ba76a1ea6f5501c435ff6bc
Script tests: passed, 12/12
One-command local production smoke: passed
```

Latest local production smoke result:

```text
status: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: none
forbiddenMatches: none
```

## Production drift

Observed production URLs:

```text
https://radarscout.io/ai-trip-planner
https://www.radarscout.io/ai-trip-planner
```

Current production result:

- both URLs return `200`;
- title is `Thailand AI Trip Planner | RadarScout`;
- robots remain `noindex, nofollow`;
- production still shows the older `No fake...` transparency labels.

Interpretation:

Production is healthy but behind the latest reviewed AI Trip Planner copy
candidate. This is expected because the latest candidate has not been production
deployed.

## Required next gate

When Vercel preview quota recovers:

1. create a fresh clean worktree from `origin/codex/travel-mvp-launch`;
2. confirm the current HEAD in that worktree;
3. verify the Vercel project is `ouyowus-projects / reddit-monitor`;
4. run `pnpm guard:vercel-preview`;
5. run preview deploy only with `npx vercel --yes`;
6. run the protected AI Trip preview smoke helper against `/ai-trip-planner`;
7. confirm no production aliases, no SEO opening, no unsafe network behavior, and
   no forbidden public copy.

Production deployment still requires explicit approval for an exact SHA.

If the operator accepts the known preview-quota limitation, the current latest
exact SHA for a production approval would be:

```text
f94317d515b5b9f55ba76a1ea6f5501c435ff6bc
```

## Safety boundaries still active

Do not do any of the following from this release gate:

```text
production deploy without exact-SHA approval
SEO index/follow opening
Bókun API/edit/sync
checkout/payment/cart/booking submission
live availability/inventory behavior
DB/schema/env changes
LLM/OpenAI integration
ThaiEleHub/Shopify changes
```

## Recommended next task

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Run it after Vercel deployment quota resets.

Until the preview quota recovers, continue only with local/testable or docs-only
RadarScout tasks and avoid stacking more unpreviewed application-code changes.
