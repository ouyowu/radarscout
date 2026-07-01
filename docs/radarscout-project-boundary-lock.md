# RadarScout project boundary lock

## Status

Active and enforced for future RadarScout work.

## Purpose

This document locks the project boundary between RadarScout and ThaiEleHub so future tasks do not mix code, content, deployments, or product assumptions.

RadarScout work must happen in the RadarScout repository only:

```text
/Users/ouyowu/reddit-monitor
```

ThaiEleHub work must not happen unless the user explicitly names ThaiEleHub or `thaielehub.com`.

## 1. RadarScout identity

RadarScout production domains:

```text
https://radarscout.io
https://www.radarscout.io
```

RadarScout repository:

```text
/Users/ouyowu/reddit-monitor
```

Primary working branch:

```text
codex/travel-mvp-launch
```

Hosting:

```text
Vercel project: ouyowus-projects / reddit-monitor
```

RadarScout product direction:

```text
AI-guided Thailand trip planner
Bókun / booking partner handoff
partner and supplier workflow
travel product discovery and recommendation
```

RadarScout owns:

- AI-guided discovery.
- Deterministic trip planning UI.
- Structured itinerary draft.
- Experience recommendation.
- Bókun product enrichment workflow when explicitly approved.
- Partner and supplier lead pages.
- Safe booking partner handoff.

RadarScout can continue work on:

- `/ai-trip-planner`
- `/chiang-mai/elephant-camp-finder`
- Chiang Mai planner and itinerary summary.
- Thailand-wide trip planner UX.
- Bókun-backed product discovery and handoff.
- RadarScout partner / supplier / destination partner pages.
- RadarScout preview and production deployment on Vercel.

## 2. ThaiEleHub identity

ThaiEleHub production domain:

```text
https://thaielehub.com
```

ThaiEleHub Shopify theme directory:

```text
/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-advenx-demo
```

ThaiEleHub product direction:

```text
Shopify elephant sanctuary SEO/GEO content site
```

ThaiEleHub work includes:

- Shopify Liquid theme edits.
- Shopify SEO landing pages.
- llms.txt for ThaiEleHub.
- ThaiEleHub schema snippets.
- ThaiEleHub product or collection page content.
- Shopify theme pushes.

ThaiEleHub is paused unless explicitly requested.

## 3. Hard separation rule

If the user says any of the following:

```text
RadarScout
radarscout.io
AI trip planner
Bókun backend
Bókun handoff
travel MVP
Chiang Mai finder
partner pages
supplier pages
Vercel preview
```

then the agent must treat the task as RadarScout work and use:

```text
/Users/ouyowu/reddit-monitor
```

The agent must not modify:

```text
/Users/ouyowu/Documents/大象营网站项目thaielehub/shopify-theme-advenx-demo
```

If the user says any of the following:

```text
ThaiEleHub
thaielehub.com
Shopify
theme
elephant sanctuary SEO
llms.txt for ThaiEleHub
ThaiEleHub collection
ThaiEleHub product page
```

then the agent must treat the task as ThaiEleHub work and must not modify RadarScout application code.

When the user says only "AI trip planner", default to RadarScout.

## 4. RadarScout safety gates

Do not do these in RadarScout without explicit user approval:

- Production deploy.
- SEO `index,follow` opening.
- Homepage, nav, or sitemap changes.
- Bókun API calls.
- Bókun product edits.
- Bókun sync.
- DB writes.
- Prisma schema changes.
- Environment variable changes.
- LLM/OpenAI integration.
- Login/account system.
- Agent portal.
- Supplier dashboard.
- Checkout/payment/cart.
- Booking submission.
- Live availability or inventory behavior.

Allowed RadarScout wording:

- Plan with RadarScout
- AI-guided discovery
- guided planning
- trusted local experiences
- booking partner
- partner-direct handoff
- Check availability
- Continue with booking partner
- See matching experiences

Forbidden RadarScout tourist-facing wording:

- AI booked this
- live availability
- available now
- guaranteed slot
- instant confirmation
- checkout
- payment
- reservation complete
- Bókun backend
- Bókun database
- Bókun-powered
- Bókun supplier products
- supplier net rate
- partner rate
- commission
- fake reviews
- fake ratings

## 5. ThaiEleHub safety gates

Do not do these in ThaiEleHub unless explicitly requested:

- Modify Shopify theme code.
- Push live theme.
- Change product prices.
- Change product URLs.
- Change collection URLs.
- Change checkout/cart/payment behavior.
- Change booking widgets.
- Add external scripts.
- Invent awards, reviews, or ratings.
- Claim guaranteed availability.
- Claim instant confirmation unless verified by product flow.
- Make medical or safety guarantees.
- Make wild animal contact guarantees.
- Mention Bókun backend/database/powered-by.

## 6. Current RadarScout state

Current known RadarScout production baseline:

```text
Production HEAD: 6ee46bb2ccdb123fd8be6589e6391b7e3e769bd2
Chat Planner 1A: live
SEO: still noindex,nofollow
```

Latest RadarScout merged candidate verified by clean preview:

```text
Feature: Chat Planner 2 deterministic itinerary summary
HEAD: d8fae814b8aed9e7a54a311575bfd49c3c575bbf
Preview URL: https://reddit-monitor-3xp03jscg-ouyowus-projects.vercel.app
Deployment ID: dpl_AkmaRFggZTvVyttnMSMeHFLKcDyB
Preview smoke: passed
Production deploy: not yet approved / not yet run
```

Recommended next RadarScout task:

```text
TD-DEPLOY-CHAT-PLANNER-2-PRODUCTION
```

Only run this after explicit production approval for:

```text
d8fae814b8aed9e7a54a311575bfd49c3c575bbf
```

## 7. Current ThaiEleHub state

ThaiEleHub work is paused.

Do not continue ThaiEleHub theme/code tasks unless the user explicitly says ThaiEleHub.

Known ThaiEleHub blocker:

```text
URL: https://thaielehub.com/pages/pattaya-elephant-sanctuary-day-trip
Status: 404 unless manually created in Shopify Admin
Action: do not continue Pattaya implementation until it returns 200
```

## 8. Recovery rule if projects get mixed again

If a future request appears to mix RadarScout and ThaiEleHub:

1. Stop before editing.
2. State which project the request appears to target.
3. Ask for confirmation only if the target cannot be inferred.
4. Do not copy code between projects.
5. Do not deploy either project until the correct target is confirmed.

If the task is about AI trip planning, Bókun handoff, or radarscout.io, assume RadarScout.

If the task is about Shopify SEO pages or thaielehub.com, assume ThaiEleHub.

## 9. What to clean up later

There may be ThaiEleHub planning artifacts inside the RadarScout repository from the prior mistaken workstream.

Future cleanup task:

```text
TD-RADARSCOUT-CLEANUP-THAIELEHUB-ARTIFACTS
```

Suggested scope:

- Identify ThaiEleHub-only docs inside `/Users/ouyowu/reddit-monitor/docs`.
- Move or remove them only after explicit approval.
- Do not touch RadarScout docs.
- Do not touch ThaiEleHub theme.
