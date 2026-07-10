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
- **Human (you)** — grants standing green-zone authority and separately approves
  anything on the red lines.
- **Advisor (ChatGPT/Claude)** — key-node judgment: safe to merge / preview /
  deploy, or rework.

Principle: **Engineer implements · QA blocks · Hermes supervises · standing
authority ships green work · the human decides red work.** No one may waive the
gate on their own change.

## Red lines (Hermes hard-block; human approval required)

ThaiEleHub / Shopify · DB / Prisma schema / migration / env / `.env*` ·
`robots` / `sitemap` / SEO `index,follow` · checkout / payment / cart / booking /
availability / inventory behavior · Bókun API / sync · fabricated products /
prices / suppliers / booking URLs · production deploys that contain red-zone
changes, require settings/env changes, or lack a clean independently reviewed SHA.

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
7. **Release** — after QA, Hermes, GitHub, and Vercel checks pass, merge the green
   PR, deploy the exact clean merge SHA when user-facing, and run production smoke.

## Risk tiers (don't run the full chain on small work)

| Change type            | Required process                                        |
| ---------------------- | ------------------------------------------------------- |
| Docs-only status       | diff check; no PR unless it changes a decision; batch   |
| Local tooling / scripts| targeted script tests; one smoke if relevant            |
| UI / product code      | Engineer + QA + Hermes; full local gate                 |
| Green prod deploy      | full gate + Hermes + exact clean SHA + automatic smoke/rollback |
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

## Production deploy (standing authorization for GREEN ZONE only)

1. **Anchor to the real code SHA**, never a docs/merge commit. The candidate is
   the deployable branch tip; confirm the last real `app/` / `lib/` code commit
   and that its tree matches the tip.
2. Run the full local gate above from a clean worktree; all green; `git diff
   --check` clean.
3. Confirm Hermes approval and successful GitHub/Vercel checks. Stop if the diff
   contains any red-zone path or needs a settings/env change.
4. Deploy from a fresh clean worktree at the exact merge SHA:

   ```bash
   rm -rf /private/tmp/radarscout-prod-<shortsha>
   git -C /Users/ouyowu/reddit-monitor worktree add /private/tmp/radarscout-prod-<shortsha> <SHA>
   cd /private/tmp/radarscout-prod-<shortsha>
   npx vercel link --yes --project reddit-monitor --scope ouyowus-projects
   npx vercel --prod --yes
   ```

5. **Post-deploy observation** — read-only smoke against the live URL
   (`https://www.radarscout.io/ai-trip-planner`): 200, noindex, cards, no unsafe
   network, no forbidden copy; confirm `/chiang-mai/elephant-camp-finder` is the
   only `index:true` marketing page. Record in the status doc.

## Rollback

No DB/schema is involved in a Trip Planner deploy, so rollback is deployment-only
and instant: Vercel dashboard → previous production deployment, or `vercel
rollback`. If any post-deploy assertion fails, roll back first, investigate after.

## Never automate under the standing release authorization

SEO `index,follow` expansion · DB/data writes/schema/migrations/env/secrets ·
Bókun API/edit/sync or supplier actions · checkout/payment/booking submission ·
ThaiEleHub/Shopify · spending/plan upgrades · ambiguous or irreversible actions.
These remain explicit, human-approved, one at a time.

## Weekly review (keep the org honest)

Each week: what shipped, which PRs delivered real product value vs. docs/process,
whether we're closer to orders / traffic / partners, and the top 3 tasks next
week. Red flag: a week where >50% of merged PRs are docs/process — freeze process
work and ship product.
