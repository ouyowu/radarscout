# RadarScout Page Specification

Status: structure-first specification. Visual polish, animation, final imagery, and implementation are intentionally deferred.

## Shared page rules

- One primary action per viewport.
- Product facts come only from reviewed, display-safe data.
- Never invent a product, price, availability, rating, review, schedule, pickup point, or booking status.
- Product detail conversion remains `Check availability` to a verified external booking-partner URL.
- Desktop may place itinerary and map side by side; mobile stacks them and keeps the primary action reachable.
- Missing product data creates an honest omission or empty state, never filler facts.

## Home `/`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| GlobalNav | Establish brand and primary paths | navigation config, brand label | Navigate; `Plan a day` |
| PromptHero | Let a traveler describe the desired Thailand day immediately | hero copy, prompt examples | Submit to planner with `idea` query |
| TrustStrip | Explain why results are safe and credible | reviewed-products statement, real-photo statement, handoff statement | None |
| FeaturedDestinations | Show only cities with meaningful reviewed coverage | destination summaries, image, product count/coverage state | `Explore [city]` |
| FeaturedExperiences | Prove the product has real experiences | reviewed public product summaries, authorized images | `View experience` |
| HowItWorks | Explain prompt -> compare -> partner handoff | three configured steps | `Plan my day` |
| ExampleDay | Preview the expected planning output without claiming live facts | clearly labeled example TripSpec and day slots | `Try this idea` |
| HandoffTrust | Clarify RadarScout versus the booking partner | static boundary copy | `Browse experiences` |
| Footer | Close navigation and legal access | footer config | Navigate |

The home page should not contain a long feature catalogue, account features, hotel/flight planning, prices, ratings, or an implied in-site booking flow.

## Planner `/ai-trip-planner`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| PlannerHeader | Set expectations for Thailand day trips | page copy, capability boundary | None |
| PromptComposer | Capture a natural-language idea | prompt text, starter prompts | Parse intent |
| TripSpecEditor | Confirm destination, duration, interests, pace, party and pickup preference | parsed TripSpec, allowed option config | Edit and confirm |
| OptionalPreferences | Keep advanced choices out of the main path | avoid list, accessibility needs, language preference | Expand/collapse |
| MatchAction | Begin reviewed product matching | confirmed TripSpec | `See matching day trips` |
| IntentSummary | Make the interpreted request transparent | confirmed TripSpec | Edit choices |
| SuggestedDay | Show Morning/Midday/Afternoon structure | deterministic itinerary slots derived from intent and matched products | Inspect |
| MatchResults | Compare reviewed products and explain fit | MatchResult list, safe product summaries | `View experience` |
| MapPanel | Show real matched locations when coordinates exist | product coordinates only | Select marker/card |
| PlannerStates | Handle loading, partial, empty and error outcomes | state + retained TripSpec | Retry or broaden choices |

The planner must preserve selections after an error. An empty result must suggest broadening preferences or changing city; it must not create mock products.

## Experiences listing `/tours`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| ListingHeader | Explain current reviewed coverage | title, summary, result count | None |
| FilterBar | Narrow the catalogue without a long form | destinations, interests, duration groups, pickup option | Update URL/query state |
| ActiveFilters | Keep filter state visible and removable | selected filter values | Remove/reset |
| ResultGrid | Compare image-forward experience cards | PublicExperienceSummary[] | `View experience` |
| ListingStates | Handle loading, empty and API failure | state, current filters | Reset/retry |
| PlannerBridge | Offer intent-first discovery | short configured copy | `Plan my day` |

Do not expose a price filter until current price data is verified, approved for public use, and consistently available.

## Experience detail `/tours/[id]`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| DetailContextNav | Preserve route back to listing or planner results | source query/context | Back navigation |
| ExperienceHero | Establish the real product | title, city, authorized hero image, reviewed summary | None |
| FitSummary | Explain why this product matched | reviewed tags, deterministic fit reasons | None |
| KeyFacts | Surface the minimum decision facts | duration, location, pickup wording, activity type only when safe | None |
| Gallery | Build confidence through authorized media | approved images + alt text | Open gallery |
| Itinerary | Explain the day when reviewed itinerary data exists | ordered itinerary items | Expand details |
| Map | Locate reviewed stops/meeting area when coordinates exist | safe coordinates | Select place |
| IncludedDetails | Show reviewed inclusions/exclusions and preparation notes | approved structured facts | Expand/collapse |
| HandoffPanel | Convert without implying RadarScout booking | verified handoff URL and boundary copy | `Check availability` |
| RelatedExperiences | Continue discovery in the same city/category | reviewed related products | `View experience` |
| DetailFAQ | Answer product-boundary questions | configured FAQ or reviewed product FAQ | Expand/collapse |

Mobile keeps a sticky `Check availability` bar only when a verified handoff exists. Without one, show a planning-only state and related reviewed alternatives.

## Destinations index `/destinations`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| DestinationHeader | Position city-by-city Thailand coverage | static copy | `Plan a day` |
| DestinationGrid | Show active and coming-later destinations honestly | destination config, coverage status, reviewed count | `Explore [city]` only when active |
| CoverageExplanation | Explain why coverage expands gradually | static copy | None |
| PlannerBridge | Serve travelers who know the experience but not the city | prompt examples | Open planner |

## Destination landing `/destinations/[slug]`

| Module | Purpose | Required data | Action |
| --- | --- | --- | --- |
| DestinationHero | Introduce the city and day-trip promise | destination content, authorized image | `Plan a day in [city]` |
| QuickOrientation | Help users understand suitable trip types | reviewed editorial copy | None |
| InterestChips | Start a prefilled planning route | destination-specific interests | Open planner with idea |
| DestinationExperiences | Show reviewed city products | reviewed product summaries | `View experience` |
| ExampleDay | Demonstrate possible structure without availability claims | labeled example slots | `Customize this day` |
| DestinationTrust | Explain coverage and handoff limits | coverage state, static boundary copy | None |

## Chiang Mai finder `/chiang-mai/elephant-camp-finder`

Preserve the existing validated planner and SEO intent. Its modules should visually converge with the shared Nav, Prompt/Choice controls, IntentSummary, SuggestedDay, ExperienceCard, PlannerStates, HandoffNote and Footer. Behavior and index policy are outside this structural task.

## Static pages

- About: mission, Thailand-wide/city-by-city scope, review process, handoff boundary.
- Contact: traveler support and partner contact choices without promising response times.
- Privacy and Terms: existing legal content; only shared visual shell may change later.
