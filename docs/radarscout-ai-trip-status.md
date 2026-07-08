# RadarScout Trip Planner — Consolidated Status

Last updated: 2026-07-08

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

## 5. Production status

Production deploy completed on 2026-07-08 after explicit human approval.

```text
Production HEAD: f9fe2b4c0b33c8608a11b8886e2032a1d64de554
Deployment ID: dpl_dDXEQiC9hA78zwcQ7EfweM6nvRaE
Deployment URL: https://reddit-monitor-d7jy6dlec-ouyowus-projects.vercel.app
Target: production
Status: READY
Aliases:
- https://radarscout.io
- https://www.radarscout.io
Previous production deployment replaced: dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
```

Post-deploy observation:

```text
https://radarscout.io/ai-trip-planner: 200, noindex,nofollow, title correct,
product cards rendered, result summary visible, no horizontal overflow, unsafe
network none, forbidden copy none.

https://www.radarscout.io/ai-trip-planner: 200, noindex,nofollow, title correct,
product cards rendered, result summary visible, no horizontal overflow, unsafe
network none, forbidden copy none.

https://radarscout.io/chiang-mai/elephant-camp-finder: 200, index,follow,
title correct, Plan with RadarScout visible.

https://www.radarscout.io/chiang-mai/elephant-camp-finder: 200, index,follow,
title correct, Plan with RadarScout visible.

https://radarscout.io/sitemap.xml: includes homepage and
/chiang-mai/elephant-camp-finder.
```

Deploy gate result:

- Vercel quota / production alias blocker is resolved.
- Trip Planner remains noindex and read-only.
- Finder remains the controlled-open indexable marketing route.
- No DB/schema/env, Bókun API, checkout/payment/booking submission, live
  availability, or ThaiEleHub/Shopify change was introduced.

## 6. Current SEO surface guard

Current controlled-opening policy:

- `/chiang-mai/elephant-camp-finder` is the only open marketing planner route:
  `robots: { index: true, follow: true }`.
- `/chiang-mai/elephant-camp-finder` is included in `sitemap.xml`.
- `/ai-trip-planner` remains closed: `robots: { index: false, follow: false }`.
- `/tours/[id]` remains closed unless a future explicit tour-detail SEO
  candidate is reviewed and allowlisted.
- The sitemap must not include `/ai-trip-planner` or unsafe `/tours/{id}` URLs.
- `robots.txt` still disallows the legacy reddit-tool marketing routes.

Regression coverage:

- `apps/web/app/__tests__/seoIndexGuard.test.ts` asserts the current index
  surface across finder, Trip Planner, tour detail metadata, sitemap, and
  robots.txt.
- `apps/web/app/__tests__/sitemap.test.ts` continues to guard sitemap scope and
  route exclusions.

Do not open additional `index,follow` pages or add routes to the sitemap without
a dedicated SEO readiness task and human approval.

## 7. Recommended next real product work

1. Observe real production behavior for `/ai-trip-planner` and
   `/chiang-mai/elephant-camp-finder`.
2. Choose whether to keep analytics postponed or explicitly approve a provider
   and taxonomy-aligned implementation.
3. Provide real signed partner product data for `PARTNER-PRODUCT-SEED-5`.
4. After reviewed partner data exists, implement partner product matching and
   safe external handoff.
5. Revisit Bókun API only after traffic, handoff intent, and partner demand make
   static reviewed handoff insufficient.

## 8. Execution Log

- 2026-07-08 — `TD-RADARSCOUT-PRODUCTION-DEPLOY-F9FE2B4`: production deploy
  completed for `f9fe2b4c0b33c8608a11b8886e2032a1d64de554`; aliases moved to
  `dpl_dDXEQiC9hA78zwcQ7EfweM6nvRaE`; post-deploy smoke passed.
- 2026-07-07 — `TD-RADARSCOUT-BOKUN-API-DISCOVERY-7`: PR #477 (`a1f6b67`)
  opened with research-only Bókun API feasibility and boundary note; result:
  merged.
- 2026-07-07 — `TD-RADARSCOUT-PARTNER-PRODUCT-MODEL-4`: PR #476 (`b0e2499`)
  opened with typed partner product model validator and unit tests; result:
  merged.

## 9. Human Approval Queue

- `ANALYTICS-PROVIDER-1` remains postponed. Needs an explicit vendor decision
  and taxonomy alignment before any provider or tracking network request is
  added.
- `PARTNER-PRODUCT-SEED-5` is blocked on real signed partner product data from
  the operator. Codex must not invent products, partners, prices, suppliers, or
  booking widget URLs.
- `PRODUCT-MATCHING-6` is blocked until reviewed partner product seed data
  exists and is merged.
- Any Bókun API implementation remains red-zone work. It requires a separate
  human-approved plan, credentials/scope decision, and safety review before any
  code, env, DB, sync, availability, checkout, or booking behavior is added.
