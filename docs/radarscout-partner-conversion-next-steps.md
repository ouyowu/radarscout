# RadarScout partner conversion next steps

Task: `TD-RADARSCOUT-PARTNER-CONVERSION-2-DOCS`

## 1. Current state

RadarScout now has static B2B interest pages for:

- `/partners`
- `/suppliers`
- `/destination-partners`

PR #89 added source-specific `mailto:` prefill prompts for those pages and passed post-merge preview smoke.

Current production gate:

- Merge SHA: `592204a0d1289cb0506cc24bad589e2d68449335`
- Status: merged and preview-passed
- Production deploy: not yet approved

Until production deploy is explicitly approved, production still uses the older simple `mailto:` links.

## 2. Partner conversion objective

The next partner-conversion phase should make it easier for travel agents, suppliers, hotels, DMCs, and destination partners to contact RadarScout with useful context.

The model should remain conservative:

- static B2B pages
- mailto-first contact
- no backend form
- no database writes
- no account, portal, or dashboard
- no booking engine
- no checkout or payment behavior
- no Bókun API or Bókun backend wording

## 3. Current strengths

- The B2B pages explain distinct audiences: partners, suppliers, and destination partners.
- The CTAs stay low-risk because they use email only.
- The source-specific mailto prompts help identify which page generated the lead.
- Public tourist pages remain separate from B2B cooperation language.
- `noindex,nofollow` remains active for B2B pages.

## 4. Remaining gaps

- There is no structured lead triage process after an email arrives.
- There is no internal checklist for qualifying partner emails.
- There is no partner-facing expectation setting about response time.
- There is no lightweight contact routing policy.
- There is no safe CRM plan.
- There is no analytics plan for B2B page visits or CTA clicks.

These gaps should be addressed with docs and small static copy updates before adding any backend.

## 5. Recommended next tasks

### Task A: Deploy partner mailto prefill

Task name:

`TD-DEPLOY-PARTNER-CONVERSION-1-PRODUCTION`

Goal:

Deploy merge SHA `592204a0d1289cb0506cc24bad589e2d68449335` after explicit approval.

Safety gates:

- use a fresh clean production worktree
- run full validation before deploy
- deploy exact merge SHA only
- smoke `/partners`, `/suppliers`, and `/destination-partners`
- confirm B2B pages stay `noindex,nofollow`
- confirm no API, DB, CRM, checkout, booking, Bókun, or LLM behavior

### Task B: Partner lead triage playbook

Task name:

`TD-RADARSCOUT-PARTNER-LEAD-TRIAGE-0`

Goal:

Create a docs-only playbook for manually reviewing partner emails.

Recommended output:

`docs/radarscout-partner-lead-triage-playbook.md`

Include:

- lead type categories
- minimum required information
- safe response templates
- red flags
- supplier trust checklist
- destination-partner fit checklist
- what not to promise

Do not implement:

- CRM
- database
- form backend
- account login
- supplier dashboard

### Task C: B2B response-time copy polish

Task name:

`TD-RADARSCOUT-PARTNER-CONVERSION-3-RESPONSE-COPY`

Goal:

Add a short static expectation-setting sentence to B2B pages.

Safe copy direction:

> Send a short note with your destination focus and public booking link. RadarScout reviews partner inquiries manually before any public recommendation.

Do not imply:

- automatic listing
- guaranteed placement
- live availability
- commission terms on public pages
- private supplier rates

### Task D: B2B analytics plan

Task name:

`TD-RADARSCOUT-B2B-ANALYTICS-PLAN-0`

Goal:

Create a docs-only analytics plan for measuring B2B page visits and mailto clicks.

This should stay planning-only until tracking policy is approved.

Do not implement:

- analytics script
- third-party tracking
- cookie banner
- event API
- database writes

### Task E: Optional static intake form design

Task name:

`TD-RADARSCOUT-PARTNER-STATIC-INTAKE-DESIGN-0`

Goal:

Design a future static intake form, but do not build it.

The design must decide whether RadarScout should stay mailto-first or later add a backend form.

Future form guardrails:

- no account login
- no supplier portal
- no product inventory management
- no availability sync
- no payment or checkout
- no Bókun API
- no DB write unless explicitly approved

## 6. Recommended sequence

Recommended order:

1. `TD-DEPLOY-PARTNER-CONVERSION-1-PRODUCTION`
2. `TD-RADARSCOUT-PARTNER-LEAD-TRIAGE-0`
3. `TD-RADARSCOUT-PARTNER-CONVERSION-3-RESPONSE-COPY`
4. `TD-RADARSCOUT-B2B-ANALYTICS-PLAN-0`
5. `TD-RADARSCOUT-PARTNER-STATIC-INTAKE-DESIGN-0`

Do not start backend lead capture until the manual email process has been used with real inquiries.

## 7. Safety guardrails

Partner-conversion work must not add:

- checkout
- payment
- cart
- booking submission
- live availability
- inventory behavior
- Bókun API calls
- Bókun sync or edit behavior
- Bókun backend or database wording
- supplier net rate wording
- partner rate wording
- public commission wording
- fake reviews
- fake ratings
- login
- partner portal
- supplier dashboard
- DB writes
- schema changes
- environment changes
- LLM/OpenAI calls

Allowed wording:

- partner inquiry
- supplier interest
- destination partner
- trusted local experiences
- booking partner handoff
- public booking link
- manually reviewed
- contact RadarScout

## 8. Production decision point

The next production decision is narrow:

Deploy the already merged and preview-passed partner mailto prefill, or keep it staged.

Required approval phrase:

`Approve TD-DEPLOY-PARTNER-CONVERSION-1-PRODUCTION for merge SHA 592204a0d1289cb0506cc24bad589e2d68449335`

Without that approval, production must remain unchanged.
