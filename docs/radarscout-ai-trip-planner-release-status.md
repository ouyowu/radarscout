# RadarScout AI Trip Planner Release Status

Task: `TD-RADARSCOUT-AI-TRIP-PLANNER-RELEASE-STATUS-2`

Last updated: 2026-07-06

## Current release-candidate state

Latest product-code candidate validated in this release-status checkpoint:

```text
c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
```

This SHA includes the latest safe AI Trip Planner result-flow, mobile UX, copy
safety, return-path, protected-preview runbook, and local preview-smoke helper
work. Later docs-only merges may advance `origin/codex/travel-mvp-launch`
without changing product behavior. Before any production deploy, use the latest
branch HEAD and re-run the deploy validation gate against that exact SHA.

## Recent merged increments

```text
PR #259
Title: Add mobile AI trip planner results coverage
Merge SHA: 3d6f1e3a1ad6daee7e3105d49e929ddf30647afb
Scope: mobile viewport E2E coverage for result actions and no horizontal overflow
Production deploy: no

PR #261
Title: Document mobile AI trip results UX audit
Merge SHA: 4e0bc5cae4d38c451d30c1e4f42f6a7abf16105c
Scope: docs-only mobile results UX audit
Production deploy: no

PR #262
Title: Tighten mobile AI trip results spacing
Merge SHA: dbbef5647a93611a79300b7463ed076335000edd
Scope: mobile result-flow spacing polish
Production deploy: no

PR #263
Title: Tighten AI trip planner mobile results header
Merge SHA: 27b9ee535e6c576fae218211bdc547340177454c
Scope: mobile results header polish
Production deploy: no

PR #264
Title: Update AI trip planner release status
Merge SHA: 57c627ffbf1644def2c41f756c501e376ec0b434
Scope: docs-only status update after PR #263
Production deploy: no

PR #265
Title: Document AI trip planner copy safety review
Merge SHA: 966a3a236286e893f0116fae6f4d03a76b7f1178
Scope: docs-only copy safety review for AI Trip Planner public surface
Production deploy: no

PR #266
Title: Clarify AI trip planner tour return path
Merge SHA: f0c89911b25609e545da980632e52d4a76fa2931
Scope: sourced tour detail context card and return link copy
Production deploy: no

PR #267
Title: Document Vercel preview bypass smoke workflow
Merge SHA: daca18c38618693627c4ca7d6a8a9da390443a0e
Scope: docs-only protected preview runbook
Production deploy: no

PR #268
Title: Add AI trip preview smoke helper
Merge SHA: c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
Scope: local preview smoke helper for protected AI Trip Planner previews
Production deploy: no

PR #269
Title: Refresh AI trip planner release status
Merge SHA: a0d95b07c2d76bc416f6147a9d1e1716747d28bd
Scope: docs-only release status refresh after preview helper
Production deploy: no

PR #270
Title: Stabilize AI trip release status wording
Merge SHA: 9bd0d825209cb2292f2b02e998ed667d9ff62c3d
Scope: docs-only release status wording cleanup
Production deploy: no
```

## Latest validation evidence

Latest protected-preview helper validation after PR #268:

```text
Preview URL: https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app/ai-trip-planner
Helper: pnpm smoke:ai-trip-preview
Status: passed
Temporary share URL: generated for smoke only; not committed or persisted
```

Helper output:

```text
status: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: []
forbiddenMatches: []
```

Latest post-merge preview checkpoint after PR #266:

```text
Preview URL: https://reddit-monitor-1aie8r6e2-ouyowus-projects.vercel.app
Deployment ID: dpl_Haa2gg3knc238k8VjnvwvXEUDpwY
Target: preview
Status: READY
Production aliases: none
Vercel Authentication: encountered
Temporary share URL: generated for smoke only; not committed or persisted
```

Latest clean HEAD validation for the current production candidate:

```text
HEAD: c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
Worktree: /private/tmp/radarscout-preview-smoke-helper-postmerge

Preview smoke covered mobile and desktop AI Trip Planner successful-result flows:

- page load 200 behind authenticated preview access;
- title `Thailand AI Trip Planner | RadarScout`;
- robots `noindex, nofollow`;
- result actions visible;
- `Results ready` status visible;
- top-match detail link includes `source=ai-trip-planner`;
- compact result fit summary class present;
- 3 comparison product cards shown;
- no horizontal overflow at 390px mobile width;
- no unsafe visible copy or unsafe network calls observed.

Preview note:

During PR #266 preview smoke, protected preview `/tours` loaded successfully but
returned no display-ready product rows. The sourced unavailable detail path was
smoked successfully with `source=ai-trip-planner`; found-state sourced detail
behavior remains covered by unit tests until preview has display-ready product
rows for real product-detail smoke.

Previous preview checkpoints:

```text
PR #255 preview: https://reddit-monitor-3rtx7djl6-ouyowus-projects.vercel.app
Deployment ID: dpl_9tf6xBVn3KSKzhMDwspUktNLAbB8

PR #256 preview: https://reddit-monitor-me9tiex8w-ouyowus-projects.vercel.app
Deployment ID: dpl_642TEzAmgV2ntdMpHu7Q8qmhWRZx

PR #257 preview: https://reddit-monitor-gktqz8zi6-ouyowus-projects.vercel.app
Deployment ID: dpl_5oPZKrQ58uJAr68reuAc7Ahqo2oV
```

Vercel preview URLs may require Vercel authentication. Local same-SHA Playwright
and production-mode builds were used as functional smoke evidence where
anonymous preview browsing was blocked.

## Validation evidence

Latest clean HEAD validation passed:

```text
Prisma generate: passed
AI Trip Planner Playwright E2E: passed, 40/40
AI Trip protected-preview helper --help: passed
AI Trip protected-preview helper production-domain refusal: passed
AI Trip protected-preview helper against Vercel share URL: passed
git diff --check: clean
```

The protected-preview helper reported:

```text
status: 200
title: Thailand AI Trip Planner | RadarScout
robots: noindex, nofollow
topMatchHref: /tours/prod_cm_1?source=ai-trip-planner
productCardCount: 3
resultSummaryVisible: true
noHorizontalOverflow: true
unsafeNetwork: []
forbiddenMatches: []
```

## Current product behavior

On `/ai-trip-planner`, a traveler can:

1. enter a Thailand trip idea
2. parse intent locally
3. confirm the interpreted trip intent
4. run read-only Thailand product search
5. see pending feedback while search is running
6. see results-ready feedback when products are returned
7. open the top comparison match directly
8. compare all returned product cards
9. open product details with `source=ai-trip-planner`
10. return from product detail pages to `/ai-trip-planner#ai-trip-results`

This is still a guided discovery and booking-partner handoff flow, not a
booking engine.

## Safety boundary status

Current clean HEAD keeps these boundaries:

```text
No production deploy from these increments
No SEO index/follow opening
No Bókun API/edit/sync
No checkout/payment/cart/booking submission
No live availability/inventory behavior
No DB/schema/env changes
No ThaiEleHub/Shopify changes
```

Allowed public positioning used by the current flow:

```text
Thailand AI trip planner
read-only Thailand product search
comparison-only product results
booking partner
View details
Open top match details
```

Forbidden product behavior remains out of scope:

```text
live availability
available now
instant confirmation
checkout
payment
booking complete
reservation complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

## Protected preview smoke workflow

For protected Vercel preview URLs, use:

```bash
pnpm smoke:ai-trip-preview 'https://<preview-host>.vercel.app/ai-trip-planner?_vercel_share=<temporary-token>'
```

The helper is read-only. It refuses RadarScout production domains, requires a
`.vercel.app` preview hostname, mocks `/api/ai-trip/search`, and reports title,
robots, top-match href, product-card count, result summary visibility,
horizontal overflow, forbidden copy, and unsafe network calls.

The helper does not request, print, store, or commit secrets. Temporary
`_vercel_share` URLs should be treated as short-lived validation artifacts.

## Production gate

Production has not been automatically updated with the latest release candidate.

Production deploy may be considered only after explicitly approving the exact
latest `origin/codex/travel-mvp-launch` SHA to deploy. As of this checkpoint,
the latest product-code candidate was:

```text
c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87
```

If production deploy is approved later, the deploy task should:

1. create a fresh clean production worktree from `origin/codex/travel-mvp-launch`
2. confirm HEAD equals the explicitly approved SHA
3. run validation before deploy
4. deploy with `npx vercel --prod --yes`
5. run production smoke on `https://radarscout.io/ai-trip-planner`
6. confirm no SEO, DB, Bókun, checkout, payment, or ThaiEleHub changes

## Recommended next safe tasks

Recommended non-production tasks:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-LATEST-HEAD-PREVIEW-SMOKE-0
Create a fresh preview deployment from clean HEAD c9b5406 and run the local
AI Trip protected-preview smoke helper against that deployment.

TD-RADARSCOUT-PREVIEW-DATA-READINESS-0
Read-only audit of preview product-data readiness for real product-detail smoke. Do not mutate DB/schema/env.

TD-RADARSCOUT-AI-TRIP-PLANNER-PRODUCTION-READINESS-0
Run a docs/read-only production readiness check for the AI Trip Planner release
candidate, including public copy, network, SEO, and safe handoff boundaries.

TD-RADARSCOUT-AI-TRIP-PLANNER-RESULTS-OBSERVATION-1
Observe the latest result flow with the local helper and browser smoke evidence,
then document any remaining UX gaps before production approval.
```

Recommended production task only after explicit approval:

```text
TD-DEPLOY-AI-TRIP-PLANNER-RESULT-FLOW-PRODUCTION
Deploy clean HEAD c9b5406bceb91b1582ef46f8b6b2d5e7b5f42a87 to production.
```
