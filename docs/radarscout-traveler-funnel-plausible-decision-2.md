# RadarScout traveler funnel Plausible decision

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-DECISION-2`

Status: decision record, updated 2026-07-08 after human approval to proceed
with analytics provider implementation.

This document records the analytics decision for RadarScout's traveler funnel.
It does not approve database writes, environment-variable changes, SEO behavior
changes, Bókun API calls, checkout/payment/booking behavior, or ThaiEleHub work.

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

These questions are now worth measuring because the Trip Planner production
deployment is live and the finder is the controlled-open marketing route.

## 3. Options considered

### Option A: Vercel Web Analytics with custom events

Value:

- lowest operational overhead if available on the current Vercel setup;
- same platform as deployment;
- can keep pageview and event instrumentation close to the Next.js app.

Current fit:

- RadarScout is already deployed on Vercel.
- Vercel Web Analytics requires no new third-party analytics vendor account.
- The package supports App Router pageview instrumentation and custom events
  through `@vercel/analytics`.
- Custom events should use the already-approved event taxonomy only.

Decision:

Select Vercel Web Analytics for the first implementation.

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

Do not implement Plausible now. Keep Plausible as a later alternative only if
Vercel Analytics does not answer the funnel questions.

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

Option C is superseded by the 2026-07-08 human decision to proceed with Vercel
Web Analytics. The postponement is closed.

## 4. Decision

Current decision:

```text
Vendor: Vercel Web Analytics.
Implement App Router pageviews with @vercel/analytics/next.
Flush approved custom funnel events with @vercel/analytics.
Do not add Plausible.
Do not add database writes, environment variables, SEO changes, Bókun API calls,
checkout/payment/booking behavior, or availability/inventory behavior.
```

This is the lowest-risk provider choice because it stays on the existing Vercel
deployment platform and does not require secrets or a new external vendor script.

## 5. Approved taxonomy

The event taxonomy from the analytics plan is the approved shape for the
implementation:

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

## 6. Guardrails for analytics implementation

Analytics implementation must include:

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

## 7. Current status

Vercel Web Analytics is selected for implementation.

Plausible remains unselected.

No database analytics implementation is active.

RadarScout remains within the current safety boundary:

- no LLM/OpenAI;
- no Bókun API/edit/sync;
- no checkout/payment/booking submission;
- no live availability or inventory claims;
- no DB/schema/env changes;
- no SEO `index,follow` opening;
- no ThaiEleHub or Shopify work.
