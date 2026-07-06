# RadarScout Vercel deployment quota runbook

Task: `TD-RADARSCOUT-VERCEL-DEPLOYMENT-QUOTA-MITIGATION-0`

Updated: 2026-07-06

## 1. Purpose

RadarScout uses Vercel previews as the main gate between local validation and production deploy consideration.

When Vercel returns:

```text
api-deployments-free-per-day
```

the deployment failed because the project or team hit the daily deployment quota. This is an operational capacity blocker, not evidence of an application regression.

## 2. Current project boundary

RadarScout project:

```text
Vercel team: ouyowus-projects
Vercel project: reddit-monitor
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Hard separation:

- do not touch ThaiEleHub files;
- do not run Shopify commands;
- do not use a temporary or accidental Vercel project;
- do not add production aliases to preview deployments.

## 3. Required preview deploy path

Use:

```bash
pnpm deploy:vercel-preview
```

Do not call `npx vercel --yes` directly from RadarScout worktrees.

The wrapper must confirm:

- the worktree is clean;
- `.vercel/project.json` points to `reddit-monitor`;
- the scope is `ouyowus-projects`;
- `.env.local` is absent;
- no production deploy flags are used.

## 4. Quota blocker signature

Expected failed output:

```text
Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day")
```

Classification:

```text
operational blocker
```

Not a blocker for:

- TypeScript validation;
- unit tests;
- targeted Playwright validation;
- Next build;
- docs-only PRs;
- reviewing and merging docs-only status updates.

Still a blocker for:

- fresh Vercel preview smoke;
- production deploy consideration for app-code changes that require preview evidence.

## 5. Safe fallback validation while quota is blocked

For app-code candidates, run same-SHA local validation from a clean worktree:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- aiTrip
pnpm --filter @reddit-monitor/web exec playwright test e2e/ai-trip-planner.spec.ts:426 --workers=1
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
git status --short
```

This fallback proves the candidate builds and the targeted AI Trip flow works locally. It does not replace the preview smoke gate for production deploy consideration unless the user explicitly accepts that substitution for a named merge SHA.

## 6. Protected preview smoke path

If a preview deployment already exists but anonymous access is blocked by Vercel Authentication, use the protected preview runbook:

```text
docs/radarscout-vercel-preview-bypass-runbook.md
```

Do not commit temporary share URLs.

Do not disable preview protection without explicit approval.

## 7. When to retry preview

Retry preview only when one of these is true:

- the Vercel daily quota has likely reset;
- plan capacity has changed;
- the user explicitly asks to retry;
- a fresh preview is required for the next production gate and the quota window has elapsed.

Before retrying:

```bash
git fetch origin
git worktree add /private/tmp/<task-name> origin/codex/travel-mvp-launch
git rev-parse HEAD
git status --short
rm -rf .vercel
npx vercel link --yes --project reddit-monitor --scope ouyowus-projects
cat .vercel/project.json
rm -f .env.local
git checkout -- .gitignore
pnpm deploy:vercel-preview
```

## 8. Production gate

Do not production deploy only because local validation passed.

Production deploy requires:

- explicit user approval naming the merge SHA;
- clean worktree;
- correct Vercel project;
- no DB/schema/env migration unless separately approved;
- no SEO `index,follow` opening unless separately approved;
- no Bókun API/edit/sync;
- no checkout/payment/booking submission behavior;
- no ThaiEleHub or Shopify changes.

## 9. Current operational recommendation

While quota is blocked:

1. Keep product-code work small and PR-scoped.
2. Prefer docs-only status, release-gate, or planning tasks that do not need Vercel preview.
3. Avoid stacking multiple unpreviewed app-code changes.
4. Retry the latest-head preview after quota reset.
5. Only consider production deploy after preview evidence or an explicitly approved substitute gate.

## 10. Current next task

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Resume this task after Vercel quota resets or an approved protected-preview/share smoke path is available.
