# RadarScout SEO post-launch monitoring 1

Task: `TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-1`

## 1. Purpose

This report records the first public-read observation after RadarScout's controlled SEO opening for:

```text
/chiang-mai/elephant-camp-finder
```

This is an observation and monitoring document only. It does not change app code, sitemap behavior, robots metadata, deployments, Bókun behavior, database state, analytics, or any ThaiEleHub asset.

## 2. Current baseline

The current controlled opening baseline remains:

```text
Primary domains:
- https://radarscout.io
- https://www.radarscout.io

Opened SEO page:
- https://www.radarscout.io/chiang-mai/elephant-camp-finder

Sitemap:
- https://www.radarscout.io/sitemap.xml
```

Expected policy:

- `/chiang-mai/elephant-camp-finder` should be `index, follow`.
- `/chiang-mai/elephant-camp-finder` should be present in `sitemap.xml`.
- `/tours/{id}` pages should remain excluded from `sitemap.xml`.
- `/partners`, `/suppliers`, and `/destination-partners` should remain `noindex, nofollow`.
- B2B pages should remain excluded from `sitemap.xml`.
- Booking handoff should remain external booking partner widget only.

## 3. Public URL checks

Checked URLs:

| URL | Result | Notes |
| --- | --- | --- |
| `https://www.radarscout.io/sitemap.xml` | 200 | Public sitemap loaded. |
| `https://www.radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder loaded on mobile and desktop browser checks. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Non-www page loaded and declared canonical to the `www` URL. |
| `https://www.radarscout.io/partners` | 200 | Robots remains `noindex, nofollow`. |
| `https://www.radarscout.io/suppliers` | 200 | Robots remains `noindex, nofollow`. |
| `https://www.radarscout.io/destination-partners` | 200 | Robots remains `noindex, nofollow`. |

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

This matches the current controlled SEO opening policy.

## 5. Metadata and robots status

### Chiang Mai finder

Observed metadata:

```text
Title: Find the right Chiang Mai experience | RadarScout
Robots: index, follow
Canonical: https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

The non-www URL also returns 200 and declares the same canonical:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

### B2B pages

Observed B2B robots state:

```text
/partners: noindex, nofollow
/suppliers: noindex, nofollow
/destination-partners: noindex, nofollow
```

This matches the policy that B2B pages stay closed while the Chiang Mai finder is the only controlled SEO opening.

## 6. Live finder interaction smoke

Browser checks were run against:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Viewports:

- mobile: 390px wide;
- desktop: 1440px wide.

Flow checked:

```text
Gentle elephant day
Family
Half day
Feeding
Bathing if clearly listed
See matching experiences
```

Observed behavior:

- page returned 200 on mobile and desktop;
- title remained `Find the right Chiang Mai experience | RadarScout`;
- robots remained `index, follow`;
- canonical remained the expected `www` URL;
- `Your suggested Chiang Mai day` was hidden before planner submission;
- `Your suggested Chiang Mai day` appeared after `See matching experiences`;
- `MORNING`, `MIDDAY`, and `AFTERNOON` labels were visible in the summary;
- recommendation cards appeared after planner submission;
- three `Check availability` links were present;
- first observed handoff URL used `https://widgets.bokun.io/...`;
- CTA rel remained `nofollow sponsored noopener noreferrer`;
- no horizontal overflow was detected on mobile or desktop.

## 7. Safety copy audit

Visible UI was checked for these unsafe tourist-facing terms:

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

No unsafe booking, payment, live-availability, fake-review, backend, supplier-rate, or commission wording was observed in the checked finder UI state.

## 8. Network/API smoke

During the public browser interaction smoke, no requests were observed for:

```text
/api/bokun
OpenAI
LLM
checkout
payment
booking submission
```

Observed handoff behavior:

- booking handoff remained external;
- the observed CTA target used the public booking partner widget domain;
- no Bókun API, checkout, payment, or booking-submission request was triggered by the public planner interaction.

## 9. Search Console status

This task did not access private Google Search Console data.

Current status from public checks:

- the finder is publicly crawlable from the page metadata perspective;
- the finder is discoverable through the public sitemap;
- closed B2B and tour-detail surfaces remain excluded from the sitemap according to public output.

Manual Search Console follow-up should record:

- sitemap submission status;
- discovered URL count;
- URL Inspection result for the finder;
- user-declared canonical;
- Google-selected canonical;
- indexing request status;
- crawl or indexing warnings.

Use:

```text
docs/radarscout-search-console-submission.md
```

as the manual submission checklist.

## 10. Warnings and follow-ups

No blocking public-site issue was found in this monitoring pass.

Follow-ups:

1. Complete manual Google Search Console submission if it has not already been completed.
2. Record the Search Console property, sitemap status, discovered URL count, and URL Inspection result.
3. Continue daily monitoring for the first 7 days.
4. Watch for unexpected indexed `/tours/{id}` or B2B pages from historical crawl state.
5. Watch generated snippets for unsafe transaction language.

## 11. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-SEARCH-CONSOLE-MANUAL-SUBMISSION-RECORD-0
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-2
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
