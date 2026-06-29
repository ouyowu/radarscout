# RadarScout conversion funnel audit

Task: `TD-RADARSCOUT-CONVERSION-FUNNEL-AUDIT-0`

Status: docs-only audit and next-task recommendation.

This document applies only to RadarScout. It does not apply to ThaiEleHub, Shopify theme work, Shopify product content, or Shopify checkout behavior.

## 1. Purpose

RadarScout now has the main pieces of a safe early funnel:

- homepage entry point
- Chiang Mai guided finder
- deterministic chat planner
- suggested itinerary summary
- recommendation cards
- external booking partner handoff
- static partner and supplier pages
- supplier link intake workflow and private intake template
- safe sitemap state with `/tours/{id}` excluded

The next decision should be based on the current conversion path rather than adding another feature blindly.

This audit maps the funnel, identifies gaps, and recommends small gated next tasks.

## 2. Current production funnel

### Traveler funnel

Current intended path:

```text
Homepage
-> Plan a Chiang Mai elephant day
-> /chiang-mai/elephant-camp-finder
-> Plan with RadarScout
-> choose planner chips
-> See matching experiences
-> recommendation cards
-> Check availability
-> external booking partner handoff
```

Current boundaries:

- RadarScout helps users compare and plan.
- RadarScout does not create bookings.
- RadarScout does not process checkout or payment.
- RadarScout does not claim live availability.
- Booking partners handle final availability, booking details, payment, and confirmation.

### Partner funnel

Current intended path:

```text
Static B2B pages
-> /partners, /suppliers, /destination-partners
-> mailto:hello@radarscout.io
-> manual email triage
-> manual supplier public link intake
-> future reviewed handoff consideration
```

Current boundaries:

- Partner pages remain `noindex,nofollow`.
- Partner pages use email-first intake.
- There is no backend form.
- There is no CRM.
- There is no partner portal or supplier dashboard.
- There is no database write.

## 3. Read-only production sample

Production sampling during this audit:

| URL | Status | Finding |
| --- | --- | --- |
| `https://radarscout.io/` | 200 | Homepage contains the finder link, `Plan with RadarScout`, and safe booking partner wording. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder remains `noindex`; planner text is present in the static response. |
| `https://radarscout.io/partners` | 200 | Page remains `noindex`; mailto CTA present. |
| `https://radarscout.io/suppliers` | 200 | Page remains `noindex`; mailto CTA present. |
| `https://radarscout.io/destination-partners` | 200 | Page remains `noindex`; mailto CTA present. |
| `https://radarscout.io/sitemap.xml` | 200 | 4 URLs; no `/tours/` URLs; no Chiang Mai finder URL. |

Important limitation:

The static HTML sample is not a complete proof of interactive CTA behavior. The `Check availability` recommendation CTA appears after client-side finder interaction, so browser smoke remains the correct verification method for that step.

## 4. What is working

Current strengths:

- The homepage now routes users into the core finder.
- The finder gives users a planning experience without LLM risk.
- The itinerary summary makes the flow feel more like a travel planner while staying deterministic.
- Recommendation cards remain tied to existing safe logic.
- External handoff wording stays clear.
- `/tours/{id}` URLs are excluded from sitemap.
- B2B pages exist but remain conservative and email-first.
- Supplier URL collection now has a manual workflow and private template before any implementation.

## 5. Current gaps

### Traveler funnel gaps

- No privacy-safe analytics event plan for the full traveler funnel.
- No click-through measurement from homepage to finder.
- No measurement for planner start, planner submit, recommendation display, or external handoff clicks.
- No controlled SEO opening has happened yet.
- Finder is still Chiang Mai-focused.
- `/tours/{id}` product-specific handoff remains blocked until verified public handoff URL sources exist.

### Partner funnel gaps

- No measurement for partner page views or mailto clicks.
- No structured private lead tracker in the repo.
- No approved real supplier public URLs are recorded for static registry work.
- No backend intake form, intentionally.
- No CRM, intentionally.

### Operational gaps

- Some older Paperclip issues can become stale if the queue is not reconciled after work is completed outside the local issue status.
- Codegraph MCP is currently unavailable in this session, so code discovery falls back to read-only file inspection.
- Vercel CLI has shown outdated-version warnings; upgrade can be handled later as a separate tooling maintenance task.

## 6. Measurement questions

Before adding analytics code, decide what RadarScout needs to answer.

Traveler questions:

1. How many homepage visitors click into the Chiang Mai finder?
2. How many finder visitors start the planner?
3. Which planner choices are most common?
4. How many users submit `See matching experiences`?
5. How many users reach recommendation cards?
6. How many users click external `Check availability` handoff?
7. Which recommendation cards receive handoff clicks?

Partner questions:

1. Which B2B pages get visited?
2. Which B2B page produces mailto clicks?
3. Are inquiries from travel agents, suppliers, or destination partners?
4. Do inbound emails include public traveler-facing URLs?
5. How many candidate links pass manual safety review?

Do not collect sensitive user or supplier data to answer these questions.

## 7. Safe future analytics boundaries

Allowed future event concepts:

- `homepage_finder_cta_click`
- `planner_start`
- `planner_choice_select`
- `planner_submit`
- `recommendation_card_impression`
- `external_handoff_click`
- `b2b_partner_mailto_click`
- `b2b_supplier_mailto_click`
- `b2b_destination_partner_mailto_click`

Allowed future properties:

- page path
- CTA label
- planner step name
- normalized planner choice key
- recommendation card key
- destination
- environment

Forbidden properties:

- traveler name
- email body
- email address typed by a visitor
- booking reference
- payment details
- checkout details
- supplier private rate
- partner rate
- commission
- private inventory state
- Bókun backend data
- raw supplier credentials

## 8. SEO state

Current staged SEO state is still conservative:

- homepage is public and links to the finder;
- `/chiang-mai/elephant-camp-finder` remains `noindex,nofollow`;
- B2B pages remain `noindex,nofollow`;
- `/tours/{id}` pages remain out of sitemap;
- sitemap contains only safe non-tour URLs.

There is already a separate controlled-opening decision document for the Chiang Mai finder.

Do not open indexing inside a conversion or analytics task.

## 9. Handoff state

Current safe handoff is strongest in the Chiang Mai finder recommendation flow.

Tour detail handoff remains blocked because product-specific external public URLs are not yet verified.

Do not implement `/tours/{id}` `Check availability` until:

- at least one real public traveler-facing URL is collected;
- the URL passes manual safety review;
- the URL source is explicit;
- tests prove products without verified handoff do not show external CTA;
- preview smoke can validate the behavior.

## 10. Recommended next tasks

### Option A: Traveler analytics docs

Task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PLAN-0
```

Scope:

- docs-only analytics event taxonomy for homepage, finder, planner, recommendation, and handoff.
- no analytics implementation.
- no third-party script.
- no DB.
- no deploy.

Value:

- Gives a safe implementation spec before adding tracking.

Risk:

- Low, if docs-only.

### Option B: Manual partner lead tracker template

Task:

```text
TD-RADARSCOUT-PARTNER-LEAD-TRACKER-TEMPLATE-0
```

Scope:

- docs-only private spreadsheet/template columns for inbound partner emails and supplier URL review.
- no backend form.
- no CRM.
- no DB.

Value:

- Converts partner page mailto inquiries into a repeatable manual process.

Risk:

- Low, if private and docs-only.

### Option C: SEO controlled opening preview spec

Task:

```text
TD-RADARSCOUT-SEO-READINESS-2-PREVIEW-SPEC
```

Scope:

- exact tests, preview smoke, rollback steps, and production gate for a future single-page finder opening.
- no robots change yet.

Value:

- Prepares the first SEO opening without opening it prematurely.

Risk:

- Medium, because it is close to an indexing change; keep docs-only first.

### Option D: Preview database blocker resolution plan

Task:

```text
TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-PLAN-0
```

Scope:

- docs-only operational plan for configuring Preview `DATABASE_URL`.
- no secret reads.
- no env writes.
- no deploy.

Value:

- Unblocks DB-backed preview smoke for future tour detail work.

Risk:

- Medium when implemented later; docs-only plan is low risk.

## 11. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-TRAVELER-FUNNEL-ANALYTICS-PLAN-0
```

Reason:

RadarScout now has a usable traveler path. The next implementation should not be another UI change until the project has a clear privacy-safe event taxonomy and verification plan.

This should be docs-only first.

## 12. Non-goals

This audit does not:

- add analytics;
- add tracking scripts;
- add cookies;
- change app code;
- change sitemap;
- change robots metadata;
- open `index,follow`;
- call Bókun API;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write to the database;
- change schema or environment variables;
- touch ThaiEleHub or Shopify files;
- deploy production.

## 13. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-conversion-funnel-audit.md
```

No app tests are required unless app code changes accidentally.
