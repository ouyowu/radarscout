# Task Plan — Reddit Monitor

## Project
SaaS that monitors Reddit for keyword matches and emails alerts to subscribers. Paid via Stripe.

## Status
- [x] Phase 1: Monorepo scaffold + tooling
- [x] Phase 2: Database schema + Prisma setup
- [x] Phase 3: Reddit crawler worker
- [x] Phase 4: Keyword matcher engine (Aho-Corasick)
- [x] Phase 5: Next.js frontend (auth, dashboard, monitor CRUD, internal API)
- [x] Phase 6: Email delivery (Resend)
- [x] Phase 7: Stripe billing integration
- [x] Phase 8: Production hardening (security headers, error boundaries, health check)

## What's built
- pnpm monorepo: apps/web (Next.js 14), apps/crawler (BullMQ worker), packages/db (Prisma), packages/matcher (Aho-Corasick), packages/mailer (Resend)
- Supabase Auth (email/password + magic link callback)
- Dashboard: list/create monitors (subreddit + keywords), billing page with Stripe checkout
- Crawler: polls Reddit via OAuth, rate-limited (60 req/min), submits matches to internal API
- Email alerts via Resend on match creation
- Stripe checkout + webhook (PRO/FREE plan enforcement)
- Security headers, error boundaries, /api/health, env validation

## Decisions
- Monitor concept stored as Keyword.flags = { subreddit } — no separate Monitor table
- Crawler has no direct DB access — uses internal API only (security boundary)
- No AI/semantic features for MVP
- console.log only, no logging framework

## Open — Next Steps
- Push to GitHub, set up CI (GitHub Actions)
- Deploy: Vercel (web) + Fly.io or Railway (crawler)
- Fill in real credentials (.env.development) and smoke test locally
- Create CONTEXT.md for domain documentation
- UI polish (consider ui-ux-pro-max skill)
