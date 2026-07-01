# RadarScout SEO post-launch monitoring 3

Task: `TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-3`

## 1. Purpose

This report records the third public-read monitoring pass after the controlled SEO opening of:

```text
/chiang-mai/elephant-camp-finder
```

This is an observation report only. It does not access private Google Search Console data and does not change app code, sitemap output, robots metadata, deployments, database state, Bókun behavior, analytics, or any ThaiEleHub asset.

## 2. Current controlled-opening policy

Expected SEO policy:

- `/chiang-mai/elephant-camp-finder` remains the only intentionally opened planner page.
- The finder should remain `index, follow`.
- The finder should remain in `https://www.radarscout.io/sitemap.xml`.
- `/tours/{id}` URLs should remain excluded from the sitemap.
- `/partners`, `/suppliers`, and `/destination-partners` should remain `noindex, nofollow` and excluded from the sitemap.
- Booking handoff should remain external booking partner widget only.

## 3. Public URL status

Checked URLs:

| URL | Result | Notes |
| --- | --- | --- |
| `https://www.radarscout.io/sitemap.xml` | 200 | Public sitemap loaded. |
| `https://www.radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder loaded. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Non-www finder loaded and points canonical to the `www` URL. |
| `https://www.radarscout.io/partners` | 200 | B2B page remains accessible but closed to indexing. |
| `https://www.radarscout.io/suppliers` | 200 | B2B page remains accessible but closed to indexing. |
| `https://www.radarscout.io/destination-partners` | 200 | B2B page remains accessible but closed to indexing. |

No public availability issue was observed in this pass.

## 4. Sitemap status

Observed sitemap URLs:

```text
https://www.radarscout.io
https://www.radarscout.io/chiang-mai/elephant-camp-finder
https://www.radarscout.io/contact
https://www.radarscout.io/privacy-policy
https://www.radarscout.io/terms-of-service
```

Sitemap findings:

- total observed URLs: 5;
- Chiang Mai finder is present;
- `/tours/{id}` URLs are absent;
- `/partners`, `/suppliers`, and `/destination-partners` are absent;
- no unsafe tour detail URLs were observed in the live sitemap.

This remains aligned with the controlled-opening policy.

## 5. Metadata and robots status

### Chiang Mai finder

Observed metadata:

```text
Title: Find the right Chiang Mai experience | RadarScout
Robots: index, follow
Canonical: https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

The non-www page also returns 200 and declares the expected canonical:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

### B2B pages

Observed robots state:

```text
/partners: noindex, nofollow
/suppliers: noindex, nofollow
/destination-partners: noindex, nofollow
```

This remains correct.

## 6. Planner flow smoke

Browser checks were run against:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Viewports:

- mobile: 390px wide;
- desktop: 1440px wide.

Flows checked:

```text
Flow A:
Gentle elephant day / Family / Half day / Feeding / Bathing if clearly listed

Flow B:
Cooking + local food / Couple / Full day / Easy pace

Flow C:
Nature day trip / Friends / Full day / Hotel-area friendly
```

Observed behavior across mobile and desktop:

- page returned 200;
- summary was hidden before planner submission;
- `Your suggested Chiang Mai day` appeared after `See matching experiences`;
- `MORNING`, `MIDDAY`, and `AFTERNOON` labels were visible;
- three external `Check availability` links were present after each submitted flow;
- CTA targets remained `https://widgets.bokun.io/...`;
- CTA rel remained `nofollow sponsored noopener noreferrer`;
- no horizontal overflow was detected.

Reset check:

- after Flow A submission, `Reset planner` cleared the summary on mobile and desktop.

Product exclusion check:

- product `1232799` was not present in visible text;
- product `1232799` was not present in observed CTA URLs.

## 7. Safety copy audit

Visible UI was checked for these unsafe tourist-facing phrases:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
fake reviews
fake ratings
supplier net rate
partner rate
commission
```

Observed result:

```text
0 unsafe visible matches
```

No unsafe booking, checkout, payment, live-availability, fake-review, backend, supplier-rate, or commission language was observed in the checked finder states.

## 8. Network/API audit

During public browser interaction checks, no requests were observed for:

```text
/api/bokun
OpenAI
LLM
checkout
payment
booking submission
```

Observed handoff behavior:

- public planner interaction did not call Bókun APIs;
- public planner interaction did not trigger checkout, payment, booking submission, or DB-write behavior;
- handoff remained external booking partner widget links only.

## 9. Search Console status

This monitoring pass did not access private Google Search Console data.

Public evidence shows:

- the finder remains crawlable from metadata and sitemap output;
- the finder canonical remains stable;
- the live sitemap remains controlled and excludes unsafe tour detail URLs;
- B2B pages remain noindex.

Search Console fields still requiring manual record:

- property used;
- sitemap submission status;
- discovered URL count;
- URL Inspection result;
- user-declared canonical;
- Google-selected canonical;
- whether indexing was requested;
- crawl or indexing warnings.

## 10. Warnings and follow-ups

No public-site blocker was found.

Follow-ups:

1. Record Search Console submission data once available.
2. Continue monitoring whether Google indexes only the intended finder URL.
3. Watch for historical `/tours/{id}` URLs appearing in Search Console coverage.
4. Watch generated snippets for unsafe booking, payment, live-availability, or fake-review language.
5. Keep additional SEO expansion blocked until separate safety audits pass.

## 11. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-SEARCH-CONSOLE-MANUAL-SUBMISSION-RECORD-0
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-4
TD-RADARSCOUT-TOUR-DETAIL-SEO-SAFETY-0
TD-RADARSCOUT-B2B-SEO-READINESS-0
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
```

Do not expand SEO beyond the current controlled Chiang Mai finder opening until Search Console and snippet monitoring confirm that the first opened page remains safe.

## 12. Guardrail confirmation

This monitoring task did not:

- modify app code;
- change robots metadata;
- change sitemap generation;
- open additional pages to `index, follow`;
- re-add `/tours/{id}` to the sitemap;
- make B2B pages indexable;
- change homepage, nav, or sitemap links;
- call Bókun APIs;
- edit or sync Bókun products;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write to the database;
- change schema or environment variables;
- add LLM/OpenAI behavior;
- touch ThaiEleHub files;
- run Shopify commands;
- deploy production.
