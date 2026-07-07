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

## 7. Recommended next real product work

1. Trip result quality review (is keyword-match relevance good enough?).
2. Booking-partner handoff coverage on product pages.
3. Traveler analytics funnel (currently no conversion/analytics data exists).
4. SEO `index,follow` opening only after readiness gates — not before there is
   real traffic and conversion evidence.
