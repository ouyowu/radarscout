# RadarScout analytics funnel plan

Task: `TD-RADARSCOUT-ANALYTICS-FUNNEL-0`

## 1. Purpose

RadarScout now has a live homepage entry point into the Chiang Mai finder:

```text
/ -> /chiang-mai/elephant-camp-finder
```

The next measurement problem is not broad site analytics. It is a narrow product-funnel question:

```text
Do travelers who see the homepage entry point move through the guided planner and continue to a booking partner handoff?
```

This document is a proposal only. It does not add analytics code, tracking scripts, database writes, LLM calls, Bókun API calls, checkout behavior, or SEO indexing changes.

## 2. Current live funnel

Current intended user path:

```text
Homepage
  -> Plan with RadarScout
  -> Chiang Mai finder
  -> Plan with RadarScout chip flow
  -> See matching experiences
  -> recommendation cards
  -> Check availability
  -> external booking partner widget
```

Current safety state:

- The Chiang Mai finder remains `noindex,nofollow`.
- B2B pages remain `noindex,nofollow`.
- `/tours/{id}` pages are excluded from the sitemap.
- Booking handoff remains an external booking partner widget.
- RadarScout does not perform checkout, payment, booking submission, confirmation, or live inventory behavior.

## 3. Questions analytics should answer

Instrumentation should be designed to answer a small set of operational questions.

1. Homepage entry effectiveness
   - How often do users see the homepage finder card?
   - How often do they click `Plan with RadarScout`?

2. Planner engagement
   - How many users start selecting planner chips?
   - Which step creates the largest drop-off: style, group, time, preferences, or submit?

3. Recommendation quality proxy
   - After submitting the planner, do users reach recommendation cards?
   - Which deterministic planner paths most often lead to a handoff click?

4. Booking partner handoff
   - How often do users click `Check availability`?
   - Which recommended product position receives the click?

5. Mobile friction
   - Is the mobile funnel materially worse than desktop?
   - Does the compact itinerary summary keep users close enough to recommendation cards?

## 4. Proposed event model

Use stable, low-cardinality event names. Avoid logging raw form text, personal data, full URLs with query strings, raw Bókun payloads, or supplier-private fields.

| Event | Trigger | Required properties | Notes |
| --- | --- | --- | --- |
| `homepage_finder_entry_viewed` | Homepage renders the Chiang Mai planner card | `surface`, `destination`, `viewport_class` | Optional if page-view instrumentation already exists. |
| `homepage_finder_entry_clicked` | User clicks `Plan with RadarScout` | `surface`, `destination`, `cta_label` | Measures homepage entry effectiveness. |
| `finder_planner_viewed` | Chiang Mai finder planner section is visible | `destination`, `surface`, `viewport_class` | Should not require user identity. |
| `finder_planner_choice_selected` | User selects a planner chip | `step_id`, `choice_id`, `selection_mode` | Use internal IDs like `gentle-elephant`, not free text. |
| `finder_planner_reset_clicked` | User clicks reset | `destination`, `selected_step_count` | Helps spot confusing flows. |
| `finder_matching_experiences_clicked` | User clicks `See matching experiences` | `destination`, `style_id`, `group_id`, `time_id`, `preference_count` | Do not send raw user text. |
| `finder_recommendations_rendered` | Recommendation cards render after submit | `destination`, `result_count`, `top_match_category` | Do not include raw product descriptions. |
| `booking_partner_handoff_clicked` | User clicks `Check availability` | `destination`, `product_id`, `card_position`, `handoff_type` | This is a click to an external partner, not a booking. |

## 5. Property guardrails

Allowed properties:

- destination identifiers such as `chiang-mai`;
- deterministic planner option IDs;
- result counts;
- card positions;
- viewport class such as `mobile` or `desktop`;
- anonymous session or request identifiers if already available and privacy-reviewed.

Forbidden properties:

- traveler name, email, phone, or payment data;
- full booking partner URLs with tokens or private query parameters;
- raw Bókun API payloads;
- raw supplier/private product records;
- free-form user text unless separately reviewed;
- exact hotel names or pickup addresses;
- checkout, payment, booking confirmation, or availability state.

## 6. Copy and event naming guardrails

Analytics labels and dashboards should avoid tourist-facing claims that RadarScout does not own.

Do not use these terms in public UI, event labels intended for public dashboards, or funnel reports:

```text
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

Allowed measurement wording:

```text
guided planner
recommendation
booking partner handoff
Check availability click
external partner click
planner completion
```

## 7. Implementation options for a future task

### Option A: Lightweight first-party event endpoint

Scope:

- Add one public-safe event endpoint.
- Validate event names against an allowlist.
- Reject unknown properties.
- Store only anonymous, low-cardinality event rows.

Value:

- Full control over allowed fields.
- Easy to enforce RadarScout safety boundaries.

Risk:

- Requires database writes.
- Requires schema design and explicit approval because project rules forbid DB/schema changes without approval.

Safety gates:

- Separate schema proposal first.
- Explicit approval before any Prisma migration.
- No production DB writes until reviewed.

### Option B: Vercel Web Analytics or platform-native analytics

Scope:

- Measure page views and route-level engagement first.
- Avoid custom event payloads until a later task.

Value:

- Lower implementation surface.
- No custom collection endpoint.

Risk:

- May not answer planner-step and handoff questions without custom events.
- Needs a review of what data the vendor collects.

Safety gates:

- Privacy review first.
- Confirm no booking partner URLs or personal data are collected.
- No new script until explicitly approved.

### Option C: Server log-only handoff audit

Scope:

- Avoid client analytics.
- Use existing deployment/runtime logs for route health and errors only.

Value:

- Lowest tracking risk.
- Useful for technical health.

Risk:

- Does not measure client-side planner choices or external handoff clicks.

Safety gates:

- No public behavior changes.
- No DB writes.
- No third-party analytics scripts.

## 8. Recommended approach

Recommended next step:

```text
TD-RADARSCOUT-ANALYTICS-FUNNEL-1-INSTRUMENTATION-SPEC
```

This should be a docs-only spec before any code change.

The spec should decide:

- whether RadarScout should use platform-native analytics, a first-party event endpoint, or no client analytics yet;
- which event names are approved;
- which properties are allowed;
- whether any DB/schema change is needed;
- what privacy and retention rules apply;
- how QA verifies no Bókun API, checkout, payment, booking submission, or LLM behavior is introduced.

Do not implement analytics code until that spec is reviewed.

## 9. Future implementation test plan

If analytics instrumentation is later approved, tests should verify:

- homepage finder CTA click is instrumented without changing navigation;
- planner chip selection emits only approved option IDs;
- `See matching experiences` emits a submit event without raw user data;
- `Check availability` emits only an external handoff click event and still opens the booking partner URL;
- unknown event names are rejected;
- unknown properties are rejected;
- no `/api/bokun` calls are introduced;
- no OpenAI or LLM calls are introduced;
- no checkout, payment, booking submission, or live availability behavior is introduced;
- SEO state remains unchanged.

## 10. Explicit non-goals

This plan does not propose:

- opening `index,follow`;
- adding `/chiang-mai/elephant-camp-finder` to the sitemap;
- re-adding `/tours/{id}` to the sitemap;
- adding checkout, payment, cart, booking submission, confirmation, or live inventory behavior;
- calling the Bókun API;
- adding LLM/OpenAI behavior;
- adding login or saved trips;
- touching ThaiEleHub or Shopify.

## 11. Suggested task queue

```text
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
TD-RADARSCOUT-ANALYTICS-FUNNEL-1-INSTRUMENTATION-SPEC
TD-RADARSCOUT-ANALYTICS-FUNNEL-2-IMPLEMENT-LOW-RISK-TRACKING
TD-RADARSCOUT-ANALYTICS-FUNNEL-2-PREVIEW-SMOKE
TD-RADARSCOUT-ANALYTICS-FUNNEL-2-MERGE-POSTMERGE-PREVIEW
TD-DEPLOY-ANALYTICS-FUNNEL-2-PRODUCTION
```

Production deployment must remain separately approved.
