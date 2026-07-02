# RadarScout Partner Manual Intake Checklist

## Task

`TD-RADARSCOUT-PARTNER-CONVERSION-PATH-1`

## Status

Docs-only manual workflow checklist. This document does not add app code, forms, database writes, schema changes, environment variables, Vercel changes, Bókun API calls, checkout, payment, booking submission, live availability, inventory behavior, or ThaiEleHub/Shopify work.

## Date

2026-07-02

## Purpose

RadarScout currently collects B2B partner, supplier, and destination-partner interest through static pages and `mailto:hello@radarscout.io`.

This checklist defines how to manually triage those inbound emails without creating a portal, dashboard, CRM, DB-backed form, checkout flow, booking engine, or Bókun integration.

## Scope

Use this checklist for inquiries from:

- `/partners`
- `/suppliers`
- `/destination-partners`

Do not use this checklist as proof that an inquiry is accepted, listed, recommended, bookable, available, or verified. It is only a manual intake and review workflow.

## Intake record

Create an internal note for each inquiry with:

| Field | Required | Notes |
| --- | --- | --- |
| Source page | Yes | `/partners`, `/suppliers`, or `/destination-partners` |
| Received date | Yes | Date the email arrived |
| Organization name | Yes | Public organization or operator name |
| Contact person | Yes | Name and email from the inquiry |
| Role type | Yes | Partner, supplier, destination partner, hotel, concierge, DMC, agency, creator, or local operator |
| Destination focus | Yes | Chiang Mai, Bangkok, Pattaya, Phuket, Thailand-wide, or other |
| Traveler audience | Preferred | Families, couples, solo travelers, groups, luxury, budget, educational, low-intensity, nature, food, culture |
| Experience category | Preferred | Elephant care, cooking, nature, cultural experience, transfer/day trip, wellness, custom itinerary, or other |
| Public traveler-facing URL | Required for suppliers | Product page, operator page, or booking partner page that a traveler can open |
| Public booking partner URL | Preferred | Only if the link is traveler-facing and safe to open |
| Claimed operating owner | Preferred | Who operates the experience |
| Contact preference | Preferred | Email, call, WhatsApp, or other |
| Internal owner | Yes | RadarScout person responsible for follow-up |
| Current status | Yes | New, needs info, rejected, manual review, candidate, approved for content draft, paused |

## First-pass classification

Classify each inquiry into one of these groups:

### Good-fit inquiry

The inquiry is potentially relevant when it has:

- a Thailand destination focus
- a clear traveler audience or experience type
- public traveler-facing details
- a public-safe booking or handoff path, if supplier/operator related
- no request to expose private rates, backend systems, inventory, or customer data
- no pressure to claim availability, instant confirmation, or guaranteed booking outcomes

### Needs-info inquiry

Mark as needs info when:

- destination is unclear
- public traveler-facing URL is missing
- experience details are too vague
- booking handoff path is missing or unclear
- operator identity is unclear
- traveler suitability or safety boundaries are missing

Ask for only public-safe details. Do not request private backend access, supplier rates, inventory exports, customer records, or payment data.

### Reject or pause

Reject or pause when the inquiry asks RadarScout to:

- process checkout, payment, cart, reservation, or booking submission
- claim live availability, available now, guaranteed slots, or instant confirmation
- access Bókun backend, Bókun database, Bókun supplier products, private inventory, or operator dashboards
- use partner rates, supplier net rates, commission terms, or private contracting language on tourist-facing pages
- publish fake ratings, fake reviews, unverifiable awards, or guaranteed results
- promote unsafe or unverifiable animal contact claims
- operate outside Thailand when the inquiry is not relevant to RadarScout's current direction

## Public URL review

For supplier and operator inquiries, check the public traveler-facing URL manually.

Required checks:

- URL loads without private login
- page is intended for travelers, not backend users
- experience title is clear
- destination is clear
- duration or approximate structure is clear
- included items are clear enough for traveler comparison
- pickup or meeting-point language is public-safe
- booking handoff path is visible if available
- page does not require RadarScout to claim live availability
- page does not require RadarScout to process payment or booking submission

Do not accept:

- screenshots of private dashboards as the only source
- private Bókun backend links
- spreadsheet exports of rates or inventory
- customer names, customer emails, traveler passports, payment references, or booking references
- content that requires RadarScout to invent missing product details

## Trust and content notes

Record public-safe trust signals only:

- operator public name
- official website or public booking page
- destination and neighborhood/area
- experience duration
- suitability notes
- intensity or pace
- language or guide notes if public
- public safety boundaries
- ethical or responsible-experience notes if supported by public copy
- photo guidelines if public

Do not record or publish:

- private supplier rates
- commissions
- backend status
- inventory counts
- customer reviews that cannot be verified
- fake ratings
- medical or safety guarantees
- guaranteed animal behavior
- guaranteed pickup unless the public page explicitly supports the claim

## Follow-up email templates

### Needs public link

```text
Thanks for reaching out to RadarScout. Before we can review the fit, please send a public traveler-facing page for the experience or destination offer you want us to check.

We can review public experience details and public booking partner links. Please do not send private backend access, supplier rates, inventory exports, customer records, or payment information.
```

### Needs destination and audience detail

```text
Thanks for your note. To understand the fit, please share the destination focus, traveler audience, and the type of Thailand experience you want RadarScout to help travelers compare.

Examples: Chiang Mai family elephant care, Bangkok day trip, low-intensity cooking experience, nature day trip, or destination partner portfolio.
```

### Not a fit

```text
Thanks for reaching out. RadarScout is focused on guided discovery and booking-partner handoff for Thailand experiences. We are not adding checkout, payment, live inventory, private backend access, supplier rate handling, or booking-engine workflows at this stage.

This inquiry is not a fit for the current RadarScout workflow.
```

## Manual status definitions

| Status | Meaning | Allowed next action |
| --- | --- | --- |
| New | Email received but not reviewed | First-pass classification |
| Needs info | Missing public-safe details | Send needs-info reply |
| Rejected | Outside current boundaries or unsafe request | Send not-a-fit reply or archive |
| Manual review | Public details exist and need human check | Review URL, content, and handoff path |
| Candidate | Looks relevant but not yet approved for public use | Prepare internal notes only |
| Approved for content draft | Human has approved drafting public-safe RadarScout copy | Draft copy in a separate task |
| Paused | Waiting on partner, policy, or product boundary decision | No publication |

## Publication guardrails

Before anything from an inquiry appears in RadarScout public UI, confirm:

- public traveler-facing source exists
- destination and experience category are clear
- RadarScout is not inventing products, availability, ratings, or reviews
- no private backend, rate, commission, inventory, or customer data is used
- no checkout, payment, cart, booking submission, or live availability behavior is added
- final CTA remains a safe booking partner handoff where applicable
- unsafe pages remain excluded from sitemap unless separately approved
- SEO `index,follow` is not opened as part of intake

## Escalation triggers

Escalate before proceeding if an inquiry requests:

- Vercel, database, or environment changes
- Prisma schema changes or DB writes
- Bókun API, Bókun edit, Bókun sync, or Bókun backend access
- private supplier rate handling
- commission display on tourist pages
- payment, checkout, cart, booking submission, or instant confirmation
- live availability, available now, guaranteed slot, or inventory claims
- login, agent portal, supplier dashboard, or traveler account
- use of ThaiEleHub assets, Shopify pages, or non-RadarScout project material

## Recommended next task

`TD-RADARSCOUT-PARTNER-CONVERSION-COPY-1`

Recommended scope:

- review whether the current static B2B pages should add a short visible "What to send us" section
- keep CTA as `mailto:hello@radarscout.io`
- do not add forms, DB writes, API routes, CRM, login, portal, dashboard, checkout, payment, Bókun API, live availability, or SEO indexing

If this task is not needed yet, continue with:

`TD-RADARSCOUT-ANALYTICS-FUNNEL-0`

as a docs-only plan for measuring homepage, finder, B2B pages, and booking-partner handoff behavior without adding tracking code yet.
