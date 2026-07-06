# RadarScout homepage AI planner concept

Task: `TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-CONCEPT-0`

Status: docs/design proposal only.

This document proposes a safer homepage direction for RadarScout as an AI-guided Thailand experience planner. It does not change homepage code, SEO indexing, sitemap output, Bókun behavior, database state, environment variables, production deployment, or ThaiEleHub/Shopify files.

## 1. Goal

Make the homepage clearly introduce RadarScout as:

```text
AI-guided Thailand experience discovery + deterministic planning + booking partner handoff
```

The homepage should help a traveler understand three things quickly:

1. RadarScout helps them describe the day they want.
2. RadarScout compares trusted local experiences and drafts a simple plan.
3. Final availability, booking details, checkout, payment, and confirmation stay with the booking partner.

This concept should not make RadarScout look like a global OTA, live inventory system, payment system, or Bókun backend.

## 2. Current baseline

Current live product surfaces already include:

- homepage entry to `/ai-trip-planner`;
- homepage entry to `/chiang-mai/elephant-camp-finder`;
- deterministic Chiang Mai finder;
- AI Trip Planner route;
- itinerary and planning summaries;
- comparison-only product cards;
- product detail links from AI Trip Planner;
- safe external booking partner handoff;
- no SEO `index,follow` opening from this concept.

The homepage is already useful, but it can do a better job of presenting RadarScout as a travel-planning product instead of a set of separate pages.

## 3. Recommended homepage structure

### Hero

Purpose:

- State the product category.
- Keep the promise realistic.
- Route the user into planning, not checkout.

Recommended hero copy:

```text
AI-guided Thailand experience planner

Tell RadarScout the kind of Thailand day you want. Compare elephant care, food, nature, family-friendly, and city experiences before continuing with a booking partner.
```

Primary CTA:

```text
Start planning
```

Primary CTA target:

```text
/ai-trip-planner
```

Secondary CTA:

```text
Plan a Chiang Mai elephant day
```

Secondary CTA target:

```text
/chiang-mai/elephant-camp-finder
```

### Prompt chip row

Purpose:

- Show example intents without implying LLM magic or booking completion.
- Keep the homepage active and travel-specific.

Suggested chips:

- `Gentle elephant day in Chiang Mai`
- `Family-friendly Thailand experience`
- `Cooking and local food day`
- `Nature day trip from Chiang Mai`
- `Bangkok or Pattaya elephant day`

Behavior for a later implementation:

- Chips can link to `/ai-trip-planner` with a safe prefilled prompt only if that is separately scoped and tested.
- If prefill is not implemented, chips can be static examples or simple links to the planner.

### How it works

Recommended three-step structure:

1. `Describe your travel style`
2. `Compare matching experiences`
3. `Continue with a booking partner`

Safe support copy:

```text
RadarScout helps with discovery, comparison, and planning. Booking partners handle current availability, checkout, payment, and confirmation.
```

### Featured planner paths

Recommended cards:

- `AI Trip Planner`
  - CTA: `Start planning`
  - Target: `/ai-trip-planner`
- `Chiang Mai elephant finder`
  - CTA: `Plan with RadarScout`
  - Target: `/chiang-mai/elephant-camp-finder`
- `Partner and supplier interest`
  - CTA: `Work with RadarScout`
  - Target: `/partners`

B2B links may remain on the homepage if already present, but this concept does not change their `noindex,nofollow` state.

## 4. Copy guardrails

Allowed wording:

- `AI-guided Thailand experience planner`
- `guided discovery`
- `compare experiences`
- `suggested plan`
- `trusted local experiences`
- `booking partner`
- `continue with a booking partner`
- `Check availability`
- `Start planning`

Forbidden public homepage wording:

- `AI booked this`
- `live availability`
- `available now`
- `guaranteed slot`
- `instant confirmation`
- `checkout`
- `payment`
- `reservation complete`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `Bókun supplier products`
- `supplier net rate`
- `partner rate`
- `commission`
- `fake reviews`
- `fake ratings`

`checkout` and `payment` may appear only in explicit boundary explanations such as:

```text
Booking partners handle checkout and payment.
```

For homepage hero and CTA copy, avoid those words entirely unless the implementation task explicitly adds a boundary note and tests it.

## 5. SEO and sitemap boundary

This concept does not open indexing.

Preserve:

```text
/chiang-mai/elephant-camp-finder: current robots state until a separate approved SEO task
/partners: noindex,nofollow
/suppliers: noindex,nofollow
/destination-partners: noindex,nofollow
/tours/{id}: excluded from sitemap
```

Do not add any new sitemap entries in the homepage concept task.

## 6. Future implementation scope

Recommended future task:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-CONCEPT-1
```

Allowed implementation files:

```text
apps/web/app/page.tsx
apps/web/app/__tests__/homepageCopy.test.tsx
apps/web/app/__tests__/sitemap.test.ts
apps/web/app/chiang-mai/elephant-camp-finder/__tests__/metadata.test.ts
```

Implementation should be narrow:

- update homepage hero and planner cards only;
- keep existing homepage routes and page metadata safe;
- do not change sitemap;
- do not change robots;
- do not change AI Trip Planner logic;
- do not change Chiang Mai finder logic;
- do not change product data;
- do not add analytics, LLM, Bókun API, checkout, payment, booking submission, inventory, or live availability behavior.

## 7. Future test plan

Future implementation tests should confirm:

- homepage links to `/ai-trip-planner`;
- homepage links to `/chiang-mai/elephant-camp-finder`;
- homepage uses safe planner/discovery wording;
- homepage does not contain forbidden live-availability, booking-completion, rate, commission, fake-review, or Bókun-backend wording;
- sitemap still excludes `/tours/{id}`;
- sitemap does not include B2B pages;
- B2B pages remain `noindex,nofollow`;
- Chiang Mai finder robots remain unchanged unless a separate SEO opening task explicitly changes them.

Suggested validation for the later implementation:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- homepageCopy
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

## 8. Recommendation

Recommended next product step:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-CONCEPT-1
```

Use this document as the copy and safety source. Keep the implementation narrow and stop at PR/preview. Do not deploy production without explicit approval for the exact merge SHA.

If Vercel preview quota is still blocked, prefer local validation plus docs/status updates over production deployment.
