# RadarScout executable roadmap

## 1. Executive summary

RadarScout should evolve from a Thailand experience finder into an AI-guided Thailand experience planner, while keeping transactions with trusted booking partners.

Strategic boundary:

- RadarScout is not a global OTA.
- RadarScout is not a Bókun clone.
- RadarScout should own discovery, recommendation, itinerary logic, content, trust, and handoff.
- Booking partners continue to own availability, checkout, payment, inventory, and confirmation.

The next product motion should be incremental. RadarScout already has a live Chiang Mai finder and verified external handoff behavior. The safest path is to improve that live funnel, then add static partner/supplier surfaces, then develop SEO and itinerary concepts only after trust signals and content depth are ready.

The product should continue to follow this operating model:

```text
Traveler intent
→ AI-guided or rule-guided interpretation
→ curated Thailand experience recommendation
→ safe booking partner handoff
```

## 2. Current production baseline

Current live baseline:

- Chiang Mai finder is live.
- Production HEAD: `79dca0a8341e0f61ff70e43461dbeed049748275`.
- Primary domains:
  - `https://radarscout.io`
  - `https://www.radarscout.io`
- 8 renderable Chiang Mai owner-managed profiles.
- `1232799` is retained in data but excluded from normal Chiang Mai recommendations.
- Booking handoff is external Bókun widget only.
- CTA: `Check availability`.
- SEO: `noindex,nofollow`.
- Mobile UX polish is live.
- Bathing helper copy is live.
- Recommendation hierarchy includes clearer “Why this matches” and “Good to know” sections.
- No booking, checkout, payment, cart, live availability, or inventory behavior inside RadarScout.

This baseline is strategically useful because it proves the core loop:

```text
preference capture → product fit ranking → safe CTA → public booking partner handoff
```

Do not expand this loop into booking infrastructure until demand, contracts, support responsibilities, and legal boundaries are clear.

## 3. Core product pillars

### Pillar A: AI-guided tourist experience

Purpose:

- Make RadarScout feel like a guided Thailand experience planner rather than a static product directory.

Key elements:

- Prompt chips.
- Planner input.
- Travel style interpretation.
- Recommendation cards.
- Itinerary draft.
- Safe handoff.

Near-term version:

- Rule-based or lightweight guided UX around the existing Chiang Mai finder.
- Prompt chips can set safe preferences.
- Recommendation cards explain fit.

Future version:

- AI-assisted itinerary drafts that use verified product context only.
- Trip-board style planning.
- SEO itinerary landing pages.

Boundary:

- No live availability claims.
- No booking confirmation claims.
- No checkout or payment inside RadarScout.

### Pillar B: Trust and local curation

Purpose:

- Make recommendations feel credible, local, and safe.

Key elements:

- Trusted local operators.
- Public booking partner handoff.
- No fake ratings or reviews.
- Clear “why this product fits” explanation.
- Good-to-know notes.
- Public-safe product facts only.

Near-term version:

- Continue improving cards and copy on the live Chiang Mai finder.
- Validate public handoff links before products render.

Future version:

- Trust checklist for product intake.
- Content/photo guidelines for suppliers.
- Local expert or destination partner validation.

Boundary:

- Do not invent supplier facts, safety claims, pickup guarantees, reviews, ratings, prices, opening hours, or product inclusions.

### Pillar C: Partner and supplier growth

Purpose:

- Build a cooperation path for travel agents, hotels, DMCs, local operators, and destination partners without creating a portal too early.

Key elements:

- Static partner pages.
- Supplier interest forms.
- Destination partner pages.
- Manual onboarding.
- Public booking link validation.

Near-term version:

- Draft static pages for `/partners`, `/suppliers`, and `/destination-partners`.
- Use contact or interest forms only.

Future version:

- Manual supplier/product intake workflow.
- Private partner dashboard only after real repeated demand.
- Optional widgets or API-style integrations only after contracts and margins are clear.

Boundary:

- No login, agent portal, supplier portal, commission dashboard, booking engine, or Bókun API integration in early phases.

### Pillar D: SEO and content growth

Purpose:

- Turn RadarScout’s planning and recommendation logic into safe, indexable content after the content and trust foundation is ready.

Key elements:

- Itinerary landing pages.
- Destination guides.
- FAQ.
- Internal links.
- Schema/canonical strategy.
- Index/follow only after content depth and trust signals improve.

Near-term version:

- Keep the Chiang Mai finder `noindex,nofollow`.
- Plan editorial page templates.
- Audit copy and claims before indexing.

Future version:

- `Chiang Mai family itinerary`.
- `Ethical elephant day in Chiang Mai`.
- `Cooking + elephant experience`.
- `Nature day trip near Chiang Mai`.

Boundary:

- No SEO opening until content depth, safe claims, internal links, canonical strategy, sitemap strategy, and product clarity are reviewed.

## 4. Recommended roadmap phases

### Phase 0: Keep production stable

Goal:

- Observe the live Chiang Mai finder.
- Measure UX and CTA stability.
- Keep `noindex,nofollow`.

Allowed:

- Smoke testing.
- Copy review.
- UX observation.
- Handoff URL audits.
- Mobile usability review.

Forbidden:

- SEO opening.
- Booking engine.
- Bókun API.
- Checkout/payment.
- Live availability claims.
- Product fact invention.

Exit criteria:

- Mobile UX remains stable.
- CTA links remain safe.
- No forbidden copy appears.
- No support or trust issues appear from handoff behavior.

### Phase 1: Homepage AI planner concept

Goal:

- Plan homepage redesign around AI-guided Thailand experience discovery.
- Do not implement code unless a separate task explicitly approves it.

Possible follow-up task:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-0
```

Allowed:

- Design proposal.
- Information architecture.
- Hero copy options.
- Prompt chip set.
- Trust/handoff copy.

Forbidden:

- Production UI changes in the concept task.
- Live availability or booking claims.
- Checkout/payment language.
- Bókun API calls.

### Phase 2: Chiang Mai finder visual upgrade

Goal:

- Make the current finder feel more like guided planning and less like a form.
- Improve the live production funnel without changing the transaction boundary.

Possible follow-up task:

```text
TD-RADARSCOUT-CHIANG-MAI-FINDER-VISUAL-0
```

Allowed:

- Prompt chips.
- Better mobile card layout.
- Clearer trust/handoff copy.
- Improved hero hierarchy.
- Noindex preserved.

Forbidden:

- URL rename.
- SEO index/follow.
- Checkout/payment.
- Live availability language.
- Bókun API or sync.

### Phase 3: Partner/supplier static pages

Goal:

- Add static B2B interest pages:
  - `/partners`
  - `/suppliers`
  - `/destination-partners`
- Use only static pages and contact/interest forms.
- No login or portal.

Possible follow-up task:

```text
TD-RADARSCOUT-PARTNER-PAGES-0
```

Allowed:

- Static copy.
- Interest forms.
- Manual intake instructions.
- Safe B2B positioning.

Forbidden:

- Agent portal.
- Supplier portal.
- Commission dashboards.
- Booking controls.
- Supplier API.
- Bókun admin or backend wording on tourist pages.

### Phase 4: SEO itinerary landing pages

Goal:

- Create editorial landing page concepts and later pages such as:
  - Chiang Mai family itinerary.
  - Ethical elephant day in Chiang Mai.
  - Cooking + elephant experience.
  - Nature day trip near Chiang Mai.
- Keep claims safe and product facts verified.

Possible follow-up task:

```text
TD-RADARSCOUT-ITINERARY-LANDING-PAGES-0
```

Allowed:

- Editorial planning.
- FAQ.
- Example itinerary structures.
- Safe product cards.
- Handoff CTAs.

Forbidden:

- Fake itinerary facts.
- Live availability claims.
- Guaranteed pickup or opening hours.
- Index/follow without SEO readiness approval.

### Phase 5: Trip board MVP

Goal:

- Allow users to save or compare experiences in a simple local session.
- No cart, no checkout, no booking engine, no account at first.

Possible follow-up task:

```text
TD-RADARSCOUT-TRIP-BOARD-MVP-0
```

Allowed:

- Local-session saved cards.
- Morning / afternoon / evening grouping.
- Compare selected experiences.
- No-login prototype.

Forbidden:

- Cart.
- Checkout.
- Payment.
- Booking engine.
- Account/collaboration unless separately approved.
- Confirmed itinerary language.

### Phase 6: SEO readiness and index/follow decision

Goal:

- Decide when selected pages can move from `noindex,nofollow` to `index,follow`.
- Only after trust copy, content depth, internal links, canonical/sitemap strategy, and product clarity are ready.

Possible follow-up task:

```text
TD-RADARSCOUT-SEO-READINESS-0
```

Allowed:

- SEO checklist.
- Content depth audit.
- Forbidden copy audit.
- Internal link plan.
- Canonical/sitemap plan.

Forbidden:

- Changing robots/indexing in the same task unless explicitly approved.
- Adding pages to sitemap before readiness is approved.

## 5. Prioritized next 4–6 small PR candidates

| Task | Objective | Allowed files | Blocked actions | Risk | Expected validation |
| --- | --- | --- | --- | --- | --- |
| `TD-RADARSCOUT-CHIANG-MAI-FINDER-VISUAL-0` | Make the live finder feel more like guided planning while preserving current handoff behavior. | `apps/web/app/chiang-mai/elephant-camp-finder/*`, related tests only. | No SEO opening, URL rename, checkout/payment, live availability, Bókun API/sync. | Low-medium | Focused finder tests, full Vitest, Playwright, TypeScript, preview smoke. |
| `TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-0` | Create homepage AI planner concept or static prototype for review. | Prefer docs/design proposal first; if implementation approved later, homepage files and tests only. | No production deploy, no live availability, no checkout/payment, no Bókun API. | Medium | Copy/UX review; if code later, tests + preview smoke. |
| `TD-RADARSCOUT-PARTNER-PAGES-0` | Add static partner/supplier/destination partner interest pages. | Future page files under `apps/web/app/partners`, `apps/web/app/suppliers`, `apps/web/app/destination-partners`; tests; copy docs. | No login, portal, commission dashboard, booking controls, Bókun API/sync. | Low-medium | Page render tests, forbidden copy audit, TypeScript, preview smoke. |
| `TD-RADARSCOUT-ITINERARY-LANDING-PAGES-0` | Draft or implement noindex itinerary landing pages for specific Chiang Mai intents. | Docs first; later page files and tests if approved. | No index/follow, fake facts, live availability, guaranteed pickup/opening hours. | Medium | Metadata tests, forbidden copy audit, content review, preview smoke. |
| `TD-RADARSCOUT-TRIP-BOARD-MVP-0` | Explore no-login saved experience comparison board. | Docs/design first; later local-state UI files and tests only if approved. | No cart, checkout, payment, booking engine, account/collaboration. | Medium-high | State tests, E2E for no booking behavior, forbidden copy audit. |
| `TD-RADARSCOUT-SEO-READINESS-0` | Audit readiness to move selected pages from noindex to index/follow. | Docs and metadata audit only. | No robots change unless explicitly approved, no sitemap/nav change in audit task. | Medium | Checklist completion, metadata audit, forbidden copy audit. |

## 6. Recommended immediate next task

Compare the two safest implementation candidates:

### Option A: `TD-RADARSCOUT-CHIANG-MAI-FINDER-VISUAL-0`

Why this is strong:

- The page is already live.
- It improves a real production funnel.
- It is low risk if `noindex,nofollow` stays unchanged.
- It does not require auth, DB, new API, Bókun API, checkout, payment, or inventory.
- It builds directly on observed user-facing behavior.

Risks:

- Visual work can over-expand if not scoped tightly.
- Copy must avoid booking/availability promises.

### Option B: `TD-RADARSCOUT-PARTNER-PAGES-0`

Why this is strong:

- It helps business development.
- It can remain mostly static.
- It supports supplier/partner conversations before building portals.

Risks:

- Even static B2B pages require careful forms/copy.
- It may introduce new public surfaces before the tourist funnel is polished.
- It may raise partner expectations if copy implies dashboards, commissions, or live inventory.

Final recommendation:

```text
TD-RADARSCOUT-CHIANG-MAI-FINDER-VISUAL-0
```

Reason:

- It is the smallest improvement to an already live, tested flow.
- It strengthens the current conversion path before adding new public pages.
- It keeps SEO closed.
- It avoids new auth, DB, API, partner operations, and transaction behavior.

Use `TD-RADARSCOUT-PARTNER-PAGES-0` after the finder visual direction stabilizes or when active partner outreach needs a public destination.

## 7. Guardrails

Tourist pages must not say:

```text
Bókun database
Bókun backend
Bókun-powered
Bókun supplier products
supplier net rate
partner rate
commission
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
booked
reservation complete
fake reviews
fake ratings
```

Tourist pages may say:

```text
trusted local experiences
booking partner
partner-direct value
secure booking handoff
compare experiences
check availability
continue with the booking partner
real local experiences
AI-guided discovery
```

Implementation guardrails:

- No booking engine.
- No checkout/payment/cart.
- No live availability/inventory.
- No Bókun API or sync without explicit approval.
- No production deploy from planning tasks.
- No SEO `index,follow` change without explicit readiness task and approval.
- No homepage/nav/sitemap links unless explicitly scoped.
- No login/account/agent portal unless explicitly scoped.
- No fake ratings, fake reviews, or invented product facts.

## 8. Open decisions

Product owner decisions needed:

- Should the next public UI task be Chiang Mai finder visual upgrade or partner pages?
- Should homepage become AI planner first?
- Should current Chiang Mai finder URL remain as is?
- Should a broader `/chiang-mai/experience-finder` exist later?
- What metrics must be observed before `index,follow`?
- Which partner page should launch first: `/partners`, `/suppliers`, or `/destination-partners`?
- Should partner/supplier pages stay noindex at launch?
- Should itinerary landing pages launch as noindex prototypes first?
- What level of trust signal is required before broader SEO exposure?
- Which user action matters most next: planner start, recommendation submit, or booking partner CTA click?

## Summary

The roadmap should move in this order:

```text
stabilize live finder
→ improve guided planning UX
→ add static partner/supplier surfaces
→ plan itinerary SEO pages
→ explore trip board
→ decide index/follow only after readiness audit
```

This keeps RadarScout focused on its durable role: helping travelers choose trusted Thailand experiences and handing them off safely to booking partners.
