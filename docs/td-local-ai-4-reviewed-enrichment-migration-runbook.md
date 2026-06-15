# TD-LOCAL-AI-4 Reviewed Enrichment Migration Runbook

## Purpose

This runbook documents how to safely apply the reviewed product enrichment database migration.

This document does not approve execution by itself. Running the migration requires explicit human approval for one specific environment: local/dev, staging, or production.

Until the migration is applied to a target database, runtime endpoints that write `BokunProductEnrichment` may fail against that database because the table may not exist yet.

## Current Merged Code State

The current mainline includes:

- Prisma schema model `BokunProductEnrichment`.
- Migration SQL for the reviewed enrichment table.
- Protected internal reviewed enrichment write endpoint.
- Mock-based tests for the reviewed write endpoint.

No production database migration has been run as part of the merged code changes.

## Target Migration

Migration folder:

```text
packages/db/prisma/migrations/20260615120000_add_bokun_product_enrichment
```

Migration file:

```text
packages/db/prisma/migrations/20260615120000_add_bokun_product_enrichment/migration.sql
```

Summary:

- Creates the `BokunProductEnrichment` table.
- Adds a unique index on `productId`.
- Adds a foreign key from `BokunProductEnrichment.productId` to `BokunProduct.id`.
- Uses `ON DELETE CASCADE`.
- Uses `ON UPDATE CASCADE`.
- Must not alter existing `BokunProduct` source columns.

## Environment Separation

### Local / Dev

Approval:

- The project owner or active developer may approve execution.

Database target:

- Use the local development `DATABASE_URL`, usually from `.env.development`.
- Confirm it points to a local/dev database, not production.

Before running commands:

- Print only a redacted `DATABASE_URL` host/database summary.
- Confirm the current branch and commit.
- Confirm the migration file exists.
- Backup is optional for disposable local DBs, but recommended if the local DB has useful synced products.

### Staging

Approval:

- The project owner must explicitly approve staging execution.

Database target:

- Use the staging `DATABASE_URL` only.
- Confirm the host, database name, and environment label before running commands.

Before running commands:

- Confirm staging backup or snapshot exists.
- Confirm no staging sync or review job is running.
- Confirm the target commit includes PR #38 and PR #39.

### Production

Approval:

- Production execution requires explicit human approval for production specifically.

Database target:

- Use the production `DATABASE_URL` only when intentionally approved.
- Do not use production credentials in a local shell unless the owner explicitly approves that exact workflow.

Production safety rules:

- Do not run against production without explicit approval.
- Do not reuse local or staging commands blindly.
- Confirm the `DATABASE_URL` target twice.
- Confirm a database backup or snapshot exists.
- Confirm no active release, sync job, or review workflow is writing conflicting data.
- Confirm the protected reviewed endpoint should remain unused until migration succeeds.

## Pre-Execution Checklist

Before any approved migration execution:

- [ ] Pull latest `codex/travel-mvp-launch`.
- [ ] Confirm the current commit includes PR #38 and PR #39.
- [ ] Confirm the migration file exists.
- [ ] Confirm there are no uncommitted local changes.
- [ ] Confirm the correct `DATABASE_URL` is loaded.
- [ ] Confirm the target environment: local/dev, staging, or production.
- [ ] Confirm backup or snapshot requirements for that environment.
- [ ] Confirm current migration status.
- [ ] Confirm the protected reviewed endpoint should not be used until migration succeeds.

Suggested inspection commands only:

```bash
git status
git rev-parse --abbrev-ref HEAD
git log --oneline -5
ls packages/db/prisma/migrations/20260615120000_add_bokun_product_enrichment
cat packages/db/prisma/migrations/20260615120000_add_bokun_product_enrichment/migration.sql
```

Prisma inspection command:

```bash
pnpm --filter @reddit-monitor/db exec prisma migrate status
```

Important: `prisma migrate status` connects to `DATABASE_URL`. Run it only after confirming the intended target environment.

## Migration SQL Summary

The migration SQL currently checked into the repository is:

```sql
-- CreateTable
CREATE TABLE "BokunProductEnrichment" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "cleanedTitle" TEXT,
    "shortSummary" TEXT,
    "suggestedTags" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BokunProductEnrichment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BokunProductEnrichment_productId_key" ON "BokunProductEnrichment"("productId");

-- AddForeignKey
ALTER TABLE "BokunProductEnrichment" ADD CONSTRAINT "BokunProductEnrichment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BokunProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

This migration must not drop tables, alter existing `BokunProduct` source columns, rename columns, delete data, or create public product behavior.

## Execution Command

Do not run this command until explicit approval is given for a specific environment:

```bash
pnpm --filter @reddit-monitor/db exec prisma migrate deploy
```

Execution notes:

- This command applies pending migrations to the target `DATABASE_URL`.
- It must only be run after explicit approval.
- It must not be run accidentally from the wrong shell or wrong environment.
- It must not be run by Codex automatically.
- It must not be run if the target database is unclear.

## Forbidden Actions

Do not:

- Run `prisma migrate deploy` without explicit approval.
- Run `prisma migrate dev` against production.
- Use production `DATABASE_URL` locally unless intentionally approved.
- Edit `migration.sql` after it has been reviewed unless a new PR is opened.
- Manually create or drop tables in production without approval.
- Test by writing real reviewed enrichment data into production unless approved.
- Enable public product read integration before migration is applied and verified.

## Post-Execution Verification

After approved execution, verify migration state:

```bash
pnpm --filter @reddit-monitor/db exec prisma migrate status
```

Suggested SQL checks, using `psql` or a database console:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'BokunProductEnrichment';
```

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'BokunProductEnrichment';
```

```sql
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'BokunProductEnrichment';
```

Optional Prisma smoke check:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
```

Optional app check:

```bash
pnpm --filter @reddit-monitor/web exec tsc --noEmit
```

Expected verification outcome:

- `BokunProductEnrichment` table exists.
- `BokunProductEnrichment_productId_key` index exists.
- `BokunProductEnrichment_productId_fkey` foreign key exists.
- Prisma migrate status reports the migration as applied for the target database.

## Rollback / Remediation Strategy

Prisma does not automatically roll back `migrate deploy`.

If migration execution fails before completion:

- Stop immediately.
- Capture the full error.
- Inspect whether the table, index, or foreign key was partially created.
- Do not manually drop objects without approval.

If a rollback is needed:

- Prepare rollback SQL in a separate emergency approval step.
- Review the rollback SQL before running it.
- Confirm whether any reviewed enrichment data has been written.
- Back up data before destructive actions.

Possible rollback direction, only if no reviewed enrichment data has been written and human approval is given:

```sql
DROP TABLE "BokunProductEnrichment";
```

This is not a recommended automatic action. Do not delete reviewed enrichment data without backup and approval.

## Next Steps After Successful Migration

After the migration is applied and verified:

1. TD-LOCAL-AI-4C-B can add a reviewed enrichment read adapter.
2. Public product API integration should happen only after read adapter tests pass.
3. Frontend or admin UI should come later, not as part of migration execution.
4. AI candidates must still never be exposed directly.
5. Public product responses must only read manually reviewed enrichment.

## Non-Goals

This runbook PR does not:

- Execute migration.
- Modify Prisma schema.
- Modify migration SQL.
- Add API routes.
- Change frontend UI.
- Change public product API behavior.
- Write database data.
- Connect to production DB.
- Change Bókun sync.
- Change local AI runtime.
- Add package dependencies.
