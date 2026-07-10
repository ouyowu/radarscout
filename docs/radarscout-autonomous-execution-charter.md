# RadarScout Autonomous Execution Charter (standing instruction for Codex)

This is a STANDING charter. It governs every Codex run on RadarScout. Codex works
the roadmap continuously and autonomously **inside the green zone**, and
**hard-stops at the red zone** for human approval. The goal: make real product
progress without a human reviewing every task. The operator has granted standing
authorization for fully gated GREEN ZONE merges and production deploys; irreversible
RED ZONE actions still require separate human approval.

Read on every run, in this order:
`CLAUDE.md` → this charter → `docs/radarscout-release-sop.md` →
`docs/radarscout-codex-task-queue.md` → `docs/radarscout-ai-trip-status.md`.

Repo: `/Users/ouyowu/reddit-monitor` (`ouyowu/radarscout`). Base branch:
`codex/travel-mvp-launch`. RadarScout only — never touch ThaiEleHub / Shopify.

## Objective

Advance RadarScout toward real traffic → conversions → signed partner products,
by executing the roadmap in `radarscout-codex-task-queue.md` in order, one focused
branch per task, smallest safe diff, highest real-product-value first. Prefer
shipping product over writing docs.

## The autonomous loop (repeat until the queue is blocked or empty)

1. **Select** the next not-done task from the queue that is in the GREEN ZONE.
2. **Step 0** — grep the repo; if already built, mark done in the status doc and
   skip. Do not do redundant work.
3. **Plan** — write the CTO-style boundary in the PR body: allowed files, explicit
   non-goals, acceptance criteria.
4. **Implement** — new branch off `codex/travel-mvp-launch`, clean worktree,
   minimal diff, no scope creep.
5. **QA (self, from a clean worktree)** — run the standard gate:
   `prisma generate` · `tsc --noEmit` · `vitest run` (scoped) · `playwright test`
   (if UI) · `build` · `git diff --check`. All green or the task does not proceed.
6. **Hermes review** — run the Hermes red-line gate. If Hermes flags anything on
   the red list → STOP that task, move it to the Human Approval Queue.
7. **Open PR and merge after independent gates.** If (a) all QA checks are green,
   (b) Hermes passed, (c) GitHub/Vercel checks are green, (d) the diff touches only
   declared files and no red-zone paths, and (e) the task is green-zone: open the
   PR into `codex/travel-mvp-launch`, review the final diff, and merge it. Never
   merge a task that implemented its own exception to these gates.
8. **Deploy user-facing green changes.** From a fresh clean worktree at the exact
   merge SHA, run the release gate and deploy to the existing Vercel project. Then
   run read-only production smoke. This standing authorization removes per-deploy
   approval only for green changes; any red-zone change, failed assertion, branch
   drift, ambiguous provenance, or settings/env change still hard-stops.
9. **Record** — append one concise line to the single Execution Log (task, PR,
   merge SHA, deployment ID if applicable, result). Do not create status-only docs
   or PRs.
10. **Next** — go to step 1 until the queue is blocked, empty, or a circuit breaker
   fires.

## GREEN ZONE — Codex may implement, QA, Hermes-check, merge, and deploy

- Docs that change a decision or unblock a gate (update in place; never status-only sprawl).
- Local tooling / scripts + their tests.
- Tests, guards, regression coverage.
- UI / product code that touches **none** of the red-zone paths below and keeps
  all existing copySafety / metadata / sitemap tests green.
- From the current queue: `SEO-INDEX-GUARD-2`, `SEARCH-CONSOLE-CHECKLIST-3`,
  `PARTNER-PRODUCT-MODEL-4`, `PRODUCT-MATCHING-6` (only after 4 and 5 exist, and
  only if booking/availability stay OFF and copySafety stays green),
  `BOKUN-API-DISCOVERY-7` (docs only).

## RED ZONE — STOP and queue for the human. Codex must NOT do these alone.

- Any production deploy containing red-zone changes, missing independent QA or
  Hermes approval, failed checks, ambiguous source SHA, or Vercel settings/env changes.
- DB / Prisma schema / migration / seed-to-DB / env / `.env*`.
- SEO: changing any `robots` / `index,follow` / `sitemap` value, or submitting a
  page to Search Console / opening indexing.
- checkout / payment / cart / booking submission / availability / inventory behavior.
- Bókun API / sync / widget-URL changes.
- Partner product **data** that would have to be invented (`PARTNER-PRODUCT-SEED-5`
  needs the operator's real signed-product source — never fabricate products,
  prices, suppliers, or booking URLs → queue for human data).
- `ANALYTICS-PROVIDER-1` (postponed by existing decision; needs an explicit vendor
  choice → human).
- ThaiEleHub / Shopify anything.
- Anything ambiguous, out of declared scope, or conflicting with an existing
  decision doc.

When a task is red: do NOT attempt it. Add a concise entry to the **Human Approval
Queue** section of `docs/radarscout-ai-trip-status.md` (what it needs, why it is
gated, exact command or data required), then continue with the next GREEN task so
you never idle waiting.

## Circuit breakers (stop the loop, wait for human)

- Same task fails checks twice, OR 3 tasks fail in a row → STOP, log, wait.
- Green queue is empty (only red-zone tasks remain) → STOP, summarize the Human
  Approval Queue, wait.
- Any diff would exceed its declared file scope → STOP, do not force it.
- Hermes is unavailable / errors → treat as not-passed; do not open the PR.
- **More than 4 automated green merges in one day → STOP and summarize.**
  (Daily cap = 4.)
- Green tasks depend on each other (task N needs task N-1 merged first) → STOP and
  note it; do not stack unmerged PRs into a fragile chain. Wait for the human to
  merge the prerequisite.

## Cost / anti-sprawl rules

- One task, one branch, smallest diff. No unrelated fixes, no broad refactors.
- Never open a status-only PR. Update `radarscout-ai-trip-status.md` in place.
- Batch trivial doc updates. Don't restate the same evidence across files.
- Prefer product value over process. If a week's output is mostly docs/process,
  say so in the log and switch to product.

## What the human sees (no per-task review)

The human does not review each green task synchronously. Codex completes the
gated green loop and the human can audit the **Execution Log** at any time. The
**Human Approval Queue** contains only true red-zone decisions. A concise report
must include every automatic merge and production deployment.

## Standing red-zone policy (updated 2026-07-10)

Separate human approval remains mandatory for DB/data writes or migrations,
schema/env/secrets, Bókun API/edit/sync or supplier actions, checkout/payment/
booking submission, SEO index expansion, ThaiEleHub/Shopify, spending or plan
upgrades, and any irreversible or out-of-scope action. Ordinary production deploys
of fully gated green changes are covered by the standing authorization above.
