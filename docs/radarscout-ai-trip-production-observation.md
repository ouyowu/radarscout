# RadarScout AI Trip production observation

Task: `TD-RADARSCOUT-AI-TRIP-PRODUCTION-OBSERVATION-0`

Updated: 2026-07-06

## 1. Scope

This was a read-only production observation for RadarScout.

Checked URLs:

```text
https://radarscout.io/ai-trip-planner
https://www.radarscout.io/ai-trip-planner
```

No code, schema, environment, database, Bókun, Shopify, or ThaiEleHub changes were made.

## 2. Current latest branch state

Latest `origin/codex/travel-mvp-launch` at observation time:

```text
2d26323c8d7a5bbfe30cad18fc0107637cb6cb5d
```

Latest merged increment:

```text
PR #361: Link planning outline to AI Trip search
```

## 3. Latest-head local validation

Clean worktree:

```text
/private/tmp/radarscout-ai-trip-production-observation
```

Validation results for `2d26323c8d7a5bbfe30cad18fc0107637cb6cb5d`:

- Prisma generate: passed.
- AI Trip Vitest focus (`pnpm --filter @reddit-monitor/web test -- aiTrip`): passed.
- Targeted AI Trip Playwright flow (`e2e/ai-trip-planner.spec.ts:426 --workers=1`): passed.
- TypeScript: passed.
- Next build: passed.
- `git diff --check`: passed.
- Worktree status: clean.

## 4. Latest preview status

Preview deploy command:

```bash
pnpm deploy:vercel-preview
```

Vercel project:

```text
ouyowus-projects / reddit-monitor
```

Preview guard:

```text
passed
```

Preview result:

```text
blocked by api-deployments-free-per-day
```

Interpretation:

- Vercel project linking is correct.
- The preview guard accepted the worktree.
- The deploy failed because of Vercel daily deployment quota.
- This is not a code, test, TypeScript, or build failure.

## 5. Production observation result

Both production domains returned the AI Trip Planner page.

Observed production status:

| URL | Status | Title | Robots | Mobile overflow |
| --- | --- | --- | --- | --- |
| `https://radarscout.io/ai-trip-planner` | 200 | `Thailand AI Trip Planner \| RadarScout` | `noindex, nofollow` | none observed |
| `https://www.radarscout.io/ai-trip-planner` | 200 | `Thailand AI Trip Planner \| RadarScout` | `noindex, nofollow` | none observed |

Production UI observations:

- AI Trip Planner page is visible.
- Chiang Mai starter can be loaded.
- Trip intent can be confirmed.
- Search action becomes available.
- With a mocked read-only `/api/ai-trip/search` response, three product cards render.
- Result fit summary renders.
- Top matched product title text is visible in the rendered result area.
- Refine link is visible.
- No mobile horizontal overflow was observed.

## 6. Production gap

With the mocked product response, production detail links rendered as:

```text
/tours/prod_cm_1
/tours/prod_cm_2
/tours/prod_cm_3
```

The observed production links did not include:

```text
source=ai-trip-planner
```

Interpretation:

- production appears safe and usable;
- production does not yet prove the latest travel-branch detail-link source normalization is live;
- the latest branch still needs a fresh Vercel preview once quota allows;
- production deploy should not be considered until the preview gate is satisfied or the user explicitly approves a same-SHA local-validation substitute.

## 7. Safety audit

Visible forbidden copy matches:

```text
none observed
```

Checked forbidden terms:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
fake reviews
fake ratings
supplier net rate
partner rate
commission
```

Unsafe network requests during the mocked production UI observation:

```text
none observed
```

No observed calls to:

```text
/api/bokun
OpenAI/LLM
checkout/payment/booking submission
```

## 8. Recommendation

Next task remains:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

Run it after Vercel quota resets or after an approved protected-preview/share smoke path is available.

Do not production deploy latest AI Trip changes until preview evidence exists or the user explicitly approves a same-SHA local-validation substitute for the named merge SHA.
