# TD-RADARSCOUT-AI-TRIP-PLANNER-PREVIEW-BYPASS-RUNBOOK-0

## Purpose

RadarScout preview deployments are protected by Vercel SSO. Anonymous `curl` or Playwright smoke tests against a preview URL can redirect to Vercel login instead of the app.

This runbook records the safe workflow for preview smoke tests without weakening production safety gates or changing project settings.

## Current project

```text
Project: ouyowus-projects / reddit-monitor
Production domains:
- https://radarscout.io
- https://www.radarscout.io
Protected preview example:
- https://reddit-monitor-rhzvysbab-ouyowus-projects.vercel.app
```

## Problem signature

When a preview is protected, direct anonymous access returns a redirect similar to:

```text
HTTP/2 302
location: https://vercel.com/sso-api?url=...
x-robots-tag: noindex
```

In browser automation, this appears as:

- expected app controls are missing;
- Playwright waits for app buttons until timeout;
- page HTML is a Vercel auth/login page, not RadarScout.

This is an operational preview-access issue. It does not prove an app regression.

## Approved safe access method

Use Vercel's temporary share URL flow for protected preview deployments.

Preferred agent tool:

```text
mcp__codex_apps__vercel._get_access_to_vercel_url
```

Input:

```text
https://<preview-host>.vercel.app/<path>
```

Output:

```text
https://<preview-host>.vercel.app/<path>?_vercel_share=<temporary-token>
```

Properties:

- expires in roughly 23 hours;
- grants temporary preview access;
- does not change project settings;
- does not deploy;
- does not expose production;
- should not be committed to source files or docs.

## Smoke strategy

Use the temporary share URL for browser smoke.

Before creating a new preview deployment from a clean worktree, use the local
preview deploy wrapper:

```bash
pnpm deploy:vercel-preview
```

The wrapper runs the preview guard first, then calls Vercel with the approved
scope. The guard confirms:

- the git worktree is clean;
- `.vercel/project.json` points to `ouyowus-projects / reddit-monitor`;
- the local worktree is not linked to an accidental temporary Vercel project;
- `.env.local` is absent so preview uses Vercel Preview environment variables;
- production deploy flags such as `--prod` are not being passed through the
  preview path.

Do not call `npx vercel --yes` directly from RadarScout preview worktrees. If the
wrapper fails, fix the local worktree or Vercel link first; do not deploy from
the failed state.

For UI-only result-flow validation, it is acceptable to mock `/api/ai-trip/search` in Playwright. This proves the deployed frontend shell and client-side result UI without depending on preview database seed state.

Use real network only when the task explicitly requires verifying backend/data behavior.

Local helper:

```bash
pnpm smoke:ai-trip-preview 'https://<preview-host>.vercel.app/ai-trip-planner?_vercel_share=<temporary-token>'
```

The helper:

- refuses `radarscout.io` and `www.radarscout.io`;
- requires a `.vercel.app` preview hostname;
- normalizes the path to `/ai-trip-planner`;
- mocks `/api/ai-trip/search`;
- reports title, robots, top-match href, product card count, result summary visibility, horizontal overflow, forbidden copy, and unsafe network calls.

## AI Trip Planner preview smoke checklist

For `/ai-trip-planner`, verify:

- page returns app UI, not Vercel SSO;
- title is `Thailand AI Trip Planner | RadarScout`;
- robots remains `noindex, nofollow`;
- local parsing and confirmation controls are visible;
- results-ready feedback appears after a mocked successful search;
- top-match details link is visible;
- detail link includes `source=ai-trip-planner`;
- three product cards are visible;
- result fit summary is visible;
- mobile viewport has no horizontal overflow;
- no forbidden public copy appears;
- no unsafe network calls are observed.

Forbidden public copy:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
fake reviews
fake ratings
supplier net rate
partner rate
commission
```

Unsafe network calls:

```text
/api/bokun
OpenAI/LLM endpoints
checkout/payment/booking submission endpoints
unexpected DB-write behavior
```

## Evidence from current preview

The protected preview workflow was tested against:

```text
Preview URL:
https://reddit-monitor-rhzvysbab-ouyowus-projects.vercel.app

Deployment:
dpl_JA3eqPjit3YrcJe5wkxrUubKeZQR

Target:
preview/null
```

Direct anonymous access redirected to Vercel SSO.

Using a temporary Vercel share URL plus a mocked `/api/ai-trip/search` response, the AI Trip Planner mobile smoke passed:

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

## What not to do

Do not solve preview smoke failures by:

- disabling preview protection globally without explicit approval;
- committing temporary `_vercel_share` URLs;
- printing secrets;
- adding production aliases to preview deployments;
- using `npx vercel --prod` for preview checks;
- changing `DATABASE_URL`, schema, or seed data unless explicitly scoped;
- touching ThaiEleHub or Shopify.

## Implemented local helper

RadarScout now includes local preview helpers:

```text
pnpm guard:vercel-preview
pnpm deploy:vercel-preview
```

Implementation:

```text
scripts/radarscout-vercel-preview-guard.js
scripts/radarscout-vercel-preview-deploy.js
```

Purpose:

```text
Validate the local deploy worktree and Vercel project link, then run the preview
deployment with the approved Vercel scope.
```

The guard is intentionally local-only. The wrapper only continues to deployment
after the guard passes. Neither helper requests secrets, changes Vercel project
settings, mutates data, or touches production aliases.

RadarScout also includes the AI Trip smoke helper:

```text
pnpm smoke:ai-trip-preview '<protected-preview-ai-trip-planner-url>'
```

Implementation:

```text
scripts/radarscout-ai-trip-preview-smoke.js
```

Current verified behavior:

```text
Preview URL:
https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app/ai-trip-planner

Result:
ok: true
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

The helper remains local/operator tooling. It does not request secrets, store
temporary share URLs, change deployment settings, mutate data, or replace full
validation.

## Remaining preview limitation

The helper intentionally mocks `/api/ai-trip/search` so UI smoke does not depend
on preview database seed state.

If a future task needs to prove real preview data behavior, use a separate
read-only preview-data readiness task first:

```text
TD-RADARSCOUT-PREVIEW-DATA-READINESS-0
```

This should remain optional tooling. It should not replace full E2E tests, build validation, or production smoke after explicitly approved production deploys.
