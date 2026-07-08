# RadarScout Autonomous Execution Charter (standing instruction for Codex)

This is a STANDING charter. It governs every Codex run on RadarScout. Codex works
the roadmap continuously and autonomously **inside the green zone**, and
**hard-stops at the red zone** for human approval. The goal: make real product
progress without a human reviewing every task — while never letting an agent take
an irreversible action alone.

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
7. **Open PR — do NOT merge (current policy: PR-only).** If (a) all checks green,
   (b) Hermes passed, (c) the diff touches only declared files and NO red-zone
   paths, and (d) it is a green-zone task: open a PR into
   `codex/travel-mvp-launch` and leave it OPEN for the human to merge. Codex does
   NOT merge, even in the green zone, under the current policy. The human
   batch-merges open green PRs when they choose.
8. **Record** — append one line to the Execution Log in the status doc (task, PR,
   SHA, result = "PR open, awaiting human merge"). Do NOT create a new status doc.
   Do NOT open status-only PRs. The status doc must have exactly one
   `Execution Log` section; append entries to that section instead of creating a
   second heading.
9. **Next** — go to step 1. Keep opening green PRs (up to the daily cap) until
   blocked or the green queue is empty. Do not wait for the human to merge before
   starting the next task — branch each new task off `codex/travel-mvp-launch`
   base (note: it will not yet contain the still-open prior PRs; keep tasks
   independent so open PRs don't conflict).

## GREEN ZONE — Codex may implement, QA, Hermes-check, and open a PR alone (human merges)

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

- Production deploy / `vercel --prod` / promoting any deployment.
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
- **More than 4 open green PRs in one day → STOP, summarize, wait** for the human
  to review/merge before opening more. (Daily cap = 4.)
- Green tasks depend on each other (task N needs task N-1 merged first) → STOP and
  note it; do not stack unmerged PRs into a fragile chain. Wait for the human to
  merge the prerequisite.

## Cost / anti-sprawl rules

- One task, one branch, smallest diff. No unrelated fixes, no broad refactors.
- Never open a status-only PR. Update `radarscout-ai-trip-status.md` in place.
- Keep exactly one `Execution Log` section in `radarscout-ai-trip-status.md`.
  Never create duplicate numbered log headings.
- Batch trivial doc updates. Don't restate the same evidence across files.
- Prefer product value over process. If a week's output is mostly docs/process,
  say so in the log and switch to product.

## What the human sees (no per-task review)

The human does NOT review each task synchronously. Codex opens green PRs and
keeps working. The human checks, when they want:
- the **open green PRs** (batch-merge the ones they're happy with — up to 4 will
  be waiting), and
- the **Execution Log** and **Human Approval Queue** in the status doc.

Current policy: Codex opens PRs but does NOT merge (green or red). The human
batch-merges green PRs at their convenience, and acts on red-zone items (deploy
approval, provide partner data, choose a vendor, approve SEO/DB). This keeps a
human in the loop on every merge while removing per-task synchronous review.

## Current standing red-zone items (as of 2026-07-07)

1. Production deploy of `7d446ee` — blocked by Vercel free-tier deploy quota;
   needs human to upgrade plan or wait for reset, then run the deploy command in
   `radarscout-ai-trip-status.md` and say `Approve production deploy — <SHA>`.
2. `ANALYTICS-PROVIDER-1` — postponed; needs explicit vendor decision.
3. `PARTNER-PRODUCT-SEED-5` — needs operator's real signed-product data source.

Codex: proceed with the GREEN queue now (start at `SEO-INDEX-GUARD-2`), and leave
the three items above in the Human Approval Queue.
