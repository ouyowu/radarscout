# RadarScout supplier link intake manual workflow

Task: `TD-RADARSCOUT-SUPPLIER-LINK-INTAKE-MANUAL-WORKFLOW-0`

Status: docs-only manual workflow proposal.

## 1. Purpose

RadarScout needs a safe way to collect public supplier and booking partner URLs before any tour handoff link is used in recommendations.

This workflow supports RadarScout's current product boundary:

- RadarScout owns discovery, comparison, itinerary planning, trust review, and booking partner handoff.
- Suppliers and booking partners own availability, checkout, payment, confirmation, and inventory.

This document does not approve any URL for production use. It defines a manual intake process only.

## 2. What can be collected

Allowed link types:

- public supplier product page
- public operator experience page
- public booking partner product page
- public destination partner page describing a specific experience
- public information page that explains what is included in the experience

Do not collect:

- private admin URLs
- Bókun dashboard/backend URLs
- checkout URLs
- cart URLs
- payment session URLs
- login-protected supplier portals
- unpublished draft pages
- spreadsheet links containing private rates or internal inventory

## 3. Intake fields

For each candidate link, collect:

- Supplier or operator public name
- Experience name
- Destination
- Public traveler-facing URL
- Link type
- Contact person
- Contact email
- Notes about what the page says is included
- Whether the page mentions pickup area, duration, food, or age suitability
- Whether the page makes any unsafe claims
- Reviewer name
- Review date
- Review status

Suggested review status values:

- `new`
- `needs clarification`
- `approved for manual handoff consideration`
- `rejected`
- `do not use`

## 4. Manual workflow

### Step 1: Request the public URL

Ask the supplier for the traveler-facing page they want RadarScout to check.

Safe request wording:

```text
Please send the public traveler-facing page for the experience you want RadarScout to review for possible recommendation handoff. RadarScout will manually check the page before using it in any recommendation.
```

Avoid asking for:

- supplier backend access
- private inventory access
- net rates
- partner rates
- commission sheets
- checkout links
- live availability calendars

### Step 2: Record the candidate link

Add the link to the manual intake tracker.

The tracker can be a private document, spreadsheet, or internal note. This task does not add a database table, form backend, CRM integration, or automated submission endpoint.

### Step 3: Perform the safety check

Before a link can be used, manually verify:

- the URL loads publicly
- the page is traveler-facing
- the page describes a real experience
- the page does not require supplier login
- the page does not expose private rates or backend fields
- the page does not claim live availability unless the booking partner page itself controls availability
- the page does not contain fake reviews, fake ratings, or unverifiable awards
- the page does not imply RadarScout takes payment or confirms bookings

### Step 4: Record decision and rationale

For every candidate URL, record:

- decision
- reason
- reviewer
- date
- any required supplier clarification

If rejected, keep the reason concise and factual.

### Step 5: Use only approved links in future implementation

Approved links can be considered for later static registry or manual handoff implementation.

Approval for manual handoff consideration does not mean:

- the link has live availability
- RadarScout can confirm bookings
- RadarScout owns checkout
- RadarScout has synced supplier inventory
- RadarScout has Bókun API access

## 5. Safety checklist

Before marking a link as approved for manual handoff consideration, confirm:

- [ ] URL is public
- [ ] URL is traveler-facing
- [ ] URL is not an admin, backend, cart, checkout, or payment URL
- [ ] URL is not a private rates sheet
- [ ] URL describes a real experience
- [ ] URL does not expose supplier backend language
- [ ] URL does not require login
- [ ] URL does not make fake availability claims
- [ ] URL does not include fake reviews or fake ratings
- [ ] URL does not imply RadarScout confirms bookings
- [ ] URL can be safely used behind `Check availability` or `Continue with booking partner`

## 6. Forbidden wording for RadarScout public pages

Do not use these phrases in tourist-facing RadarScout copy:

- live availability
- available now
- guaranteed slot
- instant confirmation
- checkout
- payment
- reservation complete
- booking complete
- Bókun backend
- Bókun database
- Bókun-powered
- Bókun supplier products
- supplier net rate
- partner rate
- commission
- fake reviews
- fake ratings

## 7. Allowed wording for RadarScout public pages

Allowed wording:

- guided discovery
- compare experiences
- trusted local experiences
- booking partner
- partner-direct handoff
- Check availability
- Continue with booking partner
- Plan with RadarScout

## 8. Example intake record

```text
Supplier public name: Example Chiang Mai Nature Care
Experience name: Gentle elephant care and local lunch
Destination: Chiang Mai
Public traveler-facing URL: https://example.com/chiang-mai/gentle-elephant-care
Link type: Supplier product page
Contact person: Supplier contact name
Contact email: supplier@example.com
Included details observed: duration, lunch, transfer area
Unsafe claims observed: none
Reviewer: RadarScout operator
Review date: 2026-06-29
Review status: approved for manual handoff consideration
Rationale: Public traveler-facing page with clear experience details and no checkout/backend/private-rate exposure.
```

## 9. Future implementation path

Recommended next tasks after this workflow is reviewed:

1. `TD-RADARSCOUT-SUPPLIER-LINK-INTAKE-STATIC-TEMPLATE-1`
   - Create a private template for manual supplier link intake.
   - No app code.
   - No DB.

2. `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY`
   - Only after at least one real public URL is collected and manually approved.
   - Static registry only.
   - No Bókun API.
   - No live availability.

3. `TD-RADARSCOUT-SUPPLIER-LINK-INTAKE-FORM-DOCS-2`
   - Document a possible future contact form.
   - Do not implement backend submission yet.

## 10. Non-goals

This workflow does not:

- create a supplier portal
- create a partner dashboard
- create a backend form
- write to the database
- call Bókun API
- sync inventory
- check live availability
- create checkout
- process payment
- confirm bookings
- edit production routes
- change SEO indexing
- deploy production

## 11. Validation for this task

This is a docs-only task.

Required validation:

```bash
git diff --check -- docs/radarscout-supplier-link-intake-manual-workflow.md
```

No app tests are required unless app code changes accidentally.
