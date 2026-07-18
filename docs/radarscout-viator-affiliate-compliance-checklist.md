# Viator affiliate compliance checklist (P0-4)

**Purpose:** close the P0 item "verify the exact Viator Affiliate/API content-display, image, caching, attribution, and deep-link requirements against the active affiliate agreement." This document records what the implementation verifiably does today, and lists the checks that can only be completed by the operator against the signed agreement and the Viator partner dashboard.

**Prepared:** 2026-07-18
**Scope:** the 105 reviewed Viator products in `apps/web/lib/viator/` and every public surface that renders them.

## 1. What the implementation already guarantees (code-verified)

| Requirement area | Current state | Enforced by |
| --- | --- | --- |
| Affiliate ID on every link | All 105 seed URLs carry `pid=P00309837`; validation fails closed on any other pid | `reviewedViatorProducts.ts` (`VIATOR_AFFILIATE_PID`), regression test in `reviewedViatorProducts.test.ts` |
| HTTPS + real Viator host | URL validation requires `https:` and `viator.com` / `*.viator.com` hostname | `isViatorAffiliateUrl`, `isReviewedViatorAffiliateUrl` |
| No price display | No public surface renders a Viator price; `retailPrice`/`currency` are hardcoded `null` in every public adapter | `reviewedViatorPublicCatalogue.ts`, `getPublicThailandProduct.ts` |
| No availability/booking claims | CTA is always the literal `Check availability`; no cart, checkout, payment, or confirmation flows exist | `bookingPartnerHandoff.ts`, copy-safety tests |
| Link relationship | Every handoff uses `rel="nofollow sponsored noopener noreferrer"` | `PUBLIC_BOOKING_PARTNER_HANDOFF_REL`, e2e assertions |
| No raw API payload exposure | Seed allowlists 10 fields; forbidden-field validation rejects price, supplier, review, and raw JSON keys | `validateReviewedViatorProduct` |
| No runtime API proxying | Public pages read a static reviewed seed; visitor traffic never hits the Viator API | architecture (static seeds) |
| Summaries are original | `shortSummary` values are manually authored during review, not copied from Viator descriptions | review workflow (docs/radarscout PR #551) |

## 2. Operator checks against the signed agreement (cannot be code-verified)

Complete these in the Viator Partner (affiliate) dashboard and the agreement PDF/terms you accepted. Check each off with a date.

- [ ] **Image licensing.** The 105 `imageUrl` values point at Viator/Tripadvisor CDN images (`media-cdn.tripadvisor.com`). Confirm the affiliate agreement licenses hotlinking product images for approved affiliates, and whether attribution text is required next to images.
- [ ] **Content display terms.** Confirm reviewed titles may be edited (we publish cleaned titles) and that manually authored summaries alongside a Viator deep link are permitted.
- [ ] **Caching/refresh window.** The static seed is a form of caching (title, image, URL). Confirm the maximum allowed staleness for displayed product content and set a re-review cadence (suggested: 90 days, tracked via `reviewedAt`).
- [ ] **Deep-link format.** Confirm `?pid=P00309837&mcid=42383&medium=api&api_version=2.0` is the currently recommended tracking format for API-sourced affiliate links, and that `pid` alone is sufficient for attribution on the 16 batch-1 URLs that lack `mcid`/`medium` parameters.
- [ ] **Attribution wording.** Confirm whether "Powered by Viator" or similar attribution is required on pages listing Viator products. Today the site labels handoffs as external partner links but does not name Viator in page chrome.
- [ ] **Dead-link sweep.** Spot-check (or script externally) that each of the 105 product URLs still resolves to a live product page — deactivated products should be pulled from the seed at the next review.
- [ ] **Prohibited-context check.** Confirm no agreement clause prohibits listing products next to other providers' affiliate links (GetYourGuide city links now render on `/destinations/thailand`).

## 3. GetYourGuide (added in PR #555)

- [ ] Confirm partner ID `IMR8EUB` is approved for `radarscout.io` in the GetYourGuide partner dashboard.
- [ ] Confirm city-page deep links (`/bangkok-l169/` etc.) with `partner_id` + `cmp` parameters are the recommended format.
- [ ] Affiliate disclosure page exists (`/affiliate-disclosure`) — confirm it satisfies both programs' disclosure requirements and applicable consumer-protection rules.

## 4. Funnel instrumentation status (priority ③)

Verified in code on 2026-07-18 — instrumentation is complete and needs no further work before collecting evidence:

- Events defined in `apps/web/lib/analytics/track.ts` and sent to **Vercel Analytics** (plus a `dataLayer` mirror for future GTM use):
  `homepage_finder_entry_clicked`, `finder_planner_choice_selected`, `finder_planner_reset_clicked`, `finder_matching_experiences_clicked`, `finder_recommendations_rendered`, `booking_partner_handoff_clicked`, `affiliate_partner_handoff_clicked`, `finder_planner_viewed`.
- Wired in: homepage hero, planner flows, AI search result cards, tour detail handoff (`TrackedBookingPartnerHandoff`), elephant finder, itinerary workspace, and the new `TrackedAffiliateLink`.
- **Where to read:** Vercel dashboard → project → Analytics → Events. The decision rule from the roadmap docs: compare `finder_recommendations_rendered` → `booking_partner_handoff_clicked` conversion before choosing between catalog expansion and conversion-UX work.
- Note: custom events require Vercel Web Analytics to be enabled on a plan that includes custom events; confirm the production project has it enabled.
