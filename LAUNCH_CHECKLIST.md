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

### Crawler (`apps/crawler`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REDDIT_CLIENT_ID` | Yes | Reddit OAuth app client ID — from reddit.com/prefs/apps |
| `REDDIT_CLIENT_SECRET` | Yes | Reddit OAuth app client secret |
| `REDDIT_USER_AGENT` | Yes | Reddit API user agent string. Reddit TOS requires format: `<appname>/<version> by u/<yourusername>` |
| `REDDIT_USERNAME` | No | Reddit account username — enables password grant for higher rate limits |
| `REDDIT_PASSWORD` | No | Reddit account password — required if `REDDIT_USERNAME` is set |
| `INTERNAL_API_URL` | Yes | Base URL of the Next.js web app (same value as `NEXT_PUBLIC_BASE_URL`) |
| `INTERNAL_API_SECRET` | Yes | Must match the value set in the web app |
| `REDIS_URL` | Yes | Same Redis instance as the web app |

---

## Manual Steps Before Going Live

### 1. Reddit App Setup
- Go to https://www.reddit.com/prefs/apps
- Click **Create app** → choose type **script**
- Set redirect URI to `http://localhost:8080` (unused but required)
- Copy the **client ID** (under the app name) and **client secret**
- Set `REDDIT_USER_AGENT` — Reddit bans clients with generic user agents

### 2. Database — Production Migration
```bash
# Run against your production DATABASE_URL
pnpm --filter @reddit-monitor/db exec prisma migrate deploy
```
- Verify tables: `User`, `Keyword`, `Match`, `Notification`
- **Never** run `prisma migrate dev` in production

### 3. Stripe Setup
1. In the Stripe Dashboard, create two Products:
   - **Pro** → add a recurring price of $19/month → copy the `price_...` ID → `STRIPE_PRO_PRICE_ID`
   - **Team** → add a recurring price of $49/month → copy the `price_...` ID → `STRIPE_TEAM_PRICE_ID`
2. Create a Webhook endpoint:
   - Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the signing secret (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`
3. Test locally before going live:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   stripe trigger checkout.session.completed
   ```

### 4. Resend Email Setup
- Add and verify your sending domain in the Resend dashboard (DNS TXT/CNAME records)
- Create an API key with **Sending access** permission
- Set `RESEND_FROM_EMAIL` to an address on the verified domain (e.g. `alerts@yourdomain.com`)
- Test by triggering a match and confirming the email arrives

### 5. Redis
- Provision a Redis instance (Upstash, Redis Cloud, or self-hosted)
- Both the web app and crawler must point to **the same Redis instance**
- Verify connectivity: `redis-cli -u "$REDIS_URL" ping` → should return `PONG`

### 6. Crawler Deployment
- The crawler is a **long-running Node.js process**, not a serverless function
- Deploy separately from the web app (Railway, Fly.io, a VPS, etc.)
- Start command: `pnpm --filter @reddit-monitor/crawler start`
- Ensure it can reach both `INTERNAL_API_URL` and `REDIS_URL`
- Monitor logs for `[engine]` and `[webhook]` prefixes

### 7. Pre-Launch Smoke Test
- [ ] Register a new account at `/auth/register`
- [ ] Add a keyword at `/dashboard`
- [ ] Manually trigger a test match via the crawler; verify email received within 60s
- [ ] Test Stripe checkout with test card `4242 4242 4242 4242`
- [ ] Verify webhook updates user plan (check DB: `SELECT plan FROM "User" WHERE email = '...'`)
- [ ] Test subscription cancellation in Stripe test mode; verify plan reverts to FREE
- [ ] Check `/sitemap.xml` returns valid XML with 4 URLs
- [ ] Check `/robots.txt` returns expected content
- [ ] Load landing page at 375px, 768px, and 1280px — no horizontal scroll

### 8. Fix `.env.example` Before Committing
The current `.env.example` has **stale Supabase variables** (no longer used) and is missing two variables added in Sprints 4–5. Update manually:

**Remove:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Add:**
```
# Stripe — Team plan price ID (added Sprint 5)
STRIPE_TEAM_PRICE_ID=price_...

# Public base URL — used for Stripe success/cancel URLs and sitemap (added Sprint 5)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
