# RadarScout AI Trip production deploy candidate

Task: `TD-RADARSCOUT-AI-TRIP-PRODUCTION-DEPLOY-CANDIDATE-DOCS`

Status: docs-only release candidate record.

This document prepares the current RadarScout AI Trip / tour-detail return-context work for a future production deployment approval decision. It does not deploy, change app code, change SEO indexing, call Bókun, change database/schema/env, or touch ThaiEleHub.

## 1. Candidate branch state

Current deployable branch:

```text
origin/codex/travel-mvp-launch
```

Latest branch HEAD at this record:

```text
366b0113da82cf910ef485e034f287ff7f1cc832
```

Latest product-code merge included in this branch:

```text
85e25156fdae83b367d324cc7389116d541cb547
```

The commits after `85e25156fdae83b367d324cc7389116d541cb547` are docs-only status or decision records:

- PR #378: refreshed active status after PR #377.
- PR #379: recorded the traveler funnel analytics decision to postpone analytics implementation.

If production deployment is later approved, the safest deploy target is the latest branch HEAD at that time, after confirming it is still a direct descendant of the validated product-code merge.

## 2. Product changes included

The current candidate includes the recent AI Trip safe-handoff improvements already merged into `codex/travel-mvp-launch`:

- AI Trip Planner result actions can jump to matching experiences and comparison cards.
- AI Trip product cards explain read-only comparison context.
- Product-card detail CTAs include booking partner handoff context in accessible labels.
- Sourced tour detail pages show AI Trip return context.
- The AI Trip return link points back to the stable matching experiences section.
- Sourced tour detail copy clarifies that no partner action or current status is stored on the page.

The candidate does not add:

- LLM/OpenAI integration;
- Bókun API calls;
- Bókun product edit or sync behavior;
- checkout, payment, cart, booking submission, confirmation, live availability, or inventory behavior;
- database writes;
- Prisma schema changes;
- environment changes;
- SEO `index,follow` opening;
- ThaiEleHub or Shopify work.

## 3. Validation evidence

Clean post-merge validation was run against the product-code merge:

```text
85e25156fdae83b367d324cc7389116d541cb547
```

Clean worktree:

```text
/private/tmp/radarscout-pr377-postmerge
```

Results:

- Prisma generate: passed.
- Public copy / AI Trip Vitest coverage: passed.
- Full Vitest as reached by the focused public-copy run: passed, 58 files / 921 tests.
- AI Trip Playwright E2E: passed, 53 / 53 tests.
- TypeScript: passed.
- Next build: passed after rerunning build separately from Playwright to avoid `.next` write contention.
- `git diff --check`: passed.
- Worktree status: clean.

The initial concurrent build run failed with a Next `PageNotFoundError` for `/_document`. The failure was caused by running Playwright and `next build` in parallel against the same `.next` directory. After removing `apps/web/.next` and rerunning `pnpm --filter @reddit-monitor/web build` separately, the build passed.

## 4. Preview status

Preview deployment was attempted from a clean latest-head worktree using the RadarScout preview helper.

Vercel project:

```text
ouyowus-projects / reddit-monitor
```

Guard result:

```text
passed
```

Current blocker:

```text
api-deployments-free-per-day
```

Meaning:

- Vercel project selection was correct.
- The worktree guard passed.
- The deploy failed because the Vercel account hit the daily deployment quota.
- This is not a code, TypeScript, test, or build failure.

Production deployment should ideally wait for fresh preview evidence after quota reset. If the operator chooses to proceed without a fresh preview, that should be an explicit production approval decision naming the merge SHA and acknowledging the preview quota blocker.

## 5. Production approval gate

Production deployment is not approved by this document.

Required approval wording:

```text
Approve production deploy for merge SHA <exact latest branch HEAD>
```

Before running production deploy, confirm:

- clean production worktree under `/private/tmp/<task-name>`;
- `git rev-parse HEAD` equals the explicitly approved SHA;
- `git status --short` is empty;
- Vercel project is `ouyowus-projects / reddit-monitor`;
- no ThaiEleHub or Shopify commands are run;
- no source changes are made during deployment.

## 6. Production smoke checklist

After any approved production deployment, check:

```text
https://radarscout.io/ai-trip-planner
https://www.radarscout.io/ai-trip-planner
```

Verify:

- page loads 200;
- title remains `Thailand AI Trip Planner | RadarScout`;
- robots remain `noindex,nofollow` unless a separate SEO opening task explicitly approved otherwise;
- trip idea input is visible;
- destination starter chips are visible;
- successful Chiang Mai / Thailand prompt flow can search safely;
- result action can jump to matching experiences;
- result action can jump to comparison cards;
- product cards show comparison-only context;
- product detail links preserve safe AI Trip source context;
- `/tours/{id}?source=ai-trip-planner` shows the AI Trip context card;
- return link points to `/ai-trip-planner#ai-trip-results`;
- no unsafe booking, payment, live availability, instant confirmation, partner-rate, supplier-rate, commission, fake review, or fake rating claims appear.

Network/safety checks:

- no OpenAI/LLM calls;
- no `/api/bokun` calls from public AI Trip flow;
- no Bókun edit/sync behavior;
- no checkout/payment/booking submission request;
- no DB write behavior from the public traveler flow.

## 7. Rollback plan

If production smoke fails after an approved deploy:

1. Stop further changes.
2. Capture the failing URL, response status, screenshot or console output if available, and current production deployment ID.
3. Revert or redeploy the last known good production deployment through Vercel.
4. Open a narrow fix branch from `origin/codex/travel-mvp-launch`.
5. Add or update regression coverage before attempting another deploy.

Do not attempt a broad refactor during rollback.

## 8. Current recommendation

Recommended next step:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Run this after Vercel deployment quota resets or when an approved protected-preview/share-smoke path is available.

If the operator wants to skip the preview blocker and proceed anyway, require explicit production approval for the exact latest branch HEAD.

## 9. Safety confirmations

This docs-only task confirms:

- app code changed: no;
- production deploy: no;
- preview deploy completed: no, blocked by Vercel quota;
- SEO `index,follow` opened: no;
- LLM/OpenAI added: no;
- Bókun API/edit/sync added: no;
- checkout/payment/booking submission added: no;
- DB/schema/env changed: no;
- ThaiEleHub files touched: no.
