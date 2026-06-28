# RadarScout SEO readiness 2 controlled opening decision

Task: `TD-RADARSCOUT-SEO-READINESS-2-CONTROLLED-OPENING-DECISION`

## 1. Decision summary

RadarScout is close to a controlled single-page SEO opening for:

```text
/chiang-mai/elephant-camp-finder
```

Do not open `index,follow` yet in this task.

Recommended decision:

```text
Prepare a future implementation task for a controlled Chiang Mai finder SEO opening, but keep production noindex,nofollow until explicitly approved.
```

This document is a gate review and implementation plan only. It does not change app code, robots metadata, sitemap output, Bókun behavior, database state, environment variables, or production deployment.

## 2. Current verified production state

Production sampling during this review showed:

| URL | Status | SEO state / finding |
| --- | --- | --- |
| `https://radarscout.io/` | 200 | Homepage has no page-level robots meta and links to the Chiang Mai finder. |
| `https://www.radarscout.io/` | 200 | Homepage has no page-level robots meta and links to the Chiang Mai finder. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | `noindex,nofollow` remains active. |
| `https://radarscout.io/partners` | 200 | `noindex,nofollow` remains active. |
| `https://radarscout.io/suppliers` | 200 | `noindex,nofollow` remains active. |
| `https://radarscout.io/destination-partners` | 200 | `noindex,nofollow` remains active. |
| `https://radarscout.io/sitemap.xml` | 200 | 4 URLs; no `/tours/{id}` entries; no Chiang Mai finder entry. |

Current production behavior is consistent with the staged SEO strategy:

- homepage can guide users to the planner;
- unsafe tour detail URLs are excluded from sitemap;
- the Chiang Mai finder remains closed to indexing;
- B2B pages remain closed to indexing;
- no site-wide SEO opening has happened.

## 3. Completed prerequisites

The following prerequisites are now complete or staged:

- `TD-RADARSCOUT-SEO-READINESS-0`
  - Identified the Chiang Mai finder as the first controlled SEO candidate.
  - Flagged homepage copy, sitemap, and tour-page risks.
- `TD-RADARSCOUT-SEO-READINESS-1`
  - Prepared safer metadata and homepage wording.
  - Kept `noindex,nofollow`.
- `TD-RADARSCOUT-SITEMAP-SAFETY-1`
  - Removed `/tours/{id}` from sitemap.
  - Preserved tour routes and page behavior.
- `TD-RADARSCOUT-HOMEPAGE-FINDER-LINK-0`
  - Added a safe homepage entry point to the Chiang Mai finder.
  - Kept the finder out of sitemap and noindex.
- `TD-RADARSCOUT-CHAT-PLANNER-1/2/2A`
  - Built deterministic planner, planner picks, and itinerary summary.
  - Kept booking partner handoff external and safe.

Partner conversion work has also improved static B2B pages, but those pages should remain `noindex,nofollow` for now.

## 4. What is ready

The Chiang Mai finder is the strongest current SEO candidate because it has:

- a clear destination and use case;
- deterministic chat-style planning;
- planner picks;
- suggested Chiang Mai day summary;
- recommendation cards;
- safe external `Check availability` handoff;
- no checkout, payment, booking submission, inventory, or live availability behavior;
- a homepage entry point;
- sitemap and tour-page safety cleanup completed around it.

The intended public positioning is:

```text
RadarScout helps travelers compare Chiang Mai elephant care, cooking, nature, and family-friendly experiences with a guided planner, then continue with a booking partner for final details.
```

## 5. What is not ready

RadarScout is not ready for broad SEO opening.

Keep these areas closed or out of sitemap:

- `/partners`
- `/suppliers`
- `/destination-partners`
- `/tours/{id}`
- any future backend, portal, dashboard, checkout, payment, inventory, or Bókun-admin surfaces

Reasons:

- B2B pages are useful for cooperation but not yet intended as SEO landing pages.
- Tour detail pages still need a separate public-copy and indexing-policy pass.
- RadarScout should not expose supplier/backend wording, rate wording, or booking-engine expectations in search snippets.
- There is no need to open site-wide indexing to test one controlled Chiang Mai finder page.

## 6. Recommended controlled opening scope

Future implementation task:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

Allowed scope for that future task:

- change only `/chiang-mai/elephant-camp-finder` robots from `noindex,nofollow` to `index,follow`;
- optionally add `/chiang-mai/elephant-camp-finder` to sitemap if the task explicitly scopes sitemap inclusion;
- preserve homepage entry point;
- preserve recommendation logic;
- preserve `Check availability` CTA;
- preserve external booking partner handoff;
- keep B2B pages `noindex,nofollow`;
- keep `/tours/{id}` excluded from sitemap;
- keep product/tour routes unchanged.

Forbidden in that future task:

- site-wide `index,follow`;
- B2B page indexing;
- `/tours/{id}` sitemap re-entry;
- checkout, payment, cart, booking submission;
- live availability or inventory claims;
- Bókun API calls, sync, edits, backend wording, or database wording;
- LLM/OpenAI integration;
- DB writes, schema changes, or environment changes;
- ThaiEleHub or Shopify changes.

## 7. Required pre-opening checks

Before approving the future `index,follow` implementation, run:

1. Rendered page copy audit for `/chiang-mai/elephant-camp-finder`.
2. Metadata audit for title, description, canonical, and robots.
3. CTA audit:
   - visible CTA remains `Check availability`;
   - handoff remains external booking partner URL;
   - CTA `rel` keeps `nofollow sponsored noopener noreferrer`.
4. Network audit:
   - no `/api/bokun`;
   - no OpenAI/LLM call;
   - no form API call;
   - no DB write;
   - no checkout/payment/booking request.
5. Sitemap audit:
   - `/tours/{id}` remains excluded;
   - B2B pages remain excluded;
   - Chiang Mai finder is included only if explicitly approved.
6. Search Console readiness:
   - verify `radarscout.io`;
   - verify `www.radarscout.io`;
   - prepare URL Inspection before and after opening.

## 8. Forbidden copy audit list

The future opening task should confirm the Chiang Mai finder does not show:

- `AI booked this`
- `live availability`
- `available now`
- `guaranteed slot`
- `instant confirmation`
- `checkout`
- `payment`
- `reservation complete`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `Bókun supplier products`
- `supplier net rate`
- `partner rate`
- `commission`
- `fake reviews`
- `fake ratings`

Safe wording remains:

- `Plan with RadarScout`
- `guided planner`
- `compare experiences`
- `trusted local experiences`
- `booking partner`
- `Check availability`
- `continue with a booking partner`

## 9. Rollback plan

If the controlled SEO opening creates unsafe snippets, incorrect indexing behavior, or unexpected public exposure:

1. Revert `/chiang-mai/elephant-camp-finder` robots to `noindex,nofollow`.
2. Remove `/chiang-mai/elephant-camp-finder` from sitemap if it was added.
3. Redeploy the rollback from a clean worktree.
4. Confirm production page source has `noindex,nofollow`.
5. Use Search Console URL Inspection to request recrawl after rollback.

No database rollback should be needed because the controlled SEO opening should not write DB state or change schema.

## 10. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-SEO-READINESS-2-PREVIEW-SPEC
```

Goal:

Create the exact implementation checklist and tests for the future controlled opening before changing robots.

Alternative if the user is ready to open indexing:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

This alternative must require explicit approval because it changes SEO indexing behavior.

Until that approval exists, keep:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
```
