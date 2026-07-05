# RadarScout preview DB schema apply plan

Task: `TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-PLAN-0`

## 1. Purpose

RadarScout Preview now has a dedicated Supabase preview/staging database URL configured in Vercel Preview, but the database has no Prisma tables yet. PR #171 still cannot complete DB-backed product detail preview smoke until the preview database has the app schema.

This document is the review gate before any database write.

No migration has been applied by this task.

## 2. Current known state

- Project: RadarScout only
- Repository: `/Users/ouyowu/reddit-monitor`
- Vercel project: `ouyowus-projects / reddit-monitor`
- Vercel environment: `Preview`
- Vercel variable: `DATABASE_URL`
- Secret source: macOS Keychain service `radarscout-preview-database-url`, account `ouyowu`
- Preview DB status from prior read-only check: reachable but empty
- Public tables found in preview DB: `0`

The database URL must not be printed, committed, pasted into PR text, or used for production.

## 3. Schema source of truth

The schema source is:

```text
packages/db/prisma/schema.prisma
```

The migration source is:

```text
packages/db/prisma/migrations
```

The migration lock file uses PostgreSQL:

```text
packages/db/prisma/migrations/migration_lock.toml
```

## 4. Migration list to apply

If approved, `prisma migrate deploy` would apply the existing migration chain in order to the preview database only.

| Order | Migration | Main effect |
| --- | --- | --- |
| 1 | `20260509000000_init` | Creates `Plan`, `Platform`, `User`, `Keyword`, `Match`, `Notification`, indexes, and initial FKs. |
| 2 | `20260509191529_add_ai_scoring_fields` | Adds AI scoring/draft fields to `Match`. |
| 3 | `20260509192918_add_product_description` | Adds `User.productDescription`. |
| 4 | `20260509193422_add_starter_plan` | Adds `STARTER` to `Plan`. |
| 5 | `20260510000000_add_email_enabled_and_match_unique` | Adds `User.emailEnabled` and unique `Match(keywordId, postId)`. |
| 6 | `20260511065013_add_campaign_architecture` | Adds `Campaign`, `Competitor`, campaign relations, and match intelligence columns. |
| 7 | `20260512090000_add_travel_intelligence_fields` | Adds travel-focused platform enum values and travel intelligence fields to `Match`. |
| 8 | `20260608141000_add_bokun_catalog` | Adds `BokunSupplier`, `BokunProduct`, indexes, and supplier/product FK. |
| 9 | `20260608150000_add_booking_inquiries` | Adds `BookingInquiry` and product inquiry indexes/FK. |
| 10 | `20260615120000_add_bokun_product_enrichment` | Adds `BokunProductEnrichment`, unique product relation, and FK. |
| 11 | `20260620000000_add_product_issue_flag` | Adds `ProductIssueFlag`, indexes, and product FK. |

## 5. Expected tables after schema apply

After a successful approved schema apply, the preview DB should contain these Prisma application tables:

- `User`
- `Campaign`
- `Competitor`
- `Keyword`
- `Match`
- `Notification`
- `BokunSupplier`
- `BokunProduct`
- `BookingInquiry`
- `BokunProductEnrichment`
- `ProductIssueFlag`

Prisma will also maintain its migration metadata table.

## 6. Destructive-operation review

The migration SQL was inspected locally.

No standalone `DROP`, `TRUNCATE`, or `DELETE` data-removal statements were found in the migration files.

The only `DELETE` text found is inside foreign-key behavior such as:

- `ON DELETE CASCADE`
- `ON DELETE RESTRICT`
- `ON DELETE SET NULL`

That FK behavior is part of the existing Prisma schema. The preview database is currently empty, so applying this migration chain should not remove existing preview application data.

## 7. Command that would apply schema after approval

Do not run this command until explicitly approved for the preview database.

```bash
DATABASE_URL="$(security find-generic-password -a ouyowu -s radarscout-preview-database-url -w)" \
  pnpm --filter @reddit-monitor/db exec prisma migrate deploy
```

This command must be run only from a clean RadarScout worktree and only with the Keychain preview/staging database URL.

## 8. Pre-apply checks required before running the command

Before schema apply, verify:

1. The worktree is clean:

   ```bash
   git status --short
   ```

2. The Vercel Preview env contains `DATABASE_URL` by name only:

   ```bash
   npx vercel env ls preview --scope ouyowus-projects
   ```

3. The Keychain item exists without printing its value:

   ```bash
   security find-generic-password \
     -a ouyowu \
     -s radarscout-preview-database-url >/dev/null \
     && echo "radarscout preview db url stored"
   ```

4. `.env.production` is not read or used.
5. No production Vercel command is run.
6. No seed data is inserted during the schema apply step.

## 9. Post-apply verification commands

After an explicitly approved schema apply, verify table presence without printing secrets:

```bash
DATABASE_URL="$(security find-generic-password -a ouyowu -s radarscout-preview-database-url -w)" \
  pnpm --filter @reddit-monitor/db exec prisma migrate status
```

Then run a read-only table existence check that reports table names/counts only.

Expected:

- all 11 Prisma application tables exist;
- Prisma migration status reports no pending migrations;
- no seed/product data has been inserted yet;
- production database was not touched.

## 10. What this task does not approve

This plan does not approve:

- `prisma migrate deploy`;
- `prisma migrate dev`;
- `prisma db push`;
- SQL DDL execution;
- seed data insertion;
- copying production data;
- production deploy;
- SEO index/follow opening;
- Bókun API calls;
- Bókun sync/edit;
- checkout, payment, cart, or booking submission behavior;
- OpenAI/LLM app behavior;
- reading `.env.production`.

## 11. Recommended next approval phrase

If this plan is accepted, the next human approval should be explicit:

```text
Approve TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-1 to run prisma migrate deploy against the Keychain radarscout-preview-database-url only.
```

After that apply step succeeds, the next separate task should be:

```text
TD-RADARSCOUT-PREVIEW-DB-SEED-PLAN-0
```

That seed plan should show the exact minimal preview-safe `BokunProduct` records before any insert happens.

## 12. Current recommendation

Proceed with schema apply only after explicit approval.

Do not merge PR #171 until:

1. preview schema exists;
2. minimal preview-safe product data exists;
3. PR #171 preview is redeployed from a clean worktree;
4. DB-backed product detail smoke proves both handoff and no-handoff behavior;
5. no unsafe network/API behavior is observed.
