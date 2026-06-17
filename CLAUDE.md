# Claude Code Operating Guide for RadarScout

## 1. Project Role

This repo powers RadarScout, an AI travel planning and Bókun-backed product catalog project.

Claude Code is an implementation agent, not the product manager.

Claude Code must follow task briefs exactly and must not independently expand scope.

Preferred workflow:

- ChatGPT writes focused task briefs.
- Claude Code executes one small task per branch.
- Claude Code returns branch, commit SHA, changed files, commands run, checks, manual safety checks, and PR URL.
- ChatGPT reviews the PR before merge.
- The user decides whether to merge or approve migrations.

## 2. Always Read Project Instruction Files First

Before doing anything:

1. Read `CLAUDE.md`, `Codex.md`, `CODEX.md`, and `AGENTS.md` if they exist.
2. Follow the strictest rule when files conflict.
3. Do not broaden the task.
4. Do not run database migrations unless the task explicitly approves one target environment.
5. Do not modify public API, frontend, Bókun sync, Prisma schema, or migrations unless explicitly allowed.
6. Return changed files, commands run, checks, and manual safety checks.

## 3. Branch And PR Workflow

Rules:

- Always start from the requested base branch, usually `codex/travel-mvp-launch`.
- Create a new focused branch per task.
- Keep changes minimal.
- Do not mix unrelated work.
- Do not fix random issues unless the task asks for it.
- Do not refactor broadly.
- Do not commit unrequested files.
- Do not open a PR until checks pass or blockers are reported.

PR description must include:

- Summary
- Safety
- Checks
- Manual verification

Final report must include:

- Branch
- Commit SHA
- Changed files
- Commands run
- Checks
- Manual safety checks
- PR URL
- GitHub mergeable status if available
- Any blockers

## 4. Database And Migration Rules

Current database state:

- Prisma schema and migration SQL for `BokunProductEnrichment` exist in the repo.
- A protected reviewed enrichment write endpoint exists.
- A reviewed enrichment migration runbook exists.
- The real database migration may not yet be applied in every environment.

Critical rules:

- Never run `prisma migrate deploy` unless the task explicitly approves one exact target environment.
- Never run `prisma migrate dev` against production.
- Never use `.env.production` unless the task explicitly approves production work.
- Never connect to production DB unless explicitly approved.
- Never connect to staging DB unless explicitly approved.
- Never write DB data unless the task explicitly allows it.
- Never run seed scripts unless explicitly allowed.
- Never modify Prisma schema or migration files unless explicitly allowed.
- Never manually create, drop, or alter tables unless explicitly approved.

Before any migration-related command:

- Confirm target environment.
- Confirm redacted `DATABASE_URL` host/database.
- Confirm backup/snapshot requirement.
- Confirm current branch and commit.
- Confirm working tree is clean.

Migration execution order:

1. local/dev only
2. staging only
3. production last and only with explicit approval

Production migration requires the user to explicitly say:

```
Approve production migrate deploy.
```

Without that exact approval, do not run production migration.

## 5. Bókun Rules

Bókun is a source of real travel product data.

Never fabricate:

- products
- prices
- availability
- suppliers
- ratings
- review counts
- booking URLs
- pickup locations
- opening hours
- checkout/payment details

Never expose:

- Bókun raw JSON payloads
- API secrets
- internal sync details
- upstream raw errors

Bókun sync rules:

- Do not modify Bókun sync unless explicitly allowed.
- Do not call Bókun API unless explicitly allowed.
- Do not run sync jobs unless explicitly allowed.
- Public product output must remain safe.
- `bookingEnabled` and `availabilityEnabled` should remain false unless a future task explicitly changes that with safety review.

Product direction:

- Bókun should remain the underlying transaction and supply-chain system.
- RadarScout should not rebuild Bókun checkout, payment, availability, inventory sync, channel management, contracts, commission, payment terms, pricing tools, API/webhooks, or OCTO features.
- RadarScout should focus on AI search, itinerary generation, signed-product matching, RAG, margin guardrails, observed OTA price comparison, SEO entry pages, and AI-generated UI.
- Public frontend copy should avoid phrases like "Bókun database", "Bókun-powered", "Bókun backend", "Bókun supplier products", and "powered by Bókun".
- Prefer user-facing phrases like "booking partner", "trusted operators", "real local experiences", "partner-direct value", "secure booking handoff", and "bookable itinerary".
- Product detail pages should eventually recommend real products and hand off "Book" / "Check availability" to the official booking widget or partner booking flow.

## 6. Local AI / Open WebUI Rules

Local AI is only a helper for low-risk candidate generation.

Local AI output is not source of truth.

Never let local AI generate or save factual business fields such as:

- price
- availability
- supplier
- rating
- review count
- booking URL
- opening hours
- checkout/payment info

Local AI must not:

- auto-save candidates
- write directly to reviewed enrichment
- modify Bókun source fields
- be exposed directly to public APIs
- be called from the reviewed save route

Local AI candidate flow:

- Candidate generation is allowed only in explicitly approved internal tasks.
- Candidate preview must stay internal and secret-protected.
- AI candidate output must be reviewed by a human before it can become reviewed enrichment.

## 7. Reviewed Enrichment Rules

Reviewed enrichment means human-approved editorial fields for Bókun products.

Allowed reviewed fields:

- cleanedTitle
- shortSummary
- suggestedTags
- seoTitle
- seoDescription
- reviewedBy
- reviewedAt

Forbidden reviewed enrichment fields:

- rawJson
- price
- availability
- supplier
- supplierName
- rating
- reviewCount
- bookingUrl
- bookingStatus
- openingHours
- checkout
- payment
- AI raw response
- AI prompt
- local AI raw output
- candidate raw object

Reviewed enrichment write endpoint rules:

- Must be internal only.
- Must require internal secret.
- Must reject unknown fields.
- Must reject forbidden fields.
- Must not call local AI.
- Must not auto-save candidates.
- Must not modify Bókun source fields.
- Must not expose raw JSON, booking, payment, price, or availability fields.

Public product API rule:

- Public APIs may only read reviewed enrichment after a dedicated reviewed read adapter and public integration task.
- Public APIs must never expose AI candidate output directly.
- Public APIs must never expose raw JSON.

## 8. Public API And Frontend Rules

Do not modify public product API unless explicitly allowed.

Do not modify frontend unless explicitly allowed.

Do not connect reviewed enrichment to public pages until:

1. migration is applied and verified for the target environment
2. reviewed read adapter exists
3. tests prove only reviewed fields are exposed
4. ChatGPT/user approves the public integration task

Do not add:

- booking flow
- checkout flow
- payment flow
- availability check
- live supplier claims

unless explicitly requested in a future task.

## 9. Testing Rules

Use focused tests for each task.

Prefer mock tests when the real database table may not exist.

For internal routes:

- Test missing secret.
- Test invalid secret.
- Test validation errors.
- Test forbidden fields.
- Test successful safe response.
- Test no raw JSON, price, availability, booking, payment, or supplier fields are returned.
- Test local AI is not called unless expected.

Common checks:

- `pnpm --filter @reddit-monitor/db exec prisma generate`
- `pnpm --filter @reddit-monitor/web exec tsc --noEmit`

Use focused `vitest run ...` commands where relevant.

Do not run broad or destructive commands unless explicitly allowed.

## 10. Secrets And Environment Rules

Never commit secrets.

Never print full secrets.

When reporting `DATABASE_URL`, only print a redacted host/database summary.

Do not modify `.env` files unless explicitly allowed.

`.env.example` may only be updated when the task explicitly allows new empty variables.

## 11. Claude Code Context Management Rule

Use `/compact` after completing a major subtask, after tests pass, or before continuing into another focused step, especially when the conversation has become long.

Use `/clear` only after the current task is fully complete and the final report has been delivered, or after the PR has been created/merged and a new task will begin.

Do not use `/clear` in the middle of an unfinished task.

Before using `/clear`, make sure the final report includes:

- branch
- commit SHA
- changed files
- commands run
- checks
- manual safety checks
- PR URL if applicable
- any unresolved blockers

## 12. Stop Conditions

Stop and report instead of guessing if:

- instructions conflict
- target environment is unclear
- database URL is unclear
- migration status reports failure
- command wants production DB without explicit approval
- changed files exceed allowed scope
- tests fail
- TypeScript fails
- Prisma generate fails
- route would expose raw JSON or AI candidates
- task requires broader changes than allowed

## 13. Current Recommended Next Step

The current recommended next execution step is:

TD-LOCAL-AI-4D-A: Apply reviewed enrichment migration to local/dev DB only

Do not run that task now.

Only run it later if the user provides a dedicated task brief that explicitly allows local/dev migration execution.

---

# What To Do After This PR

After this guardrails PR is created:

1. Send the PR URL and final report back to the user.
2. Wait for ChatGPT/user review.
3. Do not start local/dev migration in the same task.
4. Use `/compact` after the final report if the conversation is long.
5. Use `/clear` only after the task is fully complete and the final report has already been delivered.

The next separate task should be:

```
TD-LOCAL-AI-4D-A: Apply reviewed enrichment migration to local/dev DB only
```

That next task must be separately approved and must explicitly say local/dev only.
