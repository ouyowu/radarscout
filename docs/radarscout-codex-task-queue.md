# RadarScout — Codex Task Queue (execute in order)

One brief per branch. Read `CLAUDE.md` first; follow the strictest rule on
conflict. Base branch for all: `codex/travel-mvp-launch`. Do not broaden scope.
Every task ends with the standard report (branch, SHA, changed files, commands,
checks, manual verification, PR URL, mergeable status, blockers).

Global red lines (Hermes blocks on any of these unless the brief explicitly
allows it): ThaiEleHub / Shopify, DB / Prisma schema / migration / env / `.env*`,
`robots` / `sitemap` / SEO index policy, checkout / payment / availability
behavior, Bókun API / sync, fabricated products / prices / suppliers / booking
URLs. Production deploy, SEO index opening, and DB changes always require
explicit human approval and are never automated.

Ground truth captured 2026-07-07 (verify before each task — "Step 0: is it
already built?"):
- Homepage finder entry already exists (`app/page.tsx`).
- `/chiang-mai/elephant-camp-finder` already `robots: { index: true, follow: true }`
  and already listed in `app/sitemap.ts`.
- `app/robots.ts` disallows the reddit-tool marketing routes; finder is allowed.
- Analytics: Vercel Web Analytics was selected by human approval on 2026-07-08.
  The implementation should use the approved event taxonomy in
  `docs/radarscout-traveler-funnel-plausible-decision-2.md`.

Order: 1 analytics shim + Vercel provider →
3 SEO index guard **[NEXT]** → 4 Search Console checklist → 5 partner product
model → 6 partner seed → 7 product matching → 8 Bókun discovery.

> **Strategic note (2026-07-07).** Step-0 checks keep finding these tasks are
> already largely built (homepage finder entry, finder SEO-open, per-page index
> tests). The codebase is heavily guarded already. The real lever for progress
> is **getting the current safe candidate into production with real traffic** —
> that is what makes analytics, SEO guarding, and product matching worth doing.
> See `docs/radarscout-ai-trip-status.md` §6 (Option B). Do not let this queue
> become a treadmill of micro-guards while the product never ships.

---

## TD-RADARSCOUT-ANALYTICS-PROVIDER-1

Decision 2026-07-08: human approved proceeding with analytics provider work.
Vendor selected: Vercel Web Analytics. Plausible remains unselected.

Intent: wire one privacy-friendly provider so the finder funnel produces data
without DB writes, secrets, or a second analytics vendor.

Scope:
- Add Vercel Web Analytics App Router pageview support through
  `@vercel/analytics/next`.
- Add or keep the approved local `track()` shim and flush its approved taxonomy
  events through `@vercel/analytics`.
- Do not send raw free-form trip text, PII, full booking partner URLs, Bókun
  backend data, checkout/payment/booking state, availability, inventory, prices,
  ratings, or reviews.
- Do not add environment variables or secrets.

Forbidden: DB/schema, SEO/robots, Bókun, payment/availability, copy/layout
changes, PII in events, ThaiEleHub/Shopify. No secrets committed.

Acceptance: root layout loads Vercel Web Analytics; approved custom funnel
events are flushed through Vercel Analytics; local queue/dataLayer behavior is
preserved for debugging; consent/no-PII guardrails are respected.

Checks: `tsc --noEmit`; `vitest run lib/analytics`; `next build`;
`git diff --check`. Manually confirm events in the Vercel dashboard after
deployment and real traffic.

Hermes focus: flag any network call added outside the provider flush; confirm no
key/secret is committed.

---

## TD-RADARSCOUT-SEO-INDEX-GUARD-2

Branch: `codex/td-radarscout-seo-index-guard-2`

Why: per-page index policy is ALREADY tested — finder=`index:true`
(`chiang-mai/elephant-camp-finder/__tests__/metadata.test.ts`),
planner=`index:false` (`ai-trip-planner/__tests__/metadata.test.ts`),
tours gated by `getTourDetailRobots` with an empty candidate list, plus
`app/__tests__/sitemap.test.ts`. The ONE real gap: no single cross-cutting test
enforces that finder is the *only* newly-indexable marketing page. Per-page tests
cannot catch a brand-new page added as `index:true`. This task adds exactly that
allowlist guard. Low urgency (see Strategic note at top) — small increment.

Scope (verify + guard only — do NOT change any page's current index policy):
- Add ONE cross-cutting test (e.g. `app/__tests__/indexPolicyAllowlist.test.ts`)
  that enumerates page `metadata.robots` across the marketing routes and asserts
  the `index:true` set is exactly the approved allowlist: homepage, `/chiang-mai/
  elephant-camp-finder`, the static legal pages already in `sitemap.ts`, plus any
  approved `tourDetailSeoCandidates` (currently empty). Everything else
  (`/ai-trip-planner`, `/tours/[id]` default, `/demo`, reddit-tool routes) must be
  `index:false` or disallowed in `robots.ts`. The test must fail if a new route is
  added `index:true` outside the allowlist.
- Do not duplicate the existing per-page assertions; reference them.

Forbidden: changing any actual `robots`/metadata/index value, sitemap entries,
DB, Bókun, payment. This task only asserts current state.

Acceptance: new allowlist test fails if any page outside the approved set is
`index:true` or added to the sitemap; passes on current code. No behavior change.

Checks: `tsc --noEmit`;
`vitest run app/__tests__ app/ai-trip-planner app/chiang-mai app/tours`;
`git diff --check`.

Hermes focus: block if the diff changes any index/robots/sitemap value rather
than just asserting it.

---

## TD-RADARSCOUT-SEARCH-CONSOLE-CHECKLIST-3

Branch: `codex/td-radarscout-search-console-checklist-3`

Why: operational readiness to get the one open page indexed by Google, with a
rollback plan. Docs-only.

Scope (single new doc `docs/radarscout-seo-operations.md`):
- Step-by-step: verify domain in Search Console, submit `sitemap.xml`, request
  indexing for `/chiang-mai/elephant-camp-finder`, monitor coverage.
- Pre-checks that must be green before requesting indexing (page live in prod,
  200, canonical correct, index:true, analytics collecting).
- A rollback: how to flip the page back to noindex and remove from sitemap if
  quality/traffic is bad (references the guard test from task 2).
- Explicit note: no other page is submitted; production deploy + index request
  require human approval.

Forbidden: any code change, any actual Search Console action (human does that),
DB, Bókun.

Acceptance: doc is a complete, executable checklist a non-engineer can follow.

Checks: `git diff --check` (docs-only; no PR gate needed beyond review).

Hermes focus: confirm docs-only and that it does not itself open SEO or trigger
deploy.

---

## TD-RADARSCOUT-PARTNER-PRODUCT-MODEL-4

Branch: `codex/td-radarscout-partner-product-model-4`

Why: define the shape of a signed partner product BEFORE seeding any data or
touching Bókun. Types + validation only; no data, no API, no DB.

Scope:
- Add a typed model (e.g. `lib/partnerProducts/partnerProduct.ts`): id, slug,
  destination (Thailand-only), title, shortSummary, tags, partnerName,
  `bookingWidgetUrl` (the human-provided Bókun widget/handoff URL),
  `reviewedBy`, `reviewedAt`. NO price, availability, rating, review count, raw
  JSON, or checkout fields (mirror the reviewed-enrichment forbidden list).
- Add a validator that rejects unknown/forbidden fields and non-Thailand
  destinations (reuse `thailandEligibility` helper).
- Add unit tests for valid/invalid records and forbidden-field rejection.
- No loader wired to any page yet; no data file yet.

Forbidden: DB/schema/migration, Bókun API, price/availability/rating fields,
fabricated data, exposing the model to any public route in this task.

Acceptance: model + validator + tests exist; forbidden fields and non-Thailand
entries are rejected.

Checks: `tsc --noEmit`; `vitest run lib/partnerProducts`; `git diff --check`.

Hermes focus: block if any forbidden field (price/availability/rating/rawJson/
booking-status) enters the schema, or if a DB write is introduced.

---

## TD-RADARSCOUT-PARTNER-PRODUCT-SEED-5

Branch: `codex/td-radarscout-partner-product-seed-5`

Why: load 20–50 REAL signed partner products (human-provided) into a static,
reviewed data file using the task-4 model. No live API, no DB.

Scope:
- Consume an operator-provided data source (CSV/JSON the human supplies). Do NOT
  invent products, partners, titles, or `bookingWidgetUrl`s. If the source file
  is absent, STOP with a blocker — do not fabricate.
- Produce a validated static dataset (e.g. `lib/partnerProducts/seed/*.json` +
  a typed loader) that passes the task-4 validator.
- Unit test: every seed record validates; count is within 20–50; all Thailand;
  no forbidden fields; every `bookingWidgetUrl` is a well-formed https URL.
- Not yet surfaced in the planner/finder results (that is task 6).

Forbidden: fabricating any product/partner/URL, DB writes, Bókun API calls,
price/availability/rating, exposing raw JSON publicly.

Acceptance: 20–50 human-sourced records load and validate; tests green; nothing
rendered publicly yet.

Checks: `tsc --noEmit`; `vitest run lib/partnerProducts`; `git diff --check`.

Hermes focus: block if data appears AI-fabricated (no operator source cited) or
if forbidden fields/DB writes appear.

---

## TD-RADARSCOUT-PRODUCT-MATCHING-6

Branch: `codex/td-radarscout-product-matching-6`

Why: let the finder/planner recommend the real signed partner products from the
seed, handing off "Check availability" to the partner's Bókun widget URL. Keeps
booking/availability behavior OFF on our side.

Scope:
- Extend the recommendation/matching path to include partner-product seed records
  (Thailand-eligible only), ranked by the existing interest-match logic.
- "Check availability" continues to be an external handoff link
  (`recommendation.ctaHref` = the partner `bookingWidgetUrl`); we do NOT check
  availability, hold inventory, or process payment. `META.bookingEnabled` /
  `availabilityEnabled` stay `false`.
- Public copy must not claim live availability, price, or ratings for partner
  products. copySafety tests must still pass; extend them to cover the new cards.
- Fire the existing `finder_check_availability_click` analytics event on handoff.

Forbidden: Bókun API/sync, DB writes, price/availability/rating display, booking
submission, fabricated products, SEO/robots changes.

Acceptance: partner products appear in results with a working external
"Check availability" handoff; no availability/price/rating claims; copySafety +
matching tests green.

Checks: `tsc --noEmit`; `vitest run lib/aiProducts lib/partnerProducts app/ai-trip-planner app/chiang-mai`;
`playwright test ai-trip-planner homepage-ai-planner`; `next build`;
`git diff --check`.

Hermes focus: block if any availability/price/booking behavior is added, or if
the handoff becomes anything other than an external partner link.

---

## TD-RADARSCOUT-PROD-DEPLOY-CANDIDATE-B (RELEASE — Option B)

Branch: `codex/td-radarscout-prod-deploy-candidate-b` (docs/report only; no app code)

This is a RELEASE preparation task, run in parallel with the product queue. It
prepares and gates an Option-B production deploy (accept local production smoke
as sufficient for this noindex / read-only / no-DB-write / booking+availability-
disabled feature) and then **STOPS for human approval**. The agent must NOT run
the production deploy. Deploy is executed by the human only.

Why: the feature is safe and locally green but stuck behind Vercel free-tier
preview quota. Option B ships the exact code SHA now; a real preview smoke is not
required for a page with no index/DB/payment/availability surface.

### Step 0 — discover and report (do not assume)

- The exact release-candidate SHA = the last real `app/ai-trip-planner` /
  `app/api/ai-trip` / `lib/ai-trip` **code** commit on `codex/travel-mvp-launch`
  (NOT a docs-only merge). Print it.
- The Vercel **production branch** mapping (which branch auto-deploys to prod, or
  whether prod is a manual `vercel --prod`). Print it. Do not guess.
- Whether the pending safe PRs (honest-naming rename; optionally SEO-index-guard)
  are merged into the production-deploying branch. If not, STOP: those merges are
  a human/ChatGPT approval step first.
- Confirm working tree clean and `git diff --check` clean.

### Step 1 — full local gate (from a clean worktree)

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web exec vitest run
pnpm --filter @reddit-monitor/web exec playwright test
pnpm --filter @reddit-monitor/web build
pnpm smoke:ai-trip-local:production
git diff --check
```

All must pass. Capture the production-mode smoke output (expect: status 200,
title `Thailand Trip Planner | RadarScout`, robots `noindex, nofollow`,
productCardCount 3, unsafeNetwork none, forbiddenMatches none).

### Step 2 — write the deploy candidate report

Update `docs/radarscout-ai-trip-status.md` in place (do NOT create a new doc)
with a "Production deploy candidate (Option B)" section containing: exact SHA,
production branch mapping, all gate results above, the known preview-quota
limitation being explicitly accepted, the exact deploy command the human will
run, a post-deploy production observation checklist, and a rollback plan.

### Step 3 — STOP for human approval

Do not deploy. Present the exact command for the human to run themselves, e.g.
(subject to Step-0 discovery):

```text
# human runs after approval — one of:
npx vercel --prod            # if prod is manual CLI deploy
# or: merge the approved SHA into the Vercel production branch
```

The human must explicitly say "Approve production deploy" (mirrors the
CLAUDE.md production-migration approval pattern) before any deploy runs.

### Step 4 — post-deploy production observation (after human deploys)

- Fetch the live `/ai-trip-planner`: assert 200, `robots: noindex, nofollow`,
  product cards render, no unsafe network, no forbidden copy.
- Confirm `/chiang-mai/elephant-camp-finder` is live and `index:true` as expected.
- Record results in `docs/radarscout-ai-trip-status.md`.

### Rollback plan

- Vercel: instant rollback to the previous production deployment from the Vercel
  dashboard (or `vercel rollback`). No DB/schema change is involved, so rollback
  is deployment-only and immediate.

### Forbidden

- Agent must NOT run the production deploy, `vercel --prod`, or merge to the
  production branch. Human-only.
- No DB / Prisma migration / schema / env changes. No `prisma migrate deploy`.
- No SEO index change beyond the already-open finder page. No sitemap change.
- No Bókun API/sync, no checkout/payment/availability behavior, no ThaiEleHub/
  Shopify. No app code changes in this task (report/docs only).

### Hermes focus

Block if the diff contains any app-code, DB, env, SEO/robots, or Bókun change, or
if any step attempts an actual production deploy without recorded human approval.

---

## TD-RADARSCOUT-BOKUN-API-DISCOVERY-7

Branch: `codex/td-radarscout-bokun-api-discovery-7`

Why: understand Bókun API feasibility BEFORE any implementation. Research doc
only — zero code, zero API calls.

Scope (single new doc `docs/radarscout-bokun-api-discovery.md`):
- What Bókun API offers (catalog, availability, booking, channel) at a high
  level, auth model, rate limits, sandbox availability — from public docs only.
- Which RadarScout use cases it could serve later (product sync, availability)
  and the safety/gating each would require.
- Explicit non-goals: RadarScout does not rebuild Bókun checkout/payment/
  inventory/channel/OCTO. Confirms current direction (partner-direct handoff).
- A recommendation: is an API integration worth it, and what would need to be
  true first (traffic, conversions, signed partners).

Forbidden: any Bókun API call, any credential, any code change, any DB.

Acceptance: a decision-useful research doc; no code touched.

Checks: `git diff --check` (docs-only).

Hermes focus: confirm no code/credentials/API calls; research only.
