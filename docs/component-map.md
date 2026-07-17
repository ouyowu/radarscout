# RadarScout Component Map

Status: proposed reuse map. Names are architectural targets, not an instruction to rename working components immediately.

## Component hierarchy

```text
AppShell
├── GlobalNav
├── PageHeader / ExperienceHero / PromptHero
├── Section
│   ├── SectionHeading
│   ├── TrustStrip
│   ├── ExperienceGrid
│   │   └── ExperienceCard
│   ├── DestinationGrid
│   │   └── DestinationCard
│   ├── HowItWorks
│   ├── PlannerShell
│   │   ├── PromptComposer
│   │   ├── ChoiceChip / ChoiceCard
│   │   ├── TripSpecEditor
│   │   ├── IntentSummary
│   │   ├── SuggestedDay
│   │   ├── MatchResults
│   │   └── PlannerState
│   ├── FilterBar
│   ├── ItineraryTimeline
│   ├── MapPanel
│   ├── HandoffPanel
│   └── FAQAccordion
└── GlobalFooter
```

## Reusable components

| Component | Reused on | Variants / states | Data contract |
| --- | --- | --- | --- |
| `GlobalNav` | All public pages | overlay, solid, mobile menu | NavItem[], primary CTA |
| `Section` | All marketing/product pages | cream, white, forest, image band | heading/content slots |
| `SectionHeading` | Home, planner, listing, detail, destinations | centered, left, inverse | eyebrow, title, body |
| `Button` | All pages | primary, secondary, ghost, external | label, href/action, disabled/loading |
| `PromptComposer` | Home, planner, destination | compact, full | value, examples, submit action |
| `ChoiceChip` | Planner, listing, finder | default, selected, disabled | id, label, selected state |
| `ChoiceCard` | Planner preferences | default, selected, disabled | label, description, icon key |
| `TrustStrip` | Home, detail, destination | light, dark | TrustItem[] |
| `ExperienceCard` | Home, listing, planner results, related | featured, compact, result | PublicExperienceSummary + fit reasons |
| `DestinationCard` | Home, destination index | active, coming later | DestinationSummary |
| `FilterBar` | Listing and destination listing | desktop bar, mobile sheet | filter config + selected values |
| `IntentSummary` | Planner and finder | compact, expanded | TripSpec |
| `SuggestedDay` | Planner, finder, destination example | real-match, labeled example | ItinerarySlot[] |
| `ItineraryTimeline` | Planner and detail | compact, detailed | ordered itinerary items |
| `MapPanel` | Planner and detail | desktop split, mobile collapsed | safe location markers |
| `HandoffPanel` | Detail | available, planning-only | verified PartnerHandoff or null |
| `PlannerState` | Planner/listing | loading, empty, partial, error | state, message, recovery actions |
| `FAQAccordion` | Detail, destination, static pages | default | FAQItem[] |
| `GlobalFooter` | All public pages | default | grouped FooterLink[] |

## Existing components to preserve or adapt later

- `PromptHero` already supplies the prompt-first homepage entry.
- `IntentParserDemo`, `TripIntentSummary`, `ItineraryPlaceholderShell`, and result cards already provide planner behavior.
- Existing design-system `Button`, `Card`, `Nav`, and `Section` primitives should remain the base rather than creating duplicates.
- `AdventureHero`, `DmcTrustBar`, `EditorialBanner`, and `FAQAccordion` can be restyled or composed, not replaced without evidence.
- Existing tour `ProductCard`, `FilterChip`, and `FilterGroup` should converge toward shared components only when implementation begins; no refactor is approved by this document.

## State requirements

Every interactive reusable component must define:

- default
- hover/focus-visible
- selected/active when relevant
- disabled
- loading
- empty where relevant
- error where relevant
- reduced-motion behavior
- keyboard behavior and accessible name

## Responsive composition

| Area | Desktop | Mobile |
| --- | --- | --- |
| Navigation | Horizontal links + CTA | Logo + menu; no speculative bottom nav |
| Prompt | Input and CTA inline | Stacked, full width |
| Preference cards | 2–3 columns | One column or horizontal snap only if accessible |
| Results | 3-column grid | One column |
| Planner/map | Split layout | Stacked; map collapsible |
| Detail content/action | Main content + sticky side rail | Single column + verified sticky handoff |
| Filters | Inline grouped controls | Button opens filter sheet; active chips remain visible |

## Component boundaries

- Presentation components receive display-safe view models, not raw provider payloads.
- Handoff URLs are validated before reaching `HandoffPanel`.
- Product cards never decide publish eligibility; they render already-approved public records.
- Maps receive coordinates only. They do not infer or geocode unreviewed supplier text in the browser.
- UI components do not call checkout, availability, payment, booking, sync, or database-write endpoints.
