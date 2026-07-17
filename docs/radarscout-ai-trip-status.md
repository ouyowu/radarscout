# RadarScout Trip Planner — Consolidated Status

Last updated: 2026-07-09

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

### Production deploy candidate (B2 reanchor, 2026-07-09)

Step 0 resolved the prior production-state contradiction:

```text
Current production deployment ID: dpl_HMTzVxd3w46NCDrGZg6AE7wFHGGx
Current production deployment URL:
https://reddit-monitor-qyz3uo48i-ouyowus-projects.vercel.app
Current production aliases:
- https://radarscout.io
- https://www.radarscout.io
Current production Git SHA:
f78254d5ab895a53a1a2a205359f2bd472a32f2c
Current production commit:
Wire reviewed partner products into Trip Planner matching
```

This means the old `dpl_2v7...` observation is obsolete, and the earlier
`4d5619e` deploy-completion note was also superseded by the later real
production deployment at `f78254d`.

Current B2 candidate after merging PR #488:

```text
Candidate SHA: dc3482d86576f151ddc0bb2ed58e905b13302bab
Candidate commit: Improve partner product matching specificity (#488)
Base branch: origin/codex/travel-mvp-launch
Candidate status: latest deployable Trip Planner code commit
```

Included real product code:

- `8034ed1` — 8 reviewed public widget partner seed records.
- `f78254d` — reviewed partner products wired into Trip Planner matching and
  safe external `Check availability` handoff.
- `dc3482d` — partner matching quality fix for Bigboy, bamboo rafting, Inthanon,
  and afternoon half-day searches.

Vercel quota / deploy status:

```text
Vercel CLI can list and inspect deployments.
Recent Preview deployments exist and one new Preview was observed building,
so there is no current evidence that Preview deploy quota is fully locked.
`vercel usage` returned `Costs not found (404)`, so it cannot confirm quota
state for this team.
Production deploy quota can only be confirmed by the human-run
`npx vercel --prod --yes` command. Codex did not run production deploy.
```

Vercel project:

```text
Project: ouyowus-projects / reddit-monitor
Project ID: prj_TG7h3uoTkZR5OdlIoroJOj3T5uUy
Framework: Next.js
Root Directory: .
Build Command: pnpm --filter @reddit-monitor/web build
Output Directory: apps/web/.next
Observed production deploy mode: manual CLI production deploy with
npx vercel --prod --yes.
```

Local gate, run from clean worktree
`/private/tmp/radarscout-prod-deploy-candidate-b2` at exactly
`dc3482d86576f151ddc0bb2ed58e905b13302bab`:

```text
git status --short: clean
Prisma generate: passed
TypeScript: clean
Full Vitest: passed, 66 files / 976 tests
Playwright E2E: passed, 60/60
Next build: passed
AI Trip local production smoke: passed
git diff --check: clean
```

Local production smoke evidence:

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
  "unsafeNetwork": [],
  "forbiddenMatches": []
}
```

Human-only production deploy command:

```bash
rm -rf /private/tmp/radarscout-prod-dc3482d
git -C /Users/ouyowu/reddit-monitor worktree add \
  /private/tmp/radarscout-prod-dc3482d \
  dc3482d86576f151ddc0bb2ed58e905b13302bab
cd /private/tmp/radarscout-prod-dc3482d
npx vercel link --yes --project reddit-monitor --scope ouyowus-projects
npx vercel --prod --yes 2>&1 | tee /tmp/vercel-prod-deploy-dc3482d.log
```

Post-deploy production observation checklist:

```text
https://radarscout.io/ai-trip-planner and
https://www.radarscout.io/ai-trip-planner:
- HTTP 200
- title: Thailand Trip Planner | RadarScout
- robots: noindex,nofollow
- product cards render
- result summary visible
- no horizontal overflow
- unsafe network requests: none
- forbidden copy: none
- partner products can appear with external Check availability handoff
- Bigboy, bamboo rafting, Inthanon, and afternoon half-day prompts return the
  expected reviewed partner product first in the API-level ranking

https://radarscout.io/chiang-mai/elephant-camp-finder and www equivalent:
- HTTP 200
- remains index,follow
- controlled-open finder still visible

Vercel:
- production deployment ID changes from dpl_HMTzVxd3w46NCDrGZg6AE7wFHGGx
- deployment metadata Git SHA is dc3482d86576f151ddc0bb2ed58e905b13302bab
- aliases include radarscout.io and www.radarscout.io
```

Rollback:

```text
No DB/schema/env migration is involved. Roll back by restoring the previous
production deployment in Vercel Dashboard or with Vercel rollback. This is a
deployment-only rollback.
```

Status: waiting for explicit human approval and human-run production deploy.
Codex must not run `vercel --prod`.

## 5. Production status

Production was rechecked on 2026-07-09 before preparing the B2 candidate.

```text
Production HEAD: f78254d5ab895a53a1a2a205359f2bd472a32f2c
Deployment ID: dpl_HMTzVxd3w46NCDrGZg6AE7wFHGGx
Deployment URL: https://reddit-monitor-qyz3uo48i-ouyowus-projects.vercel.app
Target: production
Status: READY
Aliases:
- https://radarscout.io
- https://www.radarscout.io
Previous obsolete observation: dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3
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

## 7. Current Phase 1 evidence and next action

- Production is `dpl_F5cRvThApDQbBDPd3cNBrNdjXRJS`, built from app-code SHA
  `cc720a0a8c99cd4a11a51b7d43d19971517bd707`, with aliases
  `radarscout.io` and `www.radarscout.io`. The current development base adds only
  the docs-only goal reconciliation at `349fee6`.
- Vercel reports Web Analytics enabled and `hasData: true`. The project is on
  Hobby, which provides pageview analytics but not custom events. The operator
  has chosen not to upgrade yet, so `booking_partner_handoff_clicked` remains
  unobservable in the dashboard. Do not add another analytics provider.
- Live smoke passed for homepage, `/planner`, `/ai-trip-planner`, `/tours`, one
  Viator detail route, `sitemap.xml`, `robots.txt` and the Vercel Insights
  script. The public search returned six Viator affiliate handoffs with the
  required `nofollow sponsored noopener noreferrer` relation.
- The live tour-detail pilot routes remain `noindex, nofollow` and absent from
  the sitemap, as required before human SEO approval.
- Viator's official Basic Access documentation supports product merchandising
  and Viator checkout handoff. Its certification rules require attraction,
  review and `viatorUniqueContent` content to remain non-indexable. RadarScout's
  seed validator already rejects those protected/raw/commercial fields.
- The next action is operator approval of a 5–10 product SEO pilot allowlist for
  `TD-RADARSCOUT-SEO-CANDIDATE-UNLOCK-2B`. No index policy is changed by this
  observation.

## 8. Execution Log

- 2026-07-17 — Phase 1 evidence refresh: merged goal reconciliation PR #548 at
  `349fee6`; verified production at `cc720a0` /
  `dpl_F5cRvThApDQbBDPd3cNBrNdjXRJS`; confirmed Vercel Web Analytics has
  pageview data but Hobby cannot expose the approved custom funnel events;
  audited the 71-record Viator seed provenance and official indexing rules.
  Result: Q1 public-document evidence is sufficient for a conservative pilot;
  SEO remains blocked on an operator-approved product id allowlist. Hermes did
  not return a verdict, so the operator explicitly approved a one-time manual
  red-line review fallback for this docs-only evidence update; no standing
  exception was created.
- 2026-07-16 — `TD-RADARSCOUT-VIATOR-PRODUCTION-READONLY-PREVIEW-1`: PR #535
  (`a4a0e90`) adds a local-only, bounded Viator Production API candidate preview
  tool with no persistence; one approved Phuket probe returned 5 safe candidates.
  Hermes red-line review passed; result: PR open, awaiting human merge.
- 2026-07-16 — `TD-RADARSCOUT-VIATOR-REVIEWED-PUBLIC-INTEGRATION-1`: PR #534
  (`010133d`) routes the 16 already reviewed static Viator Thailand products
  through deterministic Planner matching; full QA and Hermes red-line review
  passed; result: PR open, awaiting human merge.
- 2026-07-09 — `TD-RADARSCOUT-FE-HOME-PROMPT-HERO`: branch
  `codex/td-radarscout-fe-home-prompt-hero` prepared prompt-first homepage test
  alignment and gate evidence; result: PR pending, awaiting human merge.
- 2026-07-09 — `TD-RADARSCOUT-PARTNER-DETAIL-ROUTE-CONSISTENCY-0`: branch
  `codex/td-partner-detail-route-consistency-0` makes reviewed partner seed
  product detail routes resolve through `/tours/partner_cm_*` with safe public
  fields and external booking partner handoff; result: PR open, awaiting human
  merge.
- 2026-07-09 — `TD-RADARSCOUT-PROD-DEPLOY-CANDIDATE-B2-REANCHOR`: after merging
  PR #488, production was rechecked and found live at `f78254d` /
  `dpl_HMTzVxd3w46NCDrGZg6AE7wFHGGx`; deploy candidate was reanchored to
  `dc3482d86576f151ddc0bb2ed58e905b13302bab`; full local gate and AI Trip local
  production smoke passed; result: waiting for explicit human production deploy
  approval.
- 2026-07-09 — `TD-RADARSCOUT-PARTNER-MATCHING-QUALITY-8`: PR #488
  improves reviewed partner product specificity for Bigboy, bamboo rafting,
  Inthanon, and afternoon half-day Trip Planner searches; no seed, widget URL,
  Bókun API/sync, DB, SEO, checkout, payment, or booking behavior changes.
- 2026-07-08 — `BOKUN-MARKETPLACE-SUPPLIER-CANDIDATE-REVIEW-1`: branch
  `codex/td-bokun-marketplace-supplier-candidate-review-1` documented 18
  read-only Bókun Marketplace candidate products across Chiang Mai, Bangkok, and
  Pattaya; result: PR open, awaiting human merge. No `Sell experience`, seed,
  widget, API, sync, or app-code change.
- 2026-07-08 — `TD-RADARSCOUT-PRODUCT-MATCHING-6`: branch
  `codex/td-radarscout-product-matching-6` wired the reviewed partner seed into
  Trip Planner product matching, added safe external `Check availability`
  handoffs, and extended tests; result: PR pending.
- 2026-07-08 — `TD-RADARSCOUT-PARTNER-PRODUCT-SEED-5A-PILOT`: PR #483
  (`e555ee8`) opened with 8 reviewed Chiang Mai partner product seed records,
  typed loader, and validation tests; result: PR open, awaiting human merge.
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

- `TD-RADARSCOUT-SEO-CANDIDATE-UNLOCK-2B` needs operator approval of a small
  pilot allowlist. Recommended review shortlist (not yet approved):
  `viator_6467bkknight`, `viator_163642p1`, `viator_191442p6`,
  `viator_163642p25`, `viator_160694p9`, `viator_44720p2`. All six currently
  return 200, remain `noindex, nofollow`, show `Check availability`, and hand off
  through a PID-tagged Viator affiliate URL.
- Enabling index/follow for any shortlist item, merging that policy, deploying
  it, and submitting it to Search Console are separate human approvals.
- Vercel Analytics stays on Hobby by operator decision. Do not upgrade or add a
  second analytics vendor automatically.
- Legacy Bókun API/publication remains dormant red-zone work and is not part of
  the current Viator-first product path.
