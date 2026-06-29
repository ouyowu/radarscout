# RadarScout operator handoff outreach request

Task: `TD-RADARSCOUT-OPERATOR-HANDOFF-OUTREACH-REQUEST-DOCS`

## 1. Purpose

Provide safe outreach copy and collection rules for requesting public operator or booking partner URLs that can later be reviewed as `operator_verified_public_link` candidates.

This document is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Why this exists

RadarScout cannot implement Source 2 handoff links until at least one real public URL is collected and manually approved.

The app must not use guessed URLs, raw Bókun fields, backend links, partner-rate links, supplier admin links, or AI-generated links.

The outreach goal is narrow:

```text
Ask an operator or booking partner for the public traveler-facing product URL they want RadarScout to hand off to.
```

## 3. What to request from an operator

Ask only for public-safe information:

| Field | Purpose |
| --- | --- |
| Operator public name | Confirms who owns or represents the experience. |
| Product or experience name | Helps match the URL to the correct RadarScout product. |
| Destination / city | Helps avoid mismatching similar products. |
| Public traveler-facing URL | Candidate Source 2 URL. |
| Pickup or meeting-point note | Operational context; do not treat as live availability. |
| What the public page includes | Price, inclusions, photos, itinerary, or partner checkout context if visible. |
| Contact name | Internal review contact only. |

Do not ask for:

- backend access;
- supplier portal access;
- Bókun admin links;
- partner-rate links;
- supplier net-rate sheets;
- commission tables;
- inventory feeds;
- API credentials;
- checkout credentials;
- private customer data.

## 4. Short outreach email template

Subject:

```text
RadarScout public booking link check for your Thailand experience
```

Body:

```text
Hi {{operator_name}},

RadarScout is a Thailand experience discovery and planning site. We help travelers compare local experiences and then continue to the operator or booking partner when they are ready to check details.

For {{product_name}}, could you send us the public traveler-facing product page or booking partner page you want RadarScout to link to?

Please send only a public URL that travelers can open without logging in. We do not need backend access, rate sheets, API credentials, inventory access, or supplier portal links.

We will review the URL before using it. RadarScout will not claim live availability, complete checkout, process payment, or confirm bookings. Those details remain handled by your product page or booking partner.

Thanks,
RadarScout
```

## 5. Follow-up email template

Use this if the first response includes an unsafe, private, or ambiguous link.

```text
Hi {{operator_name}},

Thanks for sending this. For RadarScout we can only use public traveler-facing pages.

Could you resend the link as a public product page or public booking partner page that does not require supplier/admin login and does not expose backend, partner-rate, net-rate, commission, or private inventory information?

RadarScout will use the link only as an external handoff. We will not handle checkout, payment, confirmation, live availability, or inventory.

Thanks,
RadarScout
```

## 6. Operator form copy

If this is later turned into a form, use conservative wording.

Title:

```text
Submit a public handoff link for RadarScout review
```

Intro:

```text
Send the public traveler-facing product page or booking partner page you want RadarScout to review. Do not send backend, supplier portal, partner-rate, net-rate, inventory, API, checkout, or private admin links.
```

Field labels:

```text
Operator public name
Product or experience name
Destination / city
Public traveler-facing URL
What should travelers use this page for?
Contact name
Contact email
Notes for RadarScout review
```

Submit button:

```text
Submit for review
```

Safe confirmation copy:

```text
Thanks. RadarScout will review the public link before deciding whether it can be used as an external booking partner handoff.
```

Do not use confirmation copy that says the link is live, approved, available, bookable, confirmed, or added automatically.

## 7. Reviewer triage rules

When a response arrives, classify it before adding it to the intake packet.

### Accept for review

Use this status when the submitted URL appears to be:

- public;
- `https://`;
- traveler-facing;
- related to the submitted product;
- not obviously private, tokenized, or admin-only.

This does not mean approved. It only means the URL is ready for the full intake checklist.

### Needs info

Use this status when:

- the URL is missing;
- the page is ambiguous;
- the product match is unclear;
- the page requires login and may have a public equivalent;
- the operator submitted a collection or homepage instead of a product page.

### Reject

Use this status when the submission is clearly unsafe:

- Bókun backend or database page;
- supplier admin, extranet, or portal page;
- partner-rate, supplier-rate, net-rate, or commission page;
- checkout/session/token/private signed link;
- API endpoint or credentials;
- staging, preview, internal, localhost, or private network URL;
- page depends on fake reviews, fake ratings, unverifiable awards, medical guarantees, safety guarantees, or wild animal contact guarantees.

## 8. Internal reviewer notes

Reviewer notes should be factual and limited.

Good examples:

```text
Public operator product page. No login required. Product title matches RadarScout record. Ready for full intake checklist.
```

```text
Submitted link opens supplier portal login. Rejected. Requested public traveler-facing page instead.
```

Avoid notes that include:

- secrets;
- tokens;
- private email content beyond what is needed;
- customer names;
- private rates;
- supplier credentials;
- unsupported conclusions about availability or booking status.

## 9. Hand-off into the intake packet

If a URL is accepted for review, copy it into:

```text
docs/radarscout-operator-handoff-url-collection.md
```

or an equivalent narrow review record.

Do not implement app code from an outreach response alone. The URL still needs the full URL validation checklist and visible page review checklist.

## 10. Safety boundaries

This outreach process must preserve:

- no Bókun API calls;
- no Bókun product edits or sync;
- no checkout, payment, cart, booking submission, or confirmation behavior inside RadarScout;
- no live availability or inventory behavior;
- no DB writes;
- no Prisma schema or migration changes;
- no environment variable changes;
- no LLM/OpenAI dependency;
- no SEO `index,follow` opening;
- no `/tours/{id}` sitemap inclusion;
- no ThaiEleHub or Shopify changes.

## 11. Recommended next action

Use the short outreach email with one real operator or booking partner.

When the operator provides a public URL:

1. classify the response using the triage rules;
2. run the intake checklist;
3. record the decision;
4. start `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY` only after at least one candidate is approved.
