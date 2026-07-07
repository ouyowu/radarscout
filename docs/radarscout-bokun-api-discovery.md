# RadarScout Bókun API Discovery

Task: `TD-RADARSCOUT-BOKUN-API-DISCOVERY-7`

Date: 2026-07-07

This is a research-only discovery note. It does not add application code, API
credentials, environment variables, database writes, schema changes, checkout,
payment handling, live availability, inventory sync, product sync, Bókun API
calls, production deploys, or ThaiEleHub / Shopify changes.

## 1. Executive answer

Bókun has enough API surface to support future RadarScout use cases such as
product catalog sync, availability lookup, booking handoff enrichment, and
eventual booking flows. However, those surfaces cross RadarScout red lines:
credentials, vendor data, availability, prices, checkout, booking, cancellation,
and customer data.

RadarScout should not integrate Bókun APIs yet. The next product step should
remain manually reviewed partner handoff data: signed products, human-provided
public widget URLs, safe public summaries, and deterministic matching. API work
becomes worth revisiting only after RadarScout has real traffic, measurable
handoff clicks, signed partner demand, and a clear reason that public widget
handoffs are not enough.

## 2. Sources reviewed

Primary public sources:

- Bókun developer documentation: <https://bokun.dev/>
- Bókun REST / Booking API documentation: <https://bokun.dev/booking-api-rest/vU6sCfxwYdJWd1QAcLt12i>
- Bókun product details documentation: <https://bokun.dev/booking-api-rest/vU6sCfxwYdJWd1QAcLt12i/get-product-details/m48RCWuoQY6RsVA7w9QhDt>
- Bókun availability and pricing documentation: <https://bokun.dev/booking-api-rest/vU6sCfxwYdJWd1QAcLt12i/checking-availability-and-pricing/9x4PcziToX5g8WG4j5KMxt>
- Bókun app API OAuth documentation: <https://bokun.dev/api/uzi4nXgs2wN1DhxkkLHves/authenticate-with-oauth/jfrEPmAX72TCXxgTZTWiG3>
- Bókun REST API credentials from app documentation: <https://bokun.dev/api/uzi4nXgs2wN1DhxkkLHves/rest-api/6DoRE2fRjANWYBQdvTkFqU>
- Bókun API terms: <https://www.bokun.io/api-terms>
- Bókun API product overview: <https://www.bokun.io/grow/apis>

No authenticated docs, credentials, dashboards, or live API endpoints were used.

## 3. What Bókun API surfaces appear to offer

### App / platform API

Bókun documents an app API surface with OAuth, access scopes, GraphQL reference,
REST API access, and webhooks. The OAuth documentation describes a vendor
install flow where an app requests access to vendor data, receives permission,
and then uses access tokens for the installed vendor. The access-scope docs
include read/write categories for bookings, checkouts, customers, and other
vendor resources.

RadarScout implication: this is not a lightweight public-data feed. It is a
partner/vendor integration surface that requires explicit app setup, scopes,
vendor consent, credential handling, and data-governance boundaries.

### Booking API (REST)

Bókun's Booking API (REST) documentation covers product details, availability
and pricing, booking process, booking questions and answers, checkout, editing
bookings, cancelling bookings, and error codes.

The product-details page documents product search through `POST
/activity.json/search`, including paginated results. The availability page
documents checking activity availability, capacity, pickup allotment, and prices
for date ranges.

RadarScout implication: this API is powerful enough to support product and
availability work later, but it directly touches availability, capacity,
pricing, pickup availability, and booking state. That is outside the current
RadarScout public product boundary.

### RESTful API for Experience products

Bókun's developer navigation includes a RESTful API for creating, updating, and
accessing Experience products. The component list includes content, location,
duration, inclusions, exclusions, pricing categories, availability rules,
inventory settings, commission group id, and many other product-management
components.

RadarScout implication: this looks like a product-management/admin surface, not
something RadarScout should touch in early product validation. Any create/update
access would require strict write guards and separate human approval.

### Channel Manager API / OCTO API

Bókun's public API overview describes Channel Manager API, RESTful API, OCTO
API, Zapier, and webhooks. The marketing page positions these as distribution,
availability, and channel-sync capabilities. The OCTO docs note that OCTO can be
used alongside Bókun REST or GraphQL for richer Bókun-specific needs.

RadarScout implication: channel/OCTO work belongs to a later integration
strategy, not the current discovery and handoff product.

## 4. Authentication, credentials, and legal constraints

The public docs indicate two credential models:

- OAuth for apps installed by vendors, where the vendor grants scoped access.
- Legacy REST API credentials obtained through installed-app details or a
  GraphQL query, requiring the relevant legacy API scope.

Bókun API terms emphasize that credentials must be kept secure, may be limited
or revoked, and should be used only for the authorized purpose. The terms also
state that Bókun can enforce API limits and that integrations should request the
minimum data needed for the application's intended functionality.

RadarScout implication:

- No credentials should be committed or pulled into this repo.
- No `.env` or Vercel env changes should happen without a separate approved
  integration plan.
- Any future API integration needs a least-privilege scope table before code.
- Any future vendor data storage needs a data-retention and public-field policy.

## 5. Feasible RadarScout use cases later

### A. Product catalog import / refresh

Potential value:

- Keep partner product titles, descriptions, locations, durations, inclusions,
  and public booking widget references aligned with Bókun.
- Reduce manual product-maintenance work once signed partner volume is high.

Risk:

- Could expose raw Bókun fields, internal supplier data, pricing, commission,
  rate, availability, or non-reviewed product copy.
- Could accidentally imply RadarScout owns product accuracy or backend state.

Required safety gates:

- Read-only credentials only.
- Explicit allowlist of public fields.
- Human review queue before any product becomes public.
- Tests rejecting raw JSON, price, availability, ratings, reviews, supplier net
  rates, partner rates, commission, and backend wording.
- No public route should read raw Bókun API responses.

### B. Availability lookup

Potential value:

- Show users whether an operator may have relevant date/time options before
  handoff.

Risk:

- Crosses the current no-live-availability boundary.
- Public copy may become misleading if capacity changes between RadarScout and
  partner checkout.
- Pickup availability and capacity fields add edge cases.

Required safety gates:

- Human approval to change product boundary.
- Clear copy such as "check with booking partner" until final checkout.
- Cache / staleness policy.
- No availability guarantee language.
- Monitoring for stale or failed availability calls.

Recommendation: do not build this until RadarScout has proven traffic and
partner value from static handoffs.

### C. Booking / checkout

Potential value:

- Users could theoretically complete booking inside RadarScout.

Risk:

- This would make RadarScout a booking engine and introduce payment, customer
  data, confirmation, cancellation, failure handling, and support obligations.

Recommendation: explicitly out of scope. Keep partner-direct handoff.

### D. Webhooks

Potential value:

- Later operational visibility after a partner booking or product event.

Risk:

- Requires public endpoints, authentication, replay protection, data retention,
  and customer/vendor data handling.

Recommendation: do not build before a real partner operating model exists.

## 6. What RadarScout should not build now

Do not build:

- Bókun API client.
- Bókun sync worker.
- Availability or price display.
- Checkout, cart, payment, booking submission, booking confirmation, edit, or
  cancellation flows.
- Raw Bókun product viewer.
- Supplier dashboard or channel-management UI.
- Marketplace, OTA, or OCTO compatibility layer.
- Automatic product publishing from Bókun to public RadarScout pages.

Do not add public wording such as:

- live availability
- available now
- instant confirmation
- booking complete
- Bókun backend
- Bókun database
- Bókun-powered
- supplier net rate
- partner rate
- commission

## 7. Recommended direction

Stay with the current partner-direct handoff model:

1. Define a safe partner product model.
2. Wait for human-provided signed partner product data.
3. Validate static data with strict forbidden-field tests.
4. Match reviewed products deterministically.
5. Send users to public booking partner widget URLs with safe copy.

This keeps RadarScout focused on discovery, planning, comparison, and safe
handoff instead of becoming a checkout, inventory, or supplier backend.

## 8. When to revisit Bókun API integration

Revisit only when all of these are true:

- Trip Planner and Chiang Mai finder are live and receiving real traffic.
- Analytics or server logs show meaningful planner usage and handoff clicks.
- At least one signed partner explicitly wants deeper Bókun integration.
- Public widget handoff is measurably limiting conversion or operations.
- There is an approved credential, scope, storage, and rollback plan.
- There is an approved test plan for no raw JSON, no unsafe public fields, and no
  booking/availability claims unless explicitly allowed.

## 9. Decision

Do not implement Bókun API integration now.

Next safe product work should be one of:

- collect real signed partner product data for the partner product validator;
- improve deterministic product matching once reviewed partner data exists;
- observe real Trip Planner usage and handoff behavior after production traffic;
- only then consider a narrow Bókun API proof-of-concept plan.

If an API proof of concept is later approved, it should be a separate task with
explicit human approval, read-only credentials, no public exposure, no DB writes
unless separately approved, and no checkout/booking/availability behavior in the
first iteration.
