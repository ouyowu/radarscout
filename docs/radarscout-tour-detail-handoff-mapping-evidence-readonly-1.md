# RadarScout tour detail handoff mapping evidence read-only check

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-READONLY-1`

## 1. Purpose

Run a tightly scoped read-only query against the approved non-production Preview database to find active Thailand products whose `bokunActivityId` matches the owner-managed handoff candidate list.

This report is docs-only. It does not change app code, product data, database records, database schema, environment variables, Bókun behavior, checkout behavior, sitemap output, robots metadata, deployment state, or ThaiEleHub assets.

## 2. Credential and environment source

Credential source:

```text
macOS Keychain item: radarscout-preview-database-url
```

The database URL was not printed.

Redacted connection summary:

```text
protocol: postgresql
host: aws-1-ap-southeast-2.pooler.supabase.com
port: 6543
database: postgres
user present: yes
password present: yes
sslmode used: require
environment classification: Preview / non-production
```

## 3. Query boundary

The query was executed inside a read-only transaction:

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

Allowed output fields only:

```text
id
title
city
location
bokunActivityId
active
supplierIdPresent
```

The query did not select:

```text
rawJson
supplier private fields
rates
commission
backend URLs
credentials
customer data
booking data
```

## 4. Query result

Matched rows:

```text
1
```

| id | title | city | location | bokunActivityId | active | supplierIdPresent |
| --- | --- | --- | --- | --- | --- | --- |
| `preview-tour-handoff-1232729` | Preview Chiang Mai Elephant Care Morning | Chiang Mai | Chiang Mai, Thailand | `1232729` | true | true |

Missing owner-managed candidate IDs in Preview DB:

```text
1232731
1232733
1232736
1232798
1232799
1236811
1236820
1236830
```

## 5. Candidate assessment

The Preview database contains one matching seed-style product:

```text
publicProductId: preview-tour-handoff-1232729
ownerManagedBokunId: 1232729
```

Assessment:

```text
Preview wiring candidate only.
Not approved as a production mapping candidate.
```

Reason:

- the product ID is explicitly preview-style;
- the title is explicitly preview-only;
- the query ran against non-production Preview DB, not production;
- this proves the read-only evidence path works, but it does not identify a real production `BokunProduct.id`;
- adding this mapping to shared app code would not solve real production handoff coverage.

## 6. Approval status

Current owner-managed mapping approval status:

```text
approved production mapping candidates: 0
preview-only wiring candidates: 1
needs production-safe evidence: 9 owner-managed IDs
```

Do not start:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-1C-FIRST-APPROVED-MAPPING
```

for a production mapping from this evidence alone.

## 7. What this check proves

This check proves:

- the Preview DB credential can be read from Keychain without printing the secret;
- a read-only transaction can safely query the allowed product fields;
- `bokunActivityId = 1232729` exists in Preview DB for a seed product;
- the owner-managed mapping evidence packet format is usable.

This check does not prove:

- a real production public product ID for `1232729`;
- any real production mapping for Living Green or Big Boy products;
- any broad `/tours/{id}` handoff coverage;
- any SEO readiness for tour detail pages.

## 8. Recommended next step

Recommended next task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-EVIDENCE-PROD-READONLY-PLAN
```

Goal:

Plan, but do not execute, a production read-only query for the same allowed fields.

The plan should include:

- exact SQL;
- exact output fields;
- confirmation that `rawJson`, supplier private fields, rates, commission, backend URLs, secrets, customer data, and booking data are excluded;
- requirement for explicit user approval before any production DB read.

Alternative operational path:

```text
Use an operator/manual catalog source to provide one approved publicProductId + ownerManagedBokunId evidence packet.
```

## 9. Guardrail confirmation

This task did not:

- write to the database;
- run migrations;
- change Prisma schema;
- change environment variables;
- read `.env.production`;
- print database credentials;
- select `rawJson`;
- select supplier private fields;
- select rates or commission;
- call Bókun API;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- change robots metadata;
- add `/tours/{id}` to sitemap;
- deploy preview or production;
- touch ThaiEleHub or Shopify files.
