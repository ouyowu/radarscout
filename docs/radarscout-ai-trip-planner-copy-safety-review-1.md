# RadarScout AI Trip Planner copy safety review 1

Task: `TD-RADARSCOUT-AI-TRIP-PLANNER-COPY-SAFETY-REVIEW-1`

Date: 2026-07-07

## 1. Scope

This review covers the current RadarScout AI Trip Planner and related homepage entry copy.

Reviewed surfaces:

- `/ai-trip-planner` page metadata and visible copy;
- AI Trip Planner prompt, confirmation, search, result, no-match, and unsupported-destination copy;
- AI Trip Planner product comparison card copy;
- homepage AI Trip Planner prompt entry copy;
- tour-detail return context used from `source=ai-trip-planner`;
- copy-safety tests that protect the public planner boundary.

This task is docs-only. It does not change app code, deploy, alter SEO state, write database records, change schema or environment variables, call Bókun, add checkout behavior, or touch ThaiEleHub/Shopify files.

## 2. Current safe product boundary

The current planner copy consistently describes RadarScout as a Thailand-first guided discovery product.

The strongest existing boundary phrases are:

- `Product matching is currently limited to Thailand experience records.`
- `Product search appears only after local confirmation and remains comparison-only.`
- `No booking partner action or current status claim.`
- `Current product details and booking partner handoff stay on product pages.`
- `No product, supplier, price, availability, final partner step, or partner handoff links are loaded.`
- `Prompt links load the planner form only. Real Thailand experience search starts after you review and confirm your trip intent.`

This is the right public stance for the current product because it separates:

- planning and comparison owned by RadarScout;
- current operating details and booking partner handoff owned by product/detail or partner surfaces;
- unsupported destination ideas from real product matching.

## 3. Protected wording status

The current public planner surfaces are covered by tests against the main unsafe public-copy classes:

- live availability claims;
- available-now claims;
- instant confirmation claims;
- checkout/payment wording in planner/product result cards;
- partner-rate, supplier-net-rate, and commission wording;
- Bókun backend/database/powered-by wording;
- fake ratings or review implications.

Existing source and test coverage already verifies that AI Trip Planner product cards are comparison-only and do not include checkout, payment, booking, rating, live-availability, partner-rate, supplier-net-rate, or commission fields.

## 4. Remaining UX/copy risk

The current copy is safe, but it is becoming dense. The planner now repeats the same boundary in several places:

- homepage prompt section;
- AI Trip Planner hero;
- destination starter section;
- intent parser helper;
- confirmation panel;
- search capability card;
- result feedback;
- product cards;
- deterministic outline.

The risk is not unsafe claims. The risk is friction:

- users may understand the product is safe, but not quickly understand the main action;
- multiple boundary messages may make the planner feel defensive;
- result-state copy can compete with comparison cards on mobile;
- some labels use internal/product-language phrasing such as `read-only product search`, which is accurate but less traveler-friendly.

## 5. Recommended copy direction

Keep the safety boundary, but make the traveler path simpler:

1. `Describe your Thailand trip idea.`
2. `Review the detected intent.`
3. `Search matching Thailand experiences.`
4. `Open a product page for details and booking partner handoff.`

Preferred public wording:

- `Search matching Thailand experiences`
- `Comparison-only results`
- `Open product details`
- `Continue with a booking partner`
- `Current details stay on product pages`
- `Thailand product matching only`

Avoid adding or reintroducing:

- `live availability`
- `available now`
- `instant confirmation`
- `checkout`
- `payment`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `partner rate`
- `supplier net rate`
- `commission`
- fake ratings or fake reviews

## 6. Concrete gap to implement next

The clearest next product task is a small copy/UX tightening pass on the AI Trip Planner result state, not a new feature.

Recommended next implementation:

```text
TD-RADARSCOUT-AI-TRIP-RESULT-COPY-TIGHTEN-1
```

Goal:

Make the AI Trip Planner result-state copy shorter and more traveler-readable while preserving the same safety boundary.

Suggested scope:

- tighten the successful-result helper copy near comparison cards;
- keep the `Comparison only` boundary;
- keep `Current product details and booking partner handoff stay on product pages`;
- avoid changing product matching logic;
- avoid changing CTA/handoff behavior;
- update copy-safety and E2E assertions for the revised copy.

Candidate copy:

```text
Results ready. Compare the cards below, then open a product page for current details and booking partner handoff.
```

This can replace or consolidate longer nearby result helper text if the UI currently repeats the same idea.

## 7. Safety gates for the next implementation

The next implementation must keep these gates:

- no production deploy without explicit approval;
- no SEO index/follow opening;
- no sitemap or robots changes;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory behavior;
- no DB/schema/env changes;
- no LLM/OpenAI integration;
- no ThaiEleHub/Shopify files.

Required validation:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- copySafety
pnpm --filter @reddit-monitor/web test -- productSearch
pnpm --filter @reddit-monitor/web exec playwright test e2e/ai-trip-planner.spec.ts
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

## 8. Decision

RadarScout's current AI Trip Planner public copy is safe enough to keep moving forward behind the existing preview and production gates.

Do not broaden this into LLM, booking, inventory, Bókun API, checkout, or SEO-opening work.

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-RESULT-COPY-TIGHTEN-1
```

If Vercel preview quota resets first, run:

```text
TD-RADARSCOUT-AI-TRIP-LATEST-HEAD-PREVIEW-SMOKE-RETRY
```

before considering any production deploy for latest app-code changes.
