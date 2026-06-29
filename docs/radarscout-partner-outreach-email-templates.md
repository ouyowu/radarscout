# RadarScout partner outreach email templates

Task: `TD-RADARSCOUT-PARTNER-OUTREACH-EMAIL-TEMPLATES-0`

Status: docs-only outreach copy.

Use these templates manually when contacting travel partners, suppliers, local operators, and destination partners.

This document does not send email, create automation, add CRM, add backend forms, write to the database, call Bókun API, create checkout, or deploy production.

## 1. Purpose

RadarScout needs safe outreach copy that matches its current boundary:

- RadarScout helps travelers discover, compare, and plan trusted Thailand experiences.
- RadarScout can hand users off to a public booking partner or public operator page.
- RadarScout does not claim live availability.
- RadarScout does not run checkout or payment.
- RadarScout does not confirm bookings.
- RadarScout does not need supplier dashboard or backend access.

These templates support:

- partner lead tracking;
- supplier public URL collection;
- manual safety review;
- future handoff consideration.

## 2. General copy rules

Use:

- public traveler-facing page
- booking partner
- compare experiences
- guided discovery
- recommendation handoff
- Check availability
- continue with booking partner

Avoid asking for:

- supplier dashboard access
- Bókun backend access
- private inventory access
- checkout links
- cart links
- payment session links
- partner rate sheets
- supplier net rates
- commission sheets
- private credentials

Do not claim:

- live availability
- available now
- guaranteed slot
- instant confirmation
- reservation complete
- booking complete
- RadarScout confirms bookings
- RadarScout processes payment

## 3. Short intro for travel partners

Subject:

```text
RadarScout partner conversation for Thailand experiences
```

Email:

```text
Hi {{name}},

I’m working on RadarScout, a Thailand experience discovery and planning site.

RadarScout helps travelers compare local experiences and plan a suitable day before continuing with a booking partner for final details.

We are currently speaking with travel partners, hotels and DMCs who want to help travelers find trusted Thailand experiences without RadarScout becoming a checkout or booking engine.

If this is relevant, could you share:

1. the destinations you focus on;
2. the types of travelers you serve;
3. any public traveler-facing pages you already use for Thailand experiences?

RadarScout only reviews public traveler-facing links. We do not need backend, supplier dashboard, checkout, private rate, or inventory access.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Lead type`: `travel agent`, `hotel`, or `DMC`
- `Source page`: `manual outreach` unless the lead came from a B2B page
- `Supplier link intake status`: `requested public URL`

## 4. Short intro for suppliers or local operators

Subject:

```text
Public experience page review for RadarScout
```

Email:

```text
Hi {{name}},

I’m working on RadarScout, a Thailand experience discovery and planning site.

RadarScout helps travelers compare experiences and then continue to the operator or booking partner when they are ready to check details.

If you would like RadarScout to review one of your experiences for possible future recommendation handoff, please send the public traveler-facing page for that experience.

Please send only a public page that travelers can open without logging in. We cannot use dashboard links, Bókun backend links, checkout links, private rates, partner rates, commission sheets, or inventory pages.

RadarScout will manually review the page before deciding whether it can be considered for future handoff.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Lead type`: `local operator` or `supplier`
- `Supplier link intake status`: `requested public URL`
- If a URL arrives, copy it into the supplier link intake template.

## 5. Destination partner intro

Subject:

```text
RadarScout destination partner conversation
```

Email:

```text
Hi {{name}},

I’m working on RadarScout, a guided discovery site for Thailand experiences.

We are looking at how destination partners can help travelers compare trusted local experiences by destination, travel style, pace and handoff options.

RadarScout is not a checkout system, booking engine or supplier backend. It helps travelers discover and compare experiences, then continue with the operator or booking partner for final booking details.

If this is relevant, could you share:

1. the destination you represent;
2. the experience categories you want travelers to discover;
3. any public traveler-facing pages or destination pages we should review?

Please do not send private admin, backend, checkout, rate sheet, commission, or inventory links.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Lead type`: `destination partner`
- `Destination focus`: destination represented
- `Supplier link intake status`: `requested public URL` if specific experiences are discussed

## 6. Public URL clarification request

Use this when a lead sends an unclear, private, or unsafe link.

Subject:

```text
Could you send the public traveler-facing page?
```

Email:

```text
Hi {{name}},

Thanks for sending this over.

For RadarScout review, we can only use public traveler-facing pages that a traveler can open without logging in.

Could you resend this as a public product page, public operator page, or public booking partner page?

We cannot use supplier dashboards, backend pages, checkout links, cart links, payment sessions, private rate sheets, commission sheets, or inventory pages.

Once we have the public page, we can manually review whether it is safe to consider for future recommendation handoff.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Current status`: `waiting for public URL`
- `Supplier link intake status`: `needs clarification`
- `Unsafe data present`: `yes` if the original link exposed private or unsafe data

## 7. Follow-up after public URL received

Subject:

```text
Received the public page for review
```

Email:

```text
Hi {{name}},

Thanks. We received the public traveler-facing page.

RadarScout will review it manually before deciding whether it can be considered for future recommendation handoff.

This review checks whether the page is public, traveler-facing, relevant to the experience and safe to use behind copy such as “Check availability” or “Continue with booking partner.”

This review does not mean RadarScout has live availability, inventory sync, Bókun API access, checkout ownership, payment processing or booking confirmation authority.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Current status`: `accepted for manual review`
- `Supplier link intake status`: `public URL received`
- Next action: run supplier link intake safety checklist

## 8. Rejection for unsafe or out-of-scope link

Subject:

```text
RadarScout cannot use this link for handoff review
```

Email:

```text
Hi {{name}},

Thanks for sending the link.

We cannot use this link for RadarScout handoff review because it appears to be private, backend, checkout-related, rate-related, inventory-related or otherwise not traveler-facing.

RadarScout can only review public pages that travelers can open directly and safely.

If you have a public product page, public operator page or public booking partner page for the experience, you can send that instead and we can review it separately.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Lead fit score`: `D` if no safe public page is available
- `Current status`: `rejected` or `do not use`
- `Do not use reason`: concise reason

## 9. Call scheduling reply

Subject:

```text
RadarScout partner call
```

Email:

```text
Hi {{name}},

Thanks. A short call could be useful.

The main topics would be:

1. what type of Thailand experiences you want travelers to discover;
2. what public traveler-facing pages already exist;
3. what RadarScout can safely recommend or hand off to;
4. what must stay with the operator or booking partner, such as availability, checkout, payment and confirmation.

Please send a few time options, and we can confirm a slot.

Best,
{{sender_name}}
RadarScout
```

Tracker use:

- `Current status`: `ready for call`
- `Next action`: schedule call

## 10. Lead tracker mapping

When using any template, update:

- `Source page`
- `Lead type`
- `Destination focus`
- `Public traveler-facing URL provided`
- `Booking partner URL provided`
- `Supplier link intake status`
- `Lead fit score`
- `Current status`
- `Next action`
- `Response template used`
- `Notes`

Keep notes concise and non-sensitive.

## 11. Supplier link intake mapping

If a public URL is received, copy it into:

- `docs/radarscout-supplier-link-intake-static-template.md`

Do not mark it approved until manual review confirms:

- URL is public;
- URL is traveler-facing;
- URL does not require login;
- URL does not expose backend, checkout, payment, private rate, commission or inventory data;
- URL does not imply RadarScout confirms bookings;
- URL can safely be used behind `Check availability` or `Continue with booking partner` in a future reviewed implementation.

## 12. Non-goals

These templates do not:

- send email automatically;
- create email sequences;
- create CRM records;
- create backend forms;
- write to the database;
- change app code;
- change routes;
- change sitemap;
- change robots metadata;
- open SEO indexing;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability or inventory behavior;
- approve any URL for production use;
- touch ThaiEleHub or Shopify files;
- deploy production.

## 13. Validation for this task

Required validation:

```bash
git diff --check -- docs/radarscout-partner-outreach-email-templates.md
```

No app tests are required unless app code changes accidentally.
