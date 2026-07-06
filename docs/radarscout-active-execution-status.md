# RadarScout active execution status

Task: `TD-RADARSCOUT-ACTIVE-EXECUTION-STATUS-0`

Updated: 2026-07-06

## 1. Current execution mode

RadarScout is being advanced through a semi-automatic, safety-gated execution flow.

Default working rules:

- use `origin/codex/travel-mvp-launch` as the safe base;
- use clean worktrees under `/private/tmp/<task-name>`;
- keep changes narrow and testable;
- create PRs for implementation or docs changes;
- run validation before merge;
- use preview smoke for app changes;
- do not production deploy without explicit approval for a merge SHA;
- do not touch ThaiEleHub or Shopify files.

## 2. Current product direction

RadarScout is a Thailand-first AI-guided travel discovery and itinerary product.

Current intended boundary:

- RadarScout owns guided discovery, deterministic planning, itinerary draft, safe recommendation presentation, and booking partner handoff;
- booking partners/operators own current details, checkout, payment, confirmation, and operating workflows;
- RadarScout must not behave like a live inventory system, payment system, booking engine, or Bókun backend.

## 3. Completed current-track work

Recent completed items:

- AI trip planner public copy boundary clarified;
- AI planner product matching explicitly limited to Thailand records;
- non-Thailand ideas remain planning text only;
- destination sitemap guardrail tests added;
- sitemap guardrail post-merge preview passed;
- traveler funnel analytics preview spec aligned with approved event names;
- Plausible comparison documented because Vercel custom events are blocked by current Hobby plan.
- AI Trip Planner result-flow release status documented;
- mobile AI Trip Planner result-flow audit documented;
- mobile AI Trip Planner successful-result spacing tightened through PR #263;
- latest `codex/travel-mvp-launch` preview for AI Trip Planner result-flow polish passed.

## 4. Current blocked or deferred items

### Analytics implementation

Status: deferred.

Reason:

- Vercel project is `ouyowus-projects / reddit-monitor`;
- current Vercel team plan checked through the Vercel API is `hobby`;
- official Vercel docs currently mark custom events as Pro/Enterprise.

Decision:

- do not implement Vercel custom-event analytics on the current plan;
- do not add a workaround analytics endpoint;
- do not write analytics events to RadarScout DB;
- keep the approved event taxonomy ready for a future vendor decision.

### SEO index/follow opening

Status: gated.

Reason:

- opening `index,follow` is a hard safety gate;
- it requires explicit user approval for the exact controlled-opening PR/merge SHA.

Decision:

- no automatic SEO opening;
- no sitemap expansion beyond approved public-safe URLs;
- no `/tours/{id}` sitemap re-entry without a separate tour detail SEO candidate process.

### Production deploys

Status: gated.

Decision:

- no production deploy without explicit approval naming the merge SHA.

## 5. Already-present product surfaces

The current codebase already includes:

- homepage link to `/ai-trip-planner`;
- homepage link to `/chiang-mai/elephant-camp-finder`;
- Chiang Mai deterministic chat planner;
- itinerary summary;
- compact mobile summary;
- AI trip planner route;
- read-only Thailand product search from confirmed trip intent;
- comparison-only product result cards;
- compact successful-result action and fit-summary spacing on mobile;
- `/tours/{id}?source=ai-trip-planner` return context;
- tour detail no-handoff fallback copy;
- static partner/supplier/destination partner pages;
- B2B mailto-only manual intake guidance.

Do not create duplicate tasks for these already-present surfaces unless the change has a concrete gap and test target.

## 6. Recommended next safe task

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-1
```

Type:

```text
read-only audit or narrow UX implementation after audit
```

Goal:

Audit and, only if needed, tighten the product-detail return path for travelers who arrive from `/ai-trip-planner` through `source=ai-trip-planner`.

Questions to answer:

- Does the tour detail page clearly preserve AI Trip Planner context?
- Is the return path back to `/ai-trip-planner#ai-trip-results` visible and safe?
- Does the page avoid implying booking, availability, payment, inventory, or Bókun backend behavior?
- Is the handoff from planner result to product detail to booking partner understandable?
- Is there a narrow copy or UI change worth doing next?

Why this is the right next step:

- analytics implementation is blocked by plan/vendor choice;
- SEO opening is a hard approval gate;
- several previously recommended B2B and tour-detail fallback tasks already exist in code;
- the mobile results path has already been audited and tightened through PR #263;
- the remaining core product path is the transition from AI Trip Planner results into tour detail pages.

## 7. Candidate follow-up tasks after audit

Only after the audit identifies a concrete gap:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-COPY-SAFETY-REVIEW-1
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-1
TD-RADARSCOUT-AI-TRIP-PLANNER-DETAIL-RETURN-PATH-PREVIEW-SMOKE
TD-DEPLOY-AI-TRIP-PLANNER-RESULT-FLOW-PRODUCTION
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
TD-RADARSCOUT-TRAVELER-FUNNEL-PLAUSIBLE-DECISION-2
```

Guardrails:

- no LLM/OpenAI integration;
- no Bókun API/edit/sync;
- no checkout/payment/cart/booking submission;
- no live availability/inventory;
- no DB/schema/env changes;
- no SEO index/follow opening without explicit approval;
- no ThaiEleHub/Shopify work.
