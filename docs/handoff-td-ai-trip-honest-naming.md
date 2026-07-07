# Handoff: TD-AI-TRIP-HONEST-NAMING + DOC CONSOLIDATION

For Codex to review, finish, and open the PR. The working-tree changes are
already applied on the branch below, but they were **not committed** (the mounted
sandbox had a stale `.git/index.lock` and could not run git or the toolchain).
Codex must commit, run checks, and open the PR.

## Branch

- Work branch: `codex/td-ai-trip-honest-naming-and-doc-consolidation`
- Base branch: `codex/travel-mvp-launch`
- Commit SHA: none yet (uncommitted working tree — see "Commit steps")

## Summary

The `/ai-trip-planner` page marketed itself as an "AI Trip Planner", but the
runtime uses **no generative AI** — it is deterministic local intent parsing
(`lib/ai-trip/parse-intent`) plus keyword product search over eligible Thailand
records (`app/api/ai-trip/search/route.ts`, with a hand-maintained interest
alias table). This is the only real copy-safety gap on the page: an unqualified
"AI" capability claim.

This change:

1. Renames the planner's public display name from "AI Trip Planner" to
   "Trip Planner" across the planner feature cluster (page, tours return-links,
   aria-label, preview-smoke script + test).
2. Flips the copy-safety test that previously *required* the "AI" branding into
   a guard that *forbids* re-introducing unqualified AI claims
   (`AI trip planner`, `AI-powered`, `AI-guided`).
3. Consolidates 15 ai-trip status/gate/audit docs (~4390 lines) into a single
   `docs/radarscout-ai-trip-status.md`. The 15 old files are currently
   "Superseded" tombstones and should be `git rm`-ed on commit.

Scope was deliberately limited to the planner feature. Site-wide "AI" brand
surfaces (homepage title `RadarScout | AI-guided Thailand Experience Planner`,
`app/destinations/page.tsx`, `app/suppliers/page.tsx`) were **left untouched** —
that is a separate branding decision (see Follow-ups).

The honest, explicitly-future-stage label `AI-generated itinerary → Future stage`
in `page.tsx` was intentionally retained (it describes a not-connected future
capability, not a current claim).

## Safety

- No LLM/API/network behavior changed. No new runtime calls.
- No Bókun sync, no checkout/payment/cart/booking, no availability/inventory.
- No DB / Prisma schema / migration / env changes. Read-only page unchanged.
- No SEO `index,follow` change — page stays `robots: { index: false, follow: false }`.
- Public API unchanged. `source=ai-trip-planner` param and internal identifiers
  (`AiTrip*`, `buildAiTripPlannerDetailHref`, route path `/ai-trip-planner`)
  are unchanged — only user-facing display strings changed.
- Changes are string-only in `.tsx/.ts/.js` plus doc content; no type or logic
  changes.

## Checks

Not run in the authoring environment (mounted `node_modules` is built for a
different architecture; rollup native binary missing, so vitest/tsc could not
boot). Statically verified by the author, must be confirmed by Codex in CI:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web exec vitest run app/ai-trip-planner app/tours scripts
pnpm --filter @reddit-monitor/web exec playwright test ai-trip-planner homepage-ai-planner
git diff --check
```

Author's static verification (all confirmed via grep against renamed sources):

- `copySafety.test.ts`: page now contains "Thailand trip planner"; contains no
  `AI trip planner` / `AI-powered` / `AI-guided`.
- `app/tours/__tests__/publicCopy.test.tsx`: all `toContain(... Trip Planner ...)`
  assertions match the renamed strings in `app/tours/[id]/page.tsx`.
- `scripts/__tests__/radarscout-ai-trip-preview-smoke.test.js`: expected title
  `Thailand Trip Planner | RadarScout` and body text match the renamed page and
  the updated `scripts/radarscout-ai-trip-preview-smoke.js` title assertion.

## Manual verification

- Load `/ai-trip-planner`: hero badge, H1 CTA, section labels, and `<title>`
  read "Trip Planner" / "Thailand Trip Planner" with no "AI" wording.
- Open a product from a planner result, confirm the tours return-link block
  reads "Trip Planner context" / "Back to Trip Planner results".
- Confirm the page still renders `AI-generated itinerary → Future stage` in the
  "What stays outside this planner" list (intended).

## Changed files (22 modified, 1 new; uncommitted)

Code + tests:

```text
apps/web/app/ai-trip-planner/page.tsx
apps/web/app/ai-trip-planner/IntentParserDemo.tsx
apps/web/app/ai-trip-planner/__tests__/copySafety.test.ts
apps/web/app/tours/[id]/page.tsx
apps/web/app/tours/__tests__/publicCopy.test.tsx
scripts/radarscout-ai-trip-preview-smoke.js
scripts/__tests__/radarscout-ai-trip-preview-smoke.test.js
```

Docs (new consolidated + 15 tombstones to be removed):

```text
docs/radarscout-ai-trip-status.md            (NEW — authoritative)
docs/radarscout-active-execution-status.md   (tombstone → git rm)
docs/radarscout-ai-trip-deploy-candidate-status.md
docs/radarscout-ai-trip-mobile-results-ux-audit.md
docs/radarscout-ai-trip-planner-copy-safety-review.md
docs/radarscout-ai-trip-planner-copy-safety-review-1.md
docs/radarscout-ai-trip-planner-mobile-results-ux-audit.md
docs/radarscout-ai-trip-planner-production-readiness.md
docs/radarscout-ai-trip-planner-release-status.md
docs/radarscout-ai-trip-planner-results-ux-audit.md
docs/radarscout-ai-trip-production-deploy-candidate.md
docs/radarscout-ai-trip-production-drift-observation.md
docs/radarscout-ai-trip-production-observation.md
docs/radarscout-ai-trip-real-preview-smoke.md
docs/radarscout-ai-trip-release-gate-decision.md
docs/radarscout-ai-trip-release-gate-status.md
```

## Commit steps (run locally — sandbox could not commit)

```bash
cd ~/reddit-monitor
rm -f .git/index.lock
git checkout codex/td-ai-trip-honest-naming-and-doc-consolidation
git add -A
# turn the 15 tombstones into real deletions:
git rm -q docs/radarscout-active-execution-status.md \
  docs/radarscout-ai-trip-deploy-candidate-status.md \
  docs/radarscout-ai-trip-mobile-results-ux-audit.md \
  docs/radarscout-ai-trip-planner-copy-safety-review.md \
  docs/radarscout-ai-trip-planner-copy-safety-review-1.md \
  docs/radarscout-ai-trip-planner-mobile-results-ux-audit.md \
  docs/radarscout-ai-trip-planner-production-readiness.md \
  docs/radarscout-ai-trip-planner-release-status.md \
  docs/radarscout-ai-trip-planner-results-ux-audit.md \
  docs/radarscout-ai-trip-production-deploy-candidate.md \
  docs/radarscout-ai-trip-production-drift-observation.md \
  docs/radarscout-ai-trip-production-observation.md \
  docs/radarscout-ai-trip-real-preview-smoke.md \
  docs/radarscout-ai-trip-release-gate-decision.md \
  docs/radarscout-ai-trip-release-gate-status.md
git commit -m "Honest planner naming (drop AI over-claim) + consolidate ai-trip status docs"
```

(If you prefer to keep the tombstones instead of deleting, skip the `git rm`
block — `git add -A` already staged them.)

## Follow-ups (separate briefs, not in this PR)

1. **E2E test titles** — `apps/web/e2e/ai-trip-planner.spec.ts` (lines 765, 792)
   and `apps/web/e2e/homepage-ai-planner.spec.ts` (lines 125, 196) still say
   "AI Trip Planner" in the `test('...')` description strings. These are not
   content assertions and do not fail; rename for consistency only if desired.
2. **Site-wide de-AI decision** — homepage/destinations/suppliers still brand as
   "AI". Decide whether to keep "AI" as the company brand or downgrade
   site-wide. If site-wide, update `app/__tests__/homepageCopy.test.ts`,
   `app/destinations/__tests__/destinationScope.test.ts`, and the
   `homepage-ai-planner.spec.ts` title assertion (line 70) accordingly.
3. **Release candidate anchoring** — anchor any production deploy to the last
   real `app/ai-trip-planner` / `app/api/ai-trip` / `lib/ai-trip` **code**
   commit, not a docs-only merge SHA. See `docs/radarscout-ai-trip-status.md` §4.
4. **Close stale status-doc PR** (e.g. #463) as superseded.
5. **Process rule** — no new status-only PRs/docs unless they change a decision
   or unblock a gate; update `docs/radarscout-ai-trip-status.md` in place.

## Blockers

- Vercel free-tier preview quota (`api-deployments-free-per-day`) — plan limit,
  not code. Upgrade the plan or accept local smoke for this noindex/read-only
  page (decision options in `docs/radarscout-ai-trip-status.md` §6).
