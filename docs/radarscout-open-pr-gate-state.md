# RadarScout open PR gate state

Task: `TD-RADARSCOUT-OPEN-PR-GATE-STATE-0`

Date: 2026-07-02

Status: docs-only queue snapshot. This document does not change app code, Vercel
environment variables, database state, Prisma schema, Bókun behavior, checkout,
payment, booking submission, live availability, SEO indexing, production
deployment, or ThaiEleHub/Shopify work.

## Purpose

RadarScout currently has multiple safe-looking open pull requests and one
runtime-blocked product PR. This document records the current merge gates so the
Paperclip handoff can keep moving without accidentally merging a blocked PR or
looping on a missing Preview database decision.

## Current open PRs

| PR | Title | Type | Current gate |
| --- | --- | --- | --- |
| `#176` | Add safe partner intake guidance | App UI copy + tests | Ready for explicit merge approval and post-merge preview smoke. |
| `#175` | Add RadarScout partner manual intake checklist | Docs-only | Safe candidate after `#176` unless superseded. |
| `#174` | Audit RadarScout partner conversion path | Docs-only | Safe candidate after `#176`; useful context for `#175` and B2B conversion work. |
| `#173` | Document next RadarScout queue after preview DB gate | Docs-only | Safe candidate, but lower priority after partner conversion docs. |
| `#171` | Add planning-only fallback for tour details without handoff | App code + tests | Keep open; do not merge until Preview DB runtime smoke is resolved or explicitly waived. |

## Recommended merge order

1. `#176` — merge first because it is the already preview-smoked product change
   that improves B2B partner conversion while staying static and low risk.
2. `#174` — merge the partner conversion audit so the reasoning for B2B work is
   recorded.
3. `#175` — merge the manual intake checklist as the operating process that
   supports the B2B pages.
4. `#173` — merge the queue note after the partner conversion documents if it is
   still useful.
5. `#171` — keep blocked until the Preview database gate is resolved.

This order keeps the product-moving, low-risk B2B improvement first while
preserving the explicit Preview DB boundary around tour detail behavior.

## PR #176 gate

Required next user approval:

```text
Approve merge PR #176 and run post-merge preview smoke
```

Expected post-merge checks:

- merge into `codex/travel-mvp-launch`;
- create a fresh clean worktree from the merged branch;
- run focused partner tests, full Vitest, TypeScript, and Next build;
- create Vercel Preview only;
- smoke `/partners`, `/suppliers`, and `/destination-partners`;
- confirm `What to send first` appears;
- confirm CTA remains `mailto:hello@radarscout.io`;
- confirm `noindex,nofollow` remains;
- confirm no forms, API calls, DB writes, checkout, payment, booking submission,
  Bókun API, or ThaiEleHub/Shopify behavior.

Do not production deploy as part of this gate.

## PR #171 gate

`#171` should remain open and unmerged under the normal preview-smoke policy.

Current blocker:

```text
Vercel Preview runtime does not have an approved DATABASE_URL.
```

Observed behavior:

- Vercel build/check can be green;
- authenticated preview access can work;
- DB-backed product API smoke can still return `PRODUCTS_UNAVAILABLE`;
- this is not enough to prove tour detail behavior with real DB-backed products.

Allowed resume conditions:

```text
RADARSCOUT_PREVIEW_DATABASE_URL is available in the shell and approved for Vercel Preview.
```

or:

```text
The user explicitly waives DB-backed Preview runtime smoke for PR #171.
```

Do not:

- copy Production `DATABASE_URL` into Preview without explicit approval;
- print or commit any database URL;
- treat local tests, docs-only validation, or a green Vercel build as proof of
  DB-backed Preview runtime behavior;
- merge `#171` while the runtime gate is unresolved.

## Safe work while PR #171 is blocked

Continue work that does not depend on Preview database access:

- B2B static page copy and mailto flow;
- partner intake docs;
- conversion path audits;
- SEO readiness docs and observation;
- homepage/finder copy safety;
- deterministic planner UX that does not require DB writes, Bókun API, checkout,
  payment, live inventory, or LLM integration.

Avoid starting tasks that require:

- Vercel environment variable changes;
- Prisma schema changes;
- DB writes;
- Bókun API, edit, or sync;
- checkout, payment, cart, booking submission, confirmation, or live availability;
- ThaiEleHub or Shopify files.

## Production deployment policy

No open PR in this snapshot is approved for production deployment.

Production deployment remains a separate gate requiring an explicit user message
that names the approved merge SHA.

## Current recommendation

Proceed with:

```text
Approve merge PR #176 and run post-merge preview smoke
```

Then reassess whether `#174` and `#175` should merge as docs-only support for
the partner conversion workflow.
