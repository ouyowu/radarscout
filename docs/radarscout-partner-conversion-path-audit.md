# RadarScout Partner Conversion Path Audit

## Task

`TD-RADARSCOUT-PARTNER-CONVERSION-PATH-0`

## Status

Docs-only audit. No application code, environment variables, database, schema, deployment, Bókun behavior, checkout, payment, inventory, or ThaiEleHub/Shopify work is changed by this document.

## Date

2026-07-02

## Purpose

RadarScout now has static B2B interest pages for partners, suppliers, and destination partners. This audit checks whether those pages are a safe short-term conversion path while the product remains focused on AI-guided discovery, itinerary planning, recommendation, and booking-partner handoff.

The goal is not to create a partner portal, supplier dashboard, booking engine, CRM, or transactional workflow. The goal is to confirm whether the current static pages can support early partner conversations without crossing RadarScout's product boundaries.

## Pages audited

| Page | Current purpose | Current CTA model | SEO state |
| --- | --- | --- | --- |
| `/partners` | Travel agents, hotels, concierges, planners, and creators interested in recommending Thailand experiences | `mailto:hello@radarscout.io` | `noindex,nofollow` |
| `/suppliers` | Local Thailand operators with public traveler-facing experience pages and booking partner paths | `mailto:hello@radarscout.io` | `noindex,nofollow` |
| `/destination-partners` | DMCs, local agencies, destination managers, and tourism teams organizing destination expertise | `mailto:hello@radarscout.io` | `noindex,nofollow` |

## Current implementation summary

The B2B pages use a shared static component:

- `apps/web/app/_components/PartnerInterestPage.tsx`
- `apps/web/app/_components/partnerInterestContent.ts`

Each route exports only a legal Next.js App Router page and metadata:

- `apps/web/app/partners/page.tsx`
- `apps/web/app/suppliers/page.tsx`
- `apps/web/app/destination-partners/page.tsx`

Current coverage is concentrated in:

- `apps/web/app/partners/__tests__/partnerPages.test.tsx`

The existing tests confirm:

- each page renders as a static page component
- each page keeps conservative `robots: { index: false, follow: false }`
- CTA links are `mailto:` only
- no DB, API, service-backed form, or `<form>` dependency is introduced
- crosslinks stay within the three B2B pages
- public copy avoids high-risk claims such as live availability, checkout, payment, Bókun backend wording, rates, commission, ratings, and reviews
- suppliers can send a public traveler-facing URL for manual handoff review

## Safety findings

Current B2B pages are safe for early use because they:

- collect interest only through `mailto:hello@radarscout.io`
- avoid login, accounts, portals, dashboards, forms, and backend submission
- avoid checkout, payment, cart, booking submission, live availability, and inventory behavior
- avoid Bókun API, Bókun backend, Bókun database, and Bókun-powered public wording
- set manual review expectations before any public recommendation
- make no guarantee of placement, leads, sales, availability, or acceptance
- keep SEO conservative with `noindex,nofollow`

## Conversion strengths

The current B2B path is useful now because:

- each audience has a distinct entry point
- the supplier page asks for a public traveler-facing URL, which supports RadarScout's handoff validation model
- copy explains that RadarScout helps organize traveler intent into guided discovery rather than replacing partner or operator workflows
- the static model keeps operational risk low while RadarScout validates partner interest
- related links help users choose the right B2B path without exposing consumer-facing tour pages or unsafe detail routes

## Current gaps

The pages are safe, but they are still a light lead path:

- no structured lead capture beyond email prompts
- no shared intake checklist document for manual review
- no clear internal workflow for triaging inbound partner email
- no partner qualification rubric
- no public examples of acceptable and unacceptable handoff URLs
- no analytics funnel review for B2B page visits or CTA clicks
- no CRM or lead status tracking, by design

These gaps are acceptable at the current stage. They should not be solved by adding a portal, dashboard, database-backed form, checkout, booking engine, or Bókun integration.

## Recommended next safe task

`TD-RADARSCOUT-PARTNER-CONVERSION-PATH-1`

Recommended scope:

Create a docs-only manual intake checklist for inbound B2B emails.

The checklist should cover:

- source page: partners, suppliers, or destination partners
- organization name
- contact person
- destination focus
- audience or traveler segment
- public traveler-facing URL
- public booking partner URL if available
- experience category
- safety/trust notes
- required manual checks before any recommendation
- explicit rejection criteria

This task should not add app code, forms, DB writes, schema changes, CRM, login, portal, Bókun API, checkout, payment, or deployment.

## Future implementation options

### Option A: Keep mailto-only and improve internal handling

Value:

- lowest operational risk
- no backend, DB, or privacy expansion
- enough for early partner conversations

Risk:

- manual workflow can become messy as volume grows

Safety gates:

- docs-only intake checklist first
- no automated claims
- no public accepted-partner language without manual review

### Option B: Add a static downloadable or visible intake checklist

Value:

- helps partners send better first emails
- still avoids backend form handling

Risk:

- too much process copy can make pages feel heavy

Safety gates:

- keep it short
- do not ask for private backend access, rates, commissions, inventory, payment data, or customer PII

### Option C: Add lightweight analytics later

Value:

- helps measure B2B page views and CTA clicks

Risk:

- expands privacy and tooling surface

Safety gates:

- separate analytics plan first
- no user accounts
- no partner CRM
- no hidden sensitive collection

### Option D: Add DB-backed lead capture later

Value:

- more structured lead triage

Risk:

- introduces DB writes, spam controls, privacy handling, and operational ownership

Safety gates:

- not now
- requires explicit approval
- requires privacy review, anti-spam handling, tests, and a clear owner workflow

## Do not build yet

Do not build these until explicitly scoped later:

- partner login
- agent portal
- supplier dashboard
- CRM
- DB-backed lead form
- traveler account
- checkout, payment, cart, or booking submission
- live availability or inventory behavior
- Bókun API, edit, sync, backend, database, or powered-by public wording
- partner rates, supplier net rates, commission language on tourist pages
- fake reviews, fake ratings, unverifiable awards, or guaranteed partner results

## Recommended task queue

1. `TD-RADARSCOUT-PARTNER-CONVERSION-PATH-1` — docs-only manual intake checklist
2. `TD-RADARSCOUT-PARTNER-CONVERSION-COPY-1` — optional static copy polish for the existing B2B pages
3. `TD-RADARSCOUT-B2B-CTA-SMOKE-1` — preview smoke for B2B page CTA behavior if copy changes
4. `TD-RADARSCOUT-ANALYTICS-FUNNEL-0` — docs-only analytics and conversion tracking plan
5. `TD-RADARSCOUT-LEAD-CAPTURE-0` — only if manually approved after email volume justifies it

## Current recommendation

Keep the current static B2B pages live as the short-term conversion path.

Next, create the manual intake checklist before adding any new UI or backend behavior. This preserves RadarScout's current safe boundary while improving partner operations.
