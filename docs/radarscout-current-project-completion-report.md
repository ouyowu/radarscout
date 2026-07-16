# RadarScout — Current Product Completion Report

**Purpose:** provide one current, evidence-based brief for an independent Claude Code review. This is not a release plan and does not authorize new production changes.

**Verified:** 2026-07-16 (Asia/Bangkok)  
**Production domain:** https://radarscout.io  
**Current development baseline:** \`codex/travel-mvp-launch\` at \`ef651c5ea62fa06c2b719fafc06214d45c546fb7\`  
**Production deployment:** \`dpl_5mxVYaJfNLrAeJK2r9Y8rLco8bEH\`

## 1. Executive summary

RadarScout is now a live, early-stage Thailand day-trip discovery product. A traveler can:

1. enter a Thailand trip idea;
2. use the guided Planner Studio or the trip-planner flow;
3. receive deterministic recommendations from a reviewed catalog;
4. open a reviewed experience; and
5. continue through a clearly labelled external **Check availability** affiliate handoff.

The live public catalog currently contains **71 manually reviewed Viator Thailand day-trip products**. It is useful enough for a closed-beta style validation of discovery, result relevance, and handoff clicks. It is **not** yet a complete Thailand travel marketplace: coverage is limited, inventory and prices are not live, and there is no native payment or booking confirmation.

The product should be evaluated as a **live MVP / closed-beta discovery funnel**, rather than as a finished all-Thailand travel platform.

## 2. What is live and verified

### Public entry points

| Surface | Status | Current role |
| --- | --- | --- |
| \`/\` | 200 | Main RadarScout entry point. |
| \`/planner\` | 200, \`noindex,nofollow\` | Guided Planner Studio for a multi-day Thailand route concept and recommended day experiences. |
| \`/ai-trip-planner\` | 200 | Guided Thailand trip-planning and result flow. |
| \`/chiang-mai/elephant-camp-finder\` | sitemap-listed | Existing focused Chiang Mai finder. |

Production verification on 2026-07-16 confirmed that \`radarscout.io\` and \`www.radarscout.io\` point to deployment \`dpl_5mxVYaJfNLrAeJK2r9Y8rLco8bEH\`.

### Planner and recommendation flow

- The Planner Studio renders and is deliberately not indexable.
- Planner/search results currently use the reviewed **Viator-only** catalog.
- A production query for “Bangkok floating market food day trip” returned six Viator handoffs and no Bókun URL.
- The newly reviewed Batch 2 product **Bangkok: Floating Market and Train Market Experience** was returned by the live search.
- Result cards keep the external CTA label **Check availability** and use \`rel="nofollow sponsored noopener noreferrer"\`.

### Public data safety

The public static product representation intentionally contains only:

- internal public id;
- city and destination id;
- Viator product code;
- reviewed title and short summary;
- curated tags;
- Viator affiliate product URL;
- image URL;
- review timestamp.

It intentionally does **not** expose:

- live or cached price;
- availability or inventory;
- commission, net rate, partner rate, or supplier fields;
- ratings or reviews;
- raw Viator response objects;
- booking questions;
- API keys or provider credentials.

The shared handoff helper rejects non-HTTPS URLs and always creates a handoff with a fixed \`Check availability\` label and sponsored/nofollow relationship. The reviewed Viator seed tests also require a Viator product URL.

### Search and indexing state

\`/robots.txt\` currently allows the public site but disallows API, authentication, dashboard, demo, pricing, and legacy tool paths. The current sitemap contains only:

1. \`/\`
2. \`/chiang-mai/elephant-camp-finder\`
3. \`/contact\`
4. \`/privacy-policy\`
5. \`/terms-of-service\`

\`/planner\` is confirmed \`noindex,nofollow\` and is absent from the sitemap.

## 3. Catalog status

### Approved public catalog

| Source | Products | Status |
| --- | ---: | --- |
| Earlier reviewed Viator seed | 16 | Live |
| Viator Thailand Batch 2 | 55 | Live |
| **Total public reviewed Viator catalog** | **71** | **Live** |

Batch 2 added products across Bangkok, Chiang Mai, Phuket, Krabi, Pattaya, and Koh Samui. The review process excluded 29 of 100 candidates because they were airport/transfer-only, seasonal, multi-day, cruise-port-specific, open-ended transport, or required independent animal-welfare evidence before public use.

### Provider model

- Viator Basic production access is used for **read-only curation and review**, not for a public runtime API proxy.
- Public product discovery currently reads a static, reviewed seed in the application.
- This keeps visitor requests independent of provider API latency, API quota, upstream price changes, and accidental raw-field exposure.
- Every future product batch must remain private until it passes the same human review and safe-public-seed process.

### Bókun status

The public Planner is intentionally **Viator-only**. Bókun products are not returned in current Planner search results.

The repository still contains legacy Bókun-related code and routes. That is not proof that Bókun is part of the current public Planner. An independent review should nevertheless inspect every public Bókun endpoint for authorization, commercial-field exposure, and whether it is still necessary.

## 4. Booking and commercial boundaries

RadarScout does not currently operate as the merchant of record.

The intended traveler path is:

~~~text
Trip idea → Planner/search → reviewed result card → Check availability → Viator affiliate destination
~~~

Current boundaries:

- no RadarScout cart;
- no RadarScout checkout;
- no RadarScout payment collection;
- no booking confirmation claim;
- no live availability claim;
- no runtime price comparison promise;
- no automatic booking or inventory sync.

This is appropriate for the present affiliate/discovery model. It should be communicated plainly in the public UX and preserved during future frontend work.

## 5. Architecture snapshot

### Core public paths to review

| Area | Key paths |
| --- | --- |
| Planner UI | \`apps/web/app/planner/\`, \`apps/web/app/ai-trip-planner/\` |
| Deterministic search route | \`apps/web/app/api/ai-trip/search/\` |
| Reviewed Viator catalog | \`apps/web/lib/viator/reviewedViatorProducts.ts\` |
| Batch 2 public seed | \`apps/web/lib/viator/reviewedViatorBatch2Products.ts\` |
| Viator matching | \`apps/web/lib/viator/\` |
| Public product filtering | \`apps/web/lib/publicProducts/\` |
| Handoff validation | \`apps/web/lib/publicProducts/bookingPartnerHandoff.ts\` |
| Public tour routes | \`apps/web/app/tours/\` |

### Deliberately disabled or bounded capabilities

- The optional AI narration endpoint exists, but its paid model capability is intended to remain disabled unless a server-side key is deliberately configured later.
- No LLM call is required for the ordinary Planner/search/recommendation path.
- The current Viator catalog is static at runtime rather than automatically syncing provider content to the public website.

## 6. Validation already completed for the latest catalog release

For merge \`ef651c5\`, the post-merge verification completed successfully:

- Prisma client generation;
- Vitest: **91 test files / 1,096 tests passed**;
- TypeScript \`--noEmit\`;
- Next.js production build;
- \`git diff --check\`;
- production deployment;
- production HTTP checks for home, Planner Studio, and AI trip planner;
- live Bangkok result query confirming Viator-only handoff and no commercial/raw field markers.

This validates the release mechanics and core safe-handoff behavior. It does **not** prove real traveler demand, booking conversion, provider terms compliance beyond the existing implementation, or comprehensive Thailand coverage.

## 7. Open product gaps

### P0 — audit before broadening traffic or catalog

1. **Legacy public APIs:** audit all public API routes, especially legacy Bókun and Stripe-related routes, for unauthenticated access, raw commercial data, and accidental product-flow exposure.
2. **Provider-license compliance:** verify the exact Viator Affiliate/API content-display, image, caching, attribution, and deep-link requirements against the active affiliate agreement and API documentation.
3. **Affiliate URL integrity:** verify every reviewed seed URL includes the correct affiliate identifier and reaches an appropriate Viator product page.

### P1 — improve the live MVP based on evidence

1. Collect real traveler sessions and measure the funnel:
   - homepage/planner entry;
   - completed search;
   - result-card visibility;
   - **Check availability** click.
2. Validate result relevance with real traveler prompts before more ranking changes.
3. Expand the catalog city by city only through the private candidate → human review → public static seed workflow.
4. Complete a consistent visual experience across homepage, planner/listing, and tour detail pages without adding checkout or price/availability claims.

### P2 — later, only if product evidence supports it

1. Controlled SEO expansion beyond the existing indexable surfaces.
2. A real-time provider integration, only after a separate product, commercial, and security decision.
3. Optional paid LLM narration, only with a spending cap, abuse protection, truthful public copy, and explicit approval.

## 8. Current non-blocking GitHub items

At the time of this report, two older PRs remain open against \`codex/travel-mvp-launch\`:

| PR | Subject | Review stance |
| --- | --- | --- |
| #482 | Status-document hygiene | Not a prerequisite for the live product. Avoid letting it create more status-document churn. |
| #486 | Reviewed partner-product matching quality | Not a prerequisite for the Viator-only production flow. Reassess against real traveler search behavior before merging. |

Neither PR should be treated as an automatic dependency of the current production release.

## 9. Requested independent Claude Code review

Please review the current \`codex/travel-mvp-launch\` at:

~~~text
ef651c5ea62fa06c2b719fafc06214d45c546fb7
~~~

Answer these questions with direct code evidence:

1. Can any public route expose Viator or Bókun commercial/private fields, raw provider payloads, API keys, or internal review data?
2. Is the public Planner truly Viator-only in every normal user path, with no legacy Bókun fallback?
3. Are all public handoffs limited to safe external affiliate links, with no RadarScout checkout, payment, inventory, or confirmation behavior?
4. Does the product review gate fail closed if a product lacks a verified safe public handoff?
5. Are legacy APIs, Stripe routes, Bókun routes, and internal review routes correctly access-controlled or clearly isolated from the public product path?
6. Is the Viator static seed validation sufficient to prevent forbidden fields and malformed/out-of-scope URLs?
7. Are the index/noindex and sitemap decisions internally consistent?
8. What are the three highest-leverage product changes after security/compliance findings are resolved?

Suggested verification commands:

~~~bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
~~~

## 10. Review conclusion

RadarScout has crossed the important threshold from a prototype to a live, safe affiliate-discovery MVP:

- there is a real visitor flow;
- there is a real, reviewed Thailand product catalog;
- there are real provider handoffs;
- the public Planner is not dependent on a paid LLM;
- the latest catalog is live in production.

The principal unfinished work is not “more infrastructure.” It is:

1. independently auditing the public/legacy API surface and provider-license compliance;
2. obtaining real traveler behavior data;
3. improving relevance and catalog coverage from that evidence; and
4. finishing a consistent conversion-focused frontend.

Do not treat a larger catalog, SEO expansion, or a real-time provider sync as substitutes for these validation steps.
