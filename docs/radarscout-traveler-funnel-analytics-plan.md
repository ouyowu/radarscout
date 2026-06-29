# RadarScout traveler funnel analytics plan

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PLAN-0`

Status: docs-only analytics taxonomy and privacy plan.

This plan defines what RadarScout should measure later in the traveler funnel. It does not implement analytics, tracking scripts, cookies, database writes, third-party tools, or production behavior.

This document applies only to RadarScout. It does not apply to ThaiEleHub, Shopify theme work, Shopify product content, or Shopify checkout behavior.

## 1. Current funnel

The current traveler funnel is:

```text
Homepage
-> Plan a Chiang Mai elephant day
-> /chiang-mai/elephant-camp-finder
-> Plan with RadarScout
-> select deterministic planner chips
-> See matching experiences
-> recommendation cards
-> Check availability
-> external booking partner handoff
```

Current product boundary:

- RadarScout owns guided discovery, planning, recommendations, itinerary summary, and safe handoff.
- Booking partners own final availability, booking details, checkout, payment, confirmation, and inventory.
- RadarScout does not call Bókun API.
- RadarScout does not create booking submissions.
- RadarScout does not claim live availability.

## 2. Measurement goals

RadarScout should answer these questions before adding more traveler UX:

1. Do homepage visitors click into the Chiang Mai finder?
2. Do finder visitors start the planner?
3. Which deterministic planner choices are used most often?
4. Do users submit `See matching experiences`?
5. Do recommendation cards render after submission?
6. Which recommendation cards receive external handoff clicks?
7. Do users reset and try another plan?
8. Does mobile behavior differ from desktop behavior?

These questions should be answered without collecting sensitive traveler data.

## 3. Event taxonomy

### `homepage_finder_cta_click`

Purpose:

Measure whether the homepage entry point sends users into the core finder.

Trigger:

User clicks the homepage CTA linking to `/chiang-mai/elephant-camp-finder`.

Allowed properties:

- `source_path`
- `destination_path`
- `cta_label`
- `surface`
- `device_category`

Forbidden properties:

- user name
- email
- precise location
- booking data

### `finder_view`

Purpose:

Measure visits to the Chiang Mai finder.

Trigger:

Finder page loads in the browser.

Allowed properties:

- `page_path`
- `destination`
- `surface`
- `device_category`
- `referrer_category` if privacy-safe and coarse

Forbidden properties:

- full referrer URL if it contains query parameters or private identifiers
- traveler identity
- precise location

### `planner_start`

Purpose:

Measure whether users engage with the deterministic planner.

Trigger:

User selects the first planner chip.

Allowed properties:

- `page_path`
- `destination`
- `first_step_key`
- `choice_key`
- `device_category`

Forbidden properties:

- free-text user input
- personal trip notes
- traveler identity

### `planner_choice_select`

Purpose:

Measure deterministic planner choices.

Trigger:

User selects or changes a planner chip.

Allowed properties:

- `step_key`
- `choice_key`
- `selection_mode`
- `destination`

Allowed `step_key` examples:

- `travel_style`
- `group_type`
- `time_available`
- `preference`

Allowed `choice_key` examples should be normalized keys, not raw labels:

- `gentle_elephant_day`
- `family_friendly_half_day`
- `cooking_local_food`
- `nature_day_trip`
- `low_intensity`
- `photo_friendly`
- `solo`
- `couple`
- `family`
- `friends`
- `group`
- `half_day`
- `full_day`
- `flexible`
- `feeding`
- `bathing_if_listed`
- `ethical_priority`
- `easy_pace`
- `hotel_area_friendly`

Forbidden properties:

- raw free text
- traveler names
- party member names
- hotel name
- exact pickup address

### `planner_submit`

Purpose:

Measure when users ask to see recommendations.

Trigger:

User clicks `See matching experiences`.

Allowed properties:

- `destination`
- `selected_style_key`
- `selected_group_key`
- `selected_time_key`
- `selected_preference_keys`
- `submit_surface`

Allowed `submit_surface` values:

- `planner_picks`
- `bottom_form`

Forbidden properties:

- exact hotel address
- personal contact details
- payment intent
- booking reference

### `itinerary_summary_view`

Purpose:

Measure whether the deterministic itinerary summary appears after submission.

Trigger:

The `Your suggested Chiang Mai day` summary renders after planner submission.

Allowed properties:

- `destination`
- `summary_variant_key`
- `selected_style_key`
- `selected_time_key`
- `device_category`

Forbidden properties:

- generated personal itinerary text
- LLM output
- traveler identity

### `recommendation_card_impression`

Purpose:

Measure which recommendation cards are shown after matching.

Trigger:

Recommendation cards render after planner submission.

Allowed properties:

- `destination`
- `recommendation_key`
- `rank`
- `match_context`
- `external_handoff_available`

Rules:

- Use stable internal card keys, not raw supplier private data.
- Do not expose supplier private rates, partner rates, commission, or backend data.

### `external_handoff_click`

Purpose:

Measure clicks from RadarScout to a booking partner or public operator handoff.

Trigger:

User clicks a `Check availability` CTA that points to an external booking partner URL.

Allowed properties:

- `destination`
- `recommendation_key`
- `cta_label`
- `handoff_source`
- `external_domain_category`

Allowed `handoff_source` values:

- `owner_managed_profile`
- `operator_verified_public_link`

Forbidden properties:

- full URL if it contains tokens or query parameters
- Bókun backend URL
- Bókun supplier dashboard URL
- supplier net rate
- partner rate
- commission
- checkout session ID
- payment session ID
- booking reference

### `planner_reset`

Purpose:

Measure whether users reset the planner and try again.

Trigger:

User clicks `Reset planner`.

Allowed properties:

- `destination`
- `had_submitted`
- `selected_step_count`
- `device_category`

Forbidden properties:

- full previous selection text if it includes private data
- personal notes

## 4. Privacy and data minimization rules

Keep analytics coarse and product-focused.

Do not collect:

- traveler name
- email address
- phone number
- hotel name
- exact pickup address
- exact location
- passport or ID data
- booking reference
- payment details
- checkout session
- cart state
- live availability state
- supplier private rates
- partner rates
- commission
- Bókun backend data
- Bókun login or credentials
- raw supplier inventory
- raw external handoff URL if it contains tokens or private parameters

Allowed collection should be limited to:

- page path
- event name
- normalized planner choice key
- recommendation key
- CTA label
- destination
- coarse device category
- environment
- timestamp generated by the analytics tool

## 5. Tooling options for later

This task does not choose or install an analytics tool.

Future options to compare:

1. no analytics yet
2. server log review only
3. Vercel Web Analytics
4. Plausible or another privacy-focused analytics tool
5. a small first-party event endpoint

Decision criteria:

- privacy posture
- cookie behavior
- implementation complexity
- support for client-side events
- visibility into external handoff clicks
- ability to avoid personal data
- operational cost
- rollback simplicity

Any tool selection must be a separate task.

## 6. Implementation phases

### Phase 0: Docs and manual review

Current phase.

Deliverables:

- event taxonomy
- privacy boundary
- future tests
- future implementation gates

No code changes.

### Phase 1: Tool selection document

Future task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-TOOL-SELECTION-0
```

Scope:

- compare analytics options;
- decide whether to use no analytics, Vercel Web Analytics, Plausible, server logs, or first-party events;
- document privacy and rollback implications.

Do not implement tracking in the tool selection task.

### Phase 2: Static event contract

Future task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-CONTRACT-1
```

Scope:

- create typed event names and allowed property keys;
- add tests for forbidden properties;
- no network calls yet.

### Phase 3: Preview-only instrumentation

Future task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PREVIEW-2
```

Scope:

- add limited client-side event instrumentation behind an explicit flag;
- run preview smoke only;
- verify no DB writes, Bókun calls, checkout, payment, booking submission, or SEO changes.

### Phase 4: Production instrumentation

Only after explicit approval.

Scope:

- deploy limited analytics events to production;
- verify no forbidden data is collected;
- verify external handoff behavior is unchanged;
- verify no SEO opening.

## 7. Test plan for future implementation

Future implementation tests should cover:

- homepage CTA emits only `homepage_finder_cta_click`;
- finder view emits only allowed page metadata;
- planner chip selection emits normalized keys only;
- planner submit emits selected keys without personal data;
- itinerary summary view emits deterministic summary variant only;
- recommendation card impressions use stable card keys;
- external handoff click uses safe handoff source and does not expose tokenized URLs;
- reset emits only coarse state;
- no analytics event includes forbidden keys;
- no `/api/bokun` call;
- no OpenAI or LLM call;
- no checkout, payment, cart, or booking submission request;
- no DB write;
- no SEO robots or sitemap change.

## 8. Safety gates

Every future analytics implementation task must confirm:

- production deploy requires explicit approval;
- SEO `index,follow` opening requires explicit approval;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory behavior;
- no DB/schema/env change unless separately approved;
- no ThaiEleHub or Shopify changes;
- no raw personal data;
- no raw supplier private data;
- no tokenized external URLs in event payloads.

## 9. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-TOOL-SELECTION-0
```

Goal:

Compare no analytics, server logs, Vercel Web Analytics, Plausible, and first-party events for RadarScout's traveler funnel.

This should remain docs-only and should not install or configure any analytics tool.

## 10. Non-goals

This plan does not:

- add analytics code;
- add a tracking script;
- add cookies;
- add a first-party event endpoint;
- write to the database;
- change schema or environment variables;
- change sitemap;
- change robots metadata;
- open `index,follow`;
- call Bókun API;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- change external handoff URLs;
- touch ThaiEleHub or Shopify files;
- deploy production.

## 11. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-traveler-funnel-analytics-plan.md
```

No app tests are required unless app code changes accidentally.
