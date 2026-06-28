# RadarScout analytics instrumentation spec

Task: `TD-RADARSCOUT-ANALYTICS-FUNNEL-1-INSTRUMENTATION-SPEC`

## 1. Scope

This specification narrows the analytics plan into a safe future implementation.

Target funnel:

```text
Homepage
  -> Plan with RadarScout
  -> /chiang-mai/elephant-camp-finder
  -> deterministic planner chips
  -> See matching experiences
  -> recommendation cards
  -> Check availability
  -> external booking partner handoff
```

This is a specification only.

It does not:

- add `@vercel/analytics`;
- add any client script;
- add a custom event endpoint;
- write to the database;
- change Prisma schema;
- change environment variables;
- change SEO robots;
- change sitemap output;
- call OpenAI or any LLM;
- call the Bókun API;
- change Bókun widget URLs;
- add checkout, payment, cart, booking submission, confirmation, or live inventory behavior;
- touch ThaiEleHub or Shopify.

## 2. Source decisions

This spec is based on:

- `docs/radarscout-analytics-funnel-plan.md`;
- the current homepage CTA to `/chiang-mai/elephant-camp-finder`;
- the deterministic Chiang Mai finder planner flow;
- the current `Check availability` external booking partner handoff;
- the current SEO safety state where the finder remains `noindex,nofollow`.

Official Vercel documentation confirms that Vercel Web Analytics can be added through `@vercel/analytics`, can use `beforeSend` to filter analytics events, and supports custom events. This spec treats those as candidate implementation tools, not as an implementation approval.

## 3. Recommended implementation direction

Recommended future implementation:

```text
Use Vercel Web Analytics + an allowlisted custom-event wrapper.
Do not add a first-party database-backed analytics endpoint yet.
```

Reasoning:

- It avoids RadarScout-owned analytics database writes.
- It avoids Prisma schema changes.
- It is lower-risk than creating a public event collection API.
- `beforeSend` can filter private or unsafe routes before analytics events are sent.
- Custom events can cover the small funnel questions without raw user text.

Do not implement this recommendation until the user explicitly approves the implementation task.

## 4. Approved route scope for first implementation

Analytics should be limited to these public funnel surfaces:

```text
/
/chiang-mai/elephant-camp-finder
```

The first implementation should drop pageview or custom event data for:

```text
/api/*
/auth/*
/billing
/campaigns*
/dashboard*
/internal*
/login
/monitors*
/pricing
/signup
/tours*
/partners
/suppliers
/destination-partners
```

Reasoning:

- `/tours/{id}` pages are not public-safe for broad SEO or funnel analysis yet.
- B2B pages remain `noindex,nofollow`.
- Auth, billing, dashboard, campaign, monitor, and internal routes are not part of the tourist-facing planner funnel.

## 5. Approved event names

Use snake_case event names.

Approved events for the first implementation:

| Event | Trigger | Required properties |
| --- | --- | --- |
| `homepage_finder_entry_clicked` | User clicks homepage `Plan with RadarScout` link | `destination`, `surface`, `cta_id` |
| `finder_planner_choice_selected` | User selects a planner chip | `destination`, `step_id`, `choice_id`, `selection_mode` |
| `finder_planner_reset_clicked` | User clicks `Reset planner` | `destination`, `selected_step_count` |
| `finder_matching_experiences_clicked` | User clicks `See matching experiences` | `destination`, `style_id`, `group_id`, `time_id`, `preference_count` |
| `finder_recommendations_rendered` | Recommendation cards render after planner submission | `destination`, `result_count`, `top_card_category`, `has_summary` |
| `booking_partner_handoff_clicked` | User clicks a `Check availability` recommendation CTA | `destination`, `card_position`, `recommendation_category`, `handoff_type` |

Optional event:

| Event | Trigger | Required properties |
| --- | --- | --- |
| `finder_planner_viewed` | Planner section becomes visible | `destination`, `surface` |

Do not add generic event names such as `button_click`, `booking_click`, `payment_click`, or `availability_click`.

## 6. Approved property values

### `destination`

Allowed values:

```text
chiang-mai
```

Do not send free-form destination text.

### `surface`

Allowed values:

```text
homepage
chiang-mai-finder
```

### `cta_id`

Allowed values:

```text
homepage_plan_with_radarscout
finder_see_matching_experiences
recommendation_check_availability
```

### `step_id`

Allowed values:

```text
style
group
time
preferences
```

### `choice_id`

Allowed values are the deterministic planner option IDs already present in the Chiang Mai finder:

```text
gentle-elephant
family-half-day
cooking-food
nature-day
low-intensity
photo-friendly
solo
couple
family
friends
group
half-day
full-day
flexible-time
feeding
bathing-listed
ethical-priority
easy-pace
hotel-area-friendly
```

Do not send visible chip labels as analytics values.

### `selection_mode`

Allowed values:

```text
single
multi
```

### `style_id`, `group_id`, `time_id`

Allowed values are the selected option IDs from the matching planner step.

If a step has not been selected, use:

```text
not_selected
```

### `preference_count`

Allowed values:

```text
0
1
2
3
4
5
```

Do not send preference label arrays in the first implementation.

### `selected_step_count`

Allowed values:

```text
0
1
2
3
4
```

### `result_count`

Allowed values:

```text
0
1
2
3
```

### `top_card_category` and `recommendation_category`

Allowed values:

```text
elephant_care
cooking_or_food
nature_day_trip
other
```

### `card_position`

Allowed values:

```text
1
2
3
```

Do not send product title, supplier name, full URL, or raw Bókun product data.

### `handoff_type`

Allowed values:

```text
external_booking_partner
```

Do not use:

```text
booking_created
checkout_started
payment_started
availability_checked
```

## 7. Explicitly forbidden analytics payload data

Do not send:

- traveler name;
- email;
- phone;
- payment data;
- booking reference;
- exact hotel name;
- pickup address;
- raw free-form travel text;
- raw product descriptions;
- raw supplier data;
- raw Bókun payloads;
- full booking partner URL;
- Bókun backend identifiers that are not already part of a public, approved event contract;
- cookies or local storage values beyond the analytics provider's own anonymous session handling;
- IP address as a custom property;
- user account IDs;
- checkout, payment, confirmation, live availability, or inventory state.

## 8. Recommended code shape for future implementation

Create a small client-side analytics adapter instead of calling the analytics provider directly from UI components.

Suggested future files:

```text
apps/web/lib/analytics/radarscoutAnalytics.ts
apps/web/lib/analytics/radarscoutAnalytics.test.ts
apps/web/app/_components/RadarScoutAnalytics.tsx
```

Suggested responsibilities:

- expose typed functions such as `trackHomepageFinderEntryClicked`;
- map UI state into approved event names and approved properties;
- reject unknown event names;
- reject unknown property keys;
- normalize missing selections to `not_selected`;
- keep provider-specific imports isolated;
- make tests independent of the real analytics network.

Do not add a public `/api/analytics` endpoint in the first implementation.

## 9. Vercel Web Analytics guardrails for future implementation

If Vercel Web Analytics is approved, the implementation should:

- install `@vercel/analytics` only in the implementation PR;
- add the Analytics component only in a controlled app-level component;
- use `beforeSend` to drop events outside the approved route scope;
- avoid custom `eventEndpoint` unless a separate reason is reviewed;
- avoid server-side `track` for this first client funnel pass;
- test that private/internal route paths are filtered;
- test that `/tours*` and B2B pages are filtered;
- test that analytics code is disabled or mockable in test environments.

## 10. QA requirements for implementation PR

Future implementation must include tests for:

- homepage CTA tracking uses `homepage_finder_entry_clicked`;
- homepage CTA navigation still works;
- planner chip tracking uses `finder_planner_choice_selected`;
- planner chip payloads use option IDs, not labels;
- `See matching experiences` tracking uses selected IDs and preference count;
- recommendation render tracking sends only count and category;
- `Check availability` tracking sends only card position, category, destination, and `external_booking_partner`;
- full Bókun widget URLs are not sent;
- product titles are not sent;
- supplier names are not sent;
- unknown event names are rejected;
- unknown properties are rejected;
- private route pageviews are filtered;
- `/tours*` route pageviews are filtered;
- B2B route pageviews are filtered;
- no `/api/bokun` request is introduced;
- no OpenAI or LLM request is introduced;
- no checkout, payment, booking submission, live availability, or DB write behavior is introduced;
- SEO robots remain unchanged;
- sitemap output remains unchanged.

## 11. Preview smoke requirements

Future preview smoke must verify:

- homepage loads 200;
- homepage `Plan with RadarScout` link still points to `/chiang-mai/elephant-camp-finder`;
- Chiang Mai finder loads 200;
- finder robots remain `noindex,nofollow`;
- planner flow still works;
- recommendation cards still show `Check availability`;
- external handoff URLs remain unchanged;
- no `/api/bokun`, OpenAI, LLM, checkout, payment, booking, or DB write requests appear in the browser network log;
- analytics network calls, if present, contain only approved event names and approved low-cardinality properties.

## 12. Production gate

Analytics implementation must not be production deployed automatically.

Required production approval should name:

```text
TD-DEPLOY-ANALYTICS-FUNNEL-2-PRODUCTION
```

and the exact merge SHA to deploy.

## 13. Recommended next task

Recommended implementation task:

```text
TD-RADARSCOUT-ANALYTICS-FUNNEL-2-IMPLEMENT-LOW-RISK-TRACKING
```

Scope for that future task:

- implement only the approved event adapter and Vercel Web Analytics integration;
- no DB writes;
- no Prisma schema changes;
- no first-party analytics endpoint;
- no SEO changes;
- no sitemap changes;
- no Bókun API calls;
- no checkout, payment, booking submission, live availability, or inventory behavior;
- no ThaiEleHub or Shopify work.
