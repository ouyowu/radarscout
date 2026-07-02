# RadarScout Next Queue After Preview DB Gate

## Task

`TD-RADARSCOUT-NEXT-QUEUE-AFTER-PREVIEW-DB-GATE-0`

## Status

Docs-only queue plan. No application code, environment, database, deployment, or Bókun behavior is changed by this document.

## Date

2026-07-02

## Current state

RadarScout has an open product-safety PR:

- PR: `#171`
- Title: `Add planning-only fallback for tour details without handoff`
- Branch: `codex/td-tour-detail-no-handoff-fallback-0`
- Commit: `3c2e31612d493cccf1cb5c7408e5d41dd6d0c737`

The PR is locally validated and applies cleanly to the current `codex/travel-mvp-launch` base, but it cannot complete the normal Vercel Preview runtime smoke because Preview does not currently have `DATABASE_URL`.

The decision record is now merged:

- PR: `#172`
- Title: `Document RadarScout preview database alignment`
- Merge SHA: `2d1f3a8ddc625cde709d1fd4d19224d8113bad71`
- File: `docs/radarscout-preview-database-url-alignment.md`

## Active gate

Do not merge PR `#171` under the normal preview-smoke policy until one of these happens:

1. Vercel Preview receives an approved preview or staging `DATABASE_URL`, then PR `#171` preview smoke passes.
2. The missing DB-backed preview runtime coverage is explicitly waived.
3. PR `#171` is superseded by a different implementation that can be fully verified without Preview database access.

## Safe work that can continue while the gate is unresolved

The following tasks can continue without touching Vercel environment variables, database schema, Bókun API, checkout, payment, booking submission, live availability, ThaiEleHub, or Shopify.

### Task A: Partner conversion path review

**Goal:** Audit the current partner, supplier, and destination-partner pages as a B2B lead path.

**Acceptance criteria:**

- Confirm pages are reachable and still conservative.
- Confirm public copy does not expose supplier rates, commissions, Bókun backend wording, checkout, payment, or live availability claims.
- Identify whether the current mailto-only CTA is enough for short-term partner discovery.
- Recommend whether the next step should be a docs-only lead-capture plan or a static UI copy polish PR.

**Verification:**

- Static page smoke.
- Forbidden-copy audit.
- No API, DB, login, portal, dashboard, checkout, payment, or booking behavior.

### Task B: Homepage-to-finder funnel review

**Goal:** Audit the homepage entry point into the Chiang Mai finder and determine whether users can understand the path from homepage to planner to partner handoff.

**Acceptance criteria:**

- Confirm homepage CTA links to `/chiang-mai/elephant-camp-finder`.
- Confirm homepage copy remains safe.
- Confirm sitemap policy remains conservative.
- Recommend whether any next UI change is needed before SEO opening.

**Verification:**

- Homepage smoke.
- Finder smoke.
- Sitemap check.
- Forbidden-copy audit.

### Task C: SEO controlled-opening readiness follow-up

**Goal:** Reassess whether any page is ready for `index,follow`, without opening indexing.

**Acceptance criteria:**

- Confirm sitemap excludes unsafe tour detail URLs.
- Confirm finder and B2B pages still have intended robots policy.
- Identify exact remaining blockers before opening any page to indexing.
- Produce a recommendation only; do not change metadata.

**Verification:**

- `robots.txt` check.
- `sitemap.xml` check.
- Page metadata checks.
- No production deploy.

### Task D: AI trip planner next-step docs

**Goal:** Define the next safe planning increment beyond the current deterministic Chiang Mai flow.

**Acceptance criteria:**

- Keep the MVP deterministic unless a disabled LLM parser plan is explicitly scoped.
- Do not invent products, availability, ratings, or reviews.
- Keep final product selection and handoff bounded by existing recommendation and booking-partner behavior.
- Recommend a small next task, such as destination/category expansion planning or structured intent parser docs.

**Verification:**

- Docs-only diff.
- No app code.
- No API, DB, schema, env, LLM, or Bókun change.

## Recommended next task

Recommended next safe task while PR `#171` waits on Preview DB access:

`TD-RADARSCOUT-PARTNER-CONVERSION-PATH-0`

Reason:

- It supports the business objective of partner and supplier conversion.
- It does not depend on database-backed Preview runtime behavior.
- It can be audited without Bókun API, checkout, payment, live inventory, or supplier backend work.
- It keeps the current safety model intact.

## PR #171 resume condition

Resume PR `#171` preview smoke when one of these exact conditions is true:

```text
RADARSCOUT_PREVIEW_DATABASE_URL is available in the shell and approved for Vercel Preview.
```

or:

```text
The user explicitly waives DB-backed Preview runtime smoke for PR #171.
```

Until then, PR `#171` should remain open and unmerged.

## Non-goals

This queue plan must not be used to justify:

- production deploy
- Vercel environment changes
- database writes
- Prisma schema changes
- Bókun API calls
- Bókun product edit or sync
- checkout, payment, cart, or booking submission
- live availability or inventory behavior
- LLM/OpenAI integration
- ThaiEleHub or Shopify work
- SEO `index,follow` opening

