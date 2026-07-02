# RadarScout tour detail handoff policy

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-POLICY-0`

## 1. Purpose

This document defines the product-level handoff policy for RadarScout `/tours/{id}` detail pages.

It converts the current handoff coverage audit into implementation rules for future work. It is docs-only and does not change app code, product data, Bókun behavior, sitemap output, robots metadata, database state, environment variables, deployments, or ThaiEleHub assets.

## 2. Current state

Current source behavior:

- `apps/web/lib/publicProducts/bookingPartnerHandoff.ts` validates safe public booking partner handoff URLs.
- `apps/web/lib/publicProducts/getPublicThailandProduct.ts` resolves `bookingPartnerHandoff` only when the product has an owner-managed `bokunActivityId` matching `ownerManagedBokunProfiles`.
- `apps/web/app/tours/[id]/page.tsx` renders `Check availability` only when `product.bookingPartnerHandoff` exists.
- Current `/tours/{id}` metadata remains `noindex,nofollow`.
- Current sitemap excludes `/tours/{id}`.

Current audit evidence:

- public handoff infrastructure exists;
- sampled public product details had `0` verified handoffs;
- sampled Chiang Mai / elephant-focused product details also had `0` verified handoffs;
- sampled tour detail pages did not trigger `/api/bokun`, OpenAI/LLM, checkout, payment, or booking submission requests;
- sampled tour detail pages are safe to keep visible as noindex planning/detail pages, but not ready for SEO expansion.

## 3. Product handoff states

RadarScout should classify each public tour detail product into one of three handoff states.

### State A: verified handoff

Definition:

```text
Product is display-safe and has a verified public booking partner URL.
```

Requirements:

- product is active;
- product is Thailand-eligible;
- public product fields are display-safe;
- handoff URL passes `validatePublicBookingPartnerHandoff`;
- CTA label is exactly `Check availability`;
- CTA rel is exactly `nofollow sponsored noopener noreferrer`;
- CTA opens the verified public booking partner page;
- no internal checkout, payment, cart, booking submission, live inventory, or availability claim is introduced.

Allowed visible copy:

```text
Check availability
Continue with a booking partner
Review current details on the booking partner page
```

SEO policy:

```text
Eligible for future SEO-candidate review.
Not automatically indexable.
Not automatically added to sitemap.
```

### State B: planning-only

Definition:

```text
Product is display-safe but does not have a verified public booking partner URL.
```

Requirements:

- product is active;
- product is Thailand-eligible;
- public product fields are display-safe;
- no verified handoff exists;
- no fake or fallback booking URL is invented;
- no `Check availability` CTA is shown unless a verified handoff exists.

Recommended visible copy:

```text
Planning-only detail
RadarScout can help you compare this experience, but a verified booking partner handoff is not available yet.
Use the product details here for planning and compare other experiences with verified handoff options.
```

SEO policy:

```text
Remain noindex,nofollow.
Remain excluded from sitemap.
Not eligible for SEO opening.
```

### State C: blocked

Definition:

```text
Product is not safe or not eligible for public display.
```

Examples:

- product is inactive;
- product is not Thailand-eligible;
- product lacks required trusted source data;
- product copy contains unsafe claims;
- product data would expose supplier/backend/rate/commission/private fields;
- product is unknown or unavailable.

Behavior:

```text
Return unavailable state.
Use generic blocked metadata.
Keep noindex,nofollow.
Do not include requested product ID in generic unavailable metadata.
Do not invent product content.
```

SEO policy:

```text
Never sitemap.
Never index.
```

## 4. Handoff source policy

Allowed handoff sources:

```text
owner_managed_profile
operator_verified_public_link
booking_partner_verified_public_widget
```

Current implemented source:

```text
owner_managed_profile
```

Future sources may be added only if they preserve the same safety contract:

- public HTTPS URL only;
- no admin, backend, database, private, preview, staging, localhost, or internal URLs;
- no credential-bearing query strings;
- no API key, token, secret, session, auth, or password query keys;
- no direct Bókun API call from public interaction;
- no product edit or sync behavior;
- no checkout/payment/booking submission inside RadarScout.

## 5. URL validation policy

Every public handoff URL must pass these checks before it reaches the UI:

```text
Protocol: https only
Credentials: none
Host: public host only
Path/host: no admin/backend/database/extranet/supplier/private/preview/staging/localhost patterns
Query: no sensitive keys
```

Sensitive query keys include:

```text
api_key
apikey
access_key
accesskey
auth
authorization
password
secret
session
token
```

If a URL fails validation:

```text
Do not render Check availability.
Classify as State B if product remains display-safe.
Classify as State C if the URL indicates private/backend exposure risk.
```

## 6. UI policy

### State A UI

Show:

- `Check availability` CTA;
- external link target;
- `rel="nofollow sponsored noopener noreferrer"`;
- short helper copy: `Continue with a booking partner to review current details.`

Do not show:

- live availability;
- available now;
- guaranteed slot;
- instant confirmation;
- checkout;
- payment;
- reservation complete;
- Bókun backend;
- Bókun database;
- Bókun-powered;
- supplier net rate;
- partner rate;
- commission.

### State B UI

Show:

- clear planning-only status;
- no-handoff explanation;
- link back to `/tours` or the Chiang Mai finder;
- suggestion to compare experiences with verified handoff options.

Do not show:

- `Check availability`;
- fake booking URL;
- disabled checkout button;
- fake waitlist/inquiry form;
- live availability language.

### State C UI

Show:

- unavailable state;
- generic explanation;
- safe navigation back to tours or destination pages.

Do not show:

- raw product ID in SEO metadata;
- private product fields;
- unsafe source data;
- booking or handoff CTA.

## 7. SEO policy relationship

Tour detail SEO opening must depend on handoff state.

Recommended rule:

```text
Only State A can become a future SEO candidate.
State B stays noindex and out of sitemap.
State C stays unavailable/noindex and out of sitemap.
```

Important:

```text
State A does not automatically mean indexable.
State A only means the product may enter a separate SEO candidate review.
```

Future SEO candidate review must still verify:

- safe title and description;
- safe visible copy;
- no unsafe transaction claims;
- handoff URL and rel;
- no unsafe network behavior;
- sitemap inclusion only for explicitly approved candidates;
- preview smoke before production deploy.

## 8. Required tests for implementation

Future implementation tasks should add or preserve tests for:

- owner-managed profile match returns State A;
- invalid handoff URL returns State B or State C safely;
- no matching handoff returns State B;
- inactive or ineligible product returns State C;
- State A renders `Check availability`;
- State A CTA uses `nofollow sponsored noopener noreferrer`;
- State B does not render `Check availability`;
- State B renders planning-only fallback copy;
- State C renders unavailable state;
- no state renders forbidden public copy;
- no state introduces `/api/bokun`, OpenAI/LLM, checkout, payment, booking submission, DB write, schema change, or env dependency;
- sitemap still excludes `/tours/{id}` until a separate sitemap-candidate task explicitly changes it.

## 9. Recommended next tasks

Recommended implementation sequence:

```text
TD-RADARSCOUT-TOUR-DETAIL-NO-HANDOFF-FALLBACK-0
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-STATE-TESTS-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-POLICY-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-PREP-0
TD-RADARSCOUT-TOUR-DETAIL-SITEMAP-CANDIDATES-0
```

The next safest code task is:

```text
TD-RADARSCOUT-TOUR-DETAIL-NO-HANDOFF-FALLBACK-0
```

Scope:

- add explicit State B planning-only fallback copy when no verified handoff exists;
- do not add fake CTA;
- do not change robots or sitemap;
- do not change product data;
- do not call Bókun APIs;
- do not add checkout/payment/booking behavior.

## 10. Guardrail confirmation

This policy task did not:

- modify app code;
- change robots metadata;
- change sitemap generation;
- open any tour detail page to `index, follow`;
- add `/tours/{id}` to the sitemap;
- change product data;
- change Bókun widget URLs;
- call Bókun APIs;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write to the database;
- change schema or environment variables;
- add LLM/OpenAI behavior;
- touch ThaiEleHub files;
- run Shopify commands;
- deploy production.
