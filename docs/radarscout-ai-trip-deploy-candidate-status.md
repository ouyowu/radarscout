# RadarScout AI Trip deploy candidate status

Task: `TD-RADARSCOUT-AI-TRIP-DEPLOY-CANDIDATE-STATUS-0`

Updated: 2026-07-06

## Current branch candidate

Latest `origin/codex/travel-mvp-launch` checked for this status:

```text
0a00697021dc190304fec5be84e82e139162d550
```

This head includes:

- AI Trip Planner product-card handoff copy clarified through PR #400;
- active execution status refreshed through PR #405;
- Vercel preview cleanup fixed for the current `.env*` Vercel CLI behavior through PR #407;
- AI Trip prompt-chip tap targets increased through PR #409;
- prior AI Trip result-flow, top-match, route-stop, return-path, and preview-smoke documentation updates.

## Local validation evidence

Latest validation after PR #409:

```text
Validated SHA: 0a00697021dc190304fec5be84e82e139162d550
Worktree: /private/tmp/radarscout-latest-after-pr409
```

Results:

- Prisma generate: passed.
- Vercel preview cleanup/deploy helper tests: passed, 13 tests.
- AI Trip focused Vitest (`pnpm --filter @reddit-monitor/web test -- ai-trip`): passed, 58 files / 923 tests.
- TypeScript (`pnpm --filter @reddit-monitor/web exec tsc --noEmit`): passed.
- Next build: passed.
- Playwright E2E (`pnpm --filter @reddit-monitor/web test:e2e`): passed, 53 tests.
- `git diff --check`: passed.
- Worktree status: clean.

## Preview evidence

Latest successful protected preview smoke before PR #400:

```text
Preview SHA: c04b0399b03f8fcb479a1a44da744487c12267df
Deployment ID: dpl_CFw3GQE4Dasc6h7gFXaMPyz7xzs1
Preview URL: https://reddit-monitor-5j4fonb66-ouyowus-projects.vercel.app
Project: ouyowus-projects / reddit-monitor
Target: preview / null
Production aliases: none observed
```

Protected-preview smoke result:

- `/ai-trip-planner` returned 200 through the protected preview access path.
- Title: `Thailand AI Trip Planner | RadarScout`.
- Robots: `noindex, nofollow`.
- Top match href: `/tours/prod_cm_1?source=ai-trip-planner`.
- Product card count: 3.
- Result summary visible: yes.
- Mobile horizontal overflow: none.
- Unsafe network calls: none observed.
- Forbidden visible copy matches: none observed.

Latest fresh preview attempt after PR #409:

```text
Attempted SHA: 0a00697021dc190304fec5be84e82e139162d550
Result: blocked by Vercel daily deployment quota
Error code: api-deployments-free-per-day
```

Interpretation:

- The current latest branch head has clean local validation.
- The latest successful preview does not include the PR #400 product-card copy update, the PR #407 preview cleanup fix, or the PR #409 tap-target update.
- The latest failed preview attempt confirms the preview wrapper cleans Vercel CLI `.env.local` / `.env*` link side effects and passes the local preview guard before hitting Vercel quota.
- The remaining blocker is operational quota, not a code, build, TypeScript, test, DB, Bókun, or SEO failure.

## Production gate

Production deploy remains gated.

Do not production deploy unless the operator explicitly approves an exact merge SHA.

Recommended deploy candidate if the operator accepts the known preview limitation:

```text
0a00697021dc190304fec5be84e82e139162d550
```

Safer default:

```text
Retry latest-head preview smoke after the Vercel deployment quota resets, then decide on production deploy.
```

## Safety boundary status

This status task made no app-code change and no deployment.

Confirmed boundaries:

- no SEO `index,follow` opening;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability or inventory behavior;
- no DB/schema/env changes;
- no LLM/OpenAI integration;
- no ThaiEleHub or Shopify work.

## Recommended next task

Recommended next safe task:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

If Vercel quota is still blocked, continue with docs/read-only or local-only tasks. Do not treat the quota blocker as a product-code failure.
