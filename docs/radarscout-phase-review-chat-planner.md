# RadarScout phase review: chat planner

## 1. Current live product state

RadarScout is live with a focused Chiang Mai discovery flow:

- Chiang Mai elephant / experience finder.
- Deterministic chat planner embedded in `/chiang-mai/elephant-camp-finder`.
- Planner picks summary based on selected chips.
- Suggested Chiang Mai day itinerary with Morning / Midday / Afternoon structure.
- Compact mobile itinerary summary.
- Recommendation cards powered by existing deterministic scoring and owner-managed profiles.
- External booking partner handoff through `Check availability`.
- `noindex,nofollow` still active.

Current production baseline:

```text
Production HEAD: dbbcf86ac9555183759b944905f7f8e66cd8202d
Deployment ID: dpl_HJcMZcodC43MNHoHRfTgfcti378V
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

The product is no longer only a filter form. It now feels closer to an AI-guided travel planning entry point while staying deterministic and inside the current booking boundary.

## 2. Completed milestones

Completed milestones:

- Partner pages.
- Chat Planner 0 docs.
- Chat Planner 1 deterministic planner.
- Chat Planner 1A mobile UX tighten.
- Chat Planner 2 itinerary summary.
- Chat Planner 2A compact mobile summary.
- Production deployments and smoke checks.

Key implementation pattern:

- Build small, safe PRs.
- Validate with focused tests, full Vitest, Playwright, TypeScript, and Next build.
- Use preview smoke before production deploy.
- Deploy production only after explicit approval.
- Keep booking, payment, availability, and inventory outside RadarScout.

## 3. Safety boundary status

Current safety status:

- No LLM/OpenAI integration.
- No Bókun API/edit/sync.
- No checkout/payment/booking submission.
- No DB/schema/env changes for the planner work.
- No live availability/inventory claims.
- No SEO index/follow opening.

RadarScout currently owns:

- Guided discovery.
- Deterministic planning UI.
- Experience recommendation.
- Itinerary-style framing.
- Trust and comparison copy.
- External booking partner handoff.

Booking partners continue to own:

- Availability.
- Inventory.
- Checkout.
- Payment.
- Booking confirmation.
- Operator booking workflow.

## 4. Current product strengths

RadarScout now has several concrete strengths:

- Travelers can express intent through chips instead of starting with a traditional form.
- Recommendations remain deterministic and testable.
- Booking handoff stays safe because `Check availability` sends users to the external booking partner.
- Mobile UX is tighter after the 1A and 2A polish passes.
- The itinerary summary makes the page feel more AI-planner-like without adding LLM risk.
- The old detailed form still exists as a fine-tuning layer.
- The page preserves the conservative SEO state while the experience matures.

This is the right shape for a low-risk travel planning MVP: more helpful than a product list, but not pretending to be a full OTA or live booking engine.

## 5. Remaining risks / gaps

Current gaps:

- Still no SEO indexing.
- Only the Chiang Mai flow is polished.
- No real analytics funnel review yet.
- No saved itinerary.
- No real LLM parser.
- No homepage-level AI planner.
- No supplier/partner CRM or lead capture beyond static pages.

Operational risks:

- Opening SEO too early could expose thin, noindex-era pages before trust signals and internal linking are ready.
- Adding LLM parsing too early could introduce invented claims or unsafe booking language.
- Adding destination breadth too early could dilute the quality of the Chiang Mai flow.
- Adding analytics without a plan could create noisy data and privacy/security drift.

## 6. Recommended next-stage options

### Option A: SEO readiness audit

Value:

- Establishes whether RadarScout is ready to move selected pages from `noindex,nofollow` to `index,follow`.
- Forces a review of content depth, trust signals, canonical strategy, sitemap strategy, internal links, and forbidden copy.
- Creates a clear launch gate before public SEO exposure.

Risk:

- Medium. SEO decisions affect public discovery and brand trust.
- Risk is low if this remains audit/docs only.

Scope:

- Audit current pages.
- Review metadata and robots state.
- Review sitemap/nav/internal link readiness.
- Review content depth and safety copy.
- Recommend whether to keep `noindex,nofollow` or prepare a future index/follow task.

Safety gates:

- Do not change robots in the audit task.
- Do not add sitemap entries.
- Do not add homepage/nav links.
- Do not change canonical behavior without explicit approval.
- Run forbidden copy audit.

### Option B: Homepage AI planner concept

Value:

- Connects the homepage to the AI-guided Thailand experience planner direction.
- Gives users a clearer first impression than a generic product or monitoring-style homepage.
- Can explain RadarScout’s role: discovery, recommendation, itinerary draft, and booking partner handoff.

Risk:

- Medium. Homepage changes are high-visibility.
- Copy can accidentally overpromise AI, availability, or booking behavior.

Scope:

- Docs/design proposal first.
- If later implemented, update homepage hero, prompt chips, and CTA copy only.
- Preserve booking boundaries.

Safety gates:

- No production deploy without preview smoke.
- No live availability language.
- No checkout/payment language.
- No Bókun API.
- No SEO/nav/sitemap change unless separately approved.

### Option C: Analytics / conversion tracking plan

Value:

- Clarifies whether users engage with planner chips, submit, view recommendations, and click `Check availability`.
- Helps decide whether the next bottleneck is copy, layout, ranking, CTA placement, or product coverage.

Risk:

- Medium. Analytics can create privacy and implementation drift.
- Risk is low if this starts as a plan and event taxonomy only.

Scope:

- Define funnel events.
- Define privacy constraints.
- Define what not to track.
- Recommend implementation options later.

Safety gates:

- Docs-only first.
- No analytics SDK installation in the plan task.
- No PII capture.
- No booking partner scraping.
- No DB write unless separately approved.

### Option D: Add more destinations / categories

Value:

- Moves RadarScout toward the broader Thailand experience planner direction.
- Allows testing Bangkok, Pattaya, cooking, food, nature, and local experience intent beyond Chiang Mai.

Risk:

- Medium-high. More destinations require product quality, safe copy, and ranking rules.
- Weak inventory or thin pages could harm user trust.

Scope:

- Start with docs or one narrowly scoped destination/category MVP.
- Reuse deterministic matching patterns.
- Keep product data explicit and reviewed.

Safety gates:

- No invented products.
- No live availability claims.
- No Bókun API/sync unless explicitly approved.
- No index/follow for new pages until SEO readiness passes.
- Preview smoke before any production deploy.

### Option E: Optional LLM parser behind disabled flag

Value:

- Lets travelers type natural language while keeping product matching deterministic.
- Can make the planner feel more conversational without letting the model decide booking facts.

Risk:

- High relative to current deterministic flow.
- LLM output can hallucinate preferences, claims, or booking language if not strictly constrained.

Scope:

- Docs/spec first.
- Later implementation only behind a disabled feature flag.
- LLM extracts structured intent only.
- Product matching remains deterministic/server-side.

Safety gates:

- No default-on LLM.
- No product invention.
- No availability, price, booking, or payment claims.
- Strict schema validation.
- Tests for forbidden copy and parser failure modes.
- No OpenAI/Vercel AI Gateway/provider call until explicitly approved.

## 7. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-SEO-READINESS-0
```

This should be audit/docs first.

Reasoning:

- The Chiang Mai planner is now stable enough to evaluate as a public-facing page.
- SEO is still intentionally closed with `noindex,nofollow`.
- Before opening indexing, RadarScout needs a structured readiness check for content depth, trust, metadata, canonical strategy, sitemap/nav readiness, internal links, and safety language.
- The audit can produce a clear go/no-go decision without changing production behavior.

`index,follow` should not be opened until the SEO readiness audit passes and a separate implementation task is explicitly approved.

## 8. Suggested task queue

Suggested next queue:

```text
TD-RADARSCOUT-SEO-READINESS-0
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-0
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
TD-RADARSCOUT-CHAT-PLANNER-3-LLM-PARSER-DOCS
```

Recommended sequencing:

1. Run `TD-RADARSCOUT-SEO-READINESS-0` as an audit only.
2. If SEO is not ready, keep `noindex,nofollow` and fix content/trust gaps first.
3. Draft the homepage AI planner concept without production UI changes.
4. Define analytics events before adding any tracking implementation.
5. Treat LLM parser work as future-only and docs-first, with a disabled-by-default implementation gate.

Current stop condition:

```text
Do not open index/follow yet.
Do not add homepage/nav/sitemap links yet.
Do not add LLM/OpenAI yet.
Do not add Bókun API, checkout, payment, booking submission, live availability, or inventory behavior.
```
