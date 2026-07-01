# RadarScout Search Console submission checklist

Task: `TD-RADARSCOUT-SEARCH-CONSOLE-SUBMISSION-0`

## 1. Purpose

This document defines the safe manual Google Search Console submission process for RadarScout after the controlled SEO opening of:

```text
/chiang-mai/elephant-camp-finder
```

This is a checklist and operating guide only. It does not change app code, sitemap behavior, robots metadata, deployment state, Bókun behavior, database state, or analytics.

## 2. Current production baseline

Current production state:

```text
Production HEAD: d9fe9a8a7c843dbcf6fe67c743ca6139524ffb26
Deployment ID: dpl_H3wLC2vnaKr8N1JXJjcMVhm7jSck
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Current SEO state:

- `/chiang-mai/elephant-camp-finder` is `index,follow`.
- `/chiang-mai/elephant-camp-finder` is included in `https://www.radarscout.io/sitemap.xml`.
- `/tours/{id}` URLs remain excluded from the sitemap.
- `/partners`, `/suppliers`, and `/destination-partners` remain `noindex,nofollow`.
- B2B pages remain excluded from the sitemap.

Current product boundary:

- RadarScout provides guided discovery, deterministic planning, recommendation cards, and itinerary framing.
- Booking partners handle availability, checkout, payment, confirmation, and operator workflow.
- RadarScout does not call Bókun APIs for this public finder flow.

## 3. Submission scope

Submit only:

```text
https://www.radarscout.io/sitemap.xml
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Do not submit or request indexing for:

```text
/tours/{id}
/partners
/suppliers
/destination-partners
/ai-trip-planner
/api/*
/dashboard
/internal/*
```

Rationale:

- `/tours/{id}` pages are intentionally excluded until tour detail copy, robots policy, and sitemap readiness pass a separate safety audit.
- B2B pages remain closed until lead capture and B2B positioning are stronger.
- AI trip planner surfaces need separate product-safety and LLM-safety review before indexing.

## 4. Preconditions before manual submission

Before submitting the sitemap or requesting URL inspection, verify production still matches the controlled opening state.

Required live checks:

1. Open:

   ```text
   https://www.radarscout.io/sitemap.xml
   ```

2. Confirm sitemap contains:

   ```text
   https://www.radarscout.io/chiang-mai/elephant-camp-finder
   ```

3. Confirm sitemap does not contain:

   ```text
   /tours/
   /partners
   /suppliers
   /destination-partners
   ```

4. Open:

   ```text
   https://www.radarscout.io/chiang-mai/elephant-camp-finder
   ```

5. Confirm:

   - page returns 200;
   - browser title is `Find the right Chiang Mai experience | RadarScout`;
   - robots meta is `index, follow`;
   - canonical points to the expected `www` URL;
   - planner is visible;
   - recommendations appear after `See matching experiences`;
   - CTA remains `Check availability`;
   - CTA points to an external booking partner widget;
   - CTA rel includes `nofollow sponsored noopener noreferrer`;
   - no live availability, checkout, payment, instant confirmation, fake rating, fake review, or booking-complete wording appears.

If any precondition fails, do not submit the sitemap. Create a rollback or fix task first.

## 5. Search Console property setup

Preferred setup:

```text
Domain property: radarscout.io
```

Use a domain property if DNS verification is available because it covers:

- `https://radarscout.io`;
- `https://www.radarscout.io`;
- future subdomains if needed.

Fallback setup:

```text
URL-prefix property: https://radarscout.io
URL-prefix property: https://www.radarscout.io
```

If using URL-prefix properties, verify both primary domains.

Do not change DNS, Vercel domains, redirects, or canonical behavior in this task without a separate explicit approval.

## 6. Sitemap submission steps

In Google Search Console:

1. Select the verified RadarScout property.
2. Open **Sitemaps**.
3. Submit:

   ```text
   https://www.radarscout.io/sitemap.xml
   ```

4. Record:

   - submission date;
   - property used;
   - sitemap status;
   - discovered URL count;
   - any parse errors;
   - any warning that references `/tours/` or B2B pages.

Expected result:

- sitemap accepted or pending;
- discovered URL count matches the small controlled sitemap;
- no `/tours/{id}` URLs are submitted through this sitemap.

If Google reports old `/tours/{id}` URLs from historical sitemap data, treat that as observation data, not an immediate code regression. Confirm the live sitemap still excludes them.

## 7. URL inspection steps

In Google Search Console URL Inspection, inspect:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Record:

- URL status;
- crawl allowed status;
- indexing allowed status;
- user-declared canonical;
- Google-selected canonical;
- page fetch result;
- referring sitemap;
- last crawl time, if present.

Expected:

- page is indexable;
- user-declared canonical is the expected `www` URL;
- Google-selected canonical should eventually match the expected `www` URL;
- page is discoverable through the submitted sitemap;
- no robots or canonical blocker appears.

If the URL Inspection tool has a **Request indexing** option, use it only for the Chiang Mai finder URL. Do not request indexing for closed surfaces.

## 8. Submission record template

Use this template after manual submission:

```text
Task: TD-RADARSCOUT-SEARCH-CONSOLE-SUBMISSION-0
Submission date:
Submitted by:
Search Console property:
Sitemap submitted:
Sitemap status:
Discovered URL count:
URL inspected:
URL Inspection result:
User-declared canonical:
Google-selected canonical:
Indexing requested: yes/no
Warnings:
Follow-up needed:
```

Store the completed record in a future docs update if needed.

## 9. Post-submission monitoring

After submission, continue with:

```text
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-1
```

Minimum monitoring window:

- daily checks for the first 7 days;
- weekly checks for the first month.

Watch for:

- unsafe snippets;
- unexpected indexed `/tours/{id}` URLs;
- B2B pages indexed despite noindex;
- canonical mismatch;
- crawl errors;
- search queries implying live availability, instant confirmation, checkout, payment, or fake reviews.

## 10. Rollback conditions

Prepare rollback if any of these occur:

- the Chiang Mai finder receives unsafe search snippets that imply booking, payment, checkout, instant confirmation, or live availability inside RadarScout;
- Search Console shows B2B pages or unsafe tour pages indexed because of current RadarScout sitemap behavior;
- the finder canonical resolves to an unexpected host;
- public interaction starts triggering `/api/bokun`, OpenAI/LLM, checkout, payment, booking submission, or DB-write behavior;
- the page returns persistent production errors.

Rollback task:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-ROLLBACK-0
```

Rollback must require explicit approval before production deployment.

## 11. Guardrails

This submission task must not:

- modify app code;
- change robots metadata;
- change sitemap generation;
- add `/tours/{id}` back to the sitemap;
- make B2B pages indexable;
- change homepage/nav/sitemap links;
- call Bókun APIs;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write to the database;
- change schema or environment variables;
- add LLM/OpenAI behavior;
- touch ThaiEleHub files;
- run Shopify commands;
- deploy production.

## 12. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-SEARCH-CONSOLE-SUBMISSION-0
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-1
TD-RADARSCOUT-TOUR-DETAIL-SEO-SAFETY-0
TD-RADARSCOUT-B2B-SEO-READINESS-0
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
```

Do not expand SEO to additional pages until Search Console confirms the first controlled opening is safe.
