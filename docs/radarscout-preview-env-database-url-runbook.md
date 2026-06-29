# RadarScout preview `DATABASE_URL` runbook

Task: `TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-0`

## 1. Current blocker

The post-merge preview for `TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1` deployed successfully, but DB-backed product detail API smoke is blocked in Vercel Preview because Preview has no `DATABASE_URL`.

Current candidate:

```text
Merge SHA: cfe092a3ae6534e42cb5a765f24edf42cb712d9d
Preview deployment: dpl_FnsGja9px6SiyTn3zVGn64CAsY99
Preview URL: https://reddit-monitor-jsbls7wt1-ouyowus-projects.vercel.app
Project: ouyowus-projects / reddit-monitor
Target: preview
```

Observed preview error:

```text
Environment variable not found: DATABASE_URL
```

Preview behavior:

- page routes load;
- no production aliases are attached;
- sitemap safety remains intact;
- no unsafe tour URLs are emitted in the sitemap;
- DB-backed product detail API requests return a safe error because Prisma cannot connect without `DATABASE_URL`.

## 2. Read-only env findings

Read-only Vercel checks found:

```text
Vercel Preview env: no variables found
Vercel Development env: no variables found
Vercel Production env: variables exist, including DATABASE_URL
```

Local non-production checks found:

```text
.env.development DATABASE_URL: present, but points to localhost / local dev DB
.env.local DATABASE_URL: absent
.env.test DATABASE_URL: absent or unavailable
process.env.DATABASE_URL in current shell: absent
```

The local development URL is not usable from Vercel Preview because it points to the local machine. It should not be added to Vercel Preview.

## 3. What is needed

Vercel Preview needs a cloud-accessible, non-production `DATABASE_URL` for the `reddit-monitor` project.

Safe options:

1. Create or identify a dedicated Preview/Staging Supabase Postgres database.
2. Add its `DATABASE_URL` to Vercel Preview only.
3. Keep Production `DATABASE_URL` unchanged.
4. Redeploy the post-merge preview from `cfe092a3ae6534e42cb5a765f24edf42cb712d9d`.
5. Rerun product detail API smoke using a known public product ID from `/api/products`.

## 4. Forbidden actions

Do not:

- print `DATABASE_URL` values in terminal output, logs, PRs, or docs;
- pull or decrypt Production secrets for reuse in Preview;
- copy Production `DATABASE_URL` into Preview unless explicitly approved as a temporary emergency exception;
- add a `localhost` or local dev DB URL to Vercel Preview;
- read `.env.production`;
- change Prisma schema;
- run migrations;
- write DB records;
- call Bókun API;
- change Bókun widget URLs;
- add checkout, payment, booking submission, live availability, or inventory behavior;
- open SEO `index,follow`;
- touch ThaiEleHub files or run Shopify commands.

## 5. Recommended Vercel setup

Use the Vercel Dashboard when possible so the secret value is never printed in terminal output:

```text
Vercel Dashboard
Project: reddit-monitor
Settings → Environment Variables
Name: DATABASE_URL
Environment: Preview
Value: <cloud preview/staging Postgres connection string>
Save
```

If CLI is used, paste the secret interactively and do not echo it:

```bash
npx vercel env add DATABASE_URL preview
```

After adding the variable, verify names only:

```bash
npx vercel env list preview
```

The command should confirm that `DATABASE_URL` exists for Preview without exposing its value.

## 6. Retry task after Preview DB is configured

After `DATABASE_URL` exists in Vercel Preview, run:

```text
TD-RADARSCOUT-TOUR-DETAIL-DATA-SAFETY-1-POSTMERGE-PREVIEW-RETRY
```

Retry scope:

- use a fresh clean worktree from `origin/codex/travel-mvp-launch`;
- confirm HEAD is `cfe092a3ae6534e42cb5a765f24edf42cb712d9d` or the latest approved merge SHA;
- run full validation;
- create a Vercel Preview deployment only;
- do not use `--prod`;
- smoke `/api/products` to identify a current public product ID;
- smoke `/api/products/{id}` for that product ID;
- confirm the response uses the public allowlist only;
- confirm `bookingEnabled:false`;
- confirm `availabilityEnabled:false`;
- confirm no unsafe internal fields are exposed;
- confirm sitemap still excludes `/tours/{id}`;
- stop after report.

## 7. Expected successful product detail smoke

The detail API should return `200` for a current public product ID from `/api/products`.

Expected public response shape:

```text
id
title
description
summary
city
destination
location
imageUrl
retailPrice
currency
facts
reviewedEnrichment
detailHref
meta
```

Expected safety state:

```text
meta.bookingEnabled: false
meta.availabilityEnabled: false
No partnerRate
No supplierNetRate
No commission
No Bókun backend/database/powered-by wording
No checkout/payment/booking submission behavior
```

## 8. Production deploy gate

Do not production deploy the tour detail data safety merge solely to bypass missing Preview env.

Production deploy remains a separate approval gate and requires explicit user approval for the merge SHA.

Even after production approval, the deploy must keep:

```text
No SEO index/follow opening
No Bókun API/edit/sync
No checkout/payment/booking submission
No DB/schema/env changes
No ThaiEleHub changes
```

## 9. Current recommendation

Add a dedicated cloud Preview/Staging `DATABASE_URL` to Vercel Preview, then rerun the post-merge preview smoke.

Until that is done, the safest status is:

```text
Tour detail data safety: merged
Preview deployment: READY
Preview DB-backed API smoke: blocked by missing Preview DATABASE_URL
Production deploy: not approved
Blockers: Preview DATABASE_URL missing
```
