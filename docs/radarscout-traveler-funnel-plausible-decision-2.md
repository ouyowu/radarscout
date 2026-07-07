# RadarScout traveler funnel Plausible decision

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-DECISION-2`

Status: docs-only decision record.

This document records the current analytics decision for RadarScout's traveler funnel. It does not install analytics, add tracking scripts, configure a vendor, write to the database, change environment variables, change SEO behavior, call Bókun, or touch ThaiEleHub.

## 1. Source documents reviewed

This decision is based on the current RadarScout analytics docs:

- `docs/radarscout-traveler-funnel-analytics-plan.md`
- `docs/radarscout-traveler-funnel-analytics-tool-selection.md`
- `docs/radarscout-traveler-funnel-plausible-comparison.md`
- `docs/radarscout-ai-trip-status.md`

## 2. Current funnel goal

RadarScout should eventually measure the traveler path:

```text
Homepage
-> Chiang Mai finder
-> deterministic planner chips
-> See matching experiences
-> recommendation cards
-> Check availability
-> external booking partner handoff
```

The useful questions remain:

- Do visitors click from the homepage into the finder?
- Do finder visitors interact with the planner?
- Which deterministic planner choices are selected?
- Do users submit `See matching experiences`?
- Do recommendation cards render after planner submission?
- Do users click the external booking partner handoff?

These questions are valid, but they do not require immediate analytics implementation before the next product release gate.

## 3. Options considered

### Option A: Vercel Web Analytics with custom events

Value:

- lowest operational overhead if available on the current Vercel setup;
- same platform as deployment;
- can keep pageview and event instrumentation close to the Next.js app.

Current issue:

- RadarScout's current Vercel plan and recent docs review indicate custom events are not the safest immediate path.
- Current Vercel preview deploys are also blocked by `api-deployments-free-per-day`, so adding analytics code now would make verification slower.

Decision:

Do not implement Vercel custom-event analytics now.

### Option B: Plausible custom events

Value:

- privacy-focused analytics option;
- supports custom events and custom properties;
- does not require RadarScout DB writes or Prisma schema changes.

Risks:

- adds a new vendor and public script;
- needs account, domain, privacy, and billing decisions;
- needs a strict adapter and tests to prevent leaking raw URLs, traveler text, product copy, or booking partner details.

Decision:

Do not implement Plausible now.

### Option C: Postpone custom analytics

Value:

- no new vendor;
- no new script;
- no cookie or privacy-policy risk;
- no DB/schema/env changes;
- no preview verification burden while Vercel deploy quota is blocked;
- keeps engineering focus on product clarity and safe handoff flow.

Cost:

- RadarScout will not yet have quantitative funnel metrics.
- Product decisions continue to rely on manual smoke, local validation, production observation, and operator judgment.

Decision:

Choose Option C for now.

## 4. Decision

Current decision:

```text
Do not add analytics code yet.
Do not upgrade or configure Vercel Analytics for custom events yet.
Do not add Plausible yet.
Keep the approved traveler funnel event taxonomy ready for a later implementation.
```

This is the lowest-risk choice while the current priority is keeping the AI Trip and tour-detail handoff flow safe, understandable, and releasable.

## 5. What remains approved for later

The event taxonomy from the analytics plan remains the approved shape for a future implementation:

- `homepage_finder_entry_clicked`
- `finder_planner_choice_selected`
- `finder_planner_reset_clicked`
- `finder_matching_experiences_clicked`
- `finder_recommendations_rendered`
- `booking_partner_handoff_clicked`
- `finder_planner_viewed`

Future implementation must use normalized keys only. It must not send:

- traveler names;
- emails;
- phone numbers;
- hotel names;
- pickup addresses;
- raw free-form trip text;
- full booking partner URLs;
- Bókun backend data;
- checkout, payment, booking, confirmation, availability, or inventory state.

## 6. Guardrails for future analytics implementation

Before any analytics code is added, require a new implementation task with:

- selected vendor named explicitly;
- package/script changes listed;
- event allowlist tests;
- forbidden property tests;
- route allowlist tests;
- privacy copy impact review;
- preview smoke plan;
- rollback plan.

Future analytics implementation must not:

- call OpenAI or any LLM;
- call Bókun API;
- change Bókun widget URLs;
- add checkout, payment, cart, booking submission, confirmation, live availability, or inventory behavior;
- write to the database;
- change Prisma schema;
- change environment variables without explicit approval;
- open SEO `index,follow`;
- add `/tours/{id}` back to the sitemap;
- touch ThaiEleHub or Shopify files.

## 7. Recommended next RadarScout task

Because analytics is postponed, the recommended next product task is:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Run it only when Vercel preview deployment quota resets or when an approved protected-preview/share-smoke path is available.

If preview remains blocked, the next safe docs/product task is:

```text
TD-RADARSCOUT-AI-TRIP-PRODUCTION-DEPLOY-CANDIDATE-DOCS
```

Goal:

Document the exact release candidate state, validation evidence, known preview quota blocker, production smoke checklist, and rollback plan before asking for production deployment approval.

## 8. Current status

No analytics implementation is active.

No analytics vendor is selected for implementation.

RadarScout remains within the current safety boundary:

- no LLM/OpenAI;
- no Bókun API/edit/sync;
- no checkout/payment/booking submission;
- no live availability or inventory claims;
- no DB/schema/env changes;
- no SEO `index,follow` opening;
- no ThaiEleHub or Shopify work.
