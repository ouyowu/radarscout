# RadarScout AI Trip release gate decision package

Task: `TD-RADARSCOUT-AI-TRIP-RELEASE-GATE-DECISION-0`

Updated: 2026-07-06

## 1. Purpose

This document records the current release-gate state for RadarScout AI Trip Planner while Vercel manual preview deployments are blocked by the daily deployment quota.

It is a docs-only decision package. It does not change app code, production, SEO, database, schema, environment variables, Bókun, checkout, payment, ThaiEleHub, or Shopify.

## 2. Current branch state

Latest `origin/codex/travel-mvp-launch` at the start of this package:

```text
fb9c024cd4e4e3d6e0d63b2018c8ae46db9d9aeb
```

Recent relevant merges:

| PR | Type | Summary |
| --- | --- | --- |
| #356 | app code | AI Trip result action shows top matched product title |
| #357 | app code | AI Trip refine links include clearer accessible context |
| #361 | app code | Planning outline links directly to AI Trip search |
| #362 | docs | Production observation recorded |
| #364 | docs | PR #361 preview evidence recorded |

Open PRs at the time of this package:

```text
none
```

## 3. Product-code candidate

Latest product-code candidate:

```text
2d26323c8d7a5bbfe30cad18fc0107637cb6cb5d
```

This includes:

- top-match product title surfaced in the successful AI Trip result action;
- accessible/contextual refine-trip links;
- planning outline link into the AI Trip search section;
- prior AI Trip planner safeguards around comparison-only product results.

## 4. Local validation evidence

Clean validation worktree:

```text
/private/tmp/radarscout-ai-trip-production-observation
```

Validated SHA:

```text
2d26323c8d7a5bbfe30cad18fc0107637cb6cb5d
```

Validation results:

- Prisma generate: passed.
- AI Trip focused Vitest: passed.
- Targeted AI Trip Playwright flow: passed.
- TypeScript: passed.
- Next build: passed.
- `git diff --check`: passed.
- Worktree status: clean.

Interpretation:

- the latest app-code candidate is locally validated;
- local validation does not by itself prove production readiness;
- preview evidence is still the normal gate before production consideration.

## 5. Vercel preview evidence

Manual latest-head preview retry:

```text
Command: pnpm deploy:vercel-preview
Project: ouyowus-projects / reddit-monitor
Guard: passed
Result: blocked by api-deployments-free-per-day
```

GitHub-triggered PR #361 preview:

```text
Deployment ID: dpl_9UhfrZemwViWhLYMdBdt4zXQx5qG
Preview URL: https://reddit-monitor-aq4kz9v0o-ouyowus-projects.vercel.app
Commit: b8af9476bf0ffa814033c8929cf50d725e1f5d3b
Target: preview / null
Status: READY
Production aliases: none observed
```

Anonymous public smoke result:

```text
blocked by Vercel Authentication
```

Authenticated static fetch result:

- `/ai-trip-planner` returned 200.
- Title: `Thailand AI Trip Planner | RadarScout`.
- Robots: `noindex, nofollow`.
- AI Trip Planner static page content was present.
- Public copy remained safety-scoped.

Interpretation:

- PR #361 has a valid READY preview deployment;
- full browser smoke on the preview requires a share URL or another approved protected-preview access path;
- manual latest-head preview is currently blocked by Vercel deployment quota, not by code.

## 6. Production observation

Checked production URLs:

```text
https://radarscout.io/ai-trip-planner
https://www.radarscout.io/ai-trip-planner
```

Observation result:

- page loads 200 on both domains;
- title is `Thailand AI Trip Planner | RadarScout`;
- robots remains `noindex, nofollow`;
- AI Trip Planner UI is visible;
- mocked read-only search can render three product cards;
- result fit summary renders;
- top matched product title text is visible;
- no forbidden visible copy was observed;
- no unsafe network calls were observed;
- no mobile horizontal overflow was observed.

Known production gap:

```text
mocked result detail links did not include source=ai-trip-planner
```

Interpretation:

- production is healthy and safe;
- production should not be represented as containing all latest travel-branch AI Trip detail-link/source-context work;
- latest candidate still needs a preview/full smoke gate or an explicitly approved substitute gate before production deploy consideration.

## 7. Safety boundary status

Confirmed unchanged:

- no SEO `index,follow` opening;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory behavior;
- no DB/schema/env changes;
- no LLM/OpenAI integration;
- no ThaiEleHub/Shopify changes.

Forbidden public copy remains disallowed:

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

## 8. Decision

Current decision:

```text
Do not production deploy yet.
```

Reason:

- latest app-code is locally validated;
- PR #361 has READY preview/static evidence;
- full protected preview browser smoke is still missing;
- manual latest-head preview remains blocked by Vercel daily deployment quota;
- production currently lacks at least one expected latest-candidate signal (`source=ai-trip-planner` in mocked detail links).

## 9. Next executable gate

Preferred next task:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Run when one of these is available:

- Vercel deployment quota resets;
- Vercel plan capacity changes;
- an approved protected-preview/share URL is available for full browser smoke.

Required checks:

- deploy from a clean worktree;
- confirm `.vercel/project.json` points to `reddit-monitor`;
- use `pnpm deploy:vercel-preview`;
- run AI Trip preview smoke against `/ai-trip-planner`;
- verify no production aliases;
- verify no unsafe public copy or unsafe network calls;
- verify AI Trip result links retain `source=ai-trip-planner`;
- verify mobile has no horizontal overflow.

## 10. Production approval shape

If preview smoke passes, production deploy still requires explicit approval naming the exact merge SHA.

Approval should be phrased like:

```text
Approve production deploy for merge SHA <exact-sha>
```

Do not production deploy from a stale branch or from a SHA that has not been validated under the current gate.
