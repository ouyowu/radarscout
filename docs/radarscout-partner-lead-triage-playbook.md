# RadarScout partner lead triage playbook

Task: `TD-RADARSCOUT-PARTNER-LEAD-TRIAGE-0`

## 1. Purpose

This playbook defines how RadarScout should manually review inbound partner, supplier, and destination-partner emails before any public recommendation or follow-up.

The process is intentionally manual for now. RadarScout should learn from real inbound emails before adding a backend form, CRM, supplier dashboard, or partner portal.

This playbook applies only to RadarScout. It does not apply to ThaiEleHub, Shopify theme work, Shopify product content, or Shopify checkout behavior.

## 2. Current intake model

Current B2B entry points:

- `/partners`
- `/suppliers`
- `/destination-partners`

Current intake channel:

- `mailto:hello@radarscout.io`

Current production note:

- Source-specific mailto prefill is merged and preview-passed in PR #89.
- Production deployment of that prefill still requires explicit approval for merge SHA `592204a0d1289cb0506cc24bad589e2d68449335`.

## 3. Lead categories

### Travel partner lead

Typical sender:

- travel agent
- hotel concierge
- travel planner
- affiliate-style content partner
- local guide who wants to recommend experiences

Primary question:

Can this partner introduce travelers to RadarScout or use RadarScout to compare trusted Thailand experiences?

### Supplier lead

Typical sender:

- local operator
- experience owner
- tour supplier
- activity provider

Primary question:

Can this supplier provide a public, traveler-safe experience page and booking handoff link that RadarScout can evaluate manually?

### Destination partner lead

Typical sender:

- DMC
- tourism board contact
- hotel group
- destination marketer
- local partnership manager

Primary question:

Can this organization help RadarScout improve destination coverage, trust, and experience curation without pushing RadarScout into inventory, checkout, or supplier backend work?

### Out-of-scope lead

Examples:

- asks RadarScout to process payment
- asks RadarScout to manage availability
- asks for supplier dashboard access
- asks for private net rates on public traveler pages
- asks for fake reviews, ratings, or awards
- asks to bypass public product details

Default action:

Do not progress. Send a boundary-setting reply or ignore obvious spam.

## 4. Minimum information checklist

Before scheduling a deeper conversation, try to collect:

- name
- organization
- role
- destination focus
- audience or traveler segment
- public website or product page
- public booking link if available
- experience category
- operating location
- contact email
- reason for contacting RadarScout

For suppliers, also collect:

- experience duration
- pickup or meeting-point model
- public inclusions and exclusions
- safety/trust notes
- photo/content rights status
- cancellation or booking partner policy, if publicly available

Do not ask for:

- payment card details
- traveler passport details
- private booking references
- supplier backend access
- Bókun login credentials
- private net rates for public display

## 5. First-pass scoring

Use a simple manual rating:

| Score | Meaning | Action |
| --- | --- | --- |
| A | Strong fit | Reply and request a short call or more public links |
| B | Possible fit | Reply with focused follow-up questions |
| C | Weak fit | Keep on file, no urgent follow-up |
| D | Out of scope | Decline or do not progress |

### A-fit signals

- Thailand-focused
- clear public experience pages
- responsible care or trust language where relevant
- public booking handoff exists
- traveler-facing copy is specific and verifiable
- no pressure to claim live availability
- no request for RadarScout to process checkout or payment

### D-fit signals

- no public proof of operation
- fake review or rating request
- guaranteed placement request
- asks RadarScout to edit Bókun backend data
- asks for checkout/payment handling
- asks for live inventory or availability display
- asks for private supplier rates in tourist-facing copy

## 6. Supplier trust checklist

For any supplier lead, manually check:

- public business identity
- public product or experience URL
- clear destination and meeting/pickup details
- clear duration
- clear inclusions
- clear exclusions
- safe traveler-facing booking path
- no fake ratings or unsupported review claims
- no unsupported guarantee language
- no hidden requirement for RadarScout to manage checkout, payment, or availability

If the supplier is an animal-related experience, also check for:

- no riding claims if relevant
- no show/performance claims if relevant
- animal welfare language
- clear activity descriptions
- no guaranteed animal behavior claims

## 7. Destination-partner fit checklist

For a destination partner, manually check:

- destination coverage relevance
- access to local operators or trusted experiences
- realistic content collaboration path
- ability to provide public information
- no demand for exclusive marketplace behavior
- no requirement for RadarScout to become a booking engine
- no request for private rates or commission terms on tourist pages

Good destination-partner conversations should focus on:

- coverage gaps
- trust signals
- content quality
- public booking handoff paths
- local experience categories
- traveler intent

## 8. Safe reply templates

### Travel partner reply

Subject:

`RadarScout partner inquiry`

Body:

```text
Hi [Name],

Thanks for reaching out. RadarScout helps travelers compare trusted Thailand experiences and continue with a booking partner when they are ready.

To understand the fit, could you send:

- your destination focus
- the traveler segments you work with
- the types of Thailand experiences you want to recommend
- any public website or example itinerary links

RadarScout does not process checkout, payment, live availability, or booking confirmation. Those remain with the public product page or booking partner.

Best,
RadarScout
```

### Supplier reply

Subject:

`RadarScout supplier inquiry`

Body:

```text
Hi [Name],

Thanks for sharing your experience with RadarScout.

Before we can evaluate it, please send:

- the public product or experience page
- destination and pickup or meeting-point details
- duration
- public inclusions and exclusions
- the customer-facing booking link
- any content or photo usage notes

RadarScout manually reviews supplier inquiries before any public recommendation. We do not manage supplier inventory, checkout, payment, booking confirmation, or Bókun backend data.

Best,
RadarScout
```

### Destination-partner reply

Subject:

`RadarScout destination partner inquiry`

Body:

```text
Hi [Name],

Thanks for contacting RadarScout.

For destination partnerships, we usually start by understanding:

- priority destination or region
- traveler segments
- experience categories
- public operator or product links
- trust signals that are visible to travelers
- preferred contact person

RadarScout focuses on discovery, comparison, itinerary guidance, and safe booking partner handoff. We do not operate checkout, payment, live availability, inventory, or supplier backend systems.

Best,
RadarScout
```

### Out-of-scope reply

Subject:

`RadarScout inquiry`

Body:

```text
Hi [Name],

Thanks for reaching out. This request is outside RadarScout's current scope.

RadarScout focuses on experience discovery, comparison, itinerary guidance, and booking partner handoff. We do not process payments, manage live availability, run supplier inventory, edit Bókun backend data, or create booking confirmations.

Best,
RadarScout
```

## 9. What not to promise

Do not promise:

- automatic listing
- guaranteed placement
- guaranteed ranking
- live availability
- available-now display
- instant confirmation
- checkout or payment inside RadarScout
- booking confirmation from RadarScout
- supplier dashboard access
- private net rate display
- public commission terms
- fake reviews
- fake ratings
- verified awards unless independently verified
- Bókun API sync
- Bókun backend editing

## 10. Manual triage workflow

Recommended manual flow:

1. Identify source page if the email includes a RadarScout source label.
2. Categorize the lead: partner, supplier, destination partner, or out of scope.
3. Check minimum information.
4. Assign A/B/C/D fit score.
5. Use a safe reply template.
6. If the lead is A-fit, request public links and a short call.
7. If supplier/product details are provided, review only public traveler-facing links.
8. Do not add products, pages, claims, or recommendations until a separate approved task exists.

## 11. Future automation guardrails

If RadarScout later adds CRM, intake forms, or analytics, that work must be scoped separately.

Future automation must not:

- write to the database without explicit approval
- add schema changes without explicit approval
- collect payment or checkout information
- create booking submissions
- call Bókun APIs
- sync inventory
- claim live availability
- add login, account, portal, or supplier dashboard behavior by default

The first safe automation step should be analytics or a static intake design document, not a backend lead database.

## 12. Recommended next tasks

Recommended sequence:

1. `TD-DEPLOY-PARTNER-CONVERSION-1-PRODUCTION` after explicit approval.
2. `TD-RADARSCOUT-PARTNER-CONVERSION-3-RESPONSE-COPY` for small static copy polish.
3. `TD-RADARSCOUT-B2B-ANALYTICS-PLAN-0` as docs-only.
4. `TD-RADARSCOUT-PARTNER-STATIC-INTAKE-DESIGN-0` as docs-only.

Do not start backend lead capture until real partner emails show that mailto-first triage is insufficient.
