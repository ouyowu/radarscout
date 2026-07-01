# RadarScout SEO controlled opening precheck

## 1. Task

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0
```

This is an audit-only precheck for a possible future controlled SEO opening of:

```text
/chiang-mai/elephant-camp-finder
```

This task does not open indexing. It does not change robots, sitemap, app code, Bókun behavior, database, schema, environment variables, LLM behavior, or production deployment.

## 2. Executive summary

Recommendation:

```text
Proceed to a separate controlled-opening prep task, but do not open index/follow yet.
```

The live Chiang Mai finder is a credible first SEO candidate because it now has:

- Clear page title, H1, and meta description.
- Homepage entry point.
- Deterministic chat planner.
- Planner picks.
- Deterministic itinerary summary.
- Recommendation cards.
- Safe external `Check availability` handoff.
- No visible forbidden booking, payment, live availability, fake review, or Bókun backend claims.
- No `/api/bokun`, LLM/OpenAI, checkout, payment, booking submission, or DB-write network behavior observed during the rendered smoke.

However, the actual `index,follow` change should remain behind a separate explicit approval gate because opening the page will also require:

- A deliberate sitemap decision for the finder URL.
- A Search Console / post-open monitoring plan.
- A final production smoke immediately before and after the robots change.

## 3. Current live state checked

Checked on July 1, 2026.

| URL | Status | Key result |
| --- | ---: | --- |
| `https://radarscout.io/` | 200 | Homepage live and safe; no page-level robots meta found. |
| `https://www.radarscout.io/` | 200 | Homepage canonical points to `https://www.radarscout.io`. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder remains `noindex, nofollow`. |
| `https://www.radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Finder canonical points to `https://www.radarscout.io/chiang-mai/elephant-camp-finder`. |
| `https://radarscout.io/partners` | 200 | B2B page remains `noindex, nofollow`. |
| `https://radarscout.io/suppliers` | 200 | B2B page remains `noindex, nofollow`. |
| `https://radarscout.io/destination-partners` | 200 | B2B page remains `noindex, nofollow`. |
| `https://radarscout.io/robots.txt` | 200 | Allows public pages and points to `https://www.radarscout.io/sitemap.xml`. |
| `https://radarscout.io/sitemap.xml` | 200 | 4 URLs; no `/tours/{id}` URLs; no finder URL; no B2B URLs. |

## 4. Metadata and robots findings

### Homepage

Observed:

```text
Title: RadarScout | AI-guided Thailand Experience Planner
H1: AI-guided Thailand Experience Planner
Meta description: Plan Thailand experiences with guided discovery for elephant care, cooking, nature, family-friendly days, and trusted booking partner handoff.
Canonical: https://www.radarscout.io
Robots meta: none found
```

Assessment:

- Homepage is already indexable unless blocked elsewhere.
- Homepage copy passed the forbidden phrase audit.
- Homepage is not the requested controlled-opening target, but it currently supports the planner positioning.

### Chiang Mai finder

Observed:

```text
Title: Find the right Chiang Mai experience | RadarScout
H1: Find the right Chiang Mai experience
Meta description: Compare Chiang Mai elephant care, cooking, nature, and family-friendly experiences with a guided planner. RadarScout helps you choose a fit, then continue with a booking partner.
Canonical: https://www.radarscout.io/chiang-mai/elephant-camp-finder
Robots meta: noindex, nofollow
```

Assessment:

- Page metadata is strong enough for a future controlled SEO opening.
- Robots remains intentionally closed.
- Canonical is already stable on the `www` URL.

### B2B pages

Observed:

```text
/partners: noindex, nofollow
/suppliers: noindex, nofollow
/destination-partners: noindex, nofollow
```

Assessment:

- B2B pages remain correctly closed for now.
- Do not open these in the Chiang Mai finder SEO task.

## 5. Sitemap and robots.txt findings

Sitemap:

```text
URL count: 4
/tours/{id} count: 0
/chiang-mai/elephant-camp-finder count: 0
/partners count: 0
/suppliers count: 0
/destination-partners count: 0
```

Assessment:

- The unsafe tour detail URL regression remains fixed.
- The finder URL is not in sitemap yet, which is correct while it remains `noindex,nofollow`.
- A future opening task must decide whether to add only the finder URL to sitemap when robots opens.
- Do not re-add `/tours/{id}` URLs.

Robots.txt:

```text
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /auth/
Disallow: /demo
Disallow: /use-cases
Disallow: /pricing
Disallow: /f5bot-alternative
Disallow: /gummysearch-alternative
Disallow: /reddit-monitoring-tool
Disallow: /reddit-keyword-monitor
Disallow: /reddit-mention-alerts
Disallow: /reddit-lead-finder
Disallow: /social-listening-reddit
Disallow: /reddit-competitor-monitoring
Disallow: /reddit-customer-discovery

Sitemap: https://www.radarscout.io/sitemap.xml
```

Assessment:

- No robots.txt change is needed for this precheck.
- Future controlled opening can likely be handled at page metadata + sitemap scope, not broad robots.txt scope.

## 6. Rendered Chiang Mai finder smoke

Rendered mobile smoke was run against:

```text
https://radarscout.io/chiang-mai/elephant-camp-finder
```

Flow checked:

```text
Gentle elephant day
Family
Half day
Feeding
Bathing if clearly listed
See matching experiences
```

Rendered findings:

| Check | Result |
| --- | --- |
| Page title | `Find the right Chiang Mai experience | RadarScout` |
| Robots | `noindex, nofollow` |
| H1 | `Find the right Chiang Mai experience` |
| `Plan with RadarScout` visible | Yes |
| `Your planner picks` visible | Yes |
| Planner picks retained | Yes |
| `Your suggested Chiang Mai day` visible after submit | Yes |
| Morning / Midday / Afternoon visible | Yes |
| Recommendation cards visible | Yes |
| `Check availability` CTA count | 3 |
| CTA href pattern | External `https://widgets.bokun.io/...` URLs |
| CTA rel | `nofollow sponsored noopener noreferrer` |
| Product `1232799` visible | No |
| Mobile horizontal overflow | No |

Rendered summary excerpt:

```text
Your suggested Chiang Mai day

A gentle half-day plan focused on elephant care and family-friendly pacing.

MORNING
Start with a gentle elephant care experience.

MIDDAY
Keep the plan light and easy for the group.

AFTERNOON
Leave space to return toward Chiang Mai or rest.
```

Assessment:

- The core visible page experience is strong enough for a future controlled SEO opening.
- The itinerary summary appears only after planner action, which is correct for the current UX.
- Recommendation cards and external handoff remain safe.

## 7. Safety copy audit

Visible/raw-page checks found no unsafe matches for:

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

Assessment:

- Tourist-facing visible copy is safe for the audited pages.
- B2B pages did not expose rate/commission/supplier-backend wording in the live HTML check.

## 8. Network / behavior audit

During rendered planner smoke, no network request matched:

```text
/api/bokun
OpenAI
LLM
checkout
payment
booking
```

Observed handoff behavior:

- External Bókun widget URLs are present only as `Check availability` links.
- No booking submission request was observed.
- No checkout/payment request was observed.
- No DB write behavior was observed.
- No LLM/OpenAI call was observed.

Assessment:

- Current page behavior preserves the RadarScout boundary:

```text
RadarScout = discovery / recommendation / itinerary framing / partner handoff
Booking partner = availability / checkout / payment / confirmation
```

## 9. Minor observations

### Raw HTML includes product data

The static HTML/source contained `1232799` twice, but the rendered page did not show product `1232799` in visible recommendations.

Assessment:

- This does not currently appear to be a tourist-facing issue.
- Before opening SEO, it is still worth keeping a test that verifies `1232799` is excluded from visible recommendations.

### Raw HTML does not include visible CTA text

The static HTML check did not find `Check availability`, but rendered Playwright smoke found 3 visible CTA links.

Assessment:

- This is expected for client-rendered recommendation cards.
- Future SEO smoke should include rendered checks, not only raw HTML checks.

## 10. Go / no-go decision

Decision:

```text
GO for a separate controlled-opening prep task.
NO-GO for opening index/follow inside this task.
```

Reason:

- The main page candidate is materially ready.
- Safety checks passed.
- Sitemap safety remains intact.
- B2B pages remain closed.
- But opening SEO should be its own explicit production-impacting task with a final smoke and approval gate.

## 11. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PREP-1
```

Suggested scope:

- Prepare the exact minimal diff for a future opening.
- Do not production deploy automatically.
- Do not open `index,follow` without explicit approval.
- If implementation is approved later, it should likely:
  - change only the Chiang Mai finder robots metadata,
  - add only `/chiang-mai/elephant-camp-finder` to sitemap,
  - keep `/tours/{id}` excluded,
  - keep B2B pages `noindex,nofollow`,
  - preserve CTA rel and external booking partner handoff.

Recommended safety sequence:

1. Create PR for controlled-opening prep.
2. Preview smoke.
3. Merge + post-merge preview smoke.
4. Explicit production approval gate.
5. Production deploy.
6. Post-production smoke.
7. Search Console / sitemap submission and observation.

## 12. Stop conditions for the opening task

Stop before opening SEO if any of these are found:

- Finder no longer returns `200`.
- Finder visible copy includes forbidden booking, payment, live availability, Bókun backend, rate, commission, fake review, or fake rating wording.
- CTA no longer says `Check availability`.
- CTA no longer points to external booking partner handoff.
- CTA rel loses `nofollow sponsored noopener noreferrer`.
- `/tours/{id}` URLs reappear in sitemap.
- B2B pages become indexable.
- Any `/api/bokun`, LLM/OpenAI, checkout/payment, booking submission, DB write, schema, or env behavior appears.
- ThaiEleHub or Shopify files are touched.
