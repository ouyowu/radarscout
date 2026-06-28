# RadarScout partner conversion plan

Task: `TD-RADARSCOUT-PARTNER-CONVERSION-0`

## 1. Purpose

RadarScout already has static B2B interest pages:

```text
/partners
/suppliers
/destination-partners
```

The next conversion problem is narrow:

```text
Make the existing partner pages easier to understand, attribute, and act on without adding backend forms, login, CRM, checkout, availability, or supplier dashboards.
```

This document is a plan only. It does not change app code, deploy production, open SEO indexing, add analytics code, write to a database, call Bókun, or touch ThaiEleHub / Shopify.

## 2. Current B2B state

Current implementation:

- `/partners` targets travel agents, hotels, concierges, local travel planners, and creators.
- `/suppliers` targets Thailand operators and experience providers.
- `/destination-partners` targets DMCs, tourism organizations, local agencies, and destination managers.
- All three pages are static.
- All three pages use `mailto:hello@radarscout.io` CTA links.
- All three pages remain `noindex,nofollow`.
- There is no login, portal, dashboard, API form, CRM integration, database write, or supplier backend.

Current guardrails:

- No checkout, payment, cart, booking submission, or confirmation.
- No live availability or inventory claims.
- No Bókun API, sync, edit, backend, database, or powered-by wording.
- No commission, partner rate, or supplier net rate wording on public pages.
- No fake ratings, fake reviews, fake testimonials, fake logos, or fake supplier stats.

## 3. Conversion questions to answer

Before adding any backend lead capture, RadarScout should answer:

1. Which B2B audience is most valuable first?
   - travel agent / hotel / concierge;
   - local operator / supplier;
   - DMC / destination partner.

2. What action should each audience take now?
   - send a partnership email;
   - share an experience for manual review;
   - discuss destination collaboration.

3. What minimum information is useful in an email?
   - name and organization;
   - destination focus;
   - audience or operator type;
   - public product or experience link;
   - preferred contact path.

4. What must remain manual?
   - supplier verification;
   - product intake;
   - booking-link validation;
   - trust review;
   - any commercial terms discussion.

## 4. Recommended safe improvements

### 4.1 Add audience-specific mailto prefill

Current CTA links already use a subject line. A future small patch can safely add structured email body prompts without collecting data on RadarScout servers.

Example:

```text
mailto:hello@radarscout.io
  ?subject=RadarScout supplier interest
  &body=Name:%0AOrganization:%0ADestination:%0AExperience link:%0AWhat you want to discuss:
```

Value:

- improves lead quality;
- keeps data collection in the user email client;
- avoids DB, API, CRM, form backend, login, and spam handling.

Risks:

- long mailto URLs can become harder to maintain;
- body copy must not ask for sensitive traveler, payment, or private supplier data.

Safety gates:

- CTA remains `mailto:hello@radarscout.io`;
- no `<form>`;
- no `/api/*`;
- no database write;
- no CRM integration;
- tests assert forbidden wording is absent.

### 4.2 Add page-specific source labels

Future email subjects can include source labels:

```text
[RadarScout partners page]
[RadarScout suppliers page]
[RadarScout destination partners page]
```

Value:

- lets the owner triage inbound messages manually;
- provides lightweight attribution without analytics code;
- does not require cookies or tracking.

Risk:

- none material if implemented only in mailto subject/body.

### 4.3 Add a short "What happens next" section

Future copy can clarify the manual process:

```text
What happens next
1. We review your message manually.
2. We check whether your destination or experience fits RadarScout.
3. If relevant, we ask for public product details and a safe booking partner link.
4. Nothing goes live without manual review.
```

Value:

- reduces confusion;
- reinforces that RadarScout is not a supplier dashboard or booking engine.

Safety gates:

- do not imply guaranteed acceptance;
- do not imply guaranteed traffic, sales, ranking, or availability;
- do not mention commission, rates, backend, or private inventory.

### 4.4 Add safe cross-links between B2B pages

Future page copy can link related audiences:

```text
/partners -> /suppliers
/partners -> /destination-partners
/suppliers -> /partners
/destination-partners -> /suppliers
```

Value:

- helps visitors self-select;
- improves B2B page navigation without adding homepage/nav links.

Safety gates:

- keep all pages `noindex,nofollow`;
- do not add B2B pages to sitemap;
- do not add global nav links unless separately scoped.

### 4.5 Connect B2B pages to analytics spec later

The analytics instrumentation spec currently recommends filtering B2B pages out of first-pass tourist funnel analytics.

If partner conversion measurement is needed later, create a separate B2B analytics spec. Do not mix B2B partner lead measurement with tourist planner funnel measurement in the first analytics implementation.

## 5. What not to build yet

Do not build yet:

- backend contact form;
- CRM integration;
- Resend email pipeline;
- supplier dashboard;
- partner portal;
- login/account flow for partners;
- file upload;
- product intake database;
- Bókun API sync;
- Bókun product edit workflow;
- rate, commission, margin, or commercial terms calculator;
- public partner testimonials;
- public supplier logos;
- public partner success claims.

## 6. Public-copy guardrails

Allowed wording:

```text
manual review
partner interest
supplier interest
destination partnership
trusted local experiences
guided discovery
booking partner
partner-direct handoff
public booking link
```

Forbidden wording:

```text
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
Bókun supplier products
partner rate
supplier net rate
commission
fake reviews
fake ratings
guaranteed leads
guaranteed sales
guaranteed placement
```

## 7. Recommended next implementation task

Recommended task:

```text
TD-RADARSCOUT-PARTNER-CONVERSION-1-MAILTO-PREFILL
```

Scope:

- update only static partner page content and tests;
- add page-specific `mailto:` subject/body prompts;
- optionally add a short "What happens next" section if it can be done through existing static content structure;
- keep pages `noindex,nofollow`;
- keep pages out of sitemap;
- do not add form/backend/CRM/API/DB behavior;
- do not add homepage/nav links;
- do not production deploy without explicit approval.

Likely files:

```text
apps/web/app/_components/partnerInterestContent.ts
apps/web/app/_components/PartnerInterestPage.tsx
apps/web/app/partners/__tests__/partnerPages.test.tsx
```

If the existing page component cannot support "What happens next" without broader refactoring, implement only mailto prefill and source labels first.

## 8. Test plan for future implementation

Future tests should verify:

- each page CTA remains `mailto:hello@radarscout.io`;
- each CTA has the correct source-specific subject;
- each CTA has a safe prefilled body prompt;
- CTA body does not ask for payment, private supplier, traveler, or booking data;
- no `<form>` is introduced;
- no `/api/*` dependency is introduced;
- no `fetch()` is introduced;
- no Prisma, DB, Resend, CRM, or service-backed form dependency is introduced;
- pages remain `noindex,nofollow`;
- sitemap still excludes B2B pages;
- forbidden public wording is absent;
- ThaiEleHub files are untouched.

## 9. Preview smoke for future implementation

Future preview smoke should check:

```text
/partners
/suppliers
/destination-partners
```

Required checks:

- page loads 200;
- CTA is visible;
- CTA href starts with `mailto:hello@radarscout.io`;
- CTA subject/body are URL-encoded and audience-specific;
- no form submission;
- no API request;
- no DB-backed behavior;
- robots remain `noindex,nofollow`;
- sitemap excludes the B2B pages;
- no checkout/payment/live availability/commission/rate/backend wording;
- no fake stats/logos/testimonials.

## 10. Production gate

Production deployment must remain separately approved.

Required approval should name:

```text
TD-DEPLOY-PARTNER-CONVERSION-1-PRODUCTION
```

and the exact merge SHA.
