# RadarScout partner operating pack

Task: `TD-RADARSCOUT-PARTNER-OPERATING-PACK-0`

Status: docs-only operator checklist.

This pack gives the RadarScout operator one safe workflow for partner outreach, lead tracking, public URL intake, and future handoff consideration.

This document does not add app code, backend forms, CRM, database writes, Bókun API access, checkout, payment, booking submission, live availability, inventory behavior, SEO changes, or deployment.

## 1. Source documents

Use these documents together:

- `docs/radarscout-partner-lead-tracker-template.md`
- `docs/radarscout-partner-outreach-email-templates.md`
- `docs/radarscout-supplier-link-intake-manual-workflow.md`
- `docs/radarscout-supplier-link-intake-static-template.md`

This operating pack is an index and checklist. The source documents remain the detailed templates.

## 2. Operating principle

RadarScout should only collect and review public traveler-facing partner links.

RadarScout should not request or use:

- supplier dashboard access
- Bókun backend links
- private admin links
- checkout links
- cart links
- payment session links
- private rate sheets
- partner rate sheets
- commission sheets
- live inventory calendars
- login credentials
- private supplier data

## 3. High-level workflow

```text
New lead or outreach target
-> record in partner lead tracker
-> send correct outreach template
-> request public traveler-facing URL if relevant
-> run supplier link intake if URL is received
-> approve, reject, or request clarification
-> only approved links may be considered in a future implementation task
```

No step in this workflow approves production app changes.

## 4. Step 1: Log the lead

Use:

```text
docs/radarscout-partner-lead-tracker-template.md
```

Required fields:

- `Lead ID`
- `Received date`
- `Source page`
- `Lead type`
- `Organization name`
- `Public website`
- `Destination focus`
- `Experience category`
- `Supplier link intake status`
- `Lead fit score`
- `Current status`
- `Next action`

Safe defaults:

- `Supplier link intake status`: `not requested`
- `Current status`: `needs triage`
- `Lead fit score`: blank until reviewed

Stop immediately if the lead includes:

- private credentials
- checkout links
- payment links
- private rate sheets
- supplier dashboard links
- Bókun backend links
- sensitive traveler data

Record only a concise `Do not use reason`. Do not copy sensitive data into tracker notes.

## 5. Step 2: Classify the lead

Use this mapping:

| Lead signal | Lead type | Next action |
| --- | --- | --- |
| Travel agent, hotel, or DMC inquiry | `travel agent`, `hotel`, or `DMC` | Use travel partner outreach template. |
| Local operator or supplier | `local operator` or `supplier` | Use supplier/operator public page request. |
| Destination organization or local tourism partner | `destination partner` | Use destination partner template. |
| Unclear sender role | `unknown` | Ask for clarification. |
| Private rates, checkout, backend, or unrelated services | `out of scope` | Reject or mark `do not use`. |

Do not create public claims from lead type or fit score.

## 6. Step 3: Send the right outreach template

Use:

```text
docs/radarscout-partner-outreach-email-templates.md
```

Template selection:

| Situation | Template |
| --- | --- |
| Travel agent, hotel, DMC | `Short intro for travel partners` |
| Supplier, operator, local experience provider | `Short intro for suppliers or local operators` |
| Destination organization | `Destination partner intro` |
| Unsafe or unclear link received | `Public URL clarification request` |
| Public URL received | `Follow-up after public URL received` |
| Unsafe or unusable URL | `Rejection for unsafe or out-of-scope link` |
| Call requested | `Call scheduling reply` |

After sending, update:

- `Response template used`
- `Current status`
- `Next action`
- `Last contacted date`
- `Next follow-up date`

## 7. Step 4: Request only public traveler-facing URLs

Acceptable requested links:

- public supplier product page
- public operator experience page
- public booking partner product page
- public destination partner page for a specific experience
- public information page that explains what is included

Do not request:

- supplier backend access
- private inventory access
- net rates
- partner rates
- commission sheets
- checkout links
- live availability calendars

If a partner sends an unsafe link, use the clarification template and mark:

- `Supplier link intake status`: `needs clarification`
- `Unsafe data present`: `yes`
- `Current status`: `waiting for public URL`

## 8. Step 5: Run supplier link intake

Use:

```text
docs/radarscout-supplier-link-intake-manual-workflow.md
docs/radarscout-supplier-link-intake-static-template.md
```

Minimum review fields:

- supplier or operator public name
- experience name
- destination
- category
- public traveler-facing URL
- link type
- whether pickup area is mentioned
- whether duration is mentioned
- whether food is mentioned
- whether age suitability is mentioned
- unsafe claims observed
- reviewer
- review date
- review status
- decision rationale

Review statuses:

- `new`
- `needs clarification`
- `approved for manual handoff consideration`
- `rejected`
- `do not use`

## 9. Step 6: Approve, reject, or clarify

Only mark a URL as `approved for manual handoff consideration` if:

- URL loads publicly
- URL is traveler-facing
- URL does not require login
- URL describes a real experience
- URL does not expose backend, admin, checkout, payment, private rate, commission, or inventory data
- URL does not make fake availability claims
- URL does not include fake reviews or fake ratings
- URL does not imply RadarScout confirms bookings
- URL can safely sit behind future copy such as `Check availability` or `Continue with booking partner`

Approval does not mean:

- the link has live availability
- RadarScout can confirm bookings
- RadarScout owns checkout
- RadarScout processes payment
- RadarScout has synced supplier inventory
- RadarScout has Bókun API access
- the link is approved for production app code

## 10. Step 7: Decide the next product action

Use this decision table:

| Current evidence | Next action |
| --- | --- |
| No public URL received | Continue manual outreach or close lead. |
| Unsafe or private URL received | Reject or request public URL. |
| Public URL received but unclear | Ask for clarification. |
| Public URL approved for manual handoff consideration | Keep in private tracker; wait for separate implementation task. |
| Multiple approved URLs for a destination | Consider a future static registry design task. |

Do not implement any URL in app code from this operating workflow alone.

## 11. Escalation gates

Escalate to a separate task before:

- adding a URL to app code
- creating a static registry
- adding a backend form
- adding a partner dashboard
- adding a supplier portal
- adding CRM
- adding analytics
- changing database schema
- changing environment variables
- changing sitemap
- changing robots metadata
- deploying production

Every future implementation task must have:

- exact scope
- clean worktree
- tests
- preview validation if app code changes
- production approval gate if deploy is needed

## 12. Forbidden public wording

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

These terms may appear in private operating documents only as explicit guardrails or rejection reasons.

## 13. Allowed public wording

Allowed wording:

- guided discovery
- compare experiences
- trusted local experiences
- booking partner
- partner-direct handoff
- Check availability
- Continue with booking partner
- Plan with RadarScout

## 14. Example operator run

```text
1. New inbound email arrives from a Chiang Mai operator.
2. Add lead to partner lead tracker.
3. Set Lead type = local operator.
4. Set Current status = needs triage.
5. Send supplier/operator public page request template.
6. Partner sends public product page.
7. Set Supplier link intake status = public URL received.
8. Copy URL into supplier link intake template.
9. Run safety checklist.
10. If safe, set review status = approved for manual handoff consideration.
11. Keep URL private until a separate static registry implementation task is approved.
```

## 15. Current non-goals

This pack does not:

- send emails
- create automation
- create CRM records
- create backend forms
- create API endpoints
- create partner portals
- create supplier dashboards
- write to the database
- change schema or environment variables
- change robots metadata
- change sitemap
- open SEO indexing
- call Bókun API
- edit or sync Bókun products
- add checkout, payment, cart, booking submission, live availability, or inventory behavior
- approve URLs for production app use
- touch ThaiEleHub or Shopify files
- deploy production

## 16. Recommended next tasks

If no real partner URLs are available yet:

```text
TD-RADARSCOUT-PARTNER-OUTREACH-RUN-0
```

Manual operator task outside the repo:

- send 3 to 5 outreach emails using the templates;
- record responses in the private lead tracker;
- do not change app code.

If at least one real public traveler-facing URL is collected and approved:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY-SPEC
```

Docs-only static registry specification before implementation.

## 17. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-partner-operating-pack.md
```

No app tests are required unless app code changes accidentally.
