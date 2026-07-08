# Bókun marketplace supplier onboarding read-only plan

Task: `BOKUN-MARKETPLACE-SUPPLIER-ONBOARDING-READONLY-PLAN`

Date: 2026-07-08

Status: read-only plan complete; no Bókun actions taken.

## 1. Scope

This task is a red-line planning task for future third-party marketplace supplier
onboarding.

Allowed in this task:

- list candidate suppliers/products from read-only Bókun marketplace observation;
- define the review fields needed before any product can become RadarScout seed
  data;
- document the approval gates for a future onboarding task.

Not allowed in this task:

- click `Sell experience`;
- create reseller contracts, channels, widgets, or products;
- run Bókun API calls or sync jobs;
- copy private API/backend URLs;
- add or change `bookingWidgetUrl` values in the app;
- modify seed data, matching code, checkout, booking, availability, inventory,
  DB, Prisma schema, environment variables, robots, or sitemap.

## 2. Current production baseline

RadarScout already has 8 reviewed public widget products live for user
validation. They are Chiang Mai products from operator-reviewed public Bókun
widget URLs and should remain the validation baseline before expanding to
third-party marketplace suppliers.

The current 8-product pilot covers:

- half-day morning elephant care;
- half-day afternoon elephant care;
- full-day elephant plus Pad Thai cooking;
- Thai cooking plus ethical elephant sanctuary;
- Inthanon / nature trail;
- Bigboy half-day morning;
- Bigboy half-day afternoon;
- elephant plus bamboo rafting.

These are enough for initial user validation of:

- whether travelers understand the Trip Planner flow;
- whether real partner products appear for Chiang Mai intent;
- whether `Check availability` handoff copy is clear;
- whether users click through to the public booking partner widget.

## 3. Read-only marketplace findings so far

The Bókun account has accepted contracts visible in the supplier/reseller area,
but current read-only checks did not produce new safe seedable widget URLs.

Known observations:

- The contracts screen showed 24 supplier contracts in the user-provided
  screenshot.
- Search for Thailand supplier contracts returned no confirmed Thailand supplier
  contract suitable for direct seeding.
- A Thailand reseller contract was observed for `My Visit Thailand (102688)`,
  but product search for `My Visit Thailand` returned no matching products in
  the read-only marketplace check.
- Bókun marketplace search for Thailand surfaced candidate suppliers/products
  with `Sell experience` actions, but those are not safe to seed yet because
  they require an explicit onboarding action before RadarScout can treat them as
  approved handoff products.

Candidate supplier/product names observed during read-only marketplace browsing:

| Candidate | Observed context | Current status | Next requirement |
| --- | --- | --- | --- |
| Folkpaths | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| TripGuru Thailand | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| Things to Do 360 | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| MY Holiday Centre | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| Siam Adventures | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| WanderSiam | Thailand marketplace/product discovery | Candidate only | Human review; do not click `Sell experience` without approval |
| My Visit Thailand | Accepted reseller contract observed | Not seedable yet | Need public widget products or explicit onboarding path |

This candidate list is not product seed data. It must not be used to create
RadarScout recommendations until public widget URLs are obtained and reviewed.

## 4. Candidate review fields

For each future candidate supplier/product, collect only review-safe fields:

- supplier name;
- supplier country / destination coverage;
- product title;
- destination;
- product category;
- public product page URL, if visible without API/backend access;
- whether a public Bókun widget URL exists;
- whether the product is Thailand-relevant;
- whether the product fits RadarScout's public-safe categories;
- notes on why the product should or should not be onboarded.

Do not collect or store:

- supplier net rate;
- commission;
- private reseller terms;
- backend/API URLs;
- internal Bókun IDs unless already visible as part of a public widget URL;
- live availability;
- inventory;
- checkout/payment state;
- raw Bókun JSON.

## 5. Seed eligibility rule

A marketplace product can move from candidate to RadarScout seed only when all of
these are true:

1. The product is a real Thailand travel product.
2. The operator relationship or marketplace resale permission is explicitly
   approved by the human operator.
3. A public `https://widgets.bokun.io/.../experience/<id>` handoff URL is
   available.
4. The URL is not an API/backend URL and contains no secret.
5. The product can pass `validatePartnerProductRecord`.
6. The seed record contains no price, availability, rating, review count,
   checkout, payment, inventory, commission, or net-rate fields.
7. The public copy can describe it as a safe external booking partner handoff
   without claiming live availability or confirmation.

If any requirement is missing, the product stays in the candidate list and must
not be rendered in RadarScout recommendations.

## 6. Recommended next tasks

### A. Continue current 8-product validation first

Use the current 8 public widget products to validate real user behavior before
adding marketplace complexity.

Suggested validation questions:

- Do users understand the planner flow?
- Do users find the Chiang Mai products relevant?
- Do users click `Check availability`?
- Do users understand RadarScout does not complete booking, payment, or
  confirmation?

### B. `BOKUN-MARKETPLACE-SUPPLIER-CANDIDATE-REVIEW-1`

Read-only browser task:

- review the Thailand marketplace product search results;
- list 10-20 candidate products/suppliers;
- record only review-safe fields;
- do not click `Sell experience`;
- do not create widgets or contracts;
- do not write app seed data.

Output should update this document or a single candidate CSV under a gitignored
private input path, not public seed data.

### C. `BOKUN-MARKETPLACE-SUPPLIER-ONBOARDING-APPROVAL-2`

Human approval gate:

- select 1-3 candidate suppliers/products;
- approve whether clicking `Sell experience` is allowed;
- approve whether any resulting public widget URL may be copied into
  `private-inputs/partner-products.csv`;
- confirm no Bókun API/sync, availability, or checkout integration is being
  approved.

### D. `PARTNER-PRODUCT-SEED-5B-MARKETPLACE-PILOT`

Only after approved public widget URLs exist:

- read the operator-provided private CSV/JSON;
- validate with `validatePartnerProductRecord`;
- add reviewed static seed records;
- keep booking/availability disabled;
- open PR for review.

## 7. Safety confirmations

This task did not:

- click `Sell experience`;
- create or edit any Bókun product, contract, channel, widget, or supplier;
- call the Bókun API;
- add or change app seed data;
- change matching logic;
- change checkout/payment/booking behavior;
- change availability/inventory behavior;
- write DB data;
- change Prisma schema or migrations;
- change environment variables;
- change SEO robots or sitemap;
- touch ThaiEleHub or Shopify files.
