# RadarScout SEO post-launch monitoring

Task: `TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-0`

## 1. Current production state

RadarScout has completed the controlled SEO opening for:

```text
/chiang-mai/elephant-camp-finder
```

Current production baseline:

```text
Production HEAD: d9fe9a8a7c843dbcf6fe67c743ca6139524ffb26
Deployment ID: dpl_H3wLC2vnaKr8N1JXJjcMVhm7jSck
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Live SEO state after launch:

- `/chiang-mai/elephant-camp-finder` is `index,follow`.
- `/chiang-mai/elephant-camp-finder` is present in `sitemap.xml`.
- `/tours/{id}` URLs remain excluded from `sitemap.xml`.
- `/partners`, `/suppliers`, and `/destination-partners` remain `noindex,nofollow`.
- B2B pages remain excluded from `sitemap.xml`.
- Booking handoff remains external booking partner widget only.

## 2. Monitoring objective

The first SEO monitoring objective is not to expand indexing.

The objective is to confirm that the single opened page is discovered, indexed, and shown with safe snippets while RadarScout keeps the same transaction boundaries:

- no live availability claims;
- no checkout, payment, cart, or booking submission inside RadarScout;
- no Bókun API, edit, or sync behavior;
- no product-detail sitemap re-opening;
- no B2B page indexing.

If monitoring finds unsafe snippets, wrong canonical selection, unexpected indexed pages, or unsafe traffic behavior, RadarScout should pause further SEO expansion and roll back the opened page if needed.

## 3. Search Console checklist

Set up or verify Google Search Console access for:

```text
https://radarscout.io
https://www.radarscout.io
```

Recommended property approach:

- Use a domain property if DNS verification is available.
- Otherwise verify both URL-prefix properties.
- Confirm the preferred canonical host remains `https://www.radarscout.io` where page metadata points there.

Immediate checks:

1. Submit or resubmit:

   ```text
   https://www.radarscout.io/sitemap.xml
   ```

2. Use URL Inspection for:

   ```text
   https://www.radarscout.io/chiang-mai/elephant-camp-finder
   ```

3. Confirm URL Inspection reports:

   - page is indexable;
   - canonical is the expected `www` URL;
   - page is not blocked by robots;
   - page is discovered through sitemap after sitemap processing;
   - no structured data or crawl errors create a launch blocker.

4. Do not request indexing for:

   ```text
   /tours/{id}
   /partners
   /suppliers
   /destination-partners
   ```

## 4. Daily checks for the first week

Run these checks daily for the first 7 days after production SEO opening.

### Index coverage

Check:

- `/chiang-mai/elephant-camp-finder` index status.
- Sitemap processing status.
- Whether Google selected the expected canonical.
- Whether any excluded URL unexpectedly appears as indexed.

Expected:

- Chiang Mai finder can move from discovered to crawled to indexed.
- `/tours/{id}` URLs should not reappear from sitemap.
- B2B pages should remain noindex.

### Query and snippet review

Review early impressions and visible snippets for queries around:

```text
Chiang Mai elephant experience
Chiang Mai elephant day
Chiang Mai experience finder
Chiang Mai elephant care
family-friendly Chiang Mai elephant experience
```

Safe snippet direction:

- guided planner;
- compare experiences;
- trusted local experiences;
- continue with a booking partner;
- check availability.

Unsafe snippet direction:

- live availability;
- available now;
- instant confirmation;
- checkout or payment inside RadarScout;
- reservation complete;
- fake reviews or ratings;
- Bókun backend, Bókun database, or Bókun-powered wording.

### Live page smoke

Confirm:

- page returns 200 on both primary domains;
- title remains `Find the right Chiang Mai experience | RadarScout`;
- robots remains `index, follow`;
- sitemap still contains only intended safe URLs;
- recommendation cards still appear;
- CTA remains `Check availability`;
- CTA handoff remains an external booking partner widget URL;
- CTA rel includes `nofollow sponsored noopener noreferrer`;
- product `1232799` remains excluded from Chiang Mai recommendations;
- no horizontal overflow on mobile.

### Safety/network smoke

Confirm no public interaction triggers:

- `/api/bokun`;
- OpenAI or LLM calls;
- checkout, payment, or booking submission requests;
- DB-write behavior from public planner interaction.

## 5. Weekly checks for the first month

Run these checks once per week for the first month.

### Search Console performance

Track:

- impressions;
- clicks;
- average position;
- click-through rate;
- queries with unexpected availability, booking, payment, or ratings language.

Do not overreact to low initial traffic. The first objective is safe indexing and correct snippets, not immediate ranking.

### Search result safety

Manually search branded and page-intent queries:

```text
site:radarscout.io Chiang Mai elephant
RadarScout Chiang Mai elephant finder
RadarScout Chiang Mai experience
Chiang Mai elephant experience RadarScout
```

Check whether Google shows safe titles and snippets. If snippets include unsafe transaction language, capture the query, date, screenshot, and page source before deciding whether copy changes or rollback are required.

### Sitemap and robots boundary

Confirm:

- sitemap includes `/chiang-mai/elephant-camp-finder`;
- sitemap excludes `/tours/{id}`;
- sitemap excludes B2B pages;
- B2B pages remain `noindex,nofollow`;
- tour detail pages are not intentionally promoted for SEO.

### UX and conversion observation

If analytics exists later, track only safe funnel events:

- finder page view;
- planner chip interaction;
- `See matching experiences`;
- recommendation card visible;
- `Check availability` outbound click.

Do not track:

- payment information;
- booking partner checkout fields;
- personal traveler details;
- Bókun backend data;
- supplier rates or commission data.

## 6. Rollback criteria

Roll back the Chiang Mai finder to `noindex,nofollow` if any of these occur:

- Google indexes unsafe `/tours/{id}` pages from the RadarScout sitemap path.
- Search snippets imply live availability, instant confirmation, booking completion, checkout, or payment inside RadarScout.
- The live page begins rendering unsafe tourist-facing copy such as `partner rate`, `supplier net rate`, `commission`, `Bókun backend`, or `Bókun database`.
- Public planner interaction triggers `/api/bokun`, OpenAI/LLM, checkout, payment, booking submission, or DB-write behavior.
- B2B pages become indexable by accident.
- The finder canonical points to an unexpected URL.
- The page returns persistent 5xx errors after launch.

Rollback task:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-ROLLBACK-0
```

Rollback scope:

- change `/chiang-mai/elephant-camp-finder` robots back to `noindex,nofollow`;
- remove `/chiang-mai/elephant-camp-finder` from sitemap;
- keep B2B and `/tours/{id}` safeguards unchanged;
- no product data changes;
- no Bókun API calls;
- production deploy only after explicit approval.

## 7. What not to expand yet

Do not open these surfaces to SEO until separate audits pass:

```text
/tours/{id}
/partners
/suppliers
/destination-partners
/ai-trip-planner
new destination/category pages
```

Reasons:

- `/tours/{id}` pages still need public-safe copy, metadata, robots, and sitemap review.
- B2B pages need stronger lead capture and positioning before SEO.
- AI trip planner pages need separate LLM/product-safety review before indexing.
- New destinations should not be indexable until product coverage and copy depth are verified.

## 8. Recommended next tasks

Recommended next sequence:

```text
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-1
TD-RADARSCOUT-SEARCH-CONSOLE-SUBMISSION-0
TD-RADARSCOUT-TOUR-DETAIL-SEO-SAFETY-0
TD-RADARSCOUT-B2B-SEO-READINESS-0
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
```

Suggested scopes:

1. `TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-1`
   - read-only production observation after the first search crawl window;
   - verify index status, snippets, sitemap state, and safety boundaries.

2. `TD-RADARSCOUT-SEARCH-CONSOLE-SUBMISSION-0`
   - docs/checklist or guided manual submission;
   - no code change;
   - no SEO expansion.

3. `TD-RADARSCOUT-TOUR-DETAIL-SEO-SAFETY-0`
   - audit `/tours/{id}` pages for public-safe copy, robots, and sitemap readiness;
   - do not re-add tours to sitemap until safe.

4. `TD-RADARSCOUT-B2B-SEO-READINESS-0`
   - audit whether partner/supplier/destination-partner pages should ever become indexable;
   - likely remain closed until lead capture and positioning are stronger.

5. `TD-RADARSCOUT-ANALYTICS-FUNNEL-0`
   - define safe funnel events only;
   - no analytics SDK or DB write until separately approved.

## 9. Guardrails

Every follow-up task must preserve:

- no Bókun API/edit/sync without explicit approval;
- no checkout/payment/cart/booking submission inside RadarScout;
- no live availability/inventory claims;
- no fake ratings or reviews;
- no DB/schema/env changes unless explicitly scoped;
- no LLM/OpenAI integration unless explicitly scoped;
- no ThaiEleHub or Shopify work inside RadarScout tasks;
- production deploy only after explicit approval.
