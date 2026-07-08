# RadarScout SEO Operations Checklist

Status: operational checklist only. This document does not change indexing,
robots, sitemap output, Search Console state, or production deployment.

## Current indexing policy

Approved public indexing scope:

- Homepage: `/`
- Chiang Mai finder: `/chiang-mai/elephant-camp-finder`
- Static legal/contact pages already emitted by `sitemap.ts`

Known non-indexed or excluded surfaces:

- `/ai-trip-planner` remains `noindex,nofollow`
- `/tours/{id}` remains excluded from sitemap by default
- B2B/internal/reddit-tool routes remain disallowed or non-indexed

Do not submit any URL outside the approved indexing scope without a separate SEO
opening task and human approval.

## Pre-checks before Search Console submission

Run these checks before any manual Search Console action:

1. Production deployment is current and healthy.
2. `https://www.radarscout.io/` returns 200.
3. `https://www.radarscout.io/chiang-mai/elephant-camp-finder` returns 200.
4. The Chiang Mai finder has `robots: index, follow`.
5. `https://www.radarscout.io/sitemap.xml` returns 200.
6. The sitemap includes only the approved indexable URL set.
7. The sitemap does not include `/ai-trip-planner`.
8. The sitemap does not include `/tours/{id}` URLs.
9. Vercel Web Analytics is deployed and can receive real traffic events.
10. Public copy still avoids live availability, checkout, payment, rating, review,
    fake booking, or Bókun-backend claims.

If any pre-check fails, do not request indexing. Fix the underlying production
state first.

## Manual Google Search Console steps

Only the human should perform these steps:

1. Open Google Search Console.
2. Verify the `radarscout.io` domain property if it is not already verified.
3. Submit `https://www.radarscout.io/sitemap.xml`.
4. Inspect `https://www.radarscout.io/chiang-mai/elephant-camp-finder`.
5. Request indexing for `/chiang-mai/elephant-camp-finder` only.
6. Do not request indexing for `/ai-trip-planner`.
7. Do not request indexing for `/tours/{id}`.
8. Do not request indexing for partner, supplier, internal, demo, or reddit-tool
   marketing routes unless a later approved task opens them.

## Monitoring after submission

Check Search Console over the next 7 to 14 days:

- URL inspection status for `/chiang-mai/elephant-camp-finder`
- Submitted sitemap processing status
- Coverage/indexing errors
- Query impressions and clicks for Chiang Mai elephant, family, cooking, nature,
  and experience-planning intent
- Vercel Web Analytics events for:
  - `homepage_finder_entry_clicked`
  - `finder_planner_choice_selected`
  - `finder_matching_experiences_clicked`
  - `finder_recommendations_rendered`
  - `booking_partner_handoff_clicked`

Treat traffic without planner engagement or handoff clicks as a product-quality
signal, not an SEO configuration problem.

## Rollback plan

If the indexed page attracts unsafe traffic, low-quality queries, or confusing
user behavior:

1. Open a separate SEO rollback task.
2. Change `/chiang-mai/elephant-camp-finder` back to `noindex,nofollow`.
3. Remove `/chiang-mai/elephant-camp-finder` from sitemap output.
4. Keep `/tours/{id}` excluded from sitemap.
5. Run the SEO index guard, sitemap tests, metadata tests, build, and production
   smoke.
6. Deploy only after explicit production approval.
7. Use Search Console removal tools only if urgent and human-approved.

Rollback must not change Bókun behavior, booking partner URLs, checkout/payment,
availability, inventory, DB, schema, or env.

## Non-goals

- No Search Console API automation
- No automatic indexing request
- No SEO `index,follow` expansion beyond the current approved page
- No sitemap expansion
- No `/tours/{id}` indexing
- No production deploy
- No DB/schema/env changes
- No Bókun API/sync
- No checkout, payment, booking submission, availability, or inventory behavior
- No ThaiEleHub or Shopify changes
