# RadarScout Release SOP (one page)

The standard operating procedure for shipping any RadarScout change. Follow it
top to bottom. It exists to keep velocity high AND keep the red lines safe.
Last proven end-to-end: 2026-07-07 (honest-naming + Option B production deploy).

## Roles

- **Paperclip (local team)** — CEO decides *what/why*, CTO sets *boundaries +
  acceptance*, Engineer *implements* (one branch, one task), QA *blocks* by
  re-running checks from a clean worktree.
- **Hermes (supervisor)** — independent PR review. Hard-blocks only on the red
  lines below; advisory on everything else.
- **Human (you)** — approves merge, deploy, and anything on the red lines.
  Only the human runs production deploy.
- **Advisor (ChatGPT/Claude)** — key-node judgment: safe to merge / preview /
  deploy, or rework.

Principle: **Engineer implements · QA blocks · Hermes supervises · you approve ·
advisor judges.** No one approves their own work.

## Red lines (Hermes hard-block; human approval required)

ThaiEleHub / Shopify · DB / Prisma schema / migration / env / `.env*` ·
`robots` / `sitemap` / SEO `index,follow` · checkout / payment / cart / booking /
availability / inventory behavior · Bókun API / sync · fabricated products /
prices / suppliers / booking URLs · production deploy.

RadarScout = `/Users/ouyowu/reddit-monitor` (repo `ouyowu/radarscout`).
ThaiEleHub (Shopify theme) is a separate project — never touched by a RadarScout
task, and vice-versa.

## Per-task flow

1. **Step 0 — is it already built?** Engineer greps the repo and reports
   present / partial / absent BEFORE writing code. (This repo is already heavily
   built; skipping Step 0 causes redundant PRs.)
2. **CEO note** — why + business value (a measurable user/traffic/conversion
   signal, not "a doc exists").
3. **CTO note** — allowed files, explicit non-goals, acceptance criteria.
4. **Engineer** — new branch off `codex/travel-mvp-launch`, clean worktree,
   minimal diff, no scope creep.
5. **QA** — re-run checks from a clean worktree (do not trust self-report).
6. **Hermes** — red-line review.
7. **Human** — read the report; approve or rework.

## Risk tiers (don't run the full chain on small work)

| Change type            | Required process                                        |
| ---------------------- | ------------------------------------------------------- |
| Docs-only status       | diff check; no PR unless it changes a decision; batch   |
| Local tooling / scripts| targeted script tests; one smoke if relevant            |
| UI / product code      | Engineer + QA + Hermes; full local gate                 |
| Prod deploy            | full gate + human "Approve production deploy" + human runs it |
| DB / schema / env / SEO| explicit written plan + human approval before execution |

## Standard local gate (UI/product code)

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web exec vitest run   # scope to touched dirs for speed
pnpm --filter @reddit-monitor/web exec playwright test
pnpm --filter @reddit-monitor/web build
git diff --check
```

Trip Planner also: `pnpm smoke:ai-trip-local:production` (expect 200, title
`Thailand Trip Planner | RadarScout`, robots `noindex,nofollow`, cards render,
unsafeNetwork none, forbiddenMatches none).

## Production deploy (Option B — human only)

1. **Anchor to the real code SHA**, never a docs/merge commit. The candidate is
   the deployable branch tip; confirm the last real `app/` / `lib/` code commit
   and that its tree matches the tip.
2. Run the full local gate above from a clean worktree; all green; `git diff
   --check` clean.
3. Record the candidate in `docs/radarscout-ai-trip-status.md` (update in place):
   exact SHA, gate results, accepted preview-quota limitation, deploy command,
   rollback, post-deploy checklist.
4. **Human approval gate** — human says: `Approve production deploy — <SHA>`.
5. **Human runs** (agent never does):

   ```bash
   rm -rf /private/tmp/radarscout-prod-<shortsha>
   git -C /Users/ouyowu/reddit-monitor worktree add /private/tmp/radarscout-prod-<shortsha> <SHA>
   cd /private/tmp/radarscout-prod-<shortsha>
   npx vercel link --yes --project reddit-monitor --scope ouyowus-projects
   npx vercel --prod --yes
   ```

6. **Post-deploy observation** — read-only smoke against the live URL
   (`https://www.radarscout.io/ai-trip-planner`): 200, noindex, cards, no unsafe
   network, no forbidden copy; confirm `/chiang-mai/elephant-camp-finder` is the
   only `index:true` marketing page. Record in the status doc.

## Rollback

No DB/schema is involved in a Trip Planner deploy, so rollback is deployment-only
and instant: Vercel dashboard → previous production deployment, or `vercel
rollback`. If any post-deploy assertion fails, roll back first, investigate after.

## Never automate

Production deploy · SEO `index,follow` opening · DB/schema/env changes. These are
always explicit, human-approved, one at a time.

## Weekly review (keep the org honest)

Each week: what shipped, which PRs delivered real product value vs. docs/process,
whether we're closer to orders / traffic / partners, and the top 3 tasks next
week. Red flag: a week where >50% of merged PRs are docs/process — freeze process
work and ship product.
