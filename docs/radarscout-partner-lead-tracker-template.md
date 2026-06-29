# RadarScout partner lead tracker template

Task: `TD-RADARSCOUT-PARTNER-LEAD-TRACKER-TEMPLATE-0`

Status: docs-only private tracker template.

Use this template in a private spreadsheet, private document, or internal note to track inbound partner, supplier, and destination partner interest.

This template does not create a backend form, CRM, database table, supplier portal, partner dashboard, public route, analytics implementation, or production workflow.

## 1. Purpose

RadarScout currently uses static partner pages and `mailto:hello@radarscout.io` for early B2B interest.

This tracker helps the operator answer:

- which partner page produced the lead;
- what kind of partner the lead is;
- whether the lead has a public traveler-facing URL;
- whether the lead is worth follow-up;
- whether supplier link intake should begin;
- whether a future structured form is justified.

The tracker is private operator workflow only.

## 2. Tracker columns

Suggested spreadsheet columns:

```text
Lead ID
Received date
Source page
Lead type
Organization name
Public website
Destination focus
Experience category
Public traveler-facing URL provided
Booking partner URL provided
Supplier link intake status
Lead fit score
Lead priority
Current status
Next action
Owner
Last contacted date
Next follow-up date
Response template used
Notes
Unsafe data present
Do not use reason
```

## 3. Allowed source page values

Use these values for `Source page`:

- `partners`
- `suppliers`
- `destination-partners`
- `manual outreach`
- `operator referral`
- `other`

Do not store full email tracking URLs or private referrer URLs in this field.

## 4. Lead type values

Use these values for `Lead type`:

- `travel agent`
- `hotel`
- `DMC`
- `local operator`
- `supplier`
- `destination partner`
- `content partner`
- `unknown`
- `out of scope`

If the lead is unclear, use `unknown` and request clarification.

## 5. Supplier link intake status values

Use these values for `Supplier link intake status`:

- `not requested`
- `requested public URL`
- `public URL received`
- `needs clarification`
- `approved for manual handoff consideration`
- `rejected`
- `do not use`

Only use `approved for manual handoff consideration` after the URL has passed the separate supplier link intake safety checklist.

## 6. Lead fit score

Use a simple score:

| Score | Meaning | Recommended action |
| --- | --- | --- |
| A | Strong fit; Thailand experience partner with public traveler-facing product pages. | Prioritize follow-up and supplier link intake. |
| B | Possible fit; relevant partner but missing public URL or destination detail. | Request clarification. |
| C | Weak fit; unclear relevance or not currently useful. | Low priority follow-up. |
| D | Out of scope or unsafe. | Reject or do not use. |

Do not use fit score as a public ranking, review, rating, or quality claim.

## 7. Current status values

Use these values for `Current status`:

- `new`
- `needs triage`
- `waiting for public URL`
- `waiting for clarification`
- `ready for call`
- `follow-up sent`
- `accepted for manual review`
- `rejected`
- `do not use`
- `closed`

## 8. Safe notes

Allowed notes:

- public website summary
- destination focus
- public product page exists or missing
- pickup, duration, food, or age suitability mentioned on a public page
- whether a public booking partner URL exists
- next operator action
- concise rejection reason

Avoid storing:

- traveler personal data
- private supplier rates
- partner rates
- commission sheets
- checkout session links
- payment details
- booking references
- Bókun backend URLs
- login credentials
- private inventory screenshots
- exact traveler pickup addresses

## 9. Safe response status examples

### Good lead

```text
Lead fit score: A
Current status: requested public URL
Next action: Ask for public traveler-facing product page.
Notes: Chiang Mai local operator with public website and relevant elephant care experience category.
```

### Needs clarification

```text
Lead fit score: B
Current status: waiting for clarification
Next action: Ask whether they represent the operator, travel agent, or booking partner.
Notes: Destination focus is Thailand, but product page is not yet provided.
```

### Unsafe link

```text
Lead fit score: D
Current status: do not use
Next action: Request a public traveler-facing URL only if the partner remains relevant.
Do not use reason: Submitted link appears to be an admin, checkout, private rates, or backend page.
```

## 10. Public URL handoff relationship

This lead tracker does not approve URLs for production use.

If a lead provides a public traveler-facing URL, copy the URL into the separate supplier link intake workflow:

- `docs/radarscout-supplier-link-intake-manual-workflow.md`
- `docs/radarscout-supplier-link-intake-static-template.md`

Do not use a URL in app code until it has passed manual safety review and a separate implementation task is approved.

## 11. Forbidden public claims

Do not turn tracker notes into public RadarScout copy that claims:

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

These terms may appear in private tracker guardrail notes only when they explain why a lead or URL is rejected.

## 12. Suggested manual workflow

1. Log the inbound email.
2. Identify the source page or source channel.
3. Assign lead type.
4. Assign initial fit score.
5. Check whether a public website or public traveler-facing URL is present.
6. If missing, request the public URL.
7. If received, run supplier link intake review.
8. Record follow-up status.
9. Keep notes concise and non-sensitive.
10. Close rejected or out-of-scope leads with a factual reason.

## 13. Future implementation gate

Do not build a backend form, CRM, or database lead tracker until manual tracking proves the need.

A future implementation task must first decide:

- which fields are necessary;
- whether any field is personal data;
- where data is stored;
- who can access it;
- retention and deletion process;
- spam prevention;
- whether email-only remains safer;
- whether a database schema change is required;
- whether production deploy is approved.

## 14. Non-goals

This template does not:

- add app code;
- create a public page;
- create an API endpoint;
- create a backend form;
- create a CRM;
- create a partner portal;
- create a supplier dashboard;
- write to the database;
- change schema or environment variables;
- change robots metadata;
- change sitemap;
- open SEO indexing;
- call Bókun API;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- touch ThaiEleHub or Shopify files;
- deploy production.

## 15. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-partner-lead-tracker-template.md
```

No app tests are required unless app code changes accidentally.
