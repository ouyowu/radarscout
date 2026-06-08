# Launch Checklist

## Environment Variables

### Web app (`apps/web`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. Use port 5432 in dev; pgbouncer port 6543 on Supabase serverless. |
| `AUTH_SECRET` | Yes | NextAuth signing secret. Generate: `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | Yes | Stripe server-side secret key (`sk_live_...` in prod, `sk_test_...` in dev) |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe client-side publishable key (`pk_live_...` / `pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Webhook signature verification secret (`whsec_...`) — from Stripe Dashboard → Webhooks |
| `STRIPE_PRO_PRICE_ID` | Yes | Stripe Price ID for the Pro plan ($19/mo recurring) — format: `price_...` |
| `STRIPE_TEAM_PRICE_ID` | Yes | Stripe Price ID for the Team plan ($49/mo recurring) — format: `price_...` |
| `RESEND_API_KEY` | Yes | Resend API key (`re_...`) — for sending match alert emails |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address (must be on a domain verified in Resend dashboard) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public URL of the deployed web app, no trailing slash — used for Stripe success/cancel URLs and sitemap |
| `INTERNAL_API_SECRET` | Yes | Shared secret between crawler and web API. Generate: `openssl rand -hex 32` |
| `REDIS_URL` | Yes | Redis connection string — used by BullMQ for the crawler job queue |
| `BOKUN_ACCESS_KEY` | Yes | Bókun API access key. Server-side only; never expose with `NEXT_PUBLIC_`. |
| `BOKUN_SECRET_KEY` | Yes | Bókun API secret key used to sign requests. Server-side only; never commit it. |
| `BOKUN_API_BASE_URL` | Yes | Bókun API base URL. Production: `https://api.bokun.io`; sandbox: `https://api.bokuntest.com`. |
| `BOKUN_DEFAULT_CURRENCY` | Yes | Default display currency for Bókun searches, e.g. `USD`, `EUR`, or `THB`. |

---

## Manual Steps Before Going Live

### 1. Vercel Project Setup
- Link the monorepo to a Vercel project.
- Use the root `vercel.json`:
  - Install command: `pnpm install`
  - Build command: `pnpm --filter @reddit-monitor/web build`
  - Output directory: `apps/web/.next`
- Add `radarscout.io` and `www.radarscout.io` in Vercel Domains.
- Point DNS to Vercel and wait for SSL to become valid.

### 2. Database — Production Migration
```bash
# Run against your production DATABASE_URL
pnpm --filter @reddit-monitor/db exec prisma migrate deploy
```
- Verify tables for the travel MVP: `BokunSupplier`, `BokunProduct`, `BookingInquiry`
- **Never** run `prisma migrate dev` in production

### 3. Resend Email Setup
- Add and verify your sending domain in the Resend dashboard (DNS TXT/CNAME records)
- Create an API key with **Sending access** permission
- Set `RESEND_FROM_EMAIL` to an address on the verified domain (e.g. `hello@radarscout.io`)
- Test by submitting a booking inquiry and confirming the notification path works

### 4. Bókun Setup
- In Bókun, create a booking channel for RadarScout.
- Create an API key with the minimum permissions needed for product search, availability, and checkout.
- Store `BOKUN_ACCESS_KEY` and `BOKUN_SECRET_KEY` in Vercel Environment Variables, not in frontend code.
- Use sandbox first if available: `BOKUN_API_BASE_URL=https://api.bokuntest.com`.
- Smoke test the server API:
  ```bash
  curl -X POST http://localhost:3000/api/bokun/search \
    -H 'Content-Type: application/json' \
    -d '{"query":"Chiang Mai ethical elephant","currency":"USD","commissionPercent":20}'
  ```

### 5. Bókun Product Sync
- Set `INTERNAL_API_SECRET` in Vercel.
- Call the internal sync endpoint after deploy:
  ```bash
  curl -X POST https://www.radarscout.io/api/internal/bokun/sync \
    -H "x-internal-secret: $INTERNAL_API_SECRET"
  ```
- Confirm active products appear from:
  ```bash
  curl https://www.radarscout.io/api/bokun/products?take=6
  ```

### 6. Pre-Launch Smoke Test
- [ ] Load `https://www.radarscout.io` and confirm 200
- [ ] Submit a homepage travel prompt and confirm product cards render
- [ ] Test mobile widths: 375px, 768px, 1280px — no horizontal scroll
- [ ] Test `/api/bokun/search` with sandbox or production Bókun credentials
- [ ] Test `/api/bokun/products?take=6`
- [ ] Submit a booking inquiry from a product card or form
- [ ] Confirm the inquiry is stored in `BookingInquiry`
- [ ] Check `/sitemap.xml` returns valid XML for the travel site
- [ ] Check `/robots.txt` returns expected content

### 7. Optional Later Integrations
- Stripe checkout is still in the codebase from the previous SaaS version. Do not enable paid subscription checkout until the travel offer and checkout flow are finalized.
- The Reddit crawler is still in the monorepo from the previous product. It is not required for the Thailand travel MVP launch.
