# RadarScout tour detail SEO opening status

Task: `TD-RADARSCOUT-TOUR-DETAIL-SEO-OPENING-STATUS-0`

This document records the current `/tours/{id}` SEO opening state after the empty SEO candidate scaffolding was merged.

## 1. Current implementation state

RadarScout now has a small explicit SEO candidate scaffold for tour detail pages:

- candidate registry: `apps/web/lib/publicProducts/tourDetailSeoCandidates.ts`
- tour detail metadata reads candidate state before setting robots
- sitemap generation reads the same candidate registry before adding `/tours/{id}` URLs
- tests verify the default state remains closed

The candidate registry is intentionally empty.

## 2. Current public SEO behavior

Current behavior remains conservative:

- `/tours/{id}` routes still exist
- tour detail pages still render for public detail review
- tour detail pages are not opened to `index,follow` by default
- `/tours/{id}` URLs are not emitted in `sitemap.xml` by default
- sitemap inclusion is controlled only by the explicit candidate registry

This means the scaffold is ready for a future reviewed candidate, but no tour detail SEO opening has happened yet.

## 3. Safety boundary status

The current state preserves the existing RadarScout safety gates:

- no SEO `index,follow` opening for tour detail pages
- no `/tours/{id}` sitemap expansion
- no Bókun API call, edit, sync, or backend dependency
- no checkout, payment, cart, booking submission, or live availability behavior
- no DB, schema, or env change
- no LLM/OpenAI integration
- no ThaiEleHub or Shopify work

## 4. What must happen before adding the first candidate

A product should not be added to the SEO candidate registry until a separate candidate review confirms:

- product is State A under the tour detail handoff policy
- public detail copy has no unsafe booking, rate, inventory, or internal-source wording
- product-specific handoff URL is verified
- CTA remains a safe external booking partner handoff
- page-level robots behavior is intentionally reviewed
- sitemap inclusion is intentionally reviewed
- product has enough stable public content to justify search exposure

Adding the first candidate should be a separate PR with focused tests and preview smoke.

## 5. Recommended next task

Recommended next task:

`TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-FIRST-REVIEW-0`

Scope:

- pick one State A product candidate from existing handoff evidence
- perform a read-only public-copy and handoff review
- produce a candidate review document
- do not modify the candidate registry yet
- do not open SEO
- do not deploy

Only after that review passes should RadarScout consider a separate implementation task to add one product ID to the candidate registry.
