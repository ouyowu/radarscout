# RadarScout Preview DB Gate Runbook

## Status

Active operational runbook.

## Context

RadarScout preview deployments can build successfully while runtime product-detail smoke tests still fail if the Vercel Preview environment does not have a safe `DATABASE_URL`.

This most recently blocked PR #171, `Add planning-only fallback for tour details without handoff`. The Vercel deployment was `READY`, but `/api/products/[id]` returned `PRODUCT_DETAIL_UNAVAILABLE` because the preview runtime could not load product detail data.

This document exists so Codex, Paperclip agents, and reviewers do not loop on the same failure mode.

## Product boundary

RadarScout owns:

- AI-guided discovery
- deterministic planning UI
- itinerary and comparison support
- safe public tour detail pages
- booking-partner handoff copy and links

RadarScout must not silently cross into:

- checkout
- payment
- booking submission
- live availability or inventory
- Bókun backend/API/sync/edit behavior
- production database changes
- ThaiEleHub or Shopify work

## The gate

Before a PR that depends on product-detail runtime data can pass preview smoke, Vercel Preview must expose:

```text
Project: ouyowus-projects / reddit-monitor
Environment: Preview
Variable: DATABASE_URL
Value: approved preview/staging DB URL
```

The value must be a preview or staging database URL approved by the operator. Do not infer it from production.

## Safe verification

It is safe to verify the variable name and environment only:

```bash
npx vercel env ls preview --scope ouyowus-projects
```

Expected evidence:

```text
DATABASE_URL is listed for Preview
```

Do not print, decode, pull, or log the variable value.

## Unsafe actions

Do not:

- read `.env.production`
- run `vercel env pull` to discover a secret value
- copy production `DATABASE_URL` into Preview
- guess a database URL
- run Prisma migrations
- write to the database
- use `npx vercel --prod`
- merge a runtime-data PR only because the build is green
- treat a Vercel `READY` deployment as proof that product-detail runtime smoke passed

## Expected failure signature

When the Preview DB gate is missing, these symptoms are expected:

```text
Vercel deployment status: READY
/api/products/[id]: HTTP 500
error: PRODUCT_DETAIL_UNAVAILABLE
/tours/[id]: product detail unavailable state
```

This is a runtime environment blocker, not proof that the PR's UI logic is wrong.

## PR #171 handling rule

PR #171 should remain unmerged until a clean preview smoke confirms the runtime behavior after `DATABASE_URL` is present in Vercel Preview.

Required smoke evidence:

- preview deployment is from the PR head SHA
- preview target is non-production
- `/api/products/[id]` can load product detail data from the approved preview/staging DB
- a no-handoff product renders the planning-only fallback
- a handoff product still renders `Check availability`
- `Check availability` remains an external booking partner handoff
- no `/api/bokun` call is observed
- no OpenAI/LLM call is observed
- no checkout, payment, cart, or booking submission behavior is observed
- no production aliases are attached to the preview deployment

## Paperclip continuation rule

If the Preview DB gate is missing, agents should not keep retrying the same smoke loop.

Use this decision table:

| Condition | Action |
| --- | --- |
| `DATABASE_URL` is missing from Vercel Preview | Stop and report the gate. |
| Operator says the value was added | Recheck `vercel env ls preview` by name only. |
| Value is still absent after recheck | Report wrong project/environment/name/save as likely causes. |
| Value is present | Create a fresh PR worktree and rerun preview smoke. |
| Gate remains blocked for multiple turns | Switch only to an approved docs/read-only task, or wait for operator action. |

## Safe fallback work while blocked

If the gate is blocked and the operator approves skipping PR #171 temporarily, safe work can include:

- docs-only runbooks
- queue/state documentation
- product boundary documentation
- partner conversion copy audits
- SEO readiness audits that do not require live DB-backed product detail pages

Do not use blocked time to:

- change DB/schema/env
- edit tour behavior around the unverified runtime case
- open SEO indexing
- add homepage/nav/sitemap changes
- call Bókun
- add checkout/payment/booking behavior

## Unblock checklist

Before rerunning PR #171 preview smoke:

- [ ] `DATABASE_URL` is visible by name in Vercel Preview for `reddit-monitor`.
- [ ] The URL value is approved preview/staging data, not production.
- [ ] A fresh clean worktree is created from the PR head.
- [ ] Local validation passes.
- [ ] A non-production Vercel preview deployment is created or refreshed.
- [ ] Smoke uses the preview deployment only.
- [ ] No production deploy occurs.

## Final operator prompt

Once the variable is visible, the operator can resume with:

```text
DATABASE_URL is visible in Vercel Preview now. Recheck and rerun PR #171 preview smoke.
```
