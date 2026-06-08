# Production Database Handoff

This document is the handoff point for finishing the RadarScout Thailand travel MVP after the static site is live on Vercel.

## Current Production State

- `https://www.radarscout.io/` returns `200`.
- Vercel project: `reddit-monitor`.
- Vercel production aliases:
  - `https://radarscout.io`
  - `https://www.radarscout.io`
- Bókun server credentials are configured in Vercel Production.
- `POST /api/bokun/search` works against Bókun.
- `GET /api/bokun/products` intentionally falls back to an empty catalog until production Postgres is connected.

## Required Human Input

Provide a production PostgreSQL connection string:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

For Supabase serverless, prefer the pooled connection string with pgbouncer and a low connection limit, for example:

```text
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1
```

Do not use the local development URL:

```text
postgresql://postgres:postgres@localhost:5432/reddit_monitor_dev
```

## Migration SQL To Approve

The pending production migrations create these tables:

- `BokunSupplier`
- `BokunProduct`
- `BookingInquiry`

They also create indexes and foreign keys. They do not delete records.

Files:

- `packages/db/prisma/migrations/20260608141000_add_bokun_catalog/migration.sql`
- `packages/db/prisma/migrations/20260608150000_add_booking_inquiries/migration.sql`

Before running production migration, the human owner must explicitly approve:

```text
yes, use this production DATABASE_URL and run production migration
```

## Commands After Approval

Add the production database URL to Vercel:

```bash
pnpm dlx vercel env add DATABASE_URL production
```

Redeploy so the production functions receive `DATABASE_URL`:

```bash
pnpm dlx vercel deploy --prod --yes
```

Run Prisma migrations against the approved production database:

```bash
DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require' \
  pnpm --filter @reddit-monitor/db exec prisma migrate deploy
```

Sync Bókun catalog into production:

```bash
curl -X POST https://www.radarscout.io/api/internal/bokun/sync \
  -H "x-internal-secret: $INTERNAL_API_SECRET"
```

Verify products are live:

```bash
curl "https://www.radarscout.io/api/bokun/products?take=6"
```

Expected result:

- `count` is greater than `0`
- `products` includes real Bókun product records
- Homepage cards switch from curated fallback cards to live product cards

## Smoke Tests

After database connection, migration, redeploy, and sync:

```bash
curl -I https://www.radarscout.io/
curl https://www.radarscout.io/sitemap.xml
curl "https://www.radarscout.io/api/bokun/products?take=6"
curl -X POST https://www.radarscout.io/api/bokun/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"Phuket island","currency":"USD","commissionPercent":20}'
```

Manual browser checks:

- Homepage loads at 375px, 768px, 1280px.
- No horizontal scroll.
- Homepage shows six tour cards.
- Old Reddit URLs redirect to `/`.
- Booking inquiry flow works only after production database is connected.
