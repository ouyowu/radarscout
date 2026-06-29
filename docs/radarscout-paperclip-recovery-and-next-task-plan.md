# RadarScout Paperclip recovery and next-task plan

Task: `TD-RADARSCOUT-PAPERCLIP-RECOVERY-AND-NEXT-TASK-PLAN`

Status: docs-only recovery plan.

## 1. Current execution mode

RadarScout should continue using the semi-automatic Paperclip handoff:

1. CEO defines the business goal and why it matters.
2. CTO defines technical boundaries, risk, and acceptance criteria.
3. Engineer implements only after the scope is clear, using a new branch and a clean worktree.
4. QA validates tests, smoke checks, SEO state, unsafe-copy checks, and network/API behavior.
5. CEO/CTO decide whether the work is merge-ready.
6. Human operator explicitly approves any production deploy.

This workflow remains the default. It should not become an unattended loop.

## 2. Current blocker

Paperclip and shell execution were blocked by a system-level file table error:

```text
ENFILE: file table overflow
Too many open files in system
```

Observed facts:

- The RadarScout main workspace at `/Users/ouyowu/reddit-monitor` is dirty and should not be used for implementation.
- The clean safe base for RadarScout remains `origin/codex/travel-mvp-launch`.
- The current safe base inspected for this plan is:

```text
e0581051153d90585865ec7ec70d2cd4e6df6fe1
```

- Duplicate MCP/helper `node` and `npm` processes can exhaust system file handles and prevent Paperclip, Git, and shell commands from starting.
- Cleanup must not touch RadarScout app code, production, environment variables, databases, Bókun, or ThaiEleHub/Shopify.

## 3. Recovery gate

Before relying on Paperclip issue comments again, confirm:

```bash
paperclipai issue list --json
```

Expected:

- command exits successfully
- current RadarScout issues can be listed
- no `ENFILE` or `Too many open files` error
- Paperclip API stays reachable after startup

If the command still fails, do not start Engineer implementation through Paperclip.

## 4. Safe recovery options

Recommended order:

1. Inspect duplicate helper processes with `ps`.
2. Terminate only duplicate MCP/helper `node` and `npm` processes after explicit human authorization.
3. Do not kill the Codex desktop app.
4. Do not kill Paperclip embedded PostgreSQL.
5. Do not kill project test, build, or deployment processes unless they are clearly stale and explicitly approved.
6. Restart Paperclip only if needed.
7. Re-run the Paperclip CLI smoke command above.

Do not silently kill processes because some may belong to active Codex, Claude, Vercel, browser automation, or MCP sessions.

## 5. Current product queue status

Completed and merged:

- Supplier public link request CTA app code.
- Supplier CTA production readiness documentation.

Current deploy gate:

```text
TD-DEPLOY-SUPPLIER-PUBLIC-LINK-REQUEST-CTA-PRODUCTION
```

This remains blocked until the human explicitly approves a production deploy.

Recommended approval target if deploying the latest safe branch:

```text
e0581051153d90585865ec7ec70d2cd4e6df6fe1
```

Do not treat this document as deploy approval.

## 6. Next safe RadarScout task after Paperclip recovers

If production deploy is not approved, the next safe non-deploy task should focus on partner conversion without changing booking behavior.

Recommended task:

```text
TD-RADARSCOUT-SUPPLIER-LINK-INTAKE-MANUAL-WORKFLOW-0
```

Goal:

Document or lightly implement a manual supplier-link intake workflow that keeps RadarScout within discovery and handoff boundaries.

Safe first version:

- docs-only or static copy only
- no backend form
- no DB writes
- no CRM integration
- no auto-approval of links
- no Bókun API
- no checkout/payment/booking submission
- no live availability claims

Suggested deliverable:

```text
docs/radarscout-supplier-link-intake-manual-workflow.md
```

## 7. Safety boundaries that still apply

Do not:

- production deploy without explicit human approval
- open SEO `index,follow`
- add `/tours/{id}` back to sitemap
- call Bókun API
- edit or sync Bókun products
- add checkout, payment, cart, or booking submission
- add live availability or inventory behavior
- write to DB
- change schema or env
- add LLM/OpenAI behavior
- touch ThaiEleHub files
- run Shopify commands

Allowed:

- docs-only planning
- static B2B copy
- manual-review workflow documentation
- safe `mailto:` handoff copy
- preview deployments only when explicitly scoped

## 8. Validation for this document

This document is intentionally docs-only. Validation should be limited to:

```bash
git diff --check -- docs/radarscout-paperclip-recovery-and-next-task-plan.md
```

No app tests are required unless app code changes accidentally.
