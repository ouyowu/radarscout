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

For UI-only result-flow validation, it is acceptable to mock `/api/ai-trip/search` in Playwright. This proves the deployed frontend shell and client-side result UI without depending on preview database seed state.

Use real network only when the task explicitly requires verifying backend/data behavior.

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

## Recommended future automation

Recommended next implementation:

```text
TD-RADARSCOUT-PREVIEW-SMOKE-HELPER-0
```

Scope:

- create a local-only smoke helper or documented script wrapper;
- accept a preview URL;
- request temporary Vercel access when available;
- run the AI Trip Planner mocked result-flow smoke;
- report title, robots, top-match link, card count, overflow, forbidden copy, and unsafe network findings;
- do not commit secrets or temporary share URLs;
- do not change deployment settings.

This should remain optional tooling. It should not replace full E2E tests, build validation, or production smoke after explicitly approved production deploys.
