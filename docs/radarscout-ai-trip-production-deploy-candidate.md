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
3ce46c4b0da1e45884b8534690595d53b233e059
```

Latest product-code merge included in this branch:

```text
e6c1cf7d6600322d759a994ad6f857c4a42411fd
```

The commits after `e6c1cf7d6600322d759a994ad6f857c4a42411fd` are docs-only status or decision records:

- PR #389: recorded older preview smoke evidence for `7717e79f94909c5d350066364a5a5ffb7bf5d7d6`.
- PR #391: corrected active status after PR #388 and clarified the latest-head preview quota blocker.

If production deployment is later approved, the safest deploy target is the latest branch HEAD at that time, after confirming it is still a direct descendant of the validated product-code merge.

## 2. Product changes included

The current candidate includes the recent AI Trip safe-handoff improvements already merged into `codex/travel-mvp-launch`:

- AI Trip Planner result actions can jump to matching experiences and comparison cards.
- AI Trip product cards explain read-only comparison context.
- Product-card detail CTAs include booking partner handoff context in accessible labels.
- Sourced tour detail pages show AI Trip return context.
- The AI Trip return link points back to the same AI Trip Planner results section.
- Sourced tour detail copy clarifies that no partner action or current status is recorded on the page.
- Unavailable sourced tour detail pages use the same `Back to AI Trip Planner results` label as available sourced tour detail pages.
- Unavailable sourced tour detail pages explain that travelers can return to AI Trip Planner results to compare other matches, and that no partner action or current status is recorded from the unavailable page.

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

Clean post-merge validation was run after PR #388:

```text
e6c1cf7d6600322d759a994ad6f857c4a42411fd
```

Clean worktree:

```text
/private/tmp/radarscout-pr388-postmerge
```

Results:

- Prisma generate: passed.
- Public copy / tours Vitest coverage: passed, 58 files / 921 tests.
- TypeScript: passed.
- Next build: passed.
- `git diff --check`: passed.
- Worktree status: clean.

The latest validation includes PR #388's unavailable tour detail AI Trip context copy plus its public-copy regression coverage. No route, API, database, schema, environment, Bókun, checkout, payment, inventory, or SEO behavior changed.

## 4. Preview status

Preview deployment was attempted from a clean latest-head worktree using the RadarScout preview helper.

Latest successful preview worktree:

```text
/private/tmp/radarscout-latest-head-preview-after-pr386
```

Latest successful preview SHA:

```text
7717e79f94909c5d350066364a5a5ffb7bf5d7d6
```

Vercel project:

```text
ouyowus-projects / reddit-monitor
```

Guard result:

```text
passed
```

Latest successful preview result:

```text
READY and protected-preview smoke passed
```

Meaning:

- Vercel project selection was correct.
- The worktree guard passed.
- The preview deployment for `7717e79f94909c5d350066364a5a5ffb7bf5d7d6` reached `READY`.
- Vercel Authentication protected the anonymous preview URL.
- A temporary Vercel share URL was used for the read-only smoke helper and was not committed.
- A later latest-head preview retry for `e677d50fe8bae620ed738a144727b7fef535e3de` hit `api-deployments-free-per-day`, so the current latest branch head does not yet have fresh preview evidence. PR #391 was docs-only and did not change app behavior after that retry.

Preview evidence:

```text
Preview URL: https://reddit-monitor-rnac2afi7-ouyowus-projects.vercel.app
Deployment ID: dpl_A8sLi6eAksSRFPbRLT1yWZvjLXJs
Project: ouyowus-projects / reddit-monitor
Target: preview / null
Status: READY
Protected-preview smoke: passed
```

AI Trip smoke result:

```text
status: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: []
forbiddenMatches: []
```

Production deployment remains gated on explicit approval naming the latest merge SHA.

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
