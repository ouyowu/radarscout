# RadarScout operator handoff intake form

Task: `TD-RADARSCOUT-OPERATOR-HANDOFF-INTAKE-FORM-DOCS`

## 1. Purpose

Define the manual intake and review workflow for operator verified public handoff links before RadarScout adds a second tour detail handoff source.

This document is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

The goal is to make the next implementation step auditable:

```text
collect real public operator URL
-> review URL and visible page
-> approve or reject
-> only approved links can enter a reviewed implementation artifact
```

## 2. Current state

RadarScout currently has one narrow verified tour detail handoff path:

```text
BokunProduct.bokunActivityId
-> ownerManagedBokunProfiles[].bokunId
-> ownerManagedBokunProfiles[].bookingHandoffUrl
-> optional bookingPartnerHandoff
-> /tours/{id} Check availability CTA only when verified
```

That Source 1 path is implemented and merged, but production deployment remains separately gated.

The proposed Source 2 path is documented as:

```text
operator_verified_public_link
```

However, Source 2 should not be implemented until at least one real operator or booking partner public URL has been manually collected and approved.

Preview environment limitation remains:

```text
Vercel Preview currently has no public product data for DB-backed smoke.
```

This means production data smoke and preview database configuration remain separate gates. Do not use production deploy as a substitute for a reviewed URL source.

## 3. Intake form fields

Each candidate operator handoff link should be recorded with these fields before it is considered for implementation:

| Field | Required | Notes |
| --- | --- | --- |
| RadarScout product ID | Yes | Internal product identifier used by RadarScout. |
| Bókun activity ID | Optional | Internal matching aid only; never treat it as the URL source. |
| Product title | Yes | Product name as currently represented in RadarScout. |
| Operator or supplier public name | Yes, if known | Use only public-safe display names. |
| Destination / city | Yes | Example: Chiang Mai, Bangkok, Phuket. |
| Candidate public URL | Yes | The exact URL proposed for traveler handoff. |
| URL source type | Yes | Operator email, operator website, public booking partner page, or other public traveler source. |
| Reviewer | Yes | Human reviewer responsible for the decision. |
| Reviewed at | Yes | Date or timestamp of review. |
| Review status | Yes | `approved`, `rejected`, or `needs-info`. |
| Rejection or hold reason | Required if not approved | Short, concrete reason. |
| Review notes | Optional | Extra context for future reviewers. |
| Screenshot or evidence reference | Optional | Store references without secrets, tokens, private URLs, or customer data. |

## 4. URL validation checklist

Every candidate URL must pass all of these checks before approval:

- URL is absolute and starts with `https://`.
- URL points to a public page intended for travelers.
- URL is not `localhost`, private network, internal, staging, preview, or admin-only.
- URL does not contain embedded username or password.
- URL does not contain access tokens, session tokens, API keys, signed private parameters, or secret tracking identifiers.
- URL does not require a logged-in supplier, operator, admin, or partner session.
- URL path and query do not contain partner-rate, net-rate, commission, backend, database, extranet, admin, or supplier portal language.
- URL does not imply RadarScout owns checkout, payment, booking submission, availability, inventory, or confirmation.

If any check fails, the candidate must be `rejected` or `needs-info`. Products without an approved URL must not render a product-specific `Check availability` CTA from Source 2.

## 5. Visible page review checklist

After the URL passes structural checks, the destination page should be reviewed for tourist-facing safety.

Acceptable destination pages:

- public operator product page;
- public booking partner product page;
- public traveler-facing widget page;
- public product detail page that clearly belongs to the operator or partner.

Reject or hold pages that prominently depend on:

- private supplier/admin context;
- backend, database, powered-by, extranet, or supplier portal language;
- partner-rate, net-rate, or commission wording;
- fake reviews, fake ratings, or unverifiable awards;
- medical, safety, or wild animal contact guarantees;
- checkout, payment, booking complete, or confirmation wording that could be mistaken as RadarScout behavior;
- live availability or inventory claims that RadarScout would appear to repeat.

Acceptable external handoff copy can make clear that current price, availability, booking details, payment, and confirmation are handled by the booking partner or product page, not by RadarScout.

## 6. Review workflow

Use this workflow for each candidate link:

1. Collect the candidate URL from a public-safe source.
2. Record the intake fields.
3. Run the URL validation checklist.
4. Run the visible page review checklist.
5. Record `approved`, `rejected`, or `needs-info`.
6. If approved, add the URL to the next reviewed implementation artifact.
7. If rejected or `needs-info`, do not render any product-specific Source 2 CTA for that product.

No raw external source should be consumed directly by the public app.

## 7. Storage recommendations

### Near term: static reviewed registry

After at least one real URL is approved, use a server-only static reviewed registry for the first Source 2 implementation.

Recommended shape:

```text
apps/web/lib/publicProducts/operatorVerifiedHandoffs.ts
```

This keeps the first implementation:

- small;
- auditable in code review;
- independent from DB writes;
- independent from schema changes;
- independent from external spreadsheets or live third-party sources.

### Later: reviewed database table

A DB-backed review table may be useful after the workflow has real volume.

Do not start this without explicit approval for:

- schema design;
- migration SQL review;
- DB write behavior;
- admin or operator workflow;
- rollback plan.

### Avoid: live unaudited spreadsheet or generated source

External spreadsheets can support operations, but the public app should consume only a reviewed artifact. Do not render handoff URLs directly from a live spreadsheet, raw Bókun export, generated enrichment, or LLM output.

## 8. Implementation gate

Do not start:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY
```

until at least one real candidate URL has been manually approved.

When implementation is allowed, use this handoff source order:

```text
1. owner_managed_profile
2. operator_verified_public_link
3. no handoff
```

Source 2 must not override Source 1 unless a future task explicitly defines conflict resolution.

The existing public handoff contract should remain:

```text
label: Check availability
rel: nofollow sponsored noopener noreferrer
source: operator_verified_public_link
verifiedBy: operator_manual_review
```

The handoff object must remain optional. If a product has no approved URL, RadarScout must not render a product-specific Source 2 CTA.

## 9. Safety boundaries

The intake workflow and future Source 2 implementation must preserve these boundaries:

- no Bókun API calls;
- no Bókun product edits or sync;
- no checkout, payment, cart, booking submission, or confirmation behavior inside RadarScout;
- no live availability or inventory behavior;
- no DB writes without explicit approval;
- no Prisma schema or migration changes without explicit approval;
- no environment variable changes;
- no LLM/OpenAI dependency;
- no SEO `index,follow` opening;
- no `/tours/{id}` sitemap inclusion;
- no ThaiEleHub or Shopify changes.

## 10. Recommended next tasks

Recommended sequence:

1. Manually collect one real operator or booking partner public URL.
2. Review it using this intake checklist.
3. If approved, start `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY`.
4. If preview smoke needs real DB-backed products, separately run `TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-2`.

Do not skip the reviewed URL step.
