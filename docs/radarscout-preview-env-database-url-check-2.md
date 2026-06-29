# RadarScout preview environment DATABASE_URL check 2

Task: `TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-2`

## 1. Purpose

Explain why Vercel Preview deployments cannot currently smoke-test DB-backed public product data, including tour detail handoff behavior, and define the next safe gate.

This was a read-only check. It did not change app code, deployment state, Vercel environment variables, database schema, database data, Bókun behavior, sitemap output, robots metadata, SEO index/follow state, or ThaiEleHub/Shopify files.

## 2. Background

Recent preview smoke tests for tour detail handoff work found this limitation:

```text
Vercel Preview currently has no public product data for DB-backed smoke.
```

That limitation matters because product detail pages and `/api/products` depend on database-backed product data. If Preview has no usable database connection or no preview-accessible product dataset, preview smoke can still validate build, routes, UI guards, and tests, but it cannot prove production-like product data behavior.

## 3. Read-only checks performed

The check used a clean worktree from:

```text
origin/codex/travel-mvp-launch
```

Confirmed Vercel project metadata:

```json
{
  "projectIdPresent": true,
  "orgIdPresent": true,
  "projectName": "reddit-monitor"
}
```

Checked environment variable targets with:

```bash
npx vercel env ls --scope ouyowus-projects
```

No environment values were pulled or printed. No `.env.production` file was read. No `vercel env pull`, `vercel env add`, `vercel env rm`, deploy, promote, or production command was run.

## 4. Finding

The Vercel project is correct:

```text
ouyowus-projects / reddit-monitor
```

The environment list shows `DATABASE_URL` configured for:

```text
Production
```

It does not show `DATABASE_URL` configured for:

```text
Preview
```

This is the likely reason Preview deployments cannot load DB-backed public product data.

## 5. Impact

Until Preview has an approved database configuration:

- preview deployments may return empty product data for DB-backed public product routes;
- tour detail handoff behavior can be validated by unit/render tests, but not fully smoke-tested against preview product data;
- production deploy must not be used as a substitute for preview data configuration;
- Source 2 operator handoff implementation should still require a reviewed URL and normal tests before any preview or production gate.

## 6. What not to do

Do not blindly copy Production `DATABASE_URL` into Preview.

Do not read or print `.env.production`.

Do not use `vercel env pull` to expose secrets.

Do not create DB writes or migrations to solve preview smoke.

Do not point Preview at production data unless there is an explicit approval and the risk is accepted.

Do not change Prisma schema, environment variables, Bókun behavior, checkout behavior, sitemap output, or SEO index/follow state as part of this check.

## 7. Safe next options

### Option A: Keep current Preview limitation

Continue to rely on:

- unit tests;
- render tests;
- TypeScript;
- Next build;
- production smoke after explicit deploy approval.

This is safest operationally, but keeps DB-backed preview smoke limited.

### Option B: Add a dedicated Preview database URL

Configure `DATABASE_URL` for the Vercel Preview environment using a non-production or explicitly approved preview-safe database.

This requires explicit approval for an environment variable change and a secret injection method that does not print the value.

Recommended task:

```text
TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-ADD-APPROVAL
```

Required gates:

- human supplies or approves the exact target database;
- no secret value is printed in logs;
- no `.env.production` read;
- no migration run;
- no DB write;
- verify only that Preview can connect and read expected public-safe product data.

### Option C: Create a small preview-safe seed dataset later

Use a separate preview database with a minimal public-safe dataset.

This is the cleanest long-term preview testing model, but requires a separate schema/data workflow and explicit DB approval before implementation.

## 8. Recommendation

Use Option B only if the team wants reliable preview smoke for DB-backed public product pages.

Otherwise, keep the current limitation documented and do not block docs-only or unit-test-backed work on preview DB availability.

Do not proceed with any environment variable change without explicit approval.

## 9. Current status

```text
Preview DATABASE_URL target: not configured
Production DATABASE_URL target: configured
Project: ouyowus-projects / reddit-monitor
Secrets printed: no
Environment changed: no
Deploy run: no
DB/schema changed: no
Bókun behavior changed: no
SEO index/follow changed: no
ThaiEleHub/Shopify touched: no
```
