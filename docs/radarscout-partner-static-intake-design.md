# RadarScout partner static intake design

Task: `TD-RADARSCOUT-PARTNER-STATIC-INTAKE-DESIGN-0`

## 1. Purpose

This document designs a possible future static intake form for RadarScout partner, supplier, and destination-partner inquiries.

This is not an implementation task. The current safest intake model remains:

- static B2B pages
- `mailto:hello@radarscout.io`
- manual inbox review
- manual lead triage
- no backend form
- no database writes
- no CRM
- no account, portal, or dashboard

The main decision is to keep RadarScout mailto-first until real partner inquiries prove that a structured form is needed.

## 2. Current B2B state

RadarScout has three static B2B entry points:

- `/partners`
- `/suppliers`
- `/destination-partners`

Related documents:

- `docs/radarscout-partner-conversion-next-steps.md`
- `docs/radarscout-partner-lead-triage-playbook.md`
- `docs/radarscout-b2b-analytics-plan.md`

Current model:

- B2B pages are static.
- B2B pages remain `noindex,nofollow`.
- Contact is email-first.
- Leads are reviewed manually.
- Partner/supplier/destination partner expectations are separated from tourist-facing product copy.

Current production gate:

- Partner mailto prefill is merged and preview-passed.
- Production deploy still requires explicit approval for merge SHA `592204a0d1289cb0506cc24bad589e2d68449335`.

## 3. Design decision

RadarScout should not build a backend partner intake form yet.

The safer next step is to use real inbound emails and the manual triage playbook before deciding whether form fields are necessary. A premature form would create privacy, spam, storage, and operational questions before RadarScout has enough partner demand to justify them.

If a form is built later, it should start as a static or email-generated intake experience, not as a database-backed system.

## 4. Audiences

### Travel partners

Examples:

- travel agents
- hotel concierges
- travel planners
- content partners
- local guides

Primary need:

Help travelers compare trusted Thailand experiences and continue with a booking partner.

### Suppliers

Examples:

- local operators
- experience owners
- activity providers
- tour suppliers

Primary need:

Share public product details and a traveler-safe booking handoff link for manual RadarScout review.

### Destination partners

Examples:

- DMCs
- tourism boards
- hotel groups
- destination marketing partners
- local partnership managers

Primary need:

Improve destination coverage, trust signals, and local experience curation without asking RadarScout to become a booking engine.

## 5. Non-goals and hard boundaries

Do not build in the intake phase:

- backend form submission
- API route
- database write
- Prisma schema change
- environment variable change
- CRM integration
- login or account system
- partner portal
- supplier dashboard
- product inventory management
- live availability or inventory sync
- checkout, payment, cart, or booking submission
- Bókun API call
- Bókun sync or product edit
- Bókun backend, database, or powered-by public wording
- LLM/OpenAI parsing
- ThaiEleHub or Shopify changes
- SEO `index,follow` opening
- sitemap changes

The form must never ask RadarScout to process availability, checkout, payment, confirmation, inventory, or supplier backend operations.

## 6. Possible future placement

If a static intake experience is approved later, the safest placements are:

- an embedded section on `/partners`
- an embedded section on `/suppliers`
- an embedded section on `/destination-partners`
- a separate `/partner-intake` page only if separately approved

Do not add new sitemap entries while these pages remain `noindex,nofollow`.

Do not add homepage or nav links in an intake task unless explicitly scoped.

## 7. Proposed field set

### Common fields

Use these fields for any partner type:

- name
- organization
- role
- contact email
- website or public profile
- destination focus
- inquiry type
- what you want to discuss
- acknowledgement that RadarScout does not process checkout, payment, live availability, booking confirmation, inventory, or supplier backend operations

### Partner-specific fields

For travel partners:

- traveler segment
- recommendation channel
- Thailand experience categories
- example itinerary or public website link
- expected collaboration model

### Supplier-specific fields

For suppliers:

- public product or experience URL
- customer-facing booking link
- destination or operating location
- duration
- pickup or meeting-point model
- public inclusions
- public exclusions
- content or photo rights status
- trust or safety notes

### Destination-partner fields

For destination partners:

- destination or region
- partner type
- priority experience categories
- local operator links
- public destination resources
- preferred contact person
- desired coverage gaps to discuss

## 8. Fields not to collect

Do not collect:

- payment card details
- passport or ID details
- traveler private data
- private booking references
- supplier backend access
- Bókun login credentials
- Bókun private data
- private net rates
- inventory counts
- availability calendars
- private commission terms
- confidential operator contracts

These fields would push RadarScout toward a booking engine, supplier backend, or CRM before the business need and data controls are clear.

## 9. Future form behavior options

### Option A: Stay mailto-first

Recommended now.

Behavior:

- B2B page CTA opens a prefilled email.
- Human reviews the inquiry manually.
- Manual triage playbook drives follow-up.

Value:

- lowest risk
- no storage
- no spam infrastructure
- no privacy policy expansion
- no backend maintenance

Risk:

- less structured inbound data
- more manual follow-up

### Option B: Static no-submit mock

Use only for design testing.

Behavior:

- fields render on the page
- no submit button, or submit disabled with clear explanatory copy
- no API calls
- no network write
- no data storage

Value:

- tests field clarity before implementation

Risk:

- users may expect a working form if copy is unclear

### Option C: Mailto-generated form

Potential next implementation if email volume grows.

Behavior:

- user fills fields locally
- submit generates a `mailto:` link with structured body text
- no backend API
- no database
- no CRM

Value:

- more structured emails while preserving email-first operations

Risk:

- browser and email-client behavior can be inconsistent

### Option D: Backend form

Future-only and not recommended until real partner demand exists.

Required before implementation:

- privacy review
- spam and rate-limit design
- data retention policy
- deletion process
- access-control model
- notification routing
- database schema approval
- explicit production deployment approval

## 10. Safe copy rules

Allowed wording:

- partner inquiry
- supplier interest
- destination partner
- trusted local experiences
- booking partner handoff
- public booking link
- manually reviewed
- contact RadarScout
- continue with a booking partner

Forbidden wording:

- live availability
- available now
- instant confirmation
- checkout
- payment
- booking complete
- reservation complete
- Bókun backend
- Bókun database
- Bókun-powered
- Bókun supplier products
- supplier net rate
- partner rate
- commission
- fake reviews
- fake ratings
- guaranteed placement
- guaranteed bookings

Safe helper copy example:

```text
RadarScout reviews partner inquiries manually. Please share public links and destination focus. RadarScout does not process checkout, payment, live availability, booking confirmation, inventory, or supplier backend operations.
```

## 11. Privacy and operations guardrails

Before any backend form is approved, define:

- what personal data is collected
- where it is stored
- who can access it
- how long it is retained
- how deletion requests are handled
- how spam is filtered
- whether a privacy policy update is required
- whether email-only remains sufficient

Manual spreadsheet tracking is acceptable before software automation if it avoids sensitive traveler, payment, or private supplier data.

## 12. Future implementation phases

### Phase 0: Design document

Current task.

Output:

- this document

No app changes.

### Phase 1: Static no-submit mock

Future task only after review.

Goal:

- test field clarity and page layout

Allowed:

- static UI
- no-submit prototype
- tests proving no API or DB behavior

Forbidden:

- backend form
- API route
- database write
- CRM integration

### Phase 2: Mailto-generated form

Future task only if real inquiries show that email structure is needed.

Goal:

- generate a structured email body from local form state

Allowed:

- client-side field validation
- `mailto:` output
- no data storage

Forbidden:

- server submit
- DB write
- analytics event unless separately approved

### Phase 3: Backend form

Future task only after explicit approval.

Required:

- privacy review
- spam/rate-limit plan
- access-control plan
- schema proposal
- deletion process
- production approval gate

### Phase 4: CRM or dashboard

Future-only and not recommended until real volume exists.

Do not build:

- partner portal
- supplier dashboard
- private rate tools
- inventory management
- availability sync
- booking engine

## 13. Future test plan

If a static intake UI is built later, tests should verify:

- intake section renders for the scoped page
- required field labels are visible
- forbidden fields are absent
- no `/api` request is made
- no DB write behavior exists
- no checkout, payment, booking, availability, inventory, or Bókun backend wording appears
- B2B pages remain `noindex,nofollow`
- sitemap does not include noindex B2B pages unless a separate SEO task changes that policy
- ThaiEleHub files remain untouched

If a mailto-generated form is built later, tests should also verify:

- generated email includes source page label
- generated email does not include sensitive fields
- generated email preserves public link fields
- fallback copy explains manual review

## 14. Recommended next task

Recommended immediate options:

1. Deploy partner mailto prefill only after explicit approval for merge SHA `592204a0d1289cb0506cc24bad589e2d68449335`.
2. If production deploy remains gated, do `TD-RADARSCOUT-PARTNER-CONVERSION-3-RESPONSE-COPY` as a small static copy task.
3. Do not start a backend form, CRM, or partner dashboard.

The recommended form decision remains:

```text
Stay mailto-first now.
Consider a mailto-generated structured intake only after real partner emails show repeated missing information.
```
