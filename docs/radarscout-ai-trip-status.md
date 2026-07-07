# RadarScout Trip Planner — Consolidated Status

Last updated: 2026-07-07

This single document supersedes and replaces the following status/gate/audit
docs, which have been removed to stop status-doc sprawl:

```text
radarscout-active-execution-status.md
radarscout-ai-trip-deploy-candidate-status.md
radarscout-ai-trip-mobile-results-ux-audit.md
radarscout-ai-trip-planner-copy-safety-review.md
radarscout-ai-trip-planner-copy-safety-review-1.md
radarscout-ai-trip-planner-mobile-results-ux-audit.md
radarscout-ai-trip-planner-production-readiness.md
radarscout-ai-trip-planner-release-status.md
radarscout-ai-trip-planner-results-ux-audit.md
radarscout-ai-trip-production-deploy-candidate.md
radarscout-ai-trip-production-drift-observation.md
radarscout-ai-trip-production-observation.md
radarscout-ai-trip-real-preview-smoke.md
radarscout-ai-trip-release-gate-decision.md
radarscout-ai-trip-release-gate-status.md
```

Process rule going forward: do **not** create a new status-only PR or status
doc unless it changes a decision or unblocks a gate. Update this file in place.

## 1. What the feature is (verified)

The `/ai-trip-planner` route is a **read-only Thailand trip discovery page**.
Verified against source on 2026-07-07:

- `robots: { index: false, follow: false }` — the page is noindex.
- No LLM/OpenAI/Anthropic calls anywhere in `lib/ai-trip` or `lib/aiProducts`.
  The "planner" is deterministic local intent parsing plus keyword product
  search over eligible Thailand records (with a hand-maintained interest alias
  table in `app/api/ai-trip/search/route.ts`).
- Read-only: no create/update/delete/upsert in `lib/aiProducts`.
- `app/api/ai-trip/search/route.ts` `META` explicitly sets
  `itineraryGenerationEnabled: false`, `bookingEnabled: false`,
  `availabilityEnabled: false`.
- Public copy is free of booking / payment / availability / rating / Bókun
  backend claims (enforced by `app/ai-trip-planner/__tests__/copySafety.test.ts`
  and `app/__tests__/publicCopySafety.test.ts`).

## 2. Honest-naming change (2026-07-07)

Because the runtime uses **no generative AI**, the planner's public display name
was changed from "AI Trip Planner" to "Trip Planner" across the planner feature
cluster (`app/ai-trip-planner/page.tsx`, `app/tours/[id]/page.tsx` return-links,
`IntentParserDemo` aria-label, and the preview-smoke script + test). A guard was
added to `copySafety.test.ts` so the page cannot re-introduce unqualified `AI`
marketing claims (`AI trip planner`, `AI-powered`, `AI-guided`).

The honest, explicitly-future-stage label `AI-generated itinerary → Future stage`
is intentionally retained (it describes a not-connected future capability, not a
current claim). Site-wide brand surfaces (homepage title, destinations,
suppliers) still say "AI" and are **out of scope** for this change — that is a
separate branding decision.

## 3. Validation evidence

Local validation completed on 2026-07-07 after the honest-naming change and
latest `codex/travel-mvp-launch` merge:

```text
Prisma generate: passed
Focused Trip Planner / tour Vitest: passed, 59 files / 932 tests
Smoke script unit tests: passed, 12/12
TypeScript: clean
Next build: passed
Focused Trip Planner / homepage Playwright E2E: passed, 60/60
git diff --check: clean
```

Local production-mode smoke (`pnpm smoke:ai-trip-local:production`): passed.

```text
status: 200
title: Thailand Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: none
forbiddenMatches: none
```

## 4. Release candidate

The real code tip for this feature is the last `app/ai-trip-planner` /
`app/api/ai-trip` / `lib/ai-trip` **code** commit — not a docs-only merge. When
preparing a production deploy, anchor the candidate to that code commit, verify
`git diff --check` is clean, and confirm the exact SHA. Do not treat a
status-doc merge commit as the release candidate.

## 5. Blockers

Primary: Vercel **free-tier** preview quota (`api-deployments-free-per-day`).
This is a plan limit, not a code problem. Options: upgrade the Vercel plan, or
accept the local smoke as sufficient evidence for this noindex/read-only page.

Secondary: any stale, conflicting status-doc PR (e.g. #463) should be closed as
superseded — it contains no product code.

## 6. Decision options for release

- **Option A** — wait for Vercel quota reset, run a real preview smoke, then
  deploy the exact code SHA if clean. Cleanest process.
- **Option B** — accept the local production smoke as sufficient (justified for
  a noindex, read-only, no-DB-write, booking/availability-disabled page) and
  deploy the exact code SHA. Reasonable if speed matters.
- **Option C** — pause release and run a real product-quality review of the
  planner (result relevance, whether users want it) before further release work.

## 7. Production deploy candidate (Option B)

Prepared on 2026-07-07 from a clean worktree:

```text
Worktree: /private/tmp/radarscout-prod-deploy-candidate-b
Branch: codex/td-radarscout-prod-deploy-candidate-b
Deployable branch HEAD: 7d446eedabbb7667ba559aa00d6b961348360de8
Last real Trip Planner code commit: 58d25e8 Parse word-number Trip Planner durations
Base: origin/codex/travel-mvp-launch
git status --short: clean before validation
git diff --check: clean before and after validation
```

Vercel project check:

```text
Project: ouyowus-projects / reddit-monitor
Project ID: prj_TG7h3uoTkZR5OdlIoroJOj3T5uUy
Framework: Next.js
Build command: pnpm --filter @reddit-monitor/web build
Output directory: apps/web/.next
Observed production target: manual Vercel production deployment
Current live production deployment observed by CLI: dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
Production aliases observed: radarscout.io, www.radarscout.io
```

The Vercel CLI exposed the project and production deployment target, but did not
print a Git production-branch setting in `vercel project inspect`. Treat the
safe deploy path as an explicit manual CLI production deploy from the approved
clean worktree/SHA, not as an assumed branch auto-deploy.

Pending PR status at candidate preparation time:

```text
Honest Trip Planner naming: merged via PR #465.
Trip Planner quality fixes: merged through PR #469.
Optional SEO index guard PR #471: open, test/doc-only, not required for this
  noindex/read-only Trip Planner deploy candidate.
Analytics PR #470: open and out of scope; analytics provider remains postponed.
```

Local gate results:

```text
pnpm --filter @reddit-monitor/db exec prisma generate: passed
pnpm --filter @reddit-monitor/web exec tsc --noEmit: passed
pnpm --filter @reddit-monitor/web exec vitest run: passed, 59 files / 936 tests
pnpm --filter @reddit-monitor/web exec playwright test: passed, 60/60
pnpm --filter @reddit-monitor/web build: passed
pnpm smoke:ai-trip-local:production: passed
git diff --check: clean
```

Production-mode local smoke output:

```json
{
  "ok": true,
  "failedChecks": [],
  "status": 200,
  "title": "Thailand Trip Planner | RadarScout",
  "robots": "noindex, nofollow",
  "topMatchHref": "/tours/prod_cm_1?source=ai-trip-planner",
  "productCardCount": 3,
  "resultSummaryVisible": true,
  "noHorizontalOverflow": true,
  "viewport": {
    "clientWidth": 390,
    "scrollWidth": 390
  },
  "unsafeNetwork": [],
  "forbiddenMatches": []
}
```

Decision note:

```text
Known preview limitation accepted for Option B:
Vercel free-tier preview quota previously blocked real preview smoke. For this
specific release surface, local production-mode smoke is accepted as sufficient
evidence because /ai-trip-planner remains noindex, read-only, deterministic,
no-DB-write, booking-disabled, availability-disabled, and payment-free.
```

Human deploy command, if approved:

```bash
rm -rf /private/tmp/radarscout-trip-planner-prod-7d446ee
git -C /Users/ouyowu/reddit-monitor worktree add \
  /private/tmp/radarscout-trip-planner-prod-7d446ee \
  7d446eedabbb7667ba559aa00d6b961348360de8
cd /private/tmp/radarscout-trip-planner-prod-7d446ee
npx vercel link --yes --project reddit-monitor --scope ouyowus-projects
npx vercel --prod --yes
```

The agent must not run the command above. The human must explicitly approve and
run the production deploy. Do not use this docs/report branch as the deploy
source; deploy the exact app HEAD above so the release candidate is anchored to
the reviewed product code rather than a later status-doc commit.

Post-deploy production observation checklist:

```text
Check https://radarscout.io/ai-trip-planner and https://www.radarscout.io/ai-trip-planner
- page returns 200
- browser title is Thailand Trip Planner | RadarScout
- robots remains noindex,nofollow
- Trip Planner copy uses honest naming; no unqualified AI marketing claim
- search flow returns 3 safe product cards for a valid Thailand prompt
- no unsafe visible claims: live availability, available now, instant confirmation,
  checkout, payment, booking complete, Bókun backend/database/powered, partner
  rate, supplier net rate, commission, fake reviews, fake ratings
- no unsafe network: no OpenAI/LLM, no /api/bokun call, no checkout/payment/
  booking submission, no DB write
- product detail links preserve safe Trip Planner source
Check https://radarscout.io/chiang-mai/elephant-camp-finder
- page remains live and indexable according to current controlled-opening policy
```

Rollback plan:

```text
Use Vercel dashboard rollback, or run vercel rollback to the previous production
deployment. No DB/schema/env change is involved, so rollback is deployment-only.
```

## 8. Production observation (post Option B deploy attempt)

Observed on 2026-07-07 from a docs-only worktree:

```text
Worktree: /private/tmp/radarscout-prod-observation-b
Branch: codex/td-radarscout-prod-observation-b
Source branch: codex/td-radarscout-prod-deploy-candidate-b
```

Deployment status:

```text
Expected: production deployment switched away from old dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
Actual radarscout.io deployment ID: dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
Actual www.radarscout.io deployment ID: dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
Target: production
Status: Ready
Aliases: radarscout.io, www.radarscout.io
Result: deployment switch not confirmed; Option B deploy is not closed.
```

Smoke command note:

```text
Requested command:
node scripts/radarscout-ai-trip-preview-smoke.js https://www.radarscout.io/ai-trip-planner

Result:
Refusing to run against RadarScout production domains.
```

The existing preview smoke script intentionally refuses production domains. A
read-only one-off Playwright observation using the same mocked `/api/ai-trip/search`
frontend-shell pattern was run against production without modifying app code.

Production route observation:

```json
{
  "wwwTripPlanner": {
    "url": "https://www.radarscout.io/ai-trip-planner",
    "status": 200,
    "title": "Thailand Trip Planner | RadarScout",
    "robots": "noindex, nofollow",
    "productCardCount": 3,
    "resultSummaryVisible": true,
    "noHorizontalOverflow": true,
    "unsafeNetwork": [],
    "forbiddenMatches": []
  },
  "rootTripPlanner": {
    "url": "https://radarscout.io/ai-trip-planner",
    "status": 200,
    "title": "Thailand Trip Planner | RadarScout",
    "robots": "noindex, nofollow",
    "productCardCount": 3,
    "resultSummaryVisible": true,
    "noHorizontalOverflow": true,
    "unsafeNetwork": [],
    "forbiddenMatches": []
  },
  "chiangMaiFinder": {
    "url": "https://www.radarscout.io/chiang-mai/elephant-camp-finder",
    "status": 200,
    "title": "Find the right Chiang Mai experience | RadarScout",
    "robots": "index, follow",
    "plannerVisible": true
  }
}
```

Assessment:

```text
Route behavior: passed.
Safety/network copy: passed.
Controlled SEO state: passed.
Deployment switch: failed / not observed.
Blocker: production aliases still point to old deployment dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3.
Recommended next action: if the human intended to deploy 7d446ee, rerun the exact
manual production deploy command from §7, then rerun this observation. If a bad
deployment appears later, rollback is Vercel-only because there were no DB/schema/env changes.
```

## 9. Recommended next real product work

1. Trip result quality review (is keyword-match relevance good enough?).
2. Booking-partner handoff coverage on product pages.
3. Traveler analytics funnel (currently no conversion/analytics data exists).
4. SEO `index,follow` opening only after readiness gates — not before there is
   real traffic and conversion evidence.
