# RadarScout traveler funnel Plausible comparison

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-COMPARISON-1`

## 1. Why this comparison exists

RadarScout has an approved traveler funnel analytics event taxonomy, but the first planned Vercel Analytics implementation is blocked for now.

Current checked state on 2026-07-06:

- Vercel project: `ouyowus-projects / reddit-monitor`
- Vercel team plan from the Vercel API: `hobby`
- Official Vercel documentation currently marks custom events as available on Pro and Enterprise plans.

Because the current team is on Hobby, RadarScout should not implement Vercel custom-event tracking yet. The safe next step is to compare a privacy-focused external analytics option before changing app code.

This document is a planning comparison only.

It does not:

- install Plausible;
- install Vercel Analytics;
- add any analytics script;
- add custom events;
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

## 2. Source references

RadarScout source docs:

- `docs/radarscout-traveler-funnel-analytics-plan.md`
- `docs/radarscout-traveler-funnel-analytics-tool-selection.md`
- `docs/radarscout-analytics-instrumentation-spec.md`
- `docs/radarscout-traveler-funnel-analytics-preview-spec.md`

Official vendor docs checked on 2026-07-06:

- Vercel Web Analytics quickstart: `https://vercel.com/docs/analytics/quickstart`
- Vercel custom events: `https://vercel.com/docs/analytics/custom-events`
- Vercel analytics package configuration: `https://vercel.com/docs/analytics/package`
- Vercel Web Analytics privacy policy: `https://vercel.com/docs/analytics/privacy-policy`
- Plausible custom event tracking: `https://plausible.io/docs/custom-event-goals`
- Plausible Events API: `https://plausible.io/docs/events-api`
- Plausible data policy: `https://plausible.io/data-policy`
- Plausible product overview: `https://plausible.io/`

## 3. Current analytics requirement

RadarScout needs only a narrow traveler funnel view:

```text
Homepage
  -> Plan with RadarScout
  -> /chiang-mai/elephant-camp-finder
  -> planner chips
  -> See matching experiences
  -> recommendation cards
  -> Check availability
  -> external booking partner handoff
```

The first implementation must answer:

- Do users click from the homepage into the planner?
- Do users interact with the planner chips?
- Do users submit the planner?
- Do recommendation cards render after planner submission?
- Do users click the external booking partner handoff?

It must not collect:

- traveler names;
- emails;
- phone numbers;
- exact hotel names;
- pickup addresses;
- raw free-form travel text;
- full external booking partner URLs;
- Bókun backend data;
- checkout or payment state;
- live availability or inventory state.

## 4. Approved event taxonomy remains unchanged

Any future analytics implementation should keep the approved event names:

| Event | Trigger |
| --- | --- |
| `homepage_finder_entry_clicked` | Homepage CTA to the Chiang Mai finder |
| `finder_planner_choice_selected` | Planner chip selected or changed |
| `finder_planner_reset_clicked` | Planner reset clicked |
| `finder_matching_experiences_clicked` | `See matching experiences` clicked |
| `finder_recommendations_rendered` | Recommendation cards render after planner submission |
| `booking_partner_handoff_clicked` | `Check availability` external handoff clicked |
| `finder_planner_viewed` | Optional planner visible event |

Do not rename the event taxonomy just because the analytics vendor changes.

## 5. Vercel Analytics status

Vercel remains the preferred low-friction option if the account plan supports custom events.

Advantages:

- same platform as deployment;
- no new analytics vendor account if Web Analytics is enabled;
- official Next.js App Router package exists;
- `beforeSend` can filter analytics events;
- cookie-free anonymized Web Analytics model.

Current blocker:

- Current Vercel team plan checked through the Vercel API is `hobby`.
- Official Vercel docs currently mark custom events as Pro/Enterprise.

Recommendation:

Do not implement Vercel custom-event analytics until either:

1. the Vercel plan supports custom events; or
2. RadarScout intentionally chooses pageview-only Web Analytics without custom funnel events.

Pageview-only analytics would be less useful for the current funnel goal because it would not capture chip selections, planner submission, recommendation rendering, or external handoff clicks.

## 6. Plausible fit

Plausible is a reasonable alternative to evaluate because its public positioning and docs emphasize privacy-friendly, cookieless analytics, and its docs support custom events and custom properties.

Potential advantages:

- privacy-focused and cookieless positioning;
- custom event tracking is a first-class documented concept;
- custom properties can carry normalized event context;
- no RadarScout database writes are required;
- no Prisma schema changes are required;
- no Bókun API or booking backend integration is required.

Potential risks:

- adds a new vendor;
- may require a paid Plausible account depending on traffic and feature needs;
- adds a script to the public app;
- requires a privacy/legal copy review before production;
- requires a strict wrapper so components never send raw URLs, user text, product copy, or private booking data.

## 7. Plausible implementation boundary if selected later

If RadarScout later selects Plausible, the implementation should remain narrow:

Allowed routes:

```text
/
/chiang-mai/elephant-camp-finder
```

Do not track:

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

Do not track raw page content, user text, full external URLs, or booking partner query strings.

## 8. Suggested safe implementation shape

Use a small adapter so UI components do not call the vendor directly:

```text
apps/web/lib/analytics/radarscoutAnalytics.ts
apps/web/lib/analytics/radarscoutAnalytics.test.ts
apps/web/app/_components/RadarScoutAnalytics.tsx
```

Responsibilities:

- expose one function per approved event;
- map UI state to allowlisted property keys;
- drop events outside allowed routes;
- drop forbidden keys;
- avoid raw external URLs;
- avoid raw traveler text;
- no DB writes;
- no API route;
- no Bókun calls;
- no checkout/payment/booking state.

## 9. Required tests for any future Plausible PR

Future implementation tests must prove:

- only approved event names are emitted;
- event payloads use only allowlisted keys;
- full booking partner URLs are never sent;
- raw planner text is never sent;
- `/tours/*` routes are not tracked;
- B2B routes are not tracked;
- no `/api/bokun` call is introduced;
- no OpenAI or LLM call is introduced;
- no checkout/payment/booking submission request is introduced;
- no DB write is introduced;
- robots remain unchanged;
- sitemap remains unchanged.

## 10. Recommendation

Do not implement analytics code in the current task.

Recommended next step:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-DECISION-2
```

Decision required:

```text
Option A: upgrade or configure Vercel so custom events are available, then implement Vercel Analytics.
Option B: choose Plausible and implement the same approved event taxonomy through a strict adapter.
Option C: postpone custom analytics and continue product/SEO work without funnel instrumentation.
```

Default recommendation:

Choose `Option C` unless RadarScout is ready to pay for a privacy-friendly analytics tool or upgrade Vercel. Continue product work while keeping the analytics event taxonomy ready.

