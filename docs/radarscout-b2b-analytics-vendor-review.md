# RadarScout B2B analytics vendor review

Task: `TD-RADARSCOUT-B2B-ANALYTICS-VENDOR-REVIEW-0`

Date: 2026-06-28

## 1. Purpose

This document compares safe analytics options for RadarScout's B2B partner pages:

```text
/partners
/suppliers
/destination-partners
```

This is a review document only. It does not add analytics scripts, pageview tracking, event tracking, cookies, API routes, database writes, schema changes, environment variables, production deployment, SEO indexing, or any ThaiEleHub/Shopify work.

## 2. Current B2B baseline

Current B2B model:

- static interest pages;
- conservative `noindex,nofollow`;
- `mailto:hello@radarscout.io` intake;
- manual triage by the operator;
- no backend form;
- no CRM;
- no account/login;
- no agent portal;
- no supplier dashboard;
- no database write;
- no Bókun API, sync, edit, or backend wording.

Relevant existing documents:

- `docs/radarscout-b2b-analytics-plan.md`
- `docs/radarscout-partner-conversion-plan.md`
- `docs/radarscout-partner-conversion-next-steps.md`
- `docs/radarscout-partner-lead-triage-playbook.md`
- `docs/radarscout-partner-static-intake-design.md`

## 3. Measurement questions

RadarScout should eventually answer:

1. Are B2B pages being visited?
2. Which B2B page gets the most visits?
3. Do visitors click the `mailto:` CTA?
4. Which page produces useful partner emails?
5. Are inquiries mostly travel agents, suppliers, hotels, DMCs, or destination partners?
6. Does the current manual expectation copy reduce out-of-scope requests?
7. Is `mailto:` enough, or is a future structured intake flow justified?

These questions do not require immediate analytics implementation.

## 4. Vendor and approach options

### Option A: No analytics yet; manual inbox tracking only

Summary:

Continue with email-only intake and manual tracking in a private spreadsheet or notes file.

Value:

- zero implementation risk;
- no script;
- no cookie/privacy-policy work;
- no vendor dependency;
- no DB/schema/env changes;
- no accidental capture of personal data;
- enough to evaluate early B2B signal if inquiry volume is low.

Limitations:

- cannot measure pageviews;
- cannot measure abandoned interest;
- cannot measure CTA clicks unless the email is actually sent;
- relies on consistent manual triage.

Best use:

Use now while B2B traffic and outreach volume are still small.

### Option B: Vercel Web Analytics

Official reference:

- `https://vercel.com/docs/analytics`
- `https://vercel.com/docs/analytics/custom-events`

Summary:

Vercel Web Analytics is the lowest-friction platform-native option for a Vercel-hosted Next.js app. A future implementation could add page analytics and later custom events through the Vercel analytics package.

Value:

- native to the current hosting platform;
- likely lowest operational overhead;
- useful for pageview-level visibility;
- compatible with a future allowlisted custom-event wrapper;
- no RadarScout-owned event database required.

Risks and open questions:

- still adds a client analytics dependency/script;
- custom event design needs a strict allowlist;
- must confirm what routes are included or excluded before shipping;
- should not collect private email body, partner private data, booking details, or Bókun URLs;
- may require privacy-policy review before production.

Fit for B2B pages:

Good candidate if RadarScout wants simple pageview measurement first, especially because the app is already deployed on Vercel.

Not approved yet:

Do not add `@vercel/analytics` or event calls in this task.

### Option C: Plausible

Official reference:

- `https://plausible.io/data-policy`
- `https://plausible.io/docs/custom-event-goals`

Summary:

Plausible is a privacy-focused external analytics product. A future implementation could use it for pageviews and custom event goals.

Value:

- independent analytics dashboard;
- privacy-focused positioning;
- custom event goals could cover B2B CTA clicks;
- avoids creating a RadarScout-owned analytics database.

Risks and open questions:

- adds an external vendor and client script;
- adds a separate operational account and billing surface;
- requires explicit privacy-policy review;
- event names and properties still need a strict allowlist;
- may be unnecessary until B2B traffic is meaningful.

Fit for B2B pages:

Good alternative if RadarScout wants a vendor separate from Vercel, but higher operational overhead than the platform-native option.

Not approved yet:

Do not add Plausible scripts or custom events in this task.

### Option D: Vercel/server log review only

Summary:

Use deployment logs, request logs, or Vercel observability surfaces for technical health and rough route access checks without adding a client analytics script.

Value:

- lower client privacy risk;
- no front-end script;
- useful for checking route health and error rates;
- can stay read-only.

Limitations:

- poor visibility into client-side clicks;
- does not reliably answer mailto CTA engagement;
- not a clean product analytics layer;
- may be insufficient for partner conversion decisions.

Fit for B2B pages:

Acceptable as a technical health check, not as a full B2B conversion measurement tool.

## 5. Evaluation matrix

| Option | Pageviews | Mailto click tracking | Client script | DB/schema required | Operational overhead | Recommended now |
| --- | --- | --- | --- | --- | --- | --- |
| Manual only | No | Only if email arrives | No | No | Low | Yes |
| Vercel Web Analytics | Yes | Future custom event possible | Yes | No | Low | Later, after approval |
| Plausible | Yes | Future custom event possible | Yes | No | Medium | Later, after approval |
| Vercel/server logs | Limited | No | No | No | Low/medium | Only for technical checks |

## 6. Privacy and data guardrails

Any future analytics implementation must not collect:

- email body contents;
- sender name or personal contact details;
- traveler names;
- payment details;
- checkout details;
- booking references;
- supplier private rates;
- partner rate details;
- Bókun backend data;
- Bókun database content;
- Bókun credentials;
- exact hotel pickup addresses;
- free-form supplier/private notes.

Allowed future fields should be low-cardinality and non-personal:

- page path;
- B2B page type: `partners`, `suppliers`, `destination-partners`;
- CTA id;
- CTA label;
- environment;
- viewport class if privacy-safe;
- anonymous aggregate pageview counts.

## 7. Recommended decision

Recommended current decision:

```text
Do not add analytics yet.
Keep B2B intake manual until real inquiry volume or outreach activity justifies instrumentation.
```

Reasoning:

- current B2B pages are still conservative and `noindex,nofollow`;
- early partner signal can be tracked manually from email replies;
- adding analytics before meaningful B2B traffic creates privacy and operations work without enough benefit;
- no implementation should distract from the core traveler planner and controlled SEO opening path.

Recommended future implementation if tracking is approved:

```text
Start with Vercel Web Analytics pageviews only.
Do not add mailto click events until after a separate privacy-reviewed event spec.
```

Plausible remains a valid alternative if RadarScout later wants a standalone analytics dashboard, but it should be a deliberate vendor decision rather than a default.

## 8. Future implementation safety gates

Before adding any analytics implementation:

1. Confirm production SHA and target branch.
2. Create a fresh clean worktree.
3. Keep scope limited to RadarScout.
4. Do not touch ThaiEleHub or Shopify.
5. Confirm B2B pages remain `noindex,nofollow`.
6. Confirm `/tours/{id}` stays excluded from sitemap.
7. Confirm `/chiang-mai/elephant-camp-finder` is not added to sitemap unless separately approved.
8. Do not add DB/schema/env changes.
9. Do not add a backend event endpoint unless a separate database/storage design is approved.
10. Do not production deploy without explicit SHA approval.

## 9. Future task sequence

Recommended queue:

```text
TD-RADARSCOUT-B2B-ANALYTICS-VENDOR-REVIEW-0
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-SPEC
TD-RADARSCOUT-B2B-ANALYTICS-PAGEVIEW-INSTRUMENTATION-0
TD-RADARSCOUT-B2B-MAILTO-CLICK-INSTRUMENTATION-SPEC
TD-RADARSCOUT-B2B-MAILTO-CLICK-INSTRUMENTATION-0
TD-RADARSCOUT-B2B-ANALYTICS-OBSERVATION-0
```

Only the first task is completed by this document.

Do not skip the specification tasks before implementation.

## 10. Test plan for future instrumentation

If a future implementation adds analytics, tests should cover:

- analytics provider loads only on approved public routes;
- B2B pages remain `noindex,nofollow`;
- sitemap remains unchanged unless explicitly scoped;
- no `/tours/{id}` sitemap regression;
- no analytics collection on auth, dashboard, billing, internal, API, or campaign routes;
- no forbidden event names such as `booking`, `checkout`, `payment`, `availability`, or `commission`;
- no forbidden properties such as email body, private rates, booking references, or Bókun details;
- provider initialization can be disabled in test/development;
- no DB write is introduced unless separately approved.

## 11. Current status

Status:

```text
Review complete.
No analytics vendor selected for immediate implementation.
No tracking implemented.
No production deployment.
```

Recommended next action:

```text
Keep B2B analytics manual for now.
Prioritize production catch-up approval or controlled SEO opening preparation before analytics implementation.
```
