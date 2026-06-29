# RadarScout supplier link intake static template

Task: `TD-RADARSCOUT-SUPPLIER-LINK-INTAKE-STATIC-TEMPLATE-1`

Status: docs-only private intake template.

Use this template in a private document, spreadsheet, or internal note when collecting supplier and booking partner public links for future RadarScout handoff review.

This template does not create a database record, backend form, CRM workflow, supplier portal, static registry, or production handoff link.

## 1. Intake record

```text
Record ID:
Review status: new | needs clarification | approved for manual handoff consideration | rejected | do not use
Reviewer:
Review date:

Supplier or operator public name:
Experience name:
Destination:
Category:
Public traveler-facing URL:
Link type: supplier product page | operator experience page | booking partner product page | destination partner page | public information page

Contact person:
Contact email:
Contact source:

What the public page says is included:
Pickup area mentioned: yes | no | unclear
Duration mentioned: yes | no | unclear
Food mentioned: yes | no | unclear
Age suitability mentioned: yes | no | unclear
Accessibility or pace notes:

Unsafe claims observed:
Reviewer notes:
Decision rationale:
Required supplier clarification:
```

## 2. Public URL requirements

The submitted URL must be:

- public
- traveler-facing
- specific enough to understand the experience
- reachable without login
- safe to open from a public browser

Allowed link examples:

- supplier public product page
- operator public experience page
- booking partner public product page
- destination partner public page for a specific experience
- public information page that explains what is included

Rejected link examples:

- supplier dashboard URL
- Bókun backend URL
- private admin URL
- checkout URL
- cart URL
- payment session URL
- private rates sheet
- live inventory calendar
- unpublished draft page
- login-protected supplier portal

## 3. Safety checklist

Before marking a link as `approved for manual handoff consideration`, confirm:

- [ ] URL loads publicly.
- [ ] URL is traveler-facing.
- [ ] URL is not an admin, backend, cart, checkout, or payment URL.
- [ ] URL is not a private rate, net rate, partner rate, or commission document.
- [ ] URL describes a real experience.
- [ ] URL does not require login.
- [ ] URL does not expose supplier backend language.
- [ ] URL does not expose private inventory fields.
- [ ] URL does not make fake availability claims.
- [ ] URL does not include fake reviews or fake ratings.
- [ ] URL does not make unverifiable award claims.
- [ ] URL does not imply RadarScout confirms bookings.
- [ ] URL can be safely used behind `Check availability` or `Continue with booking partner` in a future reviewed implementation.

## 4. Clarification request template

Use this when a supplier sends an unsafe or unclear link:

```text
Thanks. RadarScout can only review public traveler-facing pages for possible recommendation handoff.

Please send the public page that a traveler can open without logging in. We cannot use supplier dashboard links, checkout links, cart links, private rate sheets, or backend inventory pages.

If the public page does not clearly describe pickup area, duration, food, or what is included, please also send a short clarification.
```

## 5. Approval note template

Use this only after a manual safety review:

```text
Decision: approved for manual handoff consideration
Reviewer:
Review date:
Reason:

This approval means the public URL may be considered for a future manually reviewed handoff implementation. It does not mean RadarScout has live availability, Bókun API access, inventory sync, booking confirmation authority, checkout ownership, or payment processing.
```

## 6. Rejection note template

Use this when a link should not be used:

```text
Decision: rejected | do not use
Reviewer:
Review date:
Reason:
Supplier clarification needed:

Do not use this URL in RadarScout recommendations unless a new public traveler-facing URL is submitted and reviewed.
```

## 7. Forbidden RadarScout public wording

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

These terms can appear in internal guardrail documents only when they are clearly marked as forbidden or rejected.

## 8. Allowed RadarScout public wording

Allowed wording:

- guided discovery
- compare experiences
- trusted local experiences
- booking partner
- partner-direct handoff
- Check availability
- Continue with booking partner
- Plan with RadarScout

## 9. Future implementation gate

Using this template does not approve a production implementation.

Before any approved URL can be used in app code, RadarScout needs a separate gated task that defines:

- exact source of the approved link
- reviewed public URL
- matching experience or recommendation card
- public copy
- handoff CTA behavior
- tests
- preview smoke
- production deploy approval gate

The recommended next implementation path remains:

1. collect at least one real public traveler-facing URL with this template
2. manually approve it for handoff consideration
3. create a separate static registry task
4. verify no Bókun API, checkout, payment, booking submission, live availability, DB write, schema change, or SEO opening is introduced

## 10. Validation for this task

This is a docs-only task.

Required validation:

```bash
git diff --check -- docs/radarscout-supplier-link-intake-static-template.md
```

No app tests are required unless app code changes accidentally.
