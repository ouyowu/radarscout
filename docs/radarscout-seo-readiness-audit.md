# RadarScout SEO readiness audit

## 1. Executive summary

Decision: Almost ready for a single-page controlled SEO opening, but not ready for site-wide index/follow.

RadarScout’s strongest future indexing candidate is:

```text
/chiang-mai/elephant-camp-finder
```

That page now has a mature enough user experience to consider a controlled SEO opening later:

- Clear H1 and title.
- Substantial guided-planning UI.
- Deterministic chat planner.
- Deterministic itinerary summary.
- Recommendation cards.
- External `Check availability` handoff.
- No live availability, checkout, payment, fake review, or fake rating claims in the visible Chiang Mai finder UI.

However, RadarScout should not open site-wide indexing yet. The audit found several site-level issues that should be resolved before any broad SEO launch:

- B2B pages should remain `noindex,nofollow`.
- The homepage is indexable and contains the phrase `available now` in a harmless FAQ context, but that wording is part of the forbidden audit list and should be softened before broader SEO work.
- `sitemap.xml` currently includes many `/tours/...` product pages.
- Product detail page source and visible copy include terms such as `payment`, `partner rate`, and `Bókun supplier partner product database`, which are not appropriate for tourist-facing SEO pages under the current safety rules.
- The Chiang Mai finder is not yet linked from the homepage or navigation.
- There is no documented Search Console / post-index monitoring plan yet.

Recommended next implementation task:

```text
TD-RADARSCOUT-SEO-READINESS-1-CHIANG-MAI-CONTROLLED-OPENING-PREP
```

This should prepare, but not automatically launch, a single-page indexing change for the Chiang Mai finder.

## 2. Current production SEO state

Production state audited:

```text
Production HEAD: dbbcf86ac9555183759b944905f7f8e66cd8202d
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Current page robots status:

| URL | Status | Robots state | Notes |
| --- | ---: | --- | --- |
| `https://radarscout.io/` | 200 | No page-level robots meta found | Homepage is currently indexable unless blocked elsewhere. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | `noindex,nofollow` | Main future SEO candidate, but still intentionally closed. |
| `https://www.radarscout.io/chiang-mai/elephant-camp-finder` | 200 | `noindex,nofollow` | Canonical points to `https://www.radarscout.io/chiang-mai/elephant-camp-finder`. |
| `https://radarscout.io/partners` | 200 | `noindex,nofollow` | Should remain closed for now. |
| `https://radarscout.io/suppliers` | 200 | `noindex,nofollow` | Should remain closed for now. |
| `https://radarscout.io/destination-partners` | 200 | `noindex,nofollow` | Should remain closed for now. |
| `https://radarscout.io/sitemap.xml` | 200 | XML sitemap | Includes homepage, contact/legal pages, and many `/tours/...` URLs. |
| `https://radarscout.io/robots.txt` | 200 | Allows `/`, disallows internal/tooling paths | Points to `https://www.radarscout.io/sitemap.xml`. |

Current sitemap finding:

- `sitemap.xml` has 250 URLs.
- The audited noindex pages below are not in the sitemap:
  - `/chiang-mai/elephant-camp-finder`
  - `/partners`
  - `/suppliers`
  - `/destination-partners`
- Sitemap does include many `/tours/...` product detail URLs.

Robots.txt finding:

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
```

This is acceptable for the current closed SEO state, but should be reviewed before any controlled index/follow opening.

## 3. Page-by-page audit

### Homepage

URL:

```text
https://radarscout.io/
```

Findings:

- Status: 200.
- Title: `RadarScout | AI-powered Destination DMC Portal`.
- H1: `AI-powered Destination DMC Portal for Curated Day Tours`.
- Meta description exists.
- Canonical points to `https://www.radarscout.io`.
- No page-level robots meta was found, so the homepage is currently indexable.
- The homepage does not currently link to `/chiang-mai/elephant-camp-finder`.

Readiness:

- Not the recommended first SEO-change target.
- It needs stronger alignment with the current AI-guided Thailand experience planner direction before homepage-level SEO work.

Issue:

- Visible homepage FAQ contains `available now` in the phrase “Is RadarScout a marketplace with every country available now?” This is not an availability claim for a product, but it is still an exact forbidden phrase and should be rewritten before broader SEO launch.

### Chiang Mai finder

URL:

```text
https://radarscout.io/chiang-mai/elephant-camp-finder
```

Findings:

- Status: 200.
- Title: `Find the right Chiang Mai experience | RadarScout`.
- H1: `Find the right Chiang Mai experience`.
- Meta description exists and is unique.
- Canonical points to `https://www.radarscout.io/chiang-mai/elephant-camp-finder`.
- Robots remain `noindex,nofollow`.
- Mobile smoke has passed after the compact itinerary-summary polish.
- Chat planner, planner picks, itinerary summary, and recommendation cards are visible and usable.
- CTA remains `Check availability`.
- Handoff remains an external Bókun widget URL.

Runtime safety check:

```text
CTA href: https://widgets.bokun.io/online-sales/3f335ed3-148b-4690-b13f-c76a637227db/experience/1232731
CTA rel: nofollow sponsored noopener noreferrer
1232799 visible: false
Unsafe network requests: none detected
```

Readiness:

- Best candidate for a future controlled index/follow opening.
- Almost ready, but should not be opened until the required tasks in section 9 are complete.

### Partner pages

URLs:

```text
https://radarscout.io/partners
https://radarscout.io/suppliers
https://radarscout.io/destination-partners
```

Findings:

- All return 200.
- Each has a clear H1.
- Each has unique title and description.
- Each remains `noindex,nofollow`.
- They are static interest pages.
- They do not use backend forms.
- They do not appear in the sitemap.

Readiness:

- Keep these pages `noindex,nofollow` for now.
- They need stronger lead capture, contact workflow clarity, and B2B positioning before SEO opening.

### Product detail pages

Sample URL from sitemap:

```text
https://radarscout.io/tours/5c51176e-e42e-4bbb-9c4e-9c05666b5e6e
```

Findings:

- Status: 200.
- No page-level robots meta found for the sampled eligible product page.
- It appears in the sitemap.
- Product page source includes tourist-facing copy with terms that conflict with the current forbidden SEO safety list:
  - `payment`
  - `partner rate`
  - `Bókun supplier partner product database`

Readiness:

- Product pages are not ready for broad SEO review under the current tourist-facing copy rules.
- Product pages should be handled in a separate SEO/safety audit before any site-wide SEO opening.

## 4. Safety and booking-handoff audit

Chiang Mai finder safety findings:

- Recommendations are deterministic.
- Existing owner-managed profiles remain the data source for the finder experience.
- Product `1232799` remains excluded from visible Chiang Mai recommendations in the tested flow.
- CTA remains `Check availability`.
- CTA handoff remains an external booking partner URL.
- CTA rel includes `nofollow sponsored noopener noreferrer`.
- No `/api/bokun` request was observed during page load and planner interaction.
- No OpenAI/LLM request was observed.
- No form API call was observed.
- No DB write was observed from the client-side page interaction.
- No checkout/payment/booking request was observed.

Forbidden copy audit for audited pages:

| Surface | Result |
| --- | --- |
| Chiang Mai finder | Passed. No exact forbidden phrase matches found in visible text. |
| Partners | Passed. No exact forbidden phrase matches found in visible text. |
| Suppliers | Passed. No exact forbidden phrase matches found in visible text. |
| Destination partners | Passed. No exact forbidden phrase matches found in visible text. |
| Homepage | Warning. Contains `available now` in FAQ wording. |
| Product detail page source/sample | Warning/blocker for site-wide SEO. Contains `payment`, `partner rate`, and `Bókun supplier partner product database`. |

Conclusion:

- The Chiang Mai finder is safe enough for controlled single-page SEO preparation.
- The site as a whole is not ready for broad index/follow expansion.

## 5. Sitemap / robots / metadata findings

Sitemap:

- Live sitemap returns 200.
- Sitemap points to `https://www.radarscout.io` canonical URLs.
- Sitemap currently excludes the audited noindex pages.
- Sitemap includes many `/tours/...` URLs.

Robots.txt:

- Live robots.txt returns 200.
- Allows `/`.
- Disallows internal and legacy/product-marketing utility paths.
- Points to `https://www.radarscout.io/sitemap.xml`.

Metadata:

- Chiang Mai finder has unique title, description, canonical, and `noindex,nofollow`.
- B2B pages have unique title and description, and `noindex,nofollow`.
- B2B pages currently do not expose canonical links in production HTML.
- Homepage is indexable and canonicalizes to `www`.
- Sample product detail page is indexable and canonicalizes to `www`.

Key sitemap/metadata concern:

The sitemap already contains product pages that are indexable and not yet aligned with the current tourist-facing safety copy constraints. This should be addressed before any site-wide SEO push.

## 6. Indexing readiness decision

Decision: Almost ready for a single-page controlled SEO opening, but not ready for site-wide index/follow.

Rationale:

- `/chiang-mai/elephant-camp-finder` has the strongest UX, safety, metadata, and product-handoff posture.
- It remains correctly closed with `noindex,nofollow`.
- It is not currently in the sitemap.
- It does not appear to be linked from the homepage.
- Homepage and product pages still need copy/sitemap safety review before broad SEO work.
- B2B pages are useful but not yet SEO-ready.

Do not change robots yet.

## 7. Recommended pages to keep noindex

Keep these pages `noindex,nofollow` for now:

```text
/partners
/suppliers
/destination-partners
```

Reasons:

- They are static interest pages.
- They do not yet have a structured lead capture workflow.
- They need stronger B2B trust copy, contact routing, and possibly separate conversion tracking.
- They should not compete with tourist-facing experience discovery pages in the first SEO opening.

Also do not use this task to open product pages broadly:

```text
/tours/*
```

Reason:

- Sample product detail page and source copy still contain terms that conflict with the current SEO safety list.

## 8. Recommended first page to consider for index/follow

Recommended first candidate:

```text
/chiang-mai/elephant-camp-finder
```

Why:

- It is the most polished user-facing travel planning page.
- It has unique metadata.
- It has a clear H1.
- It has substantial interactive content.
- It has deterministic recommendations.
- It has safe external `Check availability` handoff.
- It does not claim live availability.
- It does not run checkout/payment/booking submission.
- It does not require an LLM.

Potential target queries:

- Chiang Mai elephant camp finder.
- Chiang Mai elephant sanctuary finder.
- Chiang Mai family elephant experience.
- Chiang Mai cooking + elephant experience.
- Chiang Mai nature day trip planner.
- Thailand experience planner.

Recommended opening style:

- Single-page controlled opening only.
- Keep B2B pages noindex.
- Do not open `/tours/*` broadly in the same task.

## 9. Required tasks before SEO opening

Required before changing `/chiang-mai/elephant-camp-finder` from `noindex,nofollow` to `index,follow`:

1. Final metadata review.
   - Confirm title and description target the intended search intent.
   - Confirm no `[object Object]` or generated metadata regressions.

2. Canonical URL review.
   - Confirm `www` canonical remains the desired canonical.
   - Confirm both root and `www` variants behave consistently.

3. Sitemap inclusion review.
   - Decide whether to add only `/chiang-mai/elephant-camp-finder`.
   - Do not add B2B pages or product pages as part of the first opening.

4. Robots.txt review.
   - Confirm no robots.txt path blocks the page.
   - Keep internal/API/dashboard disallows intact.

5. Structured data decision.
   - Decide whether to add WebPage/FAQ-style structured data later.
   - Do not add schema in the same task unless separately scoped.

6. Internal link support.
   - Add a controlled homepage or landing-page entry point before or alongside indexing.
   - Avoid broad nav changes unless explicitly approved.

7. Analytics / event tracking plan.
   - Define how to measure planner starts, planner submissions, recommendation views, and `Check availability` clicks.
   - Do not add analytics code in the readiness audit itself.

8. Forbidden copy cleanup.
   - Rewrite homepage `available now` FAQ wording.
   - Review product detail copy before any broader sitemap/indexing changes.

9. Post-index monitoring plan.
   - Prepare Search Console checks.
   - Monitor crawl/index status after controlled opening.
   - Watch for unexpected indexed pages.

## 10. Proposed next task

Recommended next task:

```text
TD-RADARSCOUT-SEO-READINESS-1-CHIANG-MAI-CONTROLLED-OPENING-PREP
```

Suggested scope:

- Prepare a small PR for a future controlled SEO opening of `/chiang-mai/elephant-camp-finder`.
- Include final metadata/canonical review.
- Add or document the exact sitemap change needed for only that page.
- Propose a minimal internal link strategy.
- Rewrite the homepage FAQ phrase `available now` to avoid the forbidden exact phrase.
- Keep `index,follow` unchanged unless the task explicitly approves the actual SEO opening.

Recommended staged opening strategy:

```text
Stage 1: Keep B2B pages noindex.
Stage 2: Prepare only /chiang-mai/elephant-camp-finder for possible index/follow.
Stage 3: Add homepage/internal link support.
Stage 4: Open index/follow only after explicit approval.
Stage 5: Monitor Search Console after indexing.
```

Stop condition:

Do not open `index,follow` until the controlled opening prep is reviewed and the user explicitly approves the implementation.
