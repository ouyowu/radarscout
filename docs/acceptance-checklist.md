# RadarScout Structure Design Acceptance Checklist

Use this checklist to approve the information architecture before visual implementation.

## Scope and boundaries

- [ ] The product is defined as Thailand-wide day-trip planning, launched city by city.
- [ ] Hotels, flights, multi-day travel management and in-site booking are excluded.
- [ ] RadarScout does not claim live availability, inventory, payment or confirmation.
- [ ] The conversion action remains `Check availability` to a verified external booking partner.
- [ ] No ThaiEleHub or Shopify implementation is included.
- [ ] No dependency, app code, database schema, environment or external provider API behavior is changed by this design phase.

## Routes and navigation

- [ ] Home, Planner, Tours, Tour Detail, Destinations and Destination Detail have distinct purposes.
- [ ] The Chiang Mai finder remains a preserved high-intent entry page.
- [ ] Public navigation does not expose legacy Reddit SaaS, dashboard, auth or internal review routes.
- [ ] Destination links are active only when meaningful reviewed coverage exists.
- [ ] Existing robots, sitemap and index policy remain unchanged pending separate approval.

## Page structure

- [ ] Every page has one clear primary action.
- [ ] Home starts with a prompt rather than a long form.
- [ ] Planner follows prompt -> TripSpec -> confirm -> match -> inspect.
- [ ] Listing supports city, interest, duration and pickup-related discovery without unverified price sorting.
- [ ] Detail prioritizes real imagery, reviewed facts, fit explanation and safe handoff.
- [ ] Mobile detail provides a sticky CTA only for verified handoffs.
- [ ] Empty and error states retain the user’s choices and never invent products.

## Content and data

- [ ] Brand/editorial configuration is separated from reviewed product data.
- [ ] Product components receive display-safe view models, not raw provider payloads.
- [ ] Product images have owned, operator-authorized or licensed rights status.
- [ ] Match reasons are derived from TripSpec and reviewed product fields.
- [ ] Booking handoff URLs are validated before rendering.
- [ ] CMS candidates cannot bypass public review or create booking mappings.
- [ ] Mock data is limited to examples, placeholders and UI states—not public products or facts.

## Components

- [ ] Existing Button, Card, Nav and Section primitives remain the foundation.
- [ ] Prompt, chips, cards, filters, intent summary, itinerary, map, states, handoff and FAQ have reusable contracts.
- [ ] Components define loading, empty, error, disabled, focus and selected states where relevant.
- [ ] Desktop and mobile composition is specified without creating premature account/bottom-navigation features.

## Accessibility and performance requirements for implementation

- [ ] Semantic headings and landmarks are preserved.
- [ ] Every control has an accessible name and visible focus state.
- [ ] Selected filters are communicated by more than color.
- [ ] Touch targets are at least 44px.
- [ ] Maps always have an equivalent list/timeline representation.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Hero images alone may be priority-loaded; remaining images are lazy-loaded with dimensions/sizes.
- [ ] Missing imagery does not cause layout shift or broken content.

## Implementation gate after approval

- [ ] Implementation is split into narrow PRs: shared shell/components, home, planner, listing/destination, detail.
- [ ] Each PR preserves copy-safety, public-copy, SEO-index and E2E checks.
- [ ] No PR changes matching, booking handoff, product eligibility or public API behavior unless separately scoped.
- [ ] No production deployment occurs as part of structure approval.

## Decision

- [ ] Approved as written.
- [ ] Approved with noted changes.
- [ ] Not approved; revise structure before implementation.

Reviewer notes:

```text

```
