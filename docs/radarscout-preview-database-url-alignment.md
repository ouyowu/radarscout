# RadarScout Preview Database URL Alignment

## Task

`TD-RADARSCOUT-PREVIEW-DATABASE-URL-ALIGNMENT-0`

## Status

Proposed decision record. No environment change has been made.

## Date

2026-07-02

## Context

RadarScout uses Vercel preview deployments as a safety gate before merging or deploying production changes. PR #171, `Add planning-only fallback for tour details without handoff`, created a valid Vercel preview deployment:

- PR: `#171`
- Branch: `codex/td-tour-detail-no-handoff-fallback-0`
- Commit: `3c2e31612d493cccf1cb5c7408e5d41dd6d0c737`
- Preview deployment: `dpl_77Kd8gEuRQDVduocqjuHuQnRguKw`
- Preview target: `preview`
- Preview status: `READY`

Local validation passed before runtime smoke:

- Prisma generate passed
- Focused tour and public-copy tests passed
- Focused SEO tests passed
- Full Vitest passed
- Playwright E2E passed
- TypeScript passed
- Next build passed
- `git diff --check` passed

The preview runtime smoke could not prove found-product `/tours/{id}` states because the preview deployment did not have a database connection.

Observed preview behavior:

- `/api/products` returned `PRODUCTS_UNAVAILABLE`
- known `/tours/{id}` product URLs rendered unavailable product-detail state
- Vercel runtime logs reported `Environment variable not found: DATABASE_URL`
- `vercel env ls` showed `DATABASE_URL` exists for `Production` only

This means PR #171 is locally validated, but the preview deployment cannot verify database-backed tour detail behavior.

## Decision needed

RadarScout needs a clear policy for how Vercel Preview deployments access product data during smoke tests.

Do not solve this by silently copying production secrets into preview. Any preview database connection is an environment decision and must be explicit.

## Recommended option

Create a dedicated preview/staging database connection and add it as Vercel Preview `DATABASE_URL`.

Preferred properties:

- separate from production
- read-only if practical
- contains enough safe product records to exercise public `/api/products` and `/tours/{id}` states
- includes at least one product with verified `bookingPartnerHandoff`
- includes at least one product without verified `bookingPartnerHandoff`
- does not grant write access needed for crawler, enrichment, or admin workflows

This allows preview smoke to verify:

- no-handoff tour detail renders `Planning-only detail`
- no-handoff tour detail does not render `Check availability`
- verified-handoff tour detail renders `Check availability`
- verified handoff has `rel="nofollow sponsored noopener noreferrer"`
- `/tours/{id}` remains `noindex,nofollow`
- no forbidden public copy is introduced
- no checkout/payment/booking submission behavior exists

## Alternative options considered

### Option A: Add a dedicated preview/staging database URL

Value:

- enables realistic preview smoke
- avoids production data dependency
- supports repeatable QA for `/api/products`, `/tours`, and `/tours/{id}`

Risk:

- requires provisioning and maintaining preview data
- if not read-only, preview can accidentally mutate shared data through unrelated routes

Safety gates:

- use a separate database from production
- prefer least-privilege credentials
- do not run migrations automatically
- do not expose secrets in logs or PR output
- rerun PR #171 preview smoke after adding the env

### Option B: Add production `DATABASE_URL` to Vercel Preview

Value:

- fastest way to make preview match production data
- immediately enables PR #171 runtime smoke

Risk:

- preview functions can read production data
- unrelated preview routes may have production DB access
- any accidental write-capable path has higher blast radius

Safety gates:

- requires explicit user approval
- should be temporary unless intentionally accepted as policy
- avoid running write-path tests against preview
- verify no DB writes during smoke

### Option C: Keep Preview without `DATABASE_URL`

Value:

- safest environment isolation
- no production or staging database exposure

Risk:

- database-backed preview smoke cannot prove `/api/products` or found-product `/tours/{id}` behavior
- future PRs affecting public product pages will keep requiring local-only or production-only verification

Safety gates:

- do not claim full preview smoke for DB-backed pages
- merge only when the missing runtime coverage is explicitly waived
- continue using local automated tests as the primary evidence

## Non-goals

This decision must not introduce:

- production deploy
- SEO `index,follow` opening
- Bókun API calls
- Bókun product edit or sync
- checkout, payment, cart, or booking submission
- live availability or inventory behavior
- Prisma schema changes
- automatic migrations
- LLM/OpenAI integration
- ThaiEleHub or Shopify work

## Recommended next task

`TD-RADARSCOUT-PREVIEW-DATABASE-URL-ALIGNMENT-1`

Scope:

1. Choose the preview database policy.
2. Add Vercel Preview `DATABASE_URL` only after explicit approval.
3. Rerun PR #171 preview smoke from a clean worktree.
4. Verify both no-handoff and verified-handoff tour detail states.
5. Stop before merge unless preview smoke passes.

## Required approval phrases

For a dedicated preview/staging DB:

```text
Approve adding DATABASE_URL to Vercel Preview for reddit-monitor using the approved preview/staging DB URL, then rerun PR #171 preview smoke.
```

For temporary production DB access from Preview:

```text
Approve adding production DATABASE_URL to Vercel Preview for reddit-monitor, then rerun PR #171 preview smoke.
```

For no Preview DB access:

```text
Do not add preview DATABASE_URL. Decide next RadarScout task without merging PR #171.
```

## Current blocker

PR #171 should not be merged under the normal preview-smoke policy until the preview database decision is resolved or the missing runtime product-state smoke is explicitly waived.
