# Codex Task Brief — TD-RADARSCOUT-ANALYTICS-FUNNEL-0

Supersedes RAD-3 as the first execution task. Reason: the homepage Chiang Mai
finder entry already exists (`apps/web/app/page.tsx` → `chiangMaiPlannerHref`,
"Plan with RadarScout", hero CTA "Plan a Chiang Mai elephant day"), the
`/chiang-mai/elephant-camp-finder` route exists, and its funnel CTAs
("Plan with RadarScout" → "See matching experiences" → "Check availability")
are live. The gap is that NONE of the funnel is instrumented. Adding another
entry link would be redundant; instrumenting the funnel is the real next value.

## Repo / branch rules

- Repo: `/Users/ouyowu/reddit-monitor` (ouyowu/radarscout)
- Base branch: `codex/travel-mvp-launch`
- New focused branch: `codex/td-radarscout-analytics-funnel-0`
- Clean worktree. One task, one branch. Do NOT broaden scope.
- Read `CLAUDE.md` first and follow the strictest rule on conflict.

## Why (business value)

Right now there is zero conversion data. We cannot tell whether the finder entry
works, where users drop off, or whether "Check availability" is ever clicked.
This task instruments the existing funnel so every later decision (SEO opening,
more entries, partner products) is measured, not guessed.

## Scope — what to build

A provider-agnostic client analytics shim plus event hooks on the existing
funnel. NO analytics provider is wired in this task (GA4/Plausible/Vercel is a
separate future config task); events must be safely buffered/no-op until then.

1. `apps/web/lib/analytics/track.ts`
   - Export `track(event: FunnelEvent, props?: Record<string, string | number | boolean>): void`.
   - SSR-safe: no-op when `typeof window === 'undefined'`.
   - Push events to `window.dataLayer` (create if absent) AND a bounded in-memory
     `__radarscoutAnalyticsQueue` (cap ~50) so a later provider can flush them.
   - Never throw; wrap in try/catch. No network calls in this task.
   - Export a `FunnelEvent` string-literal union (typed) with exactly:
     - `homepage_finder_entry_click`
     - `finder_plan_with_radarscout_click`
     - `finder_see_matching_experiences_click`
     - `finder_check_availability_click`
     - `planner_search_submitted`

2. Wire the events into EXISTING handlers/links only (no UI/layout/copy changes):
   - `apps/web/app/page.tsx`: homepage finder entry link(s) → `homepage_finder_entry_click`
     (include a `{ source: 'hero' | 'section' }` prop to distinguish the two).
   - `apps/web/app/chiang-mai/elephant-camp-finder/ElephantCampFinderClient.tsx`:
     - "Plan with RadarScout" open/interaction → `finder_plan_with_radarscout_click`
     - "See matching experiences" submit → `finder_see_matching_experiences_click`
     - "Check availability" CTA click → `finder_check_availability_click`
   - `apps/web/app/ai-trip-planner/IntentParserDemo.tsx`: the "Search real Thailand
     experiences" submit → `planner_search_submitted`.
   - For `<Link>` elements, add an `onClick` that calls `track(...)`; do not change
     `href`, navigation, or visible text.

3. Tests (`vitest`):
   - Unit-test `track()`: no-op under SSR (no `window`), buffers to queue +
     dataLayer under jsdom, never throws, respects the queue cap.
   - Component/interaction tests asserting each funnel handler calls `track` with
     the correct event name (mock the module).

## Explicitly forbidden in this task

- No analytics provider SDK, no GA4/Plausible/Vercel wiring, no network/beacon.
- No DB / Prisma schema / migration / env / `.env*` changes.
- No `robots` / `sitemap` / SEO `index,follow` changes.
- No Bókun API/sync, no checkout/payment/cart/booking/availability behavior
  (the "Check availability" handoff link behavior stays exactly as-is; we only
  fire an event on click).
- No public copy changes, no layout/visual changes, no route changes.
- No changes to `apps/web/app/suppliers`, `destinations`, or any ThaiEleHub /
  Shopify asset. RadarScout only.
- Do not consume PII in event props (no free-text prompt contents; category/enum
  values only).

## Acceptance criteria

- `track()` exists, is SSR-safe, typed, never throws, buffers correctly.
- All 5 funnel events fire from the correct existing interactions; verifiable in
  the browser via `window.dataLayer` / `window.__radarscoutAnalyticsQueue`.
- Confirm in the report that the homepage finder entry (RAD-3) already exists and
  is now instrumented — no new entry link was added.
- No visual, copy, route, or navigation change (diff is logic + tests only).

## Checks (QA re-runs from a clean worktree — do not trust self-report)

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web exec vitest run lib/analytics app/page app/chiang-mai app/ai-trip-planner
pnpm --filter @reddit-monitor/web exec playwright test homepage-ai-planner ai-trip-planner
git diff --check
```

## Safety statement (include in PR)

No DB/schema/env, no SEO/robots, no Bókun, no payment/availability behavior, no
copy/layout change, no ThaiEleHub/Shopify contact. Client-only, provider-agnostic
event emission; no network egress; no PII captured.

## Required final report

- Branch, commit SHA, changed files
- Commands run + results (checks above)
- Manual verification (list which interaction fired which event, observed in
  `window.dataLayer`)
- Confirmation that RAD-3 entry pre-existed and was only instrumented
- PR URL + GitHub mergeable status
- Any blockers

## Hermes review focus (red-line gate)

Block if the diff touches: ThaiEleHub/Shopify, DB/schema/env, robots/sitemap/SEO
index, checkout/payment/availability behavior, Bókun API, or adds a network
analytics call. Otherwise advisory only.

## After this task (do NOT start in this branch)

Next briefs, in order: analytics provider wiring (config-only) →
Search Console/sitemap checklist (docs) → controlled SEO opening of the single
`/chiang-mai/elephant-camp-finder` page → partner product data model (no API) →
manual partner seed → product matching → Bókun API discovery (research only).
Production deploy, SEO index opening, and DB changes always require explicit
human approval and are never automated.
