# RadarScout SEO post-launch monitoring 4

Task: `TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-4`

Date: 2026-07-06

## 1. Scope

This is a read-only production SEO monitoring report.

No app code, sitemap output, robots metadata, deployment, database, schema,
environment, Bókun behavior, analytics, ThaiEleHub, or Shopify work happened in
this task.

## 2. URLs checked

| URL | Status | Result |
| --- | ---: | --- |
| `https://radarscout.io/` | 200 | Homepage loads; no page-level robots meta found. |
| `https://www.radarscout.io/` | 200 | Homepage loads; canonical points to `https://www.radarscout.io`. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder loads with `index, follow`. |
| `https://www.radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder loads with `index, follow`; canonical points to the `www` URL. |
| `https://www.radarscout.io/sitemap.xml` | 200 | Sitemap loads as XML and includes the Chiang Mai finder. |
| `https://www.radarscout.io/partners` | 200 | B2B page remains `noindex, nofollow`. |
| `https://www.radarscout.io/suppliers` | 200 | B2B page remains `noindex, nofollow`. |
| `https://www.radarscout.io/destination-partners` | 200 | B2B page remains `noindex, nofollow`. |
| `https://www.radarscout.io/ai-trip-planner` | 200 | AI Trip Planner remains `noindex, nofollow`. |

## 3. Sitemap status

Observed sitemap URLs:

```text
https://www.radarscout.io
https://www.radarscout.io/chiang-mai/elephant-camp-finder
https://www.radarscout.io/contact
https://www.radarscout.io/privacy-policy
https://www.radarscout.io/terms-of-service
```

Status:

- `/chiang-mai/elephant-camp-finder` is present.
- `/tours/{id}` URLs are absent.
- `/partners`, `/suppliers`, and `/destination-partners` are absent.
- `/ai-trip-planner` is absent.
- destination pages remain absent.

Assessment:

The public sitemap remains controlled and aligned with the current SEO posture:
the Chiang Mai finder is open, while tour details, B2B pages, AI Trip Planner,
and broader destination pages stay excluded.

## 4. Metadata and robots status

Homepage:

```text
Title: RadarScout | AI-guided Thailand Experience Planner
Canonical: https://www.radarscout.io
Robots: no page-level robots meta observed
```

Chiang Mai finder:

```text
Title: Find the right Chiang Mai experience | RadarScout
Canonical: https://www.radarscout.io/chiang-mai/elephant-camp-finder
Robots: index, follow
```

B2B pages:

```text
/partners: noindex, nofollow
/suppliers: noindex, nofollow
/destination-partners: noindex, nofollow
```

AI Trip Planner:

```text
/ai-trip-planner: noindex, nofollow
```

Assessment:

The controlled SEO opening is still scoped to the Chiang Mai finder. No broad
site-wide opening was observed.

## 5. Safety copy audit

Checked live HTML for these unsafe public phrases:

```text
AI booked this
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
booking complete
Bókun backend
Bókun database
Bókun-powered
Bókun supplier products
supplier net rate
partner rate
commission
fake reviews
fake ratings
```

Result:

```text
0 unsafe visible matches in the checked pages.
```

## 6. Current recommendation

Recommended next RadarScout SEO task:

```text
TD-RADARSCOUT-SEO-POST-LAUNCH-MONITORING-5
```

Focus:

- repeat the same live checks after the next production deploy;
- verify Search Console state manually if available;
- keep `/tours/{id}` out of sitemap;
- keep B2B pages and AI Trip Planner `noindex,nofollow`;
- do not expand indexing until a separate controlled-opening task approves a new page.

## 7. Safety confirmations

This monitoring task confirms:

- app code changed: no;
- production deploy: no;
- robots metadata changed: no;
- sitemap generation changed: no;
- SEO opening expanded: no;
- Bókun API/edit/sync: no;
- checkout/payment/booking submission: no;
- DB/schema/env changes: no;
- ThaiEleHub/Shopify touched: no.
