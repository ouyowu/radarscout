# AGENTS.md

## 1. Think Before Coding
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them.
- If simpler approach exists, say so.
- If unclear, stop and ask.

## 2. Simplicity First
- No features beyond what was asked.
- No abstractions for single-use code.
- No speculative flexibility.
- If 200 lines could be 50, rewrite it.

## 3. Surgical Changes
- Don't improve adjacent code.
- Don't refactor things not broken.
- Match existing style.
- Remove only imports/variables YOUR changes made unused.

## 4. Goal-Driven Execution
- "Fix bug" → write failing test first, then fix, then confirm pass.
- "Refactor" → tests pass before AND after.
- Multi-step: state plan with verify steps before starting.

## 5. Project: RadarScout

### Tech stack
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS
- Database: Supabase (PostgreSQL) + Prisma ORM
- Queue: BullMQ + Redis
- Email: Resend
- Payments: Stripe
- Crawler: Node.js worker (RSS-first, no OAuth required)
- Package manager: pnpm (monorepo)

### Structure
apps/web/         # Next.js frontend
apps/crawler/     # Reddit polling worker (separate process)
packages/matcher/ # Aho-Corasick keyword engine
packages/db/      # Prisma schema + migrations
packages/mailer/  # Email templates + Resend client

### DATABASE RULES — CRITICAL
- NEVER run `prisma migrate deploy` automatically.
- After generating migration SQL, STOP. Show me the SQL. Wait for my explicit "yes" before continuing.
- Default to dev DB only. Never touch .env.production.
- Never delete database records, even in tests — use rollback transactions.

### Environment files
- .env.development → local dev (default)
- .env.test → docker-compose.test.yml isolated DB
- .env.production → DO NOT READ OR USE — human confirms all changes

### Crawler rules
- RSS-first: fetches `reddit.com/search.rss` + `r/all/new/.rss` per keyword; no OAuth required.
- Optional Google fallback via Serper.dev (`SERPER_API_KEY`); silently skipped if unset.
- Staggered polling: each keyword fires at `(90s / n) * i` offset within the 90s window.
- Compound seenIds key `${postId}:${keywordId}` — same post can match multiple keywords.
- Crawler has no direct DB write access — submits via internal API only.

### Stripe rules
- Never modify webhook handlers without showing the full diff first.
- Test with Stripe CLI in dev, never hit production Stripe in dev.

### What NOT to do
- Don't add AI/semantic features unless explicitly asked.
- Don't add logging frameworks — use console.log for now.
- Don't add analytics — not needed for MVP.

## Agent skills

### Issue tracker

Issues live in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Default mattpocock/skills label names (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
