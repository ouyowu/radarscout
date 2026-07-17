# RadarScout Content Model

Status: proposed content and ownership model. No schema, migration, CMS, seed, or API change is approved here.

## Content source classes

| Class | Source of truth | Examples | Current treatment |
| --- | --- | --- | --- |
| Brand configuration | Version-controlled config | nav, footer, hero copy, trust statements | Static config |
| Editorial destination content | Reviewed human content | city introduction, suitable trip styles | Static config initially; CMS later |
| Reviewed product content | Approved public view model | title, summary, tags, images, facts | Existing reviewed seed/database readers |
| Planner input | User session state | destination, duration, interests, pace | Client/server request state; no persistence required now |
| Matching output | Deterministic derived data | fit reasons, result ordering | Runtime derived from TripSpec + reviewed products |
| Booking handoff | Verified public mapping | label, external widget URL, rel | Existing validated handoff source |
| Legal content | Human-approved documents | privacy, terms | Version controlled |
| Analytics | Aggregated behavior events | planner start, results viewed, handoff click | Existing analytics mechanism; no new provider in this task |

## Core models

### `SiteConfig`

```ts
type SiteConfig = {
  brandName: string
  primaryNav: NavItem[]
  footerGroups: FooterGroup[]
  primaryCta: { label: string; href: string }
  trustItems: TrustItem[]
}
```

Configuration data. Store in a typed TypeScript file initially.

### `DestinationContent`

```ts
type DestinationContent = {
  slug: string
  name: string
  country: 'Thailand'
  coverageStatus: 'active' | 'limited' | 'coming-later'
  hero: MediaAsset | null
  shortIntro: string
  orientation: string[]
  interestPrompts: PromptExample[]
  seo: SeoFields
}
```

Initially configuration data. Move to CMS/database only when multiple cities need non-developer editorial updates.

### `PublicExperienceSummary`

```ts
type PublicExperienceSummary = {
  id: string
  title: string
  summary: string | null
  destination: string
  image: MediaAsset | null
  tags: string[]
  durationLabel: string | null
  pickupLabel: string | null
  detailHref: string
}
```

Must be produced only by the reviewed public-product layer. No raw supplier object or commercial field reaches the component.

### `PublicExperienceDetail`

```ts
type PublicExperienceDetail = PublicExperienceSummary & {
  description: string | null
  gallery: MediaAsset[]
  facts: DisplayFact[]
  itinerary: ItineraryItem[]
  inclusions: string[]
  exclusions: string[]
  preparationNotes: string[]
  locations: MapLocation[]
  handoff: PartnerHandoff | null
}
```

Existing reviewed product/database mechanisms remain the source. A CMS may later own editorial narrative fields, but must not bypass review eligibility or handoff validation.

### `TripSpec`

```ts
type TripSpec = {
  destination: string | null
  duration: 'half-day' | 'full-day' | null
  interests: string[]
  avoid: string[]
  pace: 'easy' | 'balanced' | 'active' | null
  travelerType: 'solo' | 'couple' | 'family' | 'friends' | null
  pickupPreference: 'hotel-area' | 'meeting-point' | 'either' | null
  language: string | null
}
```

Runtime user input. Keep transient for now. Saving itineraries would require a separate product/privacy decision.

### `MatchResult`

```ts
type MatchResult = {
  experience: PublicExperienceSummary
  fitReasons: string[]
  itineraryRole: 'morning' | 'midday' | 'afternoon' | null
}
```

Derived at runtime. Fit reasons must be deterministic and traceable to TripSpec plus reviewed product fields.

### `MediaAsset`

```ts
type MediaAsset = {
  src: string
  alt: string
  width: number | null
  height: number | null
  rightsStatus: 'owned' | 'operator-authorized' | 'licensed'
  credit: string | null
}
```

Rights metadata should eventually live with the asset record. Do not import third-party website media merely because it is publicly visible.

### `PartnerHandoff`

```ts
type PartnerHandoff = {
  label: 'Check availability'
  href: string
  rel: 'nofollow sponsored noopener noreferrer'
  target: '_blank'
  reviewedAt: string
}
```

Must come from a verified mapping. It is not mockable on public product cards.

## Configuration content

Keep these in typed, version-controlled configuration until business users need frequent editing:

- navigation and footer links
- homepage hero and prompt examples
- trust statements
- How it works steps
- supported filter labels and ordering
- destination coverage status
- static FAQs about RadarScout boundaries
- empty/loading/error copy
- safe example TripSpecs clearly labeled as examples

## Future CMS candidates

- destination introductions and editorial guides
- destination hero/gallery assets and rights metadata
- homepage editorial sections
- non-product FAQs
- curated experience collections
- related-experience editorial ordering
- seasonal editorial content that does not claim current availability

CMS publication must still pass public-copy review and cannot create bookable products or handoff URLs by itself.

## Future database candidates

- reviewed product summaries/details
- media records and rights status
- product-to-destination/category relationships
- reviewed itinerary items and safe map coordinates
- publish eligibility and audit history
- verified partner handoff mappings
- product sync timestamps and internal quality status

These are future ownership targets, not approval for schema changes.

## Temporary mock data

Allowed temporary mock/config data:

- prompt examples
- How it works copy
- clearly labeled example day structure
- destination cards marked `coming-later`
- gradient media placeholders when no authorized image exists
- loading skeletons and empty/error state fixtures in tests

Forbidden mock data on public product surfaces:

- fake products or suppliers
- fake product images presented as real
- fake prices, availability, ratings or reviews
- fake pickup/meeting points
- fake widget URLs
- invented itinerary facts
- invented map coordinates

## Data lifecycle

```text
Source product or approved static record
→ Thailand eligibility check
→ human-reviewed public enrichment
→ media rights check
→ verified booking-partner handoff
→ display-safe view model
→ planner/listing/detail components
```
