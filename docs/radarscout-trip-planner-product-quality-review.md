# RadarScout Trip Planner Product Quality Review

Task: `TD-RADARSCOUT-TRIP-PLANNER-PRODUCT-QUALITY-REVIEW-0`

Date: 2026-07-07

Production reviewed:

- `https://radarscout.io/ai-trip-planner`
- `https://www.radarscout.io/ai-trip-planner`

Production deployment in scope:

- SHA: `eb9078f00daaeed7d18542608d83f19daeac98f8`
- Deployment: `dpl_5aHqMz51QwQy6EQpCmqquTN8yaRK`

This review is read-only. It does not change code, schema, environment, SEO,
Bókun, checkout, booking, or product data.

## 1. Executive answer

### Should this be called AI?

Not in the current product surface.

The current runtime is deterministic local intent parsing plus keyword-backed
Thailand product search. It does not call an LLM and does not generate an
itinerary with a model. The current public page name, `Trip Planner`, is the
right low-risk label.

It is still reasonable to describe RadarScout's longer-term direction as
AI-assisted travel discovery, but the live `/ai-trip-planner` page should not
claim to be an AI agent or AI trip planner until an actual model-backed parser,
ranker, or itinerary step exists behind a reviewed safety boundary.

### Is deterministic search good enough for users?

Partially.

It is good enough for a noindex beta where the user enters a single Thailand
city plus one clear interest. It is not yet good enough to open SEO, advertise as
a complete trip planner, or rely on for broad multi-city planning.

The strongest current use cases are:

- Bangkok food/canal/temple prompts
- Phuket beach/boat prompts
- Chiang Mai or Pattaya elephant prompts
- unsupported non-Thailand prompts, which correctly return no product matches

The weakest current use cases are:

- multi-city Thailand routes
- prompts with multiple interests that require result diversity
- negation, especially "no elephant"
- cooking-class intent, which currently drifts toward lunch/elephant products
- ranking when one keyword dominates the top result

## 2. Production smoke result

Both production domains loaded the planner successfully:

| URL | Status | Title | Robots | Result |
| --- | ---: | --- | --- | --- |
| `https://radarscout.io/ai-trip-planner` | 200 | `Thailand Trip Planner \| RadarScout` | `noindex, nofollow` | Passed |
| `https://www.radarscout.io/ai-trip-planner` | 200 | `Thailand Trip Planner \| RadarScout` | `noindex, nofollow` | Passed |

Interactive production flow tested:

```text
Prompt: Chiang Mai 2 days elephants food relaxed pace
Parse trip intent
Confirm trip intent
Search real Thailand experiences
```

Observed:

- `/api/ai-trip/search` returned `200`
- response status was `ok`
- six product result links rendered
- result summary rendered
- mobile viewport had no horizontal overflow
- no forbidden public copy was visible
- no unsafe network calls were observed

Safety checks:

- no `/api/bokun`
- no OpenAI / LLM request
- no checkout / payment / booking request
- no visible `AI Trip Planner`
- no visible `live availability`, `available now`, `instant confirmation`, or
  similar booking-status claims

## 3. Prompt evaluation methodology

Fifteen realistic traveler prompts were submitted to the live production
`/api/ai-trip/search` endpoint.

Scoring is a product-quality judgment, not a unit-test result:

- 5 = strong match
- 4 = useful but missing a secondary preference
- 3 = mixed result; usable but needs ranking improvement
- 2 = weak result; user likely needs to reformulate
- 1 = wrong intent or clearly misleading result set

## 4. Prompt results

| ID | Prompt | Status | Top result | Judgment | Score |
| --- | --- | --- | --- | --- | ---: |
| P01 | Chiang Mai 2 days elephants food relaxed pace | ok, 6 results | Chiang Mai Traditional Khan Toke Meal & Cultural Performance | Mixed. It finds Chiang Mai and food/elephant inventory, but food dominates the first result despite elephant intent. | 3 |
| P02 | Chiang Mai gentle elephant day family half day feeding ethical pace | ok, 6 results | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | Useful elephant set. Parser missed family, gentle, half-day, and feeding nuance. | 4 |
| P03 | Bangkok one day food canals temples relaxed pace | ok, 6 results | Bangkok Sunset Canal Food Tasting Tour | Strong. Food/canal/temple results are coherent. | 5 |
| P04 | Pattaya beach day family elephant sanctuary easy pace | ok, 2 results | Pattaya: Ethical Elephant Sanctuary Day Trip | Useful elephant result set. Beach/family/easy pace nuance is not represented. | 3 |
| P05 | Phuket islands beaches boat relaxed outdoor day | ok, 6 results | 5-Hour Snorkeling and Sights at Banana Beach of Koh Hey Phuket | Strong beach/boat match. | 5 |
| P06 | Thailand 7 days Bangkok Chiang Mai Phuket food temples beaches relaxed pace | ok, 6 results | Bangkok Sunset Canal Food Tasting Tour | Weak for multi-city planning. Results collapse into Bangkok food/temple instead of covering Bangkok, Chiang Mai, and Phuket. | 2 |
| P07 | Chiang Mai cooking class local food half day couple | ok, 4 results | Chiang Mai Traditional Khan Toke Meal & Cultural Performance | Weak. It finds food but not cooking-class inventory; several results drift to elephant lunch. | 2 |
| P08 | Chiang Mai nature Doi Inthanon elephants full day | ok, 6 results | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | Strong first result and coherent elephant/nature set. | 5 |
| P09 | Bangkok elephant day trip no riding family | ok, 2 results | From Bangkok: Pattaya Ethical Elephant Jungle Sanctuary Day Trip | Useful. Correctly finds from-Bangkok elephant day trips, but family/no-riding nuance is not verified in the result text. | 4 |
| P10 | Pattaya elephant sanctuary no riding hotel pickup | ok, 2 results | Pattaya: Ethical Elephant Sanctuary Day Trip | Useful Pattaya elephant set. Hotel pickup/no-riding details are not verified from the match surface. | 4 |
| P11 | Phuket ethical elephant experience family gentle pace | ok, 6 results | From Phuket: Leaning with Elephants - Half day tour with lunch | Mixed. Several elephant matches, but one irrelevant `Private Bangkok Tour With Driver` appears with city `Phuket`. | 3 |
| P12 | Thailand honeymoon islands temples food 10 days | ok, 6 results | Bangkok Sunset Canal Food Tasting Tour | Weak for broad itinerary planning. Results skew to Bangkok food and do not represent islands/honeymoon variety. | 2 |
| P13 | Singapore zoo family 2 days | unsupported_destination, 0 results | none | Correctly blocked as outside Thailand product matching. | 5 |
| P14 | Cambodia Angkor temples 3 days | unsupported_destination, 0 results | none | Correctly blocked as outside Thailand product matching. | 5 |
| P15 | Chiang Mai temples night market no elephant relaxed evening | ok, 6 results | Chiang Mai to Doi Inthanon Guided Nature Trail and Elephant Tour | Poor. The phrase `no elephant` still extracted `elephants` and returned elephant tours. | 1 |

Average product-quality score: `3.53 / 5`.

## 5. What works

The deterministic system is useful when intent is narrow:

- it identifies major Thailand destinations;
- it returns real product pages instead of invented products;
- it safely blocks non-Thailand product search;
- it avoids availability, booking, payment, and Bókun backend claims;
- it keeps product detail and handoff behavior on product pages.

The strongest product direction is a guarded discovery/search planner, not a
full autonomous travel agent.

## 6. What does not work yet

### Ranking does not weight primary intent strongly enough

Example: `Chiang Mai 2 days elephants food relaxed pace` returned a Khan Toke
meal/cultural performance first. That is not unsafe, but it is likely not what a
traveler expects when they include `elephants`.

### Multi-city planning is underpowered

Thailand-wide prompts collapse into one city or one dominant interest. A
multi-city planner should return a balanced set across Bangkok, Chiang Mai,
Phuket, Pattaya, or explain that it can only search one stop at a time.

### Negation handling is missing

The most serious relevance failure is `no elephant` becoming an elephant intent.
This is a deterministic parser issue and should be fixed before broadening
traffic.

### Some product data quality is questionable

One Phuket elephant prompt returned `Private Bangkok Tour With Driver` with city
`Phuket`. That suggests either source data quality issues, eligibility issues, or
weak keyword matching.

### Cooking intent lacks inventory fit

`cooking class` currently maps to food/lunch-adjacent results, not clearly to a
cooking-class product. If cooking inventory is missing, the UI should say so
instead of drifting into weak substitutes.

## 7. Product decision

Do not add a full LLM agent yet.

The next highest-value work is deterministic quality improvement:

1. negation handling for phrases like `no elephant`, `avoid elephants`, and
   `not elephant`;
2. weighted ranking so primary interests outrank secondary interests;
3. multi-city result diversity or an explicit one-city-at-a-time constraint;
4. product data quality checks for city/title/category mismatches;
5. better no-match behavior for missing categories such as cooking class.

An optional LLM layer can be considered later, but it should be scoped narrowly:

- extract structured intent only;
- optionally rerank reviewed product candidates;
- never invent products;
- never claim availability;
- never create bookings;
- never write DB;
- stay behind a disabled flag until tests and safety review pass.

## 8. Recommended next tasks

### Immediate

```text
TD-RADARSCOUT-TRIP-PLANNER-QUALITY-FIX-0
```

Scope:

- fix negation parsing for avoided interests;
- add tests for `no elephant` / `avoid elephants`;
- keep public copy and booking boundaries unchanged;
- stop at PR.

### Then

```text
TD-RADARSCOUT-TRIP-PLANNER-RANKING-QUALITY-0
```

Scope:

- improve deterministic ranking for primary vs secondary interests;
- test elephant+food, cooking+food, and nature+elephant prompts;
- keep `/api/ai-trip/search` read-only.

### Then

```text
TD-RADARSCOUT-TRIP-PLANNER-MULTICITY-DIVERSITY-0
```

Scope:

- either balance Thailand-wide results across detected cities, or change the UI
  to clearly ask users to search one stop at a time.

### Later

```text
TD-RADARSCOUT-TRIP-PLANNER-LLM-PARSER-DECISION-0
```

Scope:

- docs-only decision brief;
- compare deterministic parser improvements vs a disabled-flag LLM parser;
- do not integrate OpenAI/LLM in this task.

## 9. SEO and handoff decision

Do not open SEO `index,follow` yet.

Do not optimize booking partner handoff as the next major task.

The current product still needs relevance work before it deserves broader
traffic. Booking handoff and SEO will produce better outcomes after the planner
returns consistently relevant product sets.

## 10. Blockers

No technical blocker for the current deployed page.

Product-quality blockers before broader launch:

- negation parser failure;
- weak broad-trip result diversity;
- weak cooking-class fit;
- at least one suspicious city/title mismatch in product results.
