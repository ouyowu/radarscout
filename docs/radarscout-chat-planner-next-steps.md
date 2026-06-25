# RadarScout chat planner next steps

## 1. Current state

The live Chiang Mai finder now includes a deterministic chat-style planner embedded inside:

```text
/chiang-mai/elephant-camp-finder
```

Current behavior:

- Travelers start with chip-based planning prompts.
- The planner asks about day style, group type, available time, and preferences.
- Choices map into the existing `ElephantFinderInput` shape.
- Recommendation cards still use the existing scoring and owner-managed product profile logic.
- The detailed form remains available as a fine-tuning layer.
- The CTA remains `Check availability`.
- Handoff remains an external booking partner widget.
- The page remains `noindex,nofollow`.

Current safe product boundary:

```text
RadarScout helps travelers compare and choose.
Booking partners handle availability, checkout, payment, inventory, and confirmation.
```

The planner is intentionally deterministic. It does not call an LLM, Bókun API, checkout service, or database write path.

## 2. Problem to solve next

The current planner helps users express preferences, but it still ends in a recommendation list. It does not yet translate the selected chips into a simple day-plan narrative that helps users understand the shape of their Chiang Mai day.

The next UX gap:

- Users can choose preferences, but they do not yet see a short “what this day could feel like” summary.
- Recommendation cards explain product fit, but the page does not summarize the day structure before the user compares options.
- The experience still feels partly like filtering rather than guided planning.

Example target direction:

```text
Your suggested Chiang Mai day
Morning: Gentle elephant care
Midday: Local food or optional cooking focus
Afternoon: Easy return toward Chiang Mai
```

This summary should remain non-booking, non-logistical, and non-claiming. It should help the traveler understand the plan shape, not imply confirmed timing, pickup, availability, or booking status.

## 3. Recommended next feature

Recommended next implementation task:

```text
TD-RADARSCOUT-CHAT-PLANNER-2-ITINERARY-SUMMARY-MVP
```

Goal:

Add a deterministic, non-booking itinerary summary based on selected planner chips and current recommendation context.

The summary should:

- Render only after the user has made relevant selections or clicked `See matching experiences`.
- Use selected chips to produce a short day-plan narrative.
- Sit above or near recommendation cards so it bridges planning and product comparison.
- Explain experience fit without inventing product facts.
- Keep recommendation cards and `Check availability` handoff unchanged.

The feature should not introduce:

- LLM calls.
- Bókun API calls.
- DB writes.
- Live availability or inventory behavior.
- Checkout, payment, cart, or booking submission.

## 4. Deterministic summary rules

The summary should be generated from existing planner state, not freeform AI output.

Recommended helper shape:

```ts
type ItinerarySummary = {
  title: string
  summary: string
  segments: {
    label: 'Morning' | 'Midday' | 'Afternoon'
    text: string
  }[]
}
```

The helper can inspect:

- Selected chat planner choices.
- Current `ElephantFinderInput`.
- Whether the top recommendation category is elephant care, cooking/food, nature, or local experience.

It should not inspect raw Bókun data, raw JSON, private supplier data, or any availability source.

### Gentle elephant + family + half day

Selected:

```text
Gentle elephant day + Family + Half day
```

Possible summary:

```text
A gentle half-day plan focused on elephant care and family-friendly pacing.
```

Possible segments:

```text
Morning: Start with a gentle elephant care experience.
Midday: Keep the plan light and easy for the group.
Afternoon: Leave space to return toward Chiang Mai or rest.
```

### Cooking + local food + couple + full day

Selected:

```text
Cooking + local food + Couple + Full day
```

Possible summary:

```text
A full-day food-focused plan that pairs local cooking or food experiences with a relaxed Chiang Mai pace.
```

Possible segments:

```text
Morning: Begin with a local experience or partner-hosted activity.
Midday: Make food or cooking the center of the day.
Afternoon: Compare experiences that keep the pace relaxed.
```

### Nature day trip + friends + full day

Selected:

```text
Nature day trip + Friends + Full day
```

Possible summary:

```text
A full-day nature-focused plan for travelers who want more time outside the city.
```

Possible segments:

```text
Morning: Start earlier for a nature-focused day outside central Chiang Mai.
Midday: Choose experiences with stronger outdoor or scenery fit.
Afternoon: Keep the plan flexible for a longer return toward Chiang Mai.
```

### Low-intensity + flexible

Selected:

```text
Low-intensity experience + Flexible
```

Possible summary:

```text
A flexible plan that prioritizes an easier pace over packing too much into the day.
```

Possible segments:

```text
Morning: Choose a lighter experience that does not feel rushed.
Midday: Compare options by comfort, transfer fit, and group pace.
Afternoon: Leave room for rest or a simple handoff to the booking partner.
```

## 5. UI placement

Recommended placement:

- Near `Your planner picks`.
- Above recommendation cards after the user clicks `See matching experiences`.
- Not above the initial planner before selections.

Suggested layout:

```text
Your planner picks
Selected chips...

See matching experiences

Your suggested Chiang Mai day
Short summary
Morning / Midday / Afternoon

Best Chiang Mai experience matches
Recommendation cards
```

Why this placement:

- It keeps the initial planner compact.
- It gives users an immediate planning payoff after they submit.
- It helps recommendation cards feel like part of a guided day, not a disconnected list.

The summary should be visually lighter than product cards. It should feel like planning guidance, not a confirmed itinerary.

## 6. Copy guardrails

Forbidden visible wording:

- live availability
- available now
- guaranteed slot
- instant confirmation
- checkout
- payment
- reservation complete
- AI booked this
- Bókun backend
- Bókun database
- Bókun-powered
- fake reviews
- fake ratings

Allowed wording:

- suggested day
- planning summary
- experience fit
- compare options
- check availability
- booking partner
- partner handoff
- trusted local experiences

Safe framing examples:

```text
Suggested day
Planning summary
Compare experiences that fit this style.
Continue to the booking partner when you are ready to check details.
```

Unsafe framing examples:

```text
Your confirmed itinerary
Available slots for your day
Book this schedule now
Instant confirmation plan
```

## 7. What not to build yet

Do not build these in the next implementation task:

- Saved trip boards.
- User accounts.
- PDF itinerary export.
- LLM-generated itinerary.
- Map routing.
- Hotel pickup logic.
- Checkout/payment.
- Booking cart.
- Availability calendar.
- Booking confirmation state.
- Bókun API integration.
- Supplier dashboard.

These are future product areas that require separate safety, data, legal, and operational review.

## 8. Implementation proposal for later

Recommended later PR scope:

1. Add deterministic itinerary summary helper functions.
2. Add summary UI after planner picks or above recommendation cards.
3. Add tests for each summary scenario.
4. Keep existing recommendation scoring unchanged.
5. Keep existing `Check availability` CTA unchanged.
6. Keep external handoff URLs unchanged.
7. Keep page `noindex,nofollow`.

Possible helper functions:

```ts
buildItinerarySummaryFromPlanner(params: {
  input: ElephantFinderInput
  selectedLabels: string[]
  submitted: boolean
}): ItinerarySummary | null
```

Recommended behavior:

- Return `null` before meaningful selections or before submit.
- Return a deterministic summary after planner selections.
- Prefer simple wording over complex itinerary logic.
- Use `durationPreference` to choose half-day, full-day, or flexible framing.
- Use `wantsCookingOrFood`, `wantsNatureDayTrip`, `wantsGentleFamilyExperience`, and `wantsElephantCare` to choose summary tone.
- Treat `wantsBathing` conservatively and never imply bathing is guaranteed.

Do not let the helper:

- Generate product facts.
- Read private product fields.
- Call APIs.
- Use time-specific claims.
- Create booking steps.

## 9. Test plan for later implementation

Future tests should cover:

- Summary does not render before meaningful selections.
- Summary renders after planner selections and `See matching experiences`.
- Summary changes by planner chip choices.
- Gentle family half-day summary uses gentle/family/half-day wording.
- Cooking full-day summary uses food/cooking/full-day wording.
- Nature full-day summary uses nature/outside-city/full-day wording.
- Low-intensity summary uses easier-pace wording.
- Summary never includes forbidden booking, availability, checkout, payment, or confirmation claims.
- Recommendation cards remain unchanged.
- CTA remains `Check availability`.
- External handoff behavior remains unchanged.
- `1232799` remains excluded from normal Chiang Mai recommendations.
- No API, DB, LLM, OpenAI, Bókun, checkout, or payment behavior is introduced.
- Page remains `noindex,nofollow`.

Validation for the implementation PR should include:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- elephant
pnpm --filter @reddit-monitor/web test -- chat
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
```

## 10. Recommended task sequence

Recommended sequence:

1. `TD-RADARSCOUT-CHAT-PLANNER-2-DOCS`
2. `TD-RADARSCOUT-CHAT-PLANNER-2-ITINERARY-SUMMARY-MVP`
3. `TD-RADARSCOUT-CHAT-PLANNER-2-PREVIEW-SMOKE`
4. `TD-RADARSCOUT-CHAT-PLANNER-2-MERGE-POSTMERGE-PREVIEW`
5. `TD-DEPLOY-CHAT-PLANNER-2-PRODUCTION` only after explicit approval

Stop gates:

- Stop at PR for the implementation task.
- Stop at preview after preview smoke.
- Stop at merge post-merge preview before production.
- Never production deploy without explicit user approval.

The next safe implementation task should be small and UI-only:

```text
TD-RADARSCOUT-CHAT-PLANNER-2-ITINERARY-SUMMARY-MVP
```

It should add deterministic planning summary UI without changing RadarScout’s transaction boundary.
