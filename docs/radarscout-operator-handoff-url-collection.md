# RadarScout operator handoff URL collection packet

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-URL-COLLECTION-0`

## 1. Purpose

Provide a concrete collection and review packet for the first real `operator_verified_public_link` candidate.

This document is docs-only. It does not add app code, route behavior, sitemap entries, robots changes, product data, database writes, schema changes, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify work.

The packet is intentionally empty of real operator URLs until a human reviewer supplies one. It exists so the first candidate can be reviewed consistently before any Source 2 static registry is implemented.

## 2. Gate this packet supports

Do not start:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY
```

until this packet, or an equivalent review record, contains at least one approved real public URL.

Source 2 remains blocked while this is true:

```text
approved operator_verified_public_link count = 0
```

## 3. Candidate record template

Use one record per candidate URL.

```yaml
recordId:
radarScoutProductId:
bokunActivityId:
productTitle:
operatorPublicName:
destination:
candidatePublicUrl:
urlSourceType:
urlSourceNotes:
submittedBy:
reviewer:
reviewedAt:
reviewStatus: needs-info
rejectionOrHoldReason:
reviewNotes:
evidenceReference:
```

Allowed `reviewStatus` values:

```text
approved
rejected
needs-info
```

Allowed `urlSourceType` values:

```text
operator_email_public_url
operator_website_product_page
public_booking_partner_page
public_booking_partner_widget
manual_public_web_review
```

Do not use:

```text
bokun_backend
bokun_database
supplier_admin
partner_rate_page
supplier_net_rate_page
private_extranet
ai_generated_url
guessed_url
raw_product_json
```

## 4. First candidate worksheet

The first candidate should be filled manually after a real operator or booking partner public URL is collected.

```yaml
recordId: source2-candidate-001
radarScoutProductId:
bokunActivityId:
productTitle:
operatorPublicName:
destination:
candidatePublicUrl:
urlSourceType:
urlSourceNotes:
submittedBy:
reviewer:
reviewedAt:
reviewStatus: needs-info
rejectionOrHoldReason: pending real URL collection
reviewNotes: No real URL has been approved yet. Source 2 implementation remains blocked.
evidenceReference:
```

## 5. URL validation checklist

Mark each item before approval.

| Check | Result | Notes |
| --- | --- | --- |
| URL starts with `https://` | Pending |  |
| URL is a public traveler-facing page | Pending |  |
| URL is not localhost/private/internal | Pending |  |
| URL is not staging, preview, admin, supplier portal, or extranet | Pending |  |
| URL has no embedded username/password | Pending |  |
| URL has no token, session, API key, signed parameter, or secret tracking identifier | Pending |  |
| URL has no partner-rate, supplier-rate, net-rate, commission, backend, or database wording | Pending |  |
| URL does not require a logged-in supplier/admin session | Pending |  |
| URL does not imply RadarScout owns checkout, payment, booking, confirmation, availability, or inventory | Pending |  |

Approval rule:

```text
All URL validation checks must pass before reviewStatus can become approved.
```

## 6. Visible page review checklist

Review the rendered destination page before approval.

| Check | Result | Notes |
| --- | --- | --- |
| Page is public and traveler-facing | Pending |  |
| Page describes the relevant product, operator, or booking partner offer | Pending |  |
| Page does not expose private supplier/admin context | Pending |  |
| Page does not use partner-rate, net-rate, or commission language | Pending |  |
| Page does not expose backend, database, powered-by, extranet, or supplier portal wording | Pending |  |
| Page does not rely on fake reviews, fake ratings, or unverifiable awards | Pending |  |
| Page does not make medical, safety, or wild animal contact guarantees | Pending |  |
| Page does not make RadarScout appear to complete checkout, payment, booking, or confirmation | Pending |  |
| Page does not create live availability or inventory claims that RadarScout would appear to repeat | Pending |  |

Approval rule:

```text
Any failed visible page safety check blocks approval until manually resolved.
```

## 7. Approved output shape

Only after approval, the reviewed candidate can be represented as a future static registry entry.

Do not create this app code until a real candidate has been approved.

```ts
{
  productId: 'RADARSCOUT_PRODUCT_ID',
  href: 'https://public-operator-or-booking-partner-url.example',
  label: 'Check availability',
  rel: 'nofollow sponsored noopener noreferrer',
  source: 'operator_verified_public_link',
  verifiedBy: 'operator_manual_review',
  reviewedAt: 'YYYY-MM-DD',
  reviewer: 'reviewer-name-or-initials'
}
```

The future implementation must keep `bookingPartnerHandoff` optional. If a product has no approved record, it must not render a Source 2 product-specific CTA.

## 8. Rejection examples

Reject the candidate if any of these are true:

- URL points to a Bókun backend or database page.
- URL points to a supplier admin, extranet, staging, or preview page.
- URL contains a token, session, signed parameter, API key, or private access identifier.
- URL or visible page uses partner rate, supplier net rate, commission, backend, database, or portal wording.
- Page claims RadarScout completes booking, payment, confirmation, availability, or inventory.
- Page depends on fake reviews, fake ratings, unverifiable awards, medical guarantees, safety guarantees, or wild animal contact guarantees.

## 9. Relationship to current production gates

This packet does not change current production state.

Current safety boundaries remain:

- no production deploy;
- no SEO `index,follow` opening;
- no `/tours/{id}` sitemap inclusion;
- no Bókun API calls;
- no Bókun product edits or sync;
- no checkout, payment, cart, booking submission, or confirmation behavior;
- no live availability or inventory behavior;
- no DB writes;
- no Prisma schema or migration changes;
- no environment variable changes;
- no LLM/OpenAI dependency;
- no ThaiEleHub or Shopify changes.

## 10. Recommended next action

Human/operator-side action:

```text
Collect one real public operator or booking partner URL for a RadarScout product.
```

Then update the candidate worksheet out-of-band or in a narrow docs PR.

Only after at least one candidate is approved should RadarScout start:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY
```
