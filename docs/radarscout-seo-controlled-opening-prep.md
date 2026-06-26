# RadarScout SEO controlled opening prep

Task: `TD-RADARSCOUT-SEO-READINESS-1-CHIANG-MAI-CONTROLLED-OPENING-PREP`

## 1. Scope

This preparation pass covers only:

```text
/chiang-mai/elephant-camp-finder
```

It does not open indexing. The Chiang Mai finder remains `noindex,nofollow`, and the B2B pages remain `noindex,nofollow`.

Out of scope:

- Site-wide SEO opening.
- Homepage or navigation entry changes.
- Sitemap changes.
- Product detail page SEO opening.
- Bókun API, sync, edit, or widget URL changes.
- Checkout, payment, cart, booking submission, live availability, or inventory behavior.

## 2. Chiang Mai finder metadata preparation

The Chiang Mai finder title is already aligned with the live page direction:

```text
Find the right Chiang Mai experience | RadarScout
```

The description was updated to better describe the current planner experience:

```text
Compare Chiang Mai elephant care, cooking, nature, and family-friendly experiences with a guided planner. RadarScout helps you choose a fit, then continue with a booking partner.
```

The description intentionally avoids:

- live availability
- available now
- instant confirmation
- checkout
- payment
- booking complete
- Bókun backend
- Bókun database
- Bókun-powered
- partner rate
- supplier net rate
- commission

## 3. Robots status

Current intended robots state:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
/partners: noindex,nofollow
/suppliers: noindex,nofollow
/destination-partners: noindex,nofollow
```

This task does not change robots to `index,follow`.

## 4. Homepage unsafe phrase containment

The homepage FAQ question previously used exact `available now` wording in a general marketplace question. That phrase was softened to:

```text
Is RadarScout a marketplace with every country currently shown?
```

This avoids a live-availability implication while keeping the original meaning.

No homepage SEO index/follow behavior was changed.

## 5. Sitemap finding

The current sitemap implementation still includes eligible `/tours/...` product URLs from `listPublicThailandProducts()`.

No sitemap changes were made in this task.

Before any site-wide SEO opening, run:

```text
TD-RADARSCOUT-SITEMAP-SAFETY-0
```

That task should decide whether `/tours/...` pages are safe to keep in the sitemap, whether product pages need stricter noindex behavior, and whether sitemap output should exclude pages with tourist-facing safety concerns.

## 6. Unsafe wording source search

Search terms reviewed:

```text
payment
partner rate
Bókun supplier partner product database
supplier net rate
commission
live availability
available now
instant confirmation
checkout
reservation complete
```

Findings:

- The Chiang Mai finder visible copy and metadata remain covered by tests and avoid the forbidden tourist-facing wording.
- The homepage exact `available now` FAQ phrase was removed.
- B2B page tests already enforce `noindex,nofollow` and forbidden-copy constraints for `/partners`, `/suppliers`, and `/destination-partners`.
- Product/detail and tour surfaces still contain terms such as `payment`, `partner rate`, and `Bókun supplier partner product database`.
- Internal API, Stripe, Bókun sync, local AI, docs, and tests also contain many of these terms as implementation or guardrail language.

The product/detail and tour copy should be handled separately before any broad SEO opening. It is intentionally not changed here because this task is scoped to Chiang Mai finder preparation only.

Recommended follow-up:

```text
TD-RADARSCOUT-SITEMAP-SAFETY-0
```

## 7. Homepage link strategy

The homepage and navigation still do not add a link to:

```text
/chiang-mai/elephant-camp-finder
```

That should be decided in a separate task because it changes the public funnel and internal link graph.

Recommended follow-up:

```text
TD-RADARSCOUT-HOMEPAGE-FINDER-LINK-0
```

Suggested scope for that future task:

- Add one clear internal entry to the Chiang Mai finder.
- Keep B2B pages closed.
- Keep `/chiang-mai/elephant-camp-finder` `noindex,nofollow` unless a separate SEO opening task approves changing it.
- Smoke-test homepage mobile layout and the finder route.

## 8. Monitoring checklist for future SEO opening

Before any future controlled `index,follow` change:

- Verify Google Search Console property for both `radarscout.io` and `www.radarscout.io`.
- Inspect `/chiang-mai/elephant-camp-finder` with URL Inspection before opening.
- Run forbidden-copy audit on rendered page text and metadata.
- Confirm CTA remains `Check availability`.
- Confirm handoff remains an external booking partner URL.
- Confirm no `/api/bokun`, OpenAI, checkout, payment, booking, or DB-write behavior is added to the public page.
- Confirm sitemap is safe before submitting it.
- Submit sitemap only after sitemap safety review passes.
- Monitor impressions, clicks, indexed status, canonical selection, and query snippets.
- Watch for unsafe snippets that imply live availability, instant confirmation, checkout, payment, ratings, reviews, or booking completion.
- Roll back the page to `noindex,nofollow` if unsafe pages or snippets index.

## 9. Recommended next tasks

Recommended order:

```text
TD-RADARSCOUT-SITEMAP-SAFETY-0
TD-RADARSCOUT-HOMEPAGE-FINDER-LINK-0
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

The final opening task should still require explicit approval before changing robots from `noindex,nofollow` to `index,follow`.
