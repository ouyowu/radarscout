# RadarScout traveler funnel analytics tool selection

Task: `TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-TOOL-SELECTION-0`

Status: docs-only tool comparison and recommendation.

This document compares analytics options for RadarScout's traveler funnel. It does not install, configure, or implement analytics.

This document applies only to RadarScout. It does not apply to ThaiEleHub, Shopify theme work, Shopify product content, or Shopify checkout behavior.

## 1. Source docs checked

Checked on 2026-06-29:

- Vercel Web Analytics docs: `https://vercel.com/docs/analytics`
- Vercel custom events docs: `https://vercel.com/docs/analytics/custom-events`
- Plausible custom events docs: `https://plausible.io/docs/custom-event-goals`
- Plausible custom properties docs: `https://plausible.io/docs/custom-props/introduction`

Relevant takeaways:

- Vercel Web Analytics supports pageview reporting and custom events, but custom events are plan-gated and should be checked against the current Vercel plan before implementation.
- Plausible supports custom event goals and custom properties, with explicit privacy limits and restrictions on personally identifiable information.
- Both options still require a separate implementation task before any script, package, or event call is added.

## 2. Current RadarScout requirement

RadarScout needs to understand the traveler funnel:

```text
Homepage
-> Chiang Mai finder
-> deterministic planner choices
-> See matching experiences
-> itinerary summary
-> recommendation cards
-> external Check availability handoff
```

The analytics approach must preserve the current product boundary:

- no checkout;
- no payment;
- no booking submission;
- no live availability;
- no inventory behavior;
- no Bókun API;
- no DB/schema/env change unless explicitly approved later;
- no SEO `index,follow` opening;
- no ThaiEleHub or Shopify work.

## 3. Decision criteria

Compare tools against:

| Criterion | Why it matters |
| --- | --- |
| Privacy posture | RadarScout should not collect personal traveler or supplier data. |
| Event support | The funnel needs click and planner-step events, not only pageviews. |
| Property controls | Event payloads must use normalized keys and avoid raw URLs or personal data. |
| Implementation risk | The first implementation should be easy to preview, audit, and roll back. |
| Cookie behavior | Avoid introducing cookie or consent complexity unless explicitly approved. |
| Cost and plan risk | Avoid building around a feature that is unavailable on the current plan. |
| Operational overhead | The setup should be manageable by the operator. |
| Rollback simplicity | Removing analytics should not require DB rollback or schema migration. |

## 4. Option A: No analytics yet

Description:

Do not add analytics. Continue using manual observation, Vercel deployment logs, and operator judgment.

Value:

- zero implementation risk;
- no privacy risk from analytics;
- no new script;
- no cookies;
- no vendor decision;
- no deployment required.

Limitations:

- cannot answer funnel click-through questions;
- cannot measure planner engagement;
- cannot measure external handoff clicks;
- cannot compare mobile and desktop behavior;
- decisions remain based on manual smoke and anecdotal feedback.

Recommended use:

Keep this as the default until an implementation task is explicitly approved.

## 5. Option B: Server log review only

Description:

Use server/platform request logs only for coarse page-level visibility.

Value:

- no client-side event script;
- can confirm requests to pages such as `/` and `/chiang-mai/elephant-camp-finder`;
- lower privacy risk than client-side event payloads if logs are used carefully.

Limitations:

- cannot measure client-side planner chip selection;
- cannot measure `See matching experiences`;
- cannot measure recommendation card impressions;
- cannot measure outbound `Check availability` clicks unless a redirect endpoint is added, which is not recommended now;
- log retention and access may vary by platform/tooling.

Risk:

- low for read-only manual review;
- higher if a redirect endpoint or custom server event pipeline is introduced later.

Recommendation:

Useful as a temporary baseline, not sufficient for the full traveler funnel.

## 6. Option C: Vercel Web Analytics

Description:

Use Vercel's platform-native analytics for pageviews and possibly custom events.

Potential value:

- platform-native for a Vercel-hosted Next.js app;
- low operational overhead compared with running analytics infrastructure;
- can support page-level measurement;
- custom events may support funnel event tracking if available on the current plan.

Risks and checks:

- custom events are plan-gated, so confirm availability before implementation;
- implementation still requires adding package/script/event calls;
- event payloads need strict allowlist tests;
- do not send raw external handoff URLs, traveler data, or supplier private data.

Good fit if:

- the current Vercel plan supports the needed custom events;
- RadarScout wants a platform-native first implementation;
- the implementation is limited to the event taxonomy in `docs/radarscout-traveler-funnel-analytics-plan.md`.

Not acceptable if:

- it requires collecting personal data;
- it requires opening SEO indexing;
- it requires DB/schema/env changes;
- it cannot track the needed custom events on the current plan.

## 7. Option D: Plausible

Description:

Use Plausible for privacy-focused analytics, pageviews, and custom events.

Potential value:

- privacy-focused analytics model;
- supports custom events and custom properties;
- can measure CTA clicks and planner events if implemented carefully;
- may offer clearer event/property reporting for the funnel.

Risks and checks:

- adds an external analytics vendor;
- requires script/package integration;
- custom properties must avoid personally identifiable information;
- cost/account setup and domain configuration need separate approval;
- consent and privacy policy implications should be reviewed before production.

Good fit if:

- RadarScout prefers privacy-focused analytics outside Vercel;
- custom event/property visibility is more important than platform-native simplicity;
- the operator is comfortable managing a separate analytics account.

Not acceptable if:

- it leads to tracking personally identifiable data;
- it adds broad third-party scripts without review;
- it increases operational overhead before there is enough traffic to justify it.

## 8. Option E: First-party event endpoint

Description:

Build a RadarScout-owned event endpoint and store event records.

Potential value:

- maximum control over event schema;
- can enforce server-side payload validation;
- avoids sending data to a third-party analytics provider.

Risks:

- requires API route work;
- likely requires DB writes or log storage;
- introduces schema, retention, deletion, abuse/spam, and privacy responsibilities;
- higher maintenance burden;
- higher risk of accidentally storing personal data.

Recommendation:

Do not choose this now.

This option is only appropriate after a separate privacy/data-retention design task and explicit approval for DB/schema/env changes.

## 9. Recommended decision

Recommended near-term decision:

```text
Do not implement analytics yet.
Prepare a Vercel Web Analytics preview-only implementation spec first, with Plausible as the comparison fallback.
```

Reasoning:

- RadarScout is already hosted on Vercel, so Vercel Web Analytics is the lowest-operational-overhead candidate if the required custom events are available on the current plan.
- Plausible remains a strong privacy-focused fallback if Vercel custom events are unavailable or insufficient.
- A first-party event endpoint is too much infrastructure for the current stage.
- No analytics remains acceptable until implementation is explicitly approved.

## 10. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PREVIEW-SPEC-1
```

Scope:

- docs-only preview implementation spec for Vercel Web Analytics;
- confirm exact event names and payload allowlist;
- define tests for forbidden properties;
- define preview smoke steps;
- define rollback steps;
- do not install packages or write code yet.

Alternative next task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-COMPARISON-1
```

Use this only if the Vercel plan does not support the needed event tracking.

## 11. Future implementation gate

Before adding analytics code, require:

1. explicit approval for the selected tool;
2. exact event names;
3. exact allowed properties;
4. test coverage for forbidden properties;
5. preview-only deployment;
6. network audit proving no Bókun, OpenAI, checkout, payment, booking, or DB-write behavior is introduced;
7. production deploy approval after preview smoke.

## 12. Forbidden data and behavior

Do not collect:

- traveler name;
- email address;
- phone number;
- hotel name;
- exact pickup address;
- exact location;
- booking reference;
- payment details;
- checkout session ID;
- cart state;
- supplier private rate;
- partner rate;
- commission;
- Bókun backend data;
- Bókun credentials;
- raw inventory data;
- tokenized external URLs.

Do not add:

- checkout;
- payment;
- booking submission;
- live availability;
- inventory behavior;
- Bókun API calls;
- DB/schema/env changes;
- SEO `index,follow` opening;
- ThaiEleHub or Shopify changes.

## 13. Non-goals

This task does not:

- install Vercel Web Analytics;
- install Plausible;
- add a tracking script;
- add analytics event calls;
- add cookies;
- add an API endpoint;
- write to the database;
- change schema or environment variables;
- change robots metadata;
- change sitemap;
- open SEO indexing;
- deploy production.

## 14. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-traveler-funnel-analytics-tool-selection.md
```

No app tests are required unless app code changes accidentally.
