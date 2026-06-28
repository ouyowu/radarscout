# RadarScout B2B pageview analytics instrumentation spec

Task: `TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-SPEC`

Date: 2026-06-28

## 1. Purpose

This document defines the safest future implementation boundary for B2B pageview analytics on RadarScout partner pages:

```text
/partners
/suppliers
/destination-partners
```

This is a specification only. It does not add analytics code, scripts, dependencies, cookies, custom events, API routes, database writes, environment variables, schema changes, SEO indexing, production deployment, or ThaiEleHub/Shopify work.

The goal of a later implementation would be narrow:

```text
Measure aggregate B2B pageviews only, so RadarScout can understand whether partner, supplier, and destination-partner pages receive attention.
```

## 2. Source decisions

This spec is based on:

- `docs/radarscout-b2b-analytics-plan.md`;
- `docs/radarscout-b2b-analytics-vendor-review.md`;
- current static B2B pages at `/partners`, `/suppliers`, and `/destination-partners`;
- the current B2B intake model: `mailto:hello@radarscout.io` plus manual triage;
- the current SEO state: B2B pages remain `noindex,nofollow`.

The current approved direction remains:

```text
Do not add analytics yet.
Keep B2B intake manual until real inquiry volume or outreach activity justifies instrumentation.
```

If pageview tracking is later approved, the vendor review recommends starting with Vercel Web Analytics pageviews only. Mailto click tracking and custom events should remain future-only until a separate privacy-reviewed event spec is approved.

## 3. Recommended future implementation

Recommended future implementation:

```text
Use Vercel Web Analytics for B2B pageviews only.
Do not add custom events in the first B2B analytics implementation.
Do not create a RadarScout-owned analytics database or event API.
```

Reasoning:

- pageviews answer the first B2B measurement question without collecting lead details;
- platform-native pageview tracking avoids building a custom event backend;
- no Prisma schema or database write is required;
- no partner/supplier private information is required;
- implementation can be reversed or disabled more easily than a custom event pipeline.

Not approved in this spec:

- adding `@vercel/analytics`;
- adding an analytics provider component;
- adding click tracking;
- adding `track()` calls;
- adding a first-party analytics endpoint;
- adding cookies or a cookie banner;
- adding a CRM or lead database.

## 4. Approved route scope for a later implementation

The first B2B pageview implementation should include only:

```text
/partners
/suppliers
/destination-partners
```

It should explicitly exclude:

```text
/
/chiang-mai/elephant-camp-finder
/tours/*
/api/*
/auth/*
/billing
/campaigns*
/dashboard*
/internal*
/login
/monitors*
/pricing
/signup
```

Reasons:

- homepage and traveler planner analytics belong to the tourist funnel, not this B2B task;
- `/chiang-mai/elephant-camp-finder` remains `noindex,nofollow` and has its own funnel plan;
- `/tours/{id}` pages are still excluded from the sitemap and are not public-safe for broad instrumentation decisions;
- auth, billing, internal, dashboard, campaign, monitor, and API routes are outside the B2B public-interest page scope.

## 5. Data boundaries

Allowed future pageview-level fields should stay low-cardinality and non-personal:

- page path;
- B2B page type: `partners`, `suppliers`, or `destination-partners`;
- deployment environment;
- aggregate pageview counts;
- anonymous aggregate visitor counts if the vendor provides them without exposing identity;
- coarse device class if provided by the analytics vendor and privacy-safe.

Forbidden data:

- sender name;
- sender email address;
- email body contents;
- phone number;
- free-form partner or supplier notes;
- traveler names;
- booking references;
- payment details;
- checkout details;
- exact hotel pickup addresses;
- supplier private rates;
- partner rate details;
- Bókun backend data;
- Bókun database content;
- Bókun credentials;
- product private notes;
- live inventory or availability data.

The future implementation must not add any text-input capture, form submission, backend storage, or CRM sync.

## 6. Later implementation outline

A later implementation PR, if explicitly approved, should follow this outline:

1. Create a fresh clean worktree from `origin/codex/travel-mvp-launch`.
2. Confirm `/partners`, `/suppliers`, and `/destination-partners` still render `noindex,nofollow`.
3. Add the analytics provider in the narrowest possible place.
4. Filter or limit tracking to the three approved B2B routes.
5. Do not add custom events or `mailto` click instrumentation.
6. Do not add an API route, database model, Prisma migration, environment variable, or CRM integration.
7. Add tests proving excluded routes are not intentionally instrumented.
8. Create a preview deployment only.
9. Smoke-test the three B2B pages.
10. Stop before production until the user explicitly approves the exact merge SHA.

If route filtering cannot be implemented safely, stop and keep analytics unimplemented.

## 7. Test plan for a later implementation

Future tests should cover:

- analytics provider is present only after explicit implementation approval;
- B2B page analytics scope is limited to `/partners`, `/suppliers`, and `/destination-partners`;
- `/`, `/chiang-mai/elephant-camp-finder`, and `/tours/*` are not included in this B2B pageview scope;
- `/api/*`, `/auth/*`, `/dashboard*`, and `/internal*` are excluded;
- no custom `track()` calls exist for this B2B pageview-only implementation;
- no `mailto` click events are added;
- B2B pages remain `noindex,nofollow`;
- sitemap behavior remains unchanged;
- no database write, schema change, or environment change is introduced;
- no OpenAI/LLM call is introduced;
- no Bókun API, edit, sync, or backend wording is introduced;
- no checkout, payment, cart, booking submission, live availability, or inventory behavior is introduced.

Recommended validation commands for a later implementation:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- partners
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

## 8. Rollout plan for a later implementation

Rollout sequence:

```text
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-0
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-PREVIEW-SMOKE
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-MERGE-POSTMERGE-PREVIEW
TD-DEPLOY-B2B-ANALYTICS-PAGEVIEW-PRODUCTION only after explicit approval
```

Preview smoke should verify:

- `/partners` loads 200;
- `/suppliers` loads 200;
- `/destination-partners` loads 200;
- all three remain `noindex,nofollow`;
- CTA remains `mailto:hello@radarscout.io`;
- no backend form submission exists;
- no DB write occurs;
- sitemap remains unchanged;
- `/tours/{id}` remains excluded from sitemap;
- `/chiang-mai/elephant-camp-finder` remains excluded from sitemap unless separately approved;
- no ThaiEleHub or Shopify files changed.

Production deploy remains a hard approval gate.

## 9. Guardrails

This spec does not authorize implementation.

Do not do any of the following in this docs-only task:

- production deploy;
- preview deploy;
- add analytics scripts;
- add analytics dependencies;
- add cookies or cookie-banner behavior;
- add custom events;
- add mailto click tracking;
- add API routes;
- add database writes;
- change Prisma schema;
- change environment variables;
- open SEO `index,follow`;
- add B2B pages to sitemap;
- re-add `/tours/{id}` to sitemap;
- touch ThaiEleHub files;
- run Shopify commands;
- call OpenAI or any LLM;
- call, edit, or sync Bókun;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior.

## 10. Recommended next task

Current task:

```text
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-SPEC
```

Recommended next implementation task only if the user explicitly approves analytics work:

```text
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-0
```

Until that approval exists, keep B2B analytics manual and continue using the partner lead triage process.
