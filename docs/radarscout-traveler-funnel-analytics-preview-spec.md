# RadarScout traveler funnel analytics preview spec

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PREVIEW-SPEC-1`

Status: docs-only preview implementation specification.

This document defines a future preview-only implementation checklist for Vercel Web Analytics on the RadarScout traveler funnel. It does not install packages, add scripts, add event calls, create API endpoints, or deploy.

This document applies only to RadarScout. It does not apply to ThaiEleHub, Shopify theme work, Shopify product content, or Shopify checkout behavior.

## 1. Current decision state

Related completed documents:

- `docs/radarscout-conversion-funnel-audit.md`
- `docs/radarscout-traveler-funnel-analytics-plan.md`
- `docs/radarscout-traveler-funnel-analytics-tool-selection.md`

Current recommendation:

```text
Use Vercel Web Analytics as the first preview candidate only if the current Vercel plan supports the required custom events.
```

Do not implement analytics until this preview spec is reviewed and a separate implementation task is approved.

## 2. Preview-only objective

Future implementation task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PREVIEW-2
```

Objective:

Instrument a minimal set of traveler funnel events in Preview only, using the approved event taxonomy and strict payload allowlist.

The future task must prove:

- events fire only from intended user actions;
- payloads contain only allowed normalized keys;
- no personal data is collected;
- no external handoff URL with tokens or private parameters is collected;
- no Bókun, checkout, payment, booking, DB, SEO, or route behavior changes are introduced.

## 3. Pre-implementation checks

Before writing code, the future implementation task must confirm:

1. Current Vercel project is `ouyowus-projects / reddit-monitor`.
2. Current plan supports the required Web Analytics custom events.
3. Required package and setup steps are confirmed from current official Vercel docs.
4. No environment variable changes are required for preview instrumentation.
5. No DB/schema changes are required.
6. No production deploy is approved.
7. `origin/codex/travel-mvp-launch` is the base branch.
8. Work happens in a clean worktree under `/private/tmp/<task-name>`.

If custom events are not available on the current Vercel plan, stop and switch to a docs-only Plausible comparison task. Do not implement a workaround.

## 4. Allowed event set for preview

The initial preview implementation should include only these events:

| Event | Trigger | Required properties |
| --- | --- | --- |
| `homepage_finder_cta_click` | User clicks homepage CTA to the finder. | `source_path`, `destination_path`, `cta_label`, `surface` |
| `planner_start` | User selects the first planner chip. | `page_path`, `destination`, `first_step_key`, `choice_key` |
| `planner_choice_select` | User selects or changes a planner chip. | `step_key`, `choice_key`, `selection_mode`, `destination` |
| `planner_submit` | User clicks `See matching experiences`. | `destination`, `selected_style_key`, `selected_group_key`, `selected_time_key`, `selected_preference_keys`, `submit_surface` |
| `itinerary_summary_view` | Suggested day summary renders after submit. | `destination`, `summary_variant_key`, `selected_style_key`, `selected_time_key` |
| `recommendation_card_impression` | Recommendation cards render after submit. | `destination`, `recommendation_key`, `rank`, `match_context`, `external_handoff_available` |
| `external_handoff_click` | User clicks external `Check availability`. | `destination`, `recommendation_key`, `cta_label`, `handoff_source`, `external_domain_category` |
| `planner_reset` | User clicks `Reset planner`. | `destination`, `had_submitted`, `selected_step_count` |

Do not add B2B events in this implementation. B2B analytics has its own plan.

## 5. Event payload rules

All event payloads must be built from explicit allowlists.

Allowed value types:

- hard-coded event names;
- normalized planner choice keys;
- stable recommendation keys;
- boolean flags;
- numeric rank;
- safe page paths;
- coarse surface labels;
- coarse external domain category.

Forbidden value types:

- raw external URLs;
- URL query strings;
- traveler names;
- emails;
- phone numbers;
- hotel names;
- exact pickup addresses;
- booking references;
- checkout IDs;
- payment session IDs;
- cart state;
- live availability state;
- supplier private rates;
- partner rates;
- commission;
- Bókun backend data;
- Bókun credentials;
- raw supplier inventory;
- LLM output.

## 6. Suggested code boundaries for future task

Future implementation should stay narrow.

Likely touched files:

```text
apps/web/app/page.tsx
apps/web/app/chiang-mai/elephant-camp-finder/ElephantCampFinderClient.tsx
apps/web/app/chiang-mai/elephant-camp-finder/__tests__/ElephantCampFinderClient.test.tsx
apps/web/app/__tests__/homepageCopy.test.ts
```

Possible helper file if needed:

```text
apps/web/lib/analytics/travelerFunnelEvents.ts
```

Do not touch:

- `apps/web/app/sitemap.ts`
- `apps/web/app/robots.ts`
- `/tours/{id}` route behavior
- B2B page robots
- product data
- Prisma schema
- environment files
- ThaiEleHub files
- Shopify files

## 7. Test requirements for future implementation

Add or update tests proving:

- homepage CTA tracking uses only `homepage_finder_cta_click`;
- planner start tracking fires only after first chip selection;
- planner chip tracking uses normalized keys only;
- planner submit tracking includes selected keys only;
- itinerary summary tracking does not include generated text;
- recommendation card impression tracking uses stable recommendation keys only;
- external handoff tracking does not include full external URL;
- reset tracking contains only coarse state;
- no forbidden property keys are present in event payload builders;
- no `/api/bokun` call is introduced;
- no OpenAI or LLM call is introduced;
- no checkout/payment/booking submission request is introduced;
- no DB write is introduced;
- robots remain unchanged;
- sitemap remains unchanged.

If the implementation uses a Vercel analytics package, mock it in unit tests and assert the wrapper receives only allowed event names and properties.

## 8. Preview validation commands for future implementation

Future implementation should run:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- homepageCopy
pnpm --filter @reddit-monitor/web test -- elephant
pnpm --filter @reddit-monitor/web test -- analytics
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

If focused `analytics` tests do not exist, add them in the implementation task.

## 9. Preview smoke for future implementation

Deploy preview only:

```bash
npx vercel --yes
```

Do not run:

```bash
npx vercel --prod
```

Preview checks:

- correct Vercel project: `ouyowus-projects / reddit-monitor`;
- target is preview/null;
- no production aliases;
- no `radarscout.io` or `www.radarscout.io` alias;
- deployment commit matches implementation branch head;
- worktree is clean before deploy.

Browser smoke:

1. Open homepage.
2. Click `Plan with RadarScout`.
3. Confirm route to `/chiang-mai/elephant-camp-finder`.
4. Select planner chips.
5. Click `See matching experiences`.
6. Confirm suggested day summary renders.
7. Confirm recommendation cards render.
8. Click `Check availability`.
9. Confirm external handoff behavior is unchanged.
10. Reset planner.

Network audit:

- analytics events only to the selected analytics endpoint;
- no `/api/bokun`;
- no OpenAI or LLM call;
- no form API call;
- no DB write behavior;
- no checkout/payment/booking request;
- no raw external handoff URL in analytics payload.

## 10. Production gate

Do not production deploy analytics from the preview task.

Production deployment requires a separate explicit task:

```text
TD-DEPLOY-TRAVELER-FUNNEL-ANALYTICS-PRODUCTION
```

Before approval, report:

- exact implementation commit SHA;
- preview URL;
- preview deployment ID;
- validation results;
- analytics payload audit;
- network audit;
- robots result;
- sitemap result;
- external handoff result;
- rollback plan.

## 11. Rollback plan

If analytics causes unsafe payloads, broken planner behavior, external handoff regression, or vendor/tooling issues:

1. Revert the analytics implementation commit.
2. Remove analytics package/script/event calls.
3. Confirm no analytics network calls remain.
4. Confirm planner still works.
5. Confirm `Check availability` handoff still works.
6. Confirm robots and sitemap remain unchanged.
7. Redeploy rollback only after explicit approval if production was affected.

No DB rollback should be needed because the future analytics implementation should not write DB state.

## 12. Hard non-goals

This preview spec does not approve:

- installing Vercel Web Analytics;
- installing Plausible;
- adding event calls;
- adding scripts;
- adding cookies;
- adding a first-party event endpoint;
- adding DB writes;
- changing Prisma schema;
- changing environment variables;
- changing robots metadata;
- changing sitemap;
- opening SEO indexing;
- calling Bókun API;
- changing Bókun widget URLs;
- adding checkout/payment/cart/booking submission;
- adding live availability/inventory behavior;
- touching ThaiEleHub or Shopify files;
- production deploy.

## 13. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-traveler-funnel-analytics-preview-spec.md
```

No app tests are required unless app code changes accidentally.
