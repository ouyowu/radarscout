# Cherry Hermes Review Workflow

RadarScout uses a semi-automatic review loop after each implementation phase.

Hermes is a Cherry Studio assistant using DeepSeek V3 via OpenRouter. Hermes does not run in the command line. This workflow does not call Ollama. This workflow does not call OpenRouter automatically. It is intentionally semi-automatic so human approval stays in the loop.

## Standard Flow

1. Codex completes a Phase.
2. Run:

   ```bash
   pnpm ai:prepare-hermes-review
   ```

3. Open:

   ```text
   .ai/hermes-review-prompt.md
   ```

4. Copy it into the Cherry Studio Hermes assistant.
5. If needed, also attach or copy:

   ```text
   .ai/phase-diff.patch
   ```

6. Hermes returns a review report.
7. Paste the Hermes report to Codex using:

   ```text
   .ai/codex-fix-from-hermes-template.md
   ```

8. Codex fixes only P0/P1.
9. Run:

   ```bash
   pnpm ai:checks
   ```

10. Continue to the next Phase only after P0/P1 are clear.

## Generated Files

`pnpm ai:prepare-hermes-review` creates or updates:

```text
.ai/hermes-review-prompt.md
.ai/phase-diff.patch
.ai/checks.log
.ai/codex-fix-from-hermes-template.md
```

## Business Rules Hermes Must Enforce

Real bookable products can only come from signed Bókun supplier partners.

Forbidden:

- Viator products
- GetYourGuide products
- Klook products
- Affiliate products
- Fake or manually curated products that cannot be fulfilled
- “Available now” wording for cities without Bókun supplier inventory
- External product inventory
- OpenAI / Claude / Gemini / DeepSeek backend integrations unless explicitly requested

Protected flows and files:

- `/tours?tag=Adventure`
- `/api/products?tag=Adventure&take=2`
- `server/bokun/product-sync.js`
- `server/bokun/tag-engine.js`
- `server/bokun/tag-report.js`
- `BokunProduct`
- `ProductTag`
- Existing Bókun sync and tagging pipeline

## Codex Fix Rule

When Hermes reports issues, Codex should fix only:

- P0 Must Fix
- P1 Should Fix

P2 items are optional and should not be implemented unless explicitly approved.
