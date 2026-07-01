# RadarScout chat planner MVP

## 1. Goal

Define a safe first version of a chat-style planning interface for Chiang Mai experiences:

```text
A chat-style planning interface for Chiang Mai experiences that maps user intent into existing recommendation inputs and product cards.
```

The goal is to make RadarScout feel more like a helpful local planning assistant without changing the current transaction boundary.

This MVP is not:

- A global AI travel agent.
- An OTA.
- A booking engine.
- A cart or checkout flow.
- A live availability or inventory system.
- A tool that creates bookings.

The planner should help travelers describe what kind of Chiang Mai day they want, compare suitable experiences, and continue to booking partner widgets when they are ready.

RadarScout role:

- Discovery.
- Recommendation.
- Filtering.
- Trip-shape guidance.
- Booking partner handoff.

Booking partner role:

- Availability.
- Inventory.
- Checkout.
- Payment.
- Booking submission.
- Booking confirmation.

## 2. Why this matters

A conversational planner can lower friction compared with a traditional filter form.

Why it matters:

- Users can describe travel style naturally.
- Prompt chips help users start faster.
- A chat flow feels more modern, personal, and guided than a static product list.
- The interface can ask one simple question at a time on mobile.
- It can reuse existing scoring and product logic instead of introducing a new booking or AI system.
- It helps RadarScout move toward “AI-guided Thailand experience planner” while staying safe.

The important product move is not to pretend RadarScout can book everything. It is to make choosing the right local experience feel easier, warmer, and more confidence-building.

## 3. MVP version without LLM

The first version should be deterministic and should not call an LLM.

Recommended flow:

### Step 1: group type

Assistant asks:

```text
Who are you traveling with?
```

Choices:

- Solo
- Couple
- Family
- Friends

Mapping direction:

- `Family` maps toward children/family-friendly scoring.
- `Couple` and `Friends` can keep adults-only defaults unless the user later selects children.
- `Solo` can avoid making special assumptions unless future product data supports solo-specific fit.

### Step 2: time available

Assistant asks:

```text
How much time do you have?
```

Choices:

- Half day
- Full day
- Flexible

Mapping direction:

- `Half day` maps to `durationPreference: "half_day"`.
- `Full day` maps to `durationPreference: "full_day"`.
- `Flexible` maps to `durationPreference: "flexible"` or leaves duration less weighted.

### Step 3: desired day style

Assistant asks:

```text
What kind of day do you want?
```

Choices:

- Gentle elephant day
- Cooking + local food
- Nature day trip
- Low-intensity experience

Mapping direction:

- `Gentle elephant day` maps toward elephant care, ethical priority, lower intensity, and family-friendly fit.
- `Cooking + local food` maps toward food/cooking focus.
- `Nature day trip` maps toward nature focus and full-day fit.
- `Low-intensity experience` maps toward lower physical intensity and gentler recommendations.

### Step 4: must-have preferences

Assistant asks:

```text
Any must-have preferences?
```

Choices:

- Feeding
- Bathing if clearly listed
- Ethical priority
- Photo-friendly
- Hotel area

Mapping direction:

- `Feeding` maps to existing feeding preference.
- `Bathing if clearly listed` maps to bathing preference, with conservative copy.
- `Ethical priority` maps to ethical scoring.
- `Photo-friendly` maps to photo-friendly scoring.
- `Hotel area` maps to the existing pickup / area convenience input when available.

The flow should map answers into the existing `ElephantFinderInput` shape rather than creating a new planner domain model for the MVP.

Example deterministic mapping:

```text
Family + Half day + Gentle elephant day + Feeding + Ethical priority
→ ElephantFinderInput with family-friendly, half-day, feeding, and ethical-priority preferences.
```

The output remains the existing recommendation card set, not a generated itinerary that invents details.

## 4. Future LLM version

A future version can add natural-language input behind an explicitly disabled-by-default feature flag. The LLM should be used only for structured intent extraction.

Future LLM responsibilities:

- Parse user text into a safe structured intent.
- Normalize travel style, duration, group type, and interests.
- Identify obvious out-of-scope destinations.
- Ask for clarification when intent is ambiguous.

Future LLM must not:

- Invent products.
- Invent prices.
- Invent pickup guarantees.
- Invent opening hours.
- Claim live availability.
- Claim products are available now.
- Write booking, checkout, payment, or confirmation copy.
- Decide final product facts without verified product context.
- Call Bókun or any booking partner API.

Product matching should remain server-side and grounded in verified product data, rules, and eventually RAG if explicitly approved later.

Final CTA remains:

```text
Check availability
```

Example future structured intent output:

```json
{
  "destination": "Chiang Mai",
  "groupType": "family",
  "durationPreference": "half_day",
  "interests": ["elephant_care", "gentle", "family_friendly"],
  "avoid": ["high_intensity"],
  "needsBookingHandoff": true
}
```

If the LLM output is malformed, unsupported, or over-claims product facts, the system should fail closed and return to deterministic choices.

## 5. UI modules

### Chat hero

Purpose:

- Introduce RadarScout as a guided Chiang Mai experience planner.
- Set expectations that the user is comparing experiences before continuing to a booking partner.

Safe copy direction:

```text
Plan the right Chiang Mai experience.
Answer a few quick questions and RadarScout will suggest trusted local experiences that fit your trip.
```

Avoid:

- “Book instantly.”
- “Live availability.”
- “Guaranteed slots.”
- “AI travel agent.”

### Prompt chips

Purpose:

- Help users begin without typing.
- Show safe, high-intent examples.

Example chips:

- Gentle elephant day
- Family-friendly half day
- Cooking + local food
- Nature day trip
- Low-intensity experience
- Photo-friendly Chiang Mai day

Prompt chips should set deterministic choices or start the guided flow. They should not trigger an LLM in the MVP.

### Assistant question bubbles

Purpose:

- Ask one question at a time.
- Keep the flow mobile-friendly.
- Make the interaction feel more personal than a form.

Example:

```text
RadarScout: Who are you traveling with?
You: Family
RadarScout: Great. How much time do you have?
```

These bubbles are UI framing only. They do not imply a live human agent or a full AI travel agent.

### User choice chips

Purpose:

- Capture structured answers.
- Keep tap targets mobile-friendly.
- Avoid free-text complexity in the MVP.

Choices should map directly into existing finder inputs.

### Recommendation cards

Purpose:

- Show the top matching real experiences.
- Explain fit with safe copy.
- Continue to booking partner widgets.

Cards can include:

- Product title.
- City / area.
- Fit badges.
- `Why this matches`.
- `Good to know`.
- `Check availability` CTA.

Cards must not include:

- Fake ratings.
- Fake reviews.
- Live availability.
- Available-now claims.
- Checkout or payment language.
- Booking confirmation language.

### Trip summary

Purpose:

- Reflect the user’s selected intent.
- Help users understand why recommendations changed.

Example:

```text
Your plan: family-friendly half-day elephant experience with feeding and ethical priority.
```

This is a preference summary, not a confirmed booking or final itinerary.

### Booking partner handoff CTA

Purpose:

- Make the transaction boundary clear.
- Send users to a verified external booking partner page.

CTA:

```text
Check availability
```

Safe helper copy:

```text
Opens the booking partner page so you can review final details there.
```

## 6. Reuse existing code

The MVP should reuse current Chiang Mai finder foundations rather than introduce a new planning engine.

Reusable pieces:

- Existing `ElephantFinderInput`.
- Existing scoring logic.
- Existing owner-managed profiles.
- Existing `Check availability` CTA.
- Existing Bókun widget handoff URLs.
- Existing external link safety behavior.
- Existing noindex state.
- Existing recommendation card language and guardrails.

Recommended MVP implementation shape:

```text
Chat-style UI state
→ deterministic answer mapping
→ existing ElephantFinderInput
→ existing scoring logic
→ existing product cards
→ existing booking partner handoff
```

This keeps the first version mostly presentational and reduces risk.

## 7. Proposed route

Two possible routes:

```text
/chiang-mai/ai-planner
```

or embedded inside:

```text
/chiang-mai/elephant-camp-finder
```

Recommendation:

Start as an embedded mode or section inside `/chiang-mai/elephant-camp-finder`.

Reasons:

- Avoid route and SEO complexity.
- Reuse the existing production page and noindex state.
- Keep current product and handoff behavior unchanged.
- Let users compare the guided chat mode with the current finder flow.
- Avoid prematurely creating a new public promise around “AI planner.”

Future option:

- Create `/chiang-mai/ai-planner` after the deterministic flow is validated and copy, trust signals, and product depth are stronger.

Do not change URL, sitemap, navigation, or SEO index state as part of the MVP design phase.

## 8. Guardrails

### Forbidden

- No checkout.
- No payment.
- No booking submission.
- No live availability.
- No “available now.”
- No “instant confirmation.”
- No fake reviews.
- No fake ratings.
- No Bókun backend wording.
- No Bókun API.
- No LLM in MVP.
- No cart.
- No account requirement.
- No supplier net rate.
- No partner rate.
- No commission wording on tourist pages.
- No claims that RadarScout confirms bookings.

### Allowed

- Compare experiences.
- Check availability.
- Booking partner.
- Trusted local experiences.
- Guided discovery.
- Itinerary draft.
- Handoff.
- Preference summary.
- Safe product-fit explanation.
- Conservative “good to know” guidance.

The core boundary:

```text
RadarScout helps users decide.
Booking partners help users book.
```

## 9. Future tasks

Suggested sequence:

```text
TD-RADARSCOUT-CHAT-PLANNER-1: Build deterministic chat planner UI
```

Scope:

- Add embedded chat-style mode to the existing Chiang Mai finder.
- No LLM.
- Map choice chips into existing `ElephantFinderInput`.
- Reuse existing recommendation cards and CTA.

```text
TD-RADARSCOUT-CHAT-PLANNER-2: Add structured intent extraction tests
```

Scope:

- Test deterministic mapping from chat answers to finder inputs.
- Test guardrails and forbidden copy.
- Test that no booking, checkout, payment, live availability, or Bókun API behavior is introduced.

```text
TD-RADARSCOUT-CHAT-PLANNER-3: Add optional LLM parser behind disabled flag
```

Scope:

- Add natural-language parsing only behind a disabled-by-default feature flag.
- Parse structured intent only.
- Fail closed on malformed or over-claiming output.
- Keep product matching grounded in verified product data.

```text
TD-RADARSCOUT-CHAT-PLANNER-4: Add trip summary / save-to-plan MVP
```

Scope:

- Add a lightweight preference summary or local-only trip plan.
- No account.
- No cart.
- No checkout.
- No booking state.
- No confirmed itinerary claims.

Do not start with LLM. Start with deterministic chat UX, learn from user behavior, then decide whether natural-language parsing is worth the added safety work.
