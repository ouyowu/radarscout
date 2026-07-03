# RadarScout preview DB schema and seed plan

Task: `TD-RADARSCOUT-PREVIEW-DB-SCHEMA-SEED-PLAN-0`

## 1. Current state

RadarScout now has a dedicated Supabase preview/staging database connection stored outside the repo:

- macOS Keychain service: `radarscout-preview-database-url`
- macOS Keychain account: `ouyowu`
- Vercel project: `ouyowus-projects / reddit-monitor`
- Vercel environment: `Preview`
- Vercel variable: `DATABASE_URL`

The secret value must not be printed, committed, copied into docs, or reused for production.

The current preview database connection is reachable, but the database is empty:

- public tables found: `0`
- expected Prisma models: `11`
- blocker: PR #171 preview smoke cannot prove DB-backed product detail behavior until preview schema and safe sample data exist.

## 2. Why PR #171 remains blocked

PR #171 must not be merged until a clean Vercel Preview smoke proves:

- `/api/products/[id]` can load product detail data;
- a product without a safe handoff renders the planning-only fallback;
- a product with a safe handoff still renders `Check availability`;
- CTA handoff remains external booking partner handoff only;
- there is no `/api/bokun` call;
- there is no OpenAI/LLM call;
- there is no checkout, payment, cart, booking submission, or DB write behavior.

Adding `DATABASE_URL` to Vercel Preview solved only the environment-variable gate. It did not create tables or safe product records.

## 3. Required schema surface

The current Prisma schema defines these models:

- `User`
- `Campaign`
- `Competitor`
- `Keyword`
- `Match`
- `Notification`
- `BokunSupplier`
- `BokunProduct`
- `ProductIssueFlag`
- `BokunProductEnrichment`
- `BookingInquiry`

The migration directory contains the full schema history from the initial app tables through the Bókun catalog, booking inquiry, enrichment, and product issue flag tables.

## 4. Approval-gated schema setup

The safe next step is not to run a migration immediately. The next task should generate and review the exact SQL or migration plan first.

Recommended next task:

```text
TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-PLAN-0
```

That task should:

1. use only the preview/staging `DATABASE_URL` from Keychain;
2. verify the target is the preview Supabase project, without printing the URL;
3. run a non-mutating migration status or SQL generation command where possible;
4. show the SQL or migration list to the user;
5. stop before any database write;
6. wait for explicit approval before applying migrations.

Do not run `prisma migrate deploy`, `prisma migrate dev`, `prisma db push`, SQL DDL, or seed writes without explicit approval after the plan is shown.

## 5. Preview seed data requirements

After the schema exists, PR #171 needs a small preview-safe product dataset. It should be minimal and purpose-built for product detail smoke, not a production catalog copy.

The seed should include at least:

1. one active `BokunProduct` with a safe booking handoff mapping in app-owned profiles;
2. one active `BokunProduct` without a safe booking handoff, to validate planning-only fallback;
3. safe city/location/title/description fields suitable for public preview testing;
4. no supplier net rate, partner rate, commission, internal Bókun backend copy, fake rating, fake review, live availability, available now, guaranteed slot, instant confirmation, checkout, payment, or booking-complete wording in public test data.

The seed must not:

- copy production secrets;
- copy full production catalog data;
- call Bókun API;
- sync or edit Bókun products;
- create booking inquiries;
- create checkout, payment, inventory, or availability behavior;
- write data to production.

## 6. Proposed approval sequence

Use this sequence to keep the gate controlled:

1. `TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-PLAN-0`
   - generate the preview schema application plan;
   - show migration list or SQL;
   - stop before write.
2. `TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-1`
   - only after explicit approval;
   - apply migrations to preview DB only;
   - verify expected tables exist.
3. `TD-RADARSCOUT-PREVIEW-DB-SEED-PLAN-0`
   - design the minimal safe preview product records;
   - show exact proposed seed data;
   - stop before write.
4. `TD-RADARSCOUT-PREVIEW-DB-SEED-APPLY-1`
   - only after explicit approval;
   - insert minimal preview-safe records;
   - verify no unsafe public copy.
5. `TD-RADARSCOUT-PR171-PREVIEW-SMOKE-RETRY`
   - redeploy PR #171 from a clean worktree;
   - smoke the DB-backed product detail API and tour pages;
   - stop before merge unless merge is explicitly approved.

## 7. Validation checklist for apply tasks

Before any preview DB write:

- confirm `DATABASE_URL` source is macOS Keychain service `radarscout-preview-database-url`;
- confirm Vercel Preview has `DATABASE_URL` by name only;
- confirm the target is not production;
- confirm `.env.production` was not read;
- confirm SQL or seed data has been shown and approved;
- confirm no production deploy is involved.

After schema apply:

- verify expected public tables exist;
- verify Prisma generate still passes;
- verify no production environment changed.

After seed apply:

- verify seeded product IDs are preview-safe;
- verify no unsafe tourist-facing copy;
- verify PR #171 smoke can test both handoff and no-handoff behavior.

## 8. Stop conditions

Stop immediately if:

- the target database cannot be verified as preview/staging;
- the command would use production `DATABASE_URL`;
- `.env.production` would be read;
- generated SQL includes unexpected destructive operations;
- seed data includes unsafe public wording;
- a command would write to DB without explicit approval;
- a command would call Bókun API, OpenAI/LLM, checkout/payment, or booking submission flows.

## 9. Current recommendation

Do not merge PR #171 yet.

Proceed next with:

```text
TD-RADARSCOUT-PREVIEW-DB-SCHEMA-APPLY-PLAN-0
```

That task should be a planning/SQL review gate only. It should not write to the database.
