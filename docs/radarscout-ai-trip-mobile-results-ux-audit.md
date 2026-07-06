# TD-RADARSCOUT-AI-TRIP-PLANNER-MOBILE-RESULTS-UX-0

## Current state

RadarScout now has a public `/ai-trip-planner` flow where a traveler can:

- enter a Thailand trip idea;
- parse intent locally in the browser;
- confirm the detected trip intent;
- search read-only Thailand experience records;
- see result-ready feedback;
- open the top match details;
- compare three product cards;
- continue to product pages for current details and booking partner handoff.

PR #259 added mobile E2E coverage for the result flow at a 390px-wide viewport. The test confirms that the result feedback, top-match action, product cards, and horizontal overflow safety remain intact.

## Safety boundary status

The current result flow remains inside the approved RadarScout boundary:

- no LLM/OpenAI call;
- no Bókun API/edit/sync;
- no checkout, payment, cart, or booking submission;
- no live availability or inventory claim;
- no DB/schema/env change;
- no SEO index/follow opening;
- product results stay read-only comparison results;
- booking partner handoff stays on product pages.

## Mobile UX strengths

The mobile result flow has several strong pieces already:

- The results area has a stable anchor: `#ai-trip-results`.
- `Results ready` gives a clear state change after search.
- `Open top match details` gives one obvious next action before the full card list.
- Product cards use compact mobile padding and a minimum 44px detail CTA.
- The latest E2E coverage checks for no horizontal overflow.
- Result copy repeatedly separates comparison from booking partner actions.

## Remaining UX gaps

These are not blockers, but they explain where the next mobile polish should focus.

### 1. The search journey still has several stacked sections before results

On mobile, the traveler moves through:

1. hero and destination starter content;
2. trip idea form;
3. local planning summary;
4. planner notes and safety panels;
5. optional itinerary placeholder;
6. structured trip details;
7. results area.

This is safe and transparent, but it can feel long. The result cards are now reachable, but the journey still has more explanatory content than an efficient mobile planner needs.

### 2. Product result card density is safe but still information-heavy

Each result card includes:

- comparison badges;
- city;
- title;
- summary;
- fit reason;
- fit checklist;
- tags;
- booking-partner handoff explanation;
- price label when present;
- detail CTA.

This is defensible for trust and safety. The tradeoff is vertical length. A future mobile polish could make secondary proof points visually quieter without removing them.

### 3. The top-match action is useful, but not yet a full mobile result summary

The top-match action gives a direct next step. The nearby copy says to start with the first comparison match, then compare cards below. That is good, but the page does not yet provide a compact “best next step” summary that explains why the first card is surfaced first.

### 4. Structured trip details are safe but developer-oriented

The collapsed `Trip details` panel is useful for transparency. It is also a technical JSON-facing surface. It should remain collapsed, but future UX work should avoid making it more prominent for normal travelers.

## Recommended next implementation

Recommended next task:

```text
TD-RADARSCOUT-AI-TRIP-PLANNER-MOBILE-RESULTS-UX-1
```

Goal:

Make the mobile result section tighter after search without changing product matching, APIs, booking handoff, SEO state, or destination scope.

Recommended scope:

- reduce vertical spacing inside the successful result state on mobile;
- keep `Results ready`, `Open top match details`, and product cards visible;
- make the top-match prompt feel like the primary next step;
- keep result cards safe but slightly more compact on mobile;
- preserve all existing comparison-only and booking-partner safety copy;
- keep the no-horizontal-overflow E2E test from PR #259.

## What not to build yet

Do not use this mobile polish task to add:

- LLM itinerary generation;
- Bókun API calls;
- checkout/payment/cart;
- live availability;
- saved trips/accounts;
- analytics instrumentation;
- SEO index/follow opening;
- new sitemap URLs;
- new destination inventory claims.

## Test expectations for the next implementation

Future implementation should preserve or add tests for:

- result feedback remains visible after search;
- top-match details action remains visible;
- product cards remain visible;
- no horizontal overflow at mobile width;
- result cards still identify comparison-only mode;
- detail links keep `source=ai-trip-planner`;
- no forbidden booking, payment, availability, rate, or Bókun backend wording;
- no `/api/bokun`, OpenAI/LLM, checkout/payment/booking submission, or DB write behavior.

## Recommendation

Proceed with `TD-RADARSCOUT-AI-TRIP-PLANNER-MOBILE-RESULTS-UX-1` as a narrow UI polish PR only after this audit is reviewed. This should be treated as a mobile density improvement, not a product logic change.
