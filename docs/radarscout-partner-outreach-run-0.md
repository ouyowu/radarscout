# RadarScout partner outreach run 0

Task: `TD-RADARSCOUT-PARTNER-OUTREACH-RUN-0`

Status: docs-only manual operator run sheet.

This document turns the current partner lead tracker, outreach templates, supplier link intake workflow, and partner operating pack into a first small manual outreach run.

This document does not send email, create automation, add CRM, create backend forms, write to the database, change schema or environment variables, call Bókun API, add checkout, add payment handling, create booking submission, change SEO, touch ThaiEleHub, run Shopify commands, or deploy production.

## 1. Source documents

Use this run sheet with:

- `docs/radarscout-partner-operating-pack.md`
- `docs/radarscout-partner-lead-tracker-template.md`
- `docs/radarscout-partner-outreach-email-templates.md`
- `docs/radarscout-supplier-link-intake-manual-workflow.md`
- `docs/radarscout-supplier-link-intake-static-template.md`

The source documents remain authoritative for tracker fields, email copy, and link review rules.

## 2. Run objective

Run a small manual outreach batch to collect real public traveler-facing partner or supplier URLs for future RadarScout handoff consideration.

The run is successful if the operator can answer:

- which leads were contacted;
- which template was used;
- which leads responded;
- which leads sent a public traveler-facing URL;
- which URLs need supplier link intake review;
- which leads should stop, clarify, or continue.

The run is not successful merely because many emails were sent. The useful output is reviewed evidence.

## 3. Batch size and audience

Start with a small batch:

```text
Batch size: 5 to 10 leads
Destination focus: Thailand
Preferred first destination: Chiang Mai
Secondary destinations: Bangkok, Pattaya, Phuket, Krabi, Khao Sok
Experience fit: elephant care, cooking, local food, nature day trip, family-friendly experience, gentle pace experience
```

Recommended first batch mix:

| Lead type | Count | Reason |
| --- | ---: | --- |
| Local operators or suppliers | 3 to 5 | Most likely to provide direct public experience pages. |
| Travel agents, hotels, or DMCs | 1 to 3 | Useful for demand and referral signal. |
| Destination partners | 1 to 2 | Useful for destination content and trust signal. |

Do not include broad global OTAs, unrelated software vendors, private rate wholesalers, or contacts whose only useful link is a backend or checkout page.

## 4. Lead selection checklist

Before contacting a lead, confirm:

- [ ] The organization appears relevant to Thailand travel experiences.
- [ ] The organization has a public website or public profile.
- [ ] The destination or experience category is visible or plausible.
- [ ] The lead does not require private backend access to evaluate.
- [ ] The lead does not require a commercial rate negotiation before a public URL can be reviewed.
- [ ] The lead can be logged in the private lead tracker.

Skip the lead if the first useful asset appears to be:

- supplier dashboard access;
- private admin access;
- checkout link;
- cart link;
- payment session;
- private rate sheet;
- partner rate sheet;
- commission sheet;
- inventory calendar;
- traveler personal data.

## 5. Pre-send tracker setup

Before sending any email, create a private tracker row using:

```text
docs/radarscout-partner-lead-tracker-template.md
```

Required pre-send fields:

- `Lead ID`
- `Received date` or `Outreach date`
- `Source page`: `manual outreach`
- `Lead type`
- `Organization name`
- `Public website`
- `Destination focus`
- `Experience category`
- `Supplier link intake status`: `not requested`
- `Current status`: `ready for outreach`
- `Owner`
- `Next action`

Do not store private credentials, traveler personal data, private rates, backend screenshots, or checkout URLs in the tracker.

## 6. Template selection

Use:

```text
docs/radarscout-partner-outreach-email-templates.md
```

| Lead situation | Template to use | Tracker update |
| --- | --- | --- |
| Travel agent, hotel, DMC | `Short intro for travel partners` | `Response template used`: travel partner intro |
| Supplier, local operator | `Short intro for suppliers or local operators` | `Response template used`: supplier intro |
| Destination organization | `Destination partner intro` | `Response template used`: destination partner intro |
| Unclear role | Ask for clarification before requesting a product URL. | `Current status`: waiting for clarification |

After sending, update:

- `Supplier link intake status`: `requested public URL` if a public URL was requested;
- `Current status`: `outreach sent`;
- `Last contacted date`;
- `Next follow-up date`;
- `Next action`: `wait for response` or `follow up once`.

## 7. Safe request language

The outreach should ask only for a public traveler-facing page.

Safe request:

```text
Could you share the public traveler-facing page for the experience you want RadarScout to review for possible recommendation handoff?
```

Safe boundary:

```text
RadarScout only reviews public pages that travelers can open without logging in. We do not need backend, supplier dashboard, checkout, private rate, commission, or inventory access.
```

Do not request:

- Bókun backend access;
- supplier dashboard access;
- private inventory access;
- checkout links;
- cart links;
- payment session links;
- supplier net rates;
- partner rates;
- commission sheets;
- login credentials.

## 8. Response handling

Use this table when a response arrives:

| Response received | Tracker status | Next action |
| --- | --- | --- |
| Public traveler-facing URL | `public URL received` | Copy URL into supplier link intake template. |
| Public website only, no product page | `needs clarification` | Ask for a specific public experience page. |
| Backend, admin, checkout, rate, or inventory link | `needs clarification` or `do not use` | Use public URL clarification request. |
| Requests a call | `ready for call` | Schedule only if relevant; do not promise implementation. |
| Unrelated offer | `rejected` or `closed` | Close with concise reason. |
| No response after one follow-up | `closed` or `low priority follow-up` | Do not continue repeated outreach. |

If unsafe data is received, set:

```text
Unsafe data present: yes
Do not use reason: private, backend, checkout, rate, inventory, or unrelated data received
```

Do not copy sensitive content into notes. Store only the reason category.

## 9. Public URL intake step

When a public traveler-facing URL is received, open a private intake record using:

```text
docs/radarscout-supplier-link-intake-static-template.md
```

Minimum fields for this run:

- `Record ID`
- `Review status`
- `Reviewer`
- `Review date`
- `Supplier or operator public name`
- `Experience name`
- `Destination`
- `Category`
- `Public traveler-facing URL`
- `Link type`
- `Contact source`
- `Pickup area mentioned`
- `Duration mentioned`
- `Food mentioned`
- `Age suitability mentioned`
- `Unsafe claims observed`
- `Decision rationale`

Only mark `approved for manual handoff consideration` after the full safety checklist passes.

Approval for manual handoff consideration does not approve app code, production copy, sitemap changes, SEO opening, or deployment.

## 10. Follow-up cadence

Use a conservative cadence:

```text
Day 0: send first outreach
Day 3 to 5: one follow-up if no response
Day 10 to 14: close or move to low priority if no response
```

Do not send repeated follow-ups beyond one follow-up unless the partner has already engaged.

Do not use automated drip sequences in this run.

## 11. Batch review

At the end of the run, summarize:

```text
Batch name:
Run dates:
Operator:
Total leads contacted:
Replies received:
Public traveler-facing URLs received:
URLs approved for manual handoff consideration:
URLs needing clarification:
URLs rejected or marked do not use:
Strongest destinations:
Strongest categories:
Recommended next action:
```

Recommended next action values:

- `continue manual outreach`
- `request clarification`
- `run supplier link intake`
- `prepare static registry spec`
- `pause until more public URLs are collected`
- `close weak leads`

## 12. Escalation gates

Create a separate task before:

- adding any collected URL to app code;
- creating a static handoff registry;
- changing recommendation cards;
- changing CTA behavior;
- adding forms, CRM, or backend submission;
- adding analytics instrumentation;
- changing database schema;
- changing environment variables;
- changing sitemap or robots metadata;
- deploying production.

The likely future implementation gate is:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY-SPEC
```

Only start that task after at least one real public traveler-facing URL is collected and approved for manual handoff consideration.

## 13. Stop conditions

Stop the outreach run if:

- a lead sends private credentials;
- a lead sends private rates, partner rates, or commission sheets;
- a lead sends backend, dashboard, checkout, cart, or payment links;
- a lead requests RadarScout to confirm bookings;
- a lead requests live inventory sync;
- a lead requires Bókun API access;
- a lead asks for unsupported public claims;
- the operator cannot identify a public traveler-facing page.

Stopping does not mean the lead is permanently rejected. It means the current run cannot safely proceed without a public traveler-facing URL or clearer scope.

## 14. Forbidden public claims

Do not turn outreach notes into public RadarScout copy that says:

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

These phrases may appear in internal guardrail documents only when they are clearly marked as forbidden or unsafe.

## 15. Example operator run

```text
Batch name: Chiang Mai supplier outreach run 0
Batch size: 8 leads
Destination focus: Chiang Mai
Experience categories: elephant care, cooking, local food, nature, family-friendly

Lead 001:
Lead type: local operator
Template: supplier/operator intro
Current status: outreach sent
Supplier link intake status: requested public URL
Next follow-up date: 2026-07-03

Lead 002:
Lead type: hotel
Template: travel partner intro
Current status: outreach sent
Supplier link intake status: requested public URL
Next follow-up date: 2026-07-03
```

If Lead 001 sends a public product page:

```text
Supplier link intake status: public URL received
Next action: create supplier link intake record
Unsafe data present: no
```

If Lead 002 sends a checkout or backend link:

```text
Supplier link intake status: needs clarification
Current status: waiting for public URL
Unsafe data present: yes
Do not use reason: non-public or unsafe link type
Next action: send public URL clarification request
```

## 16. Non-goals

This run does not:

- send emails automatically;
- scrape leads;
- enrich contacts;
- create CRM records;
- create database records;
- collect private partner terms;
- negotiate rates;
- approve commercial terms;
- add supplier links to RadarScout;
- change tour detail pages;
- change recommendation logic;
- add Bókun API access;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior.

## 17. Validation for this task

This is a docs-only task.

Required validation:

```bash
git diff --check -- docs/radarscout-partner-outreach-run-0.md
```

No app tests are required unless app code changes accidentally.
