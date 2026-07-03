# RadarScout tour detail handoff mapping production read-only plan

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PROD-READONLY-PLAN`

## 1. Purpose

Define the exact production read-only evidence check needed before RadarScout can approve the first real owner-managed tour detail handoff mapping.

This is a plan only. It does not read production database data, change app code, write database records, run migrations, change schema or environment variables, call Bókun, change sitemap or robots metadata, deploy, or touch ThaiEleHub assets.

## 2. Why this plan is needed

The Preview DB read-only check found only a preview seed record:

```text
publicProductId: preview-tour-handoff-1232729
bokunActivityId: 1232729
```

That proves the query path works, but it is not enough to approve a production mapping.

The remaining blocker is:

```text
Find the real production BokunProduct.id values whose bokunActivityId matches owner-managed profile IDs.
```

## 3. Production access rule

Do not execute this plan until the user explicitly approves the exact production read-only query.

Required approval phrase:

```text
Approve TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PROD-READONLY-1 to run the documented read-only production query only.
```

Without that phrase, stop at this plan.

## 4. Data source

Allowed source:

```text
Production PostgreSQL database used by RadarScout production.
```

Forbidden sources:

```text
.env.production
raw Bókun API
Bókun sync endpoint
Bókun backend or database pages
supplier admin portals
LLM/OpenAI
public title similarity alone
rawJson URL extraction
```

Credential handling requirements:

- do not print the production database URL;
- do not print credentials;
- do not store credentials in the repository;
- do not commit `.env` files;
- use an approved secret source only;
- print only a redacted connection summary if needed.

## 5. Exact SQL

Run the query inside a read-only transaction.

```sql
BEGIN READ ONLY;

SELECT
  id,
  title,
  city,
  location,
  "bokunActivityId",
  active,
  CASE WHEN "supplierId" IS NULL THEN false ELSE true END AS "supplierIdPresent"
FROM "BokunProduct"
WHERE "bokunActivityId" IN (
  '1232729', '1232731', '1232733', '1232736', '1232798',
  '1232799', '1236811', '1236820', '1236830'
)
ORDER BY "bokunActivityId" ASC;

COMMIT;
```

## 6. Allowed output fields

The only fields that may be printed or documented are:

```text
id
title
city
location
bokunActivityId
active
supplierIdPresent
```

Allowed summary fields:

```text
matched row count
active row count
supplier-present row count
missing owner-managed candidate IDs
```

## 7. Forbidden output fields

Do not select, print, copy, summarize, or commit:

```text
rawJson
supplier private fields
supplier email
supplier credentials
vendor credentials
rates
commission
partner rate
supplier net rate
checkout URL
booking URL from raw data
backend URL
admin URL
customer data
booking data
order data
payment data
API keys
tokens
secrets
```

## 8. Owner-managed IDs under review

| Owner-managed Bókun ID | Profile title | Expected mapping decision |
| --- | --- | --- |
| `1232729` | Half-Day Morning Elephant Sanctuary Program in Chiang Mai | Approve only if production row exists and checklist passes |
| `1232731` | Half-Day Afternoon Elephant Sanctuary Program in Chiang Mai | Approve only if production row exists and checklist passes |
| `1232733` | Full-Day Elephant Sanctuary and Pad Thai Cooking in Chiang Mai | Approve only if production row exists and checklist passes |
| `1232736` | Thai Cooking Class and Ethical Elephant Sanctuary Chiang Mai | Approve only if production row exists and checklist passes |
| `1232798` | Inthanon Heaven Trail(Living Green Elephant Sanctuary) | Approve only if production row exists and checklist passes |
| `1232799` | Living Green Elephant Sanctuary Experience near Bangkok & Pattaya | Hold for separate Bangkok/Pattaya review even if row exists |
| `1236811` | Day for Elephant Half-Day Morning-Bigboy | Approve only if production row exists and checklist passes |
| `1236820` | Day for Elephant Half-Day Afternoon | Approve only if production row exists and checklist passes |
| `1236830` | Day for Elephant & Bamboo Rafting Adventure Meets Natural Beauty | Approve only if production row exists and checklist passes |

## 9. Approval checklist after query

A returned row is not automatically approved. Each candidate still needs this checklist:

| Check | Required result |
| --- | --- |
| `id` is a real production public product ID | Pass |
| `active` is true | Pass |
| `supplierIdPresent` is true | Pass |
| `bokunActivityId` exactly equals an owner-managed Bókun ID | Pass |
| `title` reasonably matches the owner-managed profile title | Pass |
| `city`/`location` match the expected destination context | Pass |
| Handoff URL comes only from `ownerManagedBokunProfiles` | Pass |
| Handoff URL passes `validatePublicBookingPartnerHandoff` | Pass |
| `/tours/{id}` remains `noindex,nofollow` | Pass |
| `/tours/{id}` remains excluded from sitemap | Pass |

Only rows that pass this checklist can be converted into:

```ts
{
  publicProductId: 'PRODUCTION_BOKUN_PRODUCT_ID',
  ownerManagedBokunId: 'OWNER_MANAGED_BOKUN_ID',
  reviewedBy: 'operator_manual_review',
  reviewNote: '...'
}
```

## 10. Stop conditions

Stop immediately and do not document candidate rows if any of these happen:

- query is not read-only;
- production credential source is ambiguous;
- the command would print the production DB URL;
- the query would select `rawJson` or private supplier fields;
- the query asks for rates, commission, customer, booking, order, or payment data;
- Bókun API or sync would be called;
- the DB connection points to an unexpected host or database;
- the command requires schema migration or DB write privileges;
- any result contains sensitive data outside the allowed output fields.

## 11. What the follow-up execution task may do

The follow-up execution task may:

- retrieve the approved production DB URL from an approved secret source;
- print only redacted connection metadata;
- execute the exact SQL in this document;
- document only the allowed fields and summary counts;
- create a docs-only report PR.

It must not:

- add mapping entries;
- modify app code;
- deploy;
- write DB records;
- run migrations;
- call Bókun;
- change SEO or sitemap.

## 12. Recommended follow-up task

Only after explicit approval, run:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PROD-READONLY-1
```

Expected output:

```text
docs/radarscout-tour-detail-handoff-mapping-prod-readonly-result.md
```

If one or more production rows pass the checklist, the next implementation task may be:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING
```

If no rows pass, keep:

```text
ownerManagedProductHandoffMappings: empty
approved production mappings: 0
```

## 13. Guardrail confirmation

This plan did not:

- read production DB data;
- read `.env.production`;
- print secrets;
- write to any database;
- run migrations;
- change schema or environment variables;
- change app code;
- add mapping entries;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, booking submission, live availability, or inventory behavior;
- change robots metadata;
- add `/tours/{id}` to sitemap;
- deploy preview or production;
- touch ThaiEleHub or Shopify files.
