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

Ground truth refreshed 2026-07-10 (verify before each task — "Step 0: is it
already built?"):
- Homepage finder entry already exists (`app/page.tsx`).
- `/chiang-mai/elephant-camp-finder` already `robots: { index: true, follow: true }`
  and already listed in `app/sitemap.ts`.
- `app/robots.ts` disallows the reddit-tool marketing routes; finder is allowed.
- Analytics: Vercel Web Analytics was selected by human approval on 2026-07-08.
  The implementation should use the approved event taxonomy in
  `docs/radarscout-traveler-funnel-plausible-decision-2.md`.
- Production at `b7befb7` already includes the prompt-first homepage, reviewed
  partner products and media, matching, the tours listing restyle, and the tour
  detail restyle. Do not reopen FE-1/2/3/4 as implementation tasks.

## Now / Next / Later (current product order)

### NOW — real traffic and conversion evidence (highest value)

Do not add product features until this loop has real observations:

1. Use a normal, non-headless browser to complete homepage prompt → planner
   search → result → `Check availability`; then confirm Vercel Analytics receives
   page views and the approved funnel events. Headless smoke is verification,
   not user-behavior evidence.
2. Human runs the existing Search Console checklist for the single approved
   indexable finder page: domain verification, sitemap submission, and indexing
   request. This remains a RED-ZONE human action; Codex does not submit it.
3. Send the finder to a small set of real Thailand travelers / relevant groups
   and observe behavior before changing matching or adding another feature.

North-star signal: `booking_partner_handoff_clicked` — a real visitor clicking
`Check availability`. Supporting signals are homepage entry, planner search, and
result visibility. If these events are absent, diagnose traffic/instrumentation;
do not guess at matching improvements.

### NEXT — only after real observations exist

- Improve matching from real search terms and zero-result / weak-result evidence,
  not imagined queries.
- Add more reviewed partner products using the existing human-provided,
  gitignored input → validated static seed workflow. Prove Chiang Mai first;
  expand destinations only when the observed demand supports it.
- Review handoff quality using real clicks and product-detail behavior. Preserve
  the external public Bókun widget handoff; no availability or payment behavior.

### LATER — after the finder proves demand and handoff conversion

- Controlled SEO expansion to additional high-intent pages.
- Email capture for visitors who do not continue to a booking partner.
- Optional real LLM planning only if user behavior demonstrates a need for richer
  itinerary generation (separate scope and approval).
- Bókun API / sync only if public-widget handoff is demonstrably insufficient
  (RED ZONE; separate explicit approval).

Completed foundations: analytics provider, SEO index guard, Search Console
runbook, partner product model, 8-record reviewed pilot seed, partner matching,
real partner media, design tokens, prompt homepage, listing restyle, and detail
restyle. Historical task briefs below remain for audit; completed tasks must not
be selected again.

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

## TD-RADARSCOUT-PARTNER-PRODUCT-SEED-5A-PILOT

Branch: `codex/td-radarscout-partner-product-seed-5a-pilot`

Why: load a small pilot set of 3–10 REAL signed partner products
(human-provided) into a static, reviewed data file using the task-4 model. No
live API, no DB. This replaces the earlier 20–50 product target for the first
iteration; do not stall product validation just to hit a larger count.

Human input gate:
- The raw operator-provided source must live locally under
  `private-inputs/partner-products.csv` or `private-inputs/partner-products.json`.
- `private-inputs/` is gitignored and must never be committed.
- If the input file is absent, malformed, or contains fewer than 3 valid records,
  STOP with a blocker. Do not fabricate or pad records.
- If more than 10 records are provided, use only records that validate and report
  the count; do not broaden the pilot without a separate task.

Scope:
- Consume the operator-provided local data source. Do NOT invent products,
  partners, titles, summaries, tags, or `bookingWidgetUrl`s.
- Produce a validated static dataset (e.g. `lib/partnerProducts/seed/*.json` +
  a typed loader) that passes the task-4 validator.
- Unit test: every seed record validates; count is within 3–10; all Thailand;
  no forbidden fields; every `bookingWidgetUrl` is a well-formed https URL.
- Not yet surfaced in the planner/finder results (that is task 6).

Forbidden: fabricating any product/partner/URL, DB writes, Bókun API calls,
price/availability/rating, exposing raw JSON publicly.

Acceptance: 3–10 human-sourced pilot records load and validate; tests green;
nothing rendered publicly yet.

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

## Frontend redesign — "Immersive Expedition" (GREEN ZONE, 4 staged PRs)

Governing spec: `docs/radarscout-frontend-design.md` (original design system; NOT
a copy of any third-party site or theme). Do these in order; each is one branch
off `codex/travel-mvp-launch`, full gate, open PR, do NOT merge. Every step must
keep the DESIGN.md §0 guardrails: no cart/checkout/price/availability/rating;
detail CTA = "Check availability" → partner Bókun widget URL; `copySafety`,
`publicCopySafety`, `seoIndexGuard` tests green; no robots/sitemap/DB/env/Bókun
API/ThaiEleHub changes; self-hosted fonts, no third-party CDN, no third-party
assets. Steps 2–4 each depend on Step 1 being merged (charter dependency rule —
if FE-1 is unmerged, stop and wait).

### TD-RADARSCOUT-FE-DESIGN-TOKENS-1 — COMPLETED (#492)

Why: establish the design system before any page rewrite.

Scope: add the DESIGN.md tokens (color, type scale, spacing, radius, elevation)
as a Tailwind theme extension and/or CSS variables; self-host `Fraunces` + `Inter`
via `next/font`; build the primitives — `Button` (primary/secondary/ghost),
`ExperienceCard`, `SiteNav` (transparent→solid on scroll), `Section` band. NO page
is rewritten in this step; primitives are added and unit/render-tested only.

Forbidden: rewriting home/listing/detail; changing any page's copy, robots, or
behavior; third-party CDNs/assets; cart/checkout.

Acceptance: tokens + 4 primitives exist with tests; existing pages unchanged and
still render; a11y (focus rings, 44px targets) on primitives; no visual change to
live pages yet.

Checks: `tsc --noEmit`; `vitest run` (scoped to new components + full suite green);
`playwright test`; `build`; `git diff --check`.

Hermes focus: block if any page markup/copy/robots/sitemap changed, if a third-
party asset/CDN is added, or if cart/price/availability appears.

### TD-RADARSCOUT-FE-HOME-PROMPT-HERO-2A — COMPLETED (#496)

Why: the homepage now leads with a **prompt-first hero** — a visible input the
visitor types their Thailand trip into — instead of a passive heading + buttons.
The operator authored the code already; also removed the site's unqualified "AI"
claims (the engine is deterministic, no LLM), keeping the honest-naming stance.

Already implemented on disk (do NOT redesign; integrate + verify):
- NEW `apps/web/app/_components/PromptHero.tsx` — prompt input (`#hero-trip-idea`)
  + "Plan my trip" submit + example chips; submit/chip → `router.push` to
  `/ai-trip-planner?idea=<enc>#intent-demo`; fires `homepage_finder_entry_clicked`
  ({source:'hero_prompt'|'hero_chip'}).
- NEW `apps/web/app/_components/promptHero.helpers.ts` — `buildIdeaHref`, `exampleChips`.
- NEW `apps/web/app/_components/__tests__/promptHero.test.ts` — pure-logic + source
  assertions (node env, repo convention).
- EDITED `apps/web/app/page.tsx` — use `PromptHero`; removed the redundant lower
  "Use a prompt" chips section; de-AI'd copy: title → `RadarScout | Personalized
  Thailand Experience Planner`, `AI itinerary matching` → `Personalized experience
  matching`, `AI planning engine` → `planning engine`, `AI planning use cases` →
  `Trip planning use cases`.

Scope of THIS task = test reconciliation + full gate only. Update the coupled
tests to the new hero (do not revert the design):
- `app/__tests__/homepageCopy.test.ts`: new title; drop assertions for the old
  hero copy (`AI-guided Thailand Experience Planner`, `Tell RadarScout the kind of
  Thailand day you want`, `Start planning`) and the removed "Use a prompt, then
  compare matching experiences." block + its chip/`buildPlannerIdeaHref` lines;
  `AI planning use cases` → `Trip planning use cases`. If prompt-entry coverage is
  wanted, read `_components/PromptHero.tsx` / `promptHero.helpers.ts` instead.
- `e2e/homepage-ai-planner.spec.ts`: new `toHaveTitle` + hero heading; remove
  "Start with a travel idea" / "Use a prompt" assertions; the prompt chips are now
  **buttons** (`getByRole('button', { name })`), click → assert URL
  `/ai-trip-planner?idea=<enc>#intent-demo` and `#trip-idea` prefilled (reuse chip
  "Gentle elephant day in Chiang Mai"); optionally cover the `#hero-trip-idea`
  input submit.

Forbidden: changing the hero design/copy intent; cart/checkout/price/availability;
robots/sitemap/DB/env/Bókun; third-party assets. Homepage stays index-eligible but
the index POLICY is unchanged (seoIndexGuard must stay green).

Acceptance: `homepageCopy`, `publicCopySafety`, `seoIndexGuard`, `promptHero`, and
homepage E2E all green; homepage renders the prompt-first hero with no horizontal
overflow; no "AI" capability claim remains in `app/page.tsx` or `PromptHero.tsx`.

Checks: `tsc --noEmit`; `vitest run app/__tests__ app/_components`; `playwright test
homepage-ai-planner ai-trip-planner`; `build`; `git diff --check`.

Hermes focus: block on red-zone paths, unsafe copy, third-party assets, or any
robots/sitemap change. Note this rides the B2 re-anchored deploy (its code must be
in the deploy candidate SHA, or it will not be live).

### TD-RADARSCOUT-FE-HOME-2 — COMPLETED (#493)

Why: restyle `/` to the DESIGN.md Home blueprint.

Scope: rebuild the homepage layout with the primitives — full-bleed hero
(placeholder image until real assets), trust strip (reuse existing safe copy),
featured real partner experiences (from seed), how-it-works, immersive band,
partner-direct value, footer. Preserve all existing links/CTAs to planner + finder
and their behavior.

Forbidden: cart/checkout/price/availability/rating; changing planner/finder
behavior; robots/sitemap/DB/env/Bókun; third-party assets. Homepage `<title>` and
safe copy rules unchanged.

Acceptance: home matches the blueprint responsively (desktop/mobile), no
horizontal overflow; `copySafety`/`publicCopySafety`/`seoIndexGuard`/homepage E2E
green; Lighthouse-sane (hero `priority`, others lazy). Placeholder imagery via
`next/image`.

Checks: `tsc`; `vitest run`; `playwright test homepage-ai-planner ai-trip-planner`;
`build`; `git diff --check`.

Hermes focus: block on any red-zone path, unsafe copy, or third-party asset.

### TD-RADARSCOUT-FE-LISTING-3 — COMPLETED (#494)

Why: restyle the collection/listing surface (`/tours`, destination listings).

Scope: category header (full-bleed placeholder + Fraunces title + count/summary,
NO price), client-side filter/sort (destination + interest chips), responsive
`ExperienceCard` grid with skeleton loading + safe empty state (reuse planner
no-match copy). Card CTA = "View details" → tour detail.

Forbidden: price/availability/rating, add-to-cart, sitemap/robots changes,
third-party assets.

Acceptance: listing renders responsively with the grid + filters; empty/loading
states present; all safety/SEO tests green; no overflow.

Checks: `tsc`; `vitest run`; `playwright test`; `build`; `git diff --check`.

Hermes focus: block on cart/price/availability, robots/sitemap change, or third-
party asset.

### TD-RADARSCOUT-FE-DETAIL-4 — COMPLETED (#495)

Why: restyle `/tours/[id]` to the immersive detail blueprint — WITHOUT a Shopify
buy-box.

Scope: immersive experience hero, optional gallery (owned/licensed/placeholder
images only), description + "why this fits" chips (reuse existing fit signals),
**sticky "Check availability" action → the partner Bókun widget URL**
(`rel="nofollow sponsored noopener noreferrer"`, external), reuse existing safe
handoff/return copy, related-experiences cards. Keep `getTourDetailRobots` gating
and the source-param return path intact.

Forbidden: add-to-cart / Buy-now / price / availability text / rating; changing
the tour-detail robots gating or source-param behavior; sitemap/robots/DB/env/
Bókun API; third-party assets.

Acceptance: detail matches blueprint; the only booking action is the external
"Check availability" handoff to the Bókun widget URL; `copySafety`/`publicCopy`/
`seoIndexGuard` + tour-detail tests green; no overflow.

Checks: `tsc`; `vitest run app/tours app/ai-trip-planner app/chiang-mai`;
`playwright test`; `build`; `git diff --check`.

Hermes focus: block if any add-to-cart/price/availability appears, if the handoff
becomes anything other than the external partner widget link, or if tour-detail
robots gating changes.

---

## TD-RADARSCOUT-PROD-DEPLOY-CANDIDATE-B2-REANCHOR (RELEASE — supersedes B)

Branch: `codex/td-radarscout-prod-deploy-candidate-b2` (docs/report only; no app code)

Supersedes `TD-RADARSCOUT-PROD-DEPLOY-CANDIDATE-B`. That candidate pinned
`7d446ee`, which **predates the real partner products + matching** now merged into
`codex/travel-mvp-launch`. Deploying `7d446ee` would ship WITHOUT the partner
products — the whole point of shipping now. Re-anchor to the current real code.
Same rule as before: agent prepares and gates, then STOPS. Human deploys.

### Step 0 — resolve two facts before anything (do not assume)

1. **What is actually live in production right now?** The repo contains a commit
   `4d5619e "Record RadarScout production deploy completion"`, but an earlier
   observation reported production still on `dpl_2v7mRufyuHdh6fuh2wnjR2XWx6c3`.
   Resolve the contradiction: read-only, determine the current production
   deployment id and which commit/date it corresponds to (`vercel ls` /
   dashboard). Report the truth. Do NOT deploy until this is clear.
2. **The new release-candidate SHA** = the last real `app/` / `lib/` **code**
   commit on `codex/travel-mvp-launch` that includes the partner seed (#483) and
   matching wiring (`f78254d`) — NOT a docs commit (the current tip `23c1a16` /
   `8a15e0c` are docs), NOT `7d446ee`. If PR #488 (matching quality) is merged
   first, use its merge commit. Print the exact SHA and confirm its tree contains
   `apps/web/lib/partnerProducts/seed/` and the matching wiring.

### Step 1 — full local gate (clean worktree at the new SHA)

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web exec vitest run
pnpm --filter @reddit-monitor/web exec playwright test
pnpm --filter @reddit-monitor/web build
pnpm smoke:ai-trip-local:production
git diff --check
```

All green. In the local smoke, additionally confirm partner products now surface
(the planner/finder returns the real Chiang Mai partner products and the
"Check availability" handoff points at the `widgets.bokun.io` URLs). If partner
products do NOT appear, STOP — the candidate is wrong.

### Step 2 — update the deploy candidate record

Update `docs/radarscout-ai-trip-status.md` IN PLACE (no new doc): new SHA, the
resolved current-live-deployment fact from Step 0, gate results, the exact deploy
command pinned to the NEW SHA, rollback, post-deploy checklist. Mark the old
`7d446ee` candidate as superseded.

### Step 3 — STOP for human approval

Do not deploy. Present the exact command pinned to the NEW SHA. Human must say
`Approve production deploy — <NEW SHA>` and run it themselves.

### Step 4 — post-deploy observation (after human deploys)

Read-only against the live site: `/ai-trip-planner` and
`/chiang-mai/elephant-camp-finder` return 200; the finder now shows the real
partner products; "Check availability" links resolve to the `widgets.bokun.io`
URLs; robots/index policy unchanged (finder index:true, planner noindex); no
unsafe network; no forbidden copy. Confirm the production deployment id changed
to the new one. Record in the status doc.

### Forbidden

- Agent must NOT deploy, run `vercel --prod`, or promote any deployment.
- No app code / DB / schema / env / SEO / robots / sitemap / Bókun API / payment /
  availability changes. Report/docs only.

### Hermes focus

Block if the diff contains app-code/DB/env/SEO/Bókun changes, if the candidate is
anchored to a docs commit or to the stale `7d446ee`, or if any step attempts an
actual deploy without recorded human approval.

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
