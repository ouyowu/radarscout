# RadarScout AI trip planner results UX audit

Task: `TD-RADARSCOUT-AI-TRIP-PLANNER-RESULTS-UX-AUDIT-0`

Date: 2026-07-06

## 1. Scope

This was a read-only production and clean-preview observation of the RadarScout AI trip planner path.

Checked product path:

```text
Homepage
  -> /ai-trip-planner
  -> local trip intent parsing
  -> confirm trip intent
  -> /api/ai-trip/search
  -> comparison-only product result cards
  -> /tours/{id}
```

This task did not:

- modify app code;
- modify docs outside this report;
- deploy production;
- open SEO `index,follow`;
- call Bókun APIs;
- add checkout, payment, booking submission, live availability, or inventory behavior;
- write to the database;
- change Prisma schema or environment variables;
- touch ThaiEleHub or Shopify files.

## 2. Production URLs checked

| URL | Result |
| --- | --- |
| `https://radarscout.io/` | 200 |
| `https://radarscout.io/ai-trip-planner` | 200 |
| `https://radarscout.io/api/ai-trip/search` | 200 for a Chiang Mai test prompt |
| First returned `/tours/{id}` detail URL | 200 |

Production metadata checked through Vercel:

```text
Deployment ID: dpl_7B5U2ZeMAfhLQX9m2MZvZv1sbRUo
Project: reddit-monitor
Target: production
Status: READY
Aliases:
- radarscout.io
- www.radarscout.io
gitDirty: 1
Git SHA metadata: not available in deployment response
```

## 3. Homepage result

Homepage checks passed:

- page loads 200;
- browser title is `RadarScout | AI-guided Thailand Experience Planner`;
- homepage links to `/ai-trip-planner`;
- homepage links to `/chiang-mai/elephant-camp-finder`;
- no unsafe analytics, checkout, payment, live availability, or Bókun backend behavior was observed.

## 4. AI trip planner page result

AI trip planner checks passed:

- page loads 200;
- browser title is `Thailand AI Trip Planner | RadarScout`;
- robots meta remains `noindex, nofollow`;
- trip idea textarea is visible;
- `Parse trip intent` is visible;
- `Confirm trip intent` is available after parsing;
- `Search real Thailand experiences` is available after confirmation;
- mobile viewport has no horizontal overflow.

Production page copy includes current safety boundaries:

- product search is read-only;
- product results are comparison-only;
- product matching is Thailand-limited;
- non-Thailand ideas remain planning text until coverage is reviewed.

## 5. Production API result

Read-only production API check:

```http
POST https://radarscout.io/api/ai-trip/search
Content-Type: application/json

{"prompt":"Chiang Mai 3 days elephants food temples relaxed pace"}
```

Observed result:

```text
status: ok
product count: 4
destination: Chiang Mai
interests: food, temples, elephants
productRetrievalEnabled: true
itineraryGenerationEnabled: false
bookingEnabled: false
availabilityEnabled: false
first result detailHref: /tours/0a07032a-7642-438f-a242-f63508587334
```

This confirms the backend search path is working in production and remains non-booking.

## 6. Production UI flow result

Flow tested:

```text
Chiang Mai 3 days elephants food temples relaxed pace
Parse trip intent
Confirm trip intent
Search real Thailand experiences
```

Observed after waiting for the API response:

- `/api/ai-trip/search` request is sent;
- response status is 200;
- `Why these experiences match` appears;
- comparison product cards appear;
- no unsafe network requests were observed.

Important timing note:

The production search response can take about 15 seconds. Short 5-7 second smoke waits can incorrectly report that no results rendered.

## 7. Finding: product detail source context is not live on current production

Observed production issue:

- production result cards render `View details`;
- observed result card links were plain `/tours/{id}`;
- observed result card links did not include `?source=ai-trip-planner`;
- the opened tour detail page returned 200 and showed the safe no-handoff fallback;
- the opened tour detail page did not show AI trip planner return context.

Why this matters:

The current branch source contains `buildAiTripPlannerDetailHref(detailHref)` in:

```text
apps/web/app/ai-trip-planner/AiSearchProductCard.tsx
```

and current tests assert:

```text
/tours/prod_1?source=ai-trip-planner
```

Production does not appear to be serving that behavior.

Likely cause:

- production deployment is a dirty deployment with `gitDirty: 1`;
- production deployment metadata does not expose a clean Git SHA;
- production may not be aligned to the current clean `origin/codex/travel-mvp-launch` HEAD.

## 8. Clean preview check

A clean preview was created from current `origin/codex/travel-mvp-launch` HEAD:

```text
Preview URL: https://reddit-monitor-70z7kgsus-ouyowus-projects.vercel.app
Deployment ID: dpl_3sVonpKMirDTEYcKffwGsrSwYDPV
Project: ouyowus-projects / reddit-monitor
Target: preview / null
Status: READY
Production aliases: none
```

Preview build passed.

Preview is protected by Vercel SSO, so anonymous Playwright could not complete the full hydrated browser flow. `vercel curl` confirmed the preview page HTML includes the current AI trip planner safety copy.

## 9. Safety audit

Visible UI and network checks found no unsafe matches for:

- live availability;
- available now;
- instant confirmation;
- checkout;
- payment;
- booking complete;
- Bókun backend;
- Bókun database;
- Bókun-powered;
- partner rate;
- supplier net rate;
- commission.

Network audit:

- no `/api/bokun`;
- no OpenAI/LLM request;
- no checkout/payment/booking submission request;
- no DB write behavior observed from the browser flow.

## 10. UX findings

What works:

- homepage-to-planner entry exists;
- the AI trip planner explains read-only product matching;
- the confirm-then-search flow works;
- result summary and comparison cards render after a successful API response;
- product detail pages preserve the safe no-handoff fallback where no verified handoff exists;
- mobile layout has no horizontal overflow.

What needs attention:

- search can take long enough that short smoke tests produce false negatives;
- production deployment is dirty and lacks clean Git SHA metadata;
- production result card links do not preserve `source=ai-trip-planner`, even though current source/tests expect that behavior;
- detail pages do not yet show a clear AI planner return context in the observed production flow.

## 11. Recommended next task

Recommended next task:

```text
TD-RADARSCOUT-PRODUCTION-CLEAN-HEAD-ALIGNMENT-0
```

Goal:

Confirm whether current clean `origin/codex/travel-mvp-launch` HEAD should be deployed to production to replace the dirty production deployment.

Required gate:

```text
Production deploy requires explicit approval for the exact current clean HEAD SHA.
```

Recommended validation before any approval:

- run full validation on a fresh production worktree;
- deploy a clean preview if needed;
- use an authenticated preview smoke or local production build smoke to confirm `?source=ai-trip-planner` appears on AI planner result links;
- only then request explicit production approval.

Do not write new app code until clean HEAD alignment is resolved, because the expected source-context behavior already exists in current code.

