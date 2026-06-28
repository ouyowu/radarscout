# RadarScout Search Console controlled opening checklist

Task: `TD-RADARSCOUT-SEO-READINESS-2-SEARCH-CONSOLE-CHECKLIST`

## 1. Purpose

This document defines the manual Search Console and post-index monitoring checklist for a future controlled SEO opening of:

```text
/chiang-mai/elephant-camp-finder
```

This is a planning document only.

It does not:

- change robots metadata;
- add URLs to sitemap;
- deploy production;
- call Google Search Console APIs;
- add analytics scripts;
- change app code;
- touch ThaiEleHub or Shopify.

Current intended SEO state remains:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
```

## 2. Why this checklist exists

The Chiang Mai finder is close to a controlled SEO opening, but the first opening should be reversible and observable.

Before any `index,follow` change, RadarScout needs a manual checklist for:

- ownership verification;
- URL inspection;
- sitemap decision;
- snippet safety;
- post-index monitoring;
- rollback triggers.

This reduces the risk of opening SEO and then discovering unsafe snippets, unexpected indexed routes, or stale sitemap behavior after the fact.

## 3. Scope

In scope for future Search Console monitoring:

- `https://radarscout.io/chiang-mai/elephant-camp-finder`
- `https://www.radarscout.io/chiang-mai/elephant-camp-finder`
- `https://radarscout.io/sitemap.xml`
- `https://www.radarscout.io/sitemap.xml`

Out of scope:

- B2B pages;
- `/tours/{id}`;
- site-wide SEO opening;
- product detail page SEO;
- paid search;
- analytics implementation;
- LLM/OpenAI integration;
- Bókun API, sync, edit, or backend operations.

## 4. Pre-opening ownership checks

Before changing robots, manually confirm Google Search Console access for:

```text
radarscout.io
www.radarscout.io
```

Preferred property setup:

- domain property for `radarscout.io` if available;
- URL-prefix properties for both primary variants if domain property is not available.

Record:

- property type;
- verification method;
- verified owner account;
- verification date;
- whether both `radarscout.io` and `www.radarscout.io` can be inspected.

Do not store credentials, verification tokens, or private Search Console exports in the repository.

## 5. Pre-opening URL inspection

Before implementation, manually inspect:

```text
https://radarscout.io/chiang-mai/elephant-camp-finder
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Expected before opening:

- page is reachable;
- current state reports blocked by `noindex` or not indexed because of `noindex`;
- canonical selection is understandable;
- Google can fetch the page;
- page content renders.

If Search Console reports fetch, canonical, redirect, or mobile usability problems, stop and resolve those before opening indexing.

## 6. Pre-opening page safety checks

Before changing robots, verify the rendered page still has:

- title: `Find the right Chiang Mai experience | RadarScout`;
- safe meta description;
- `Plan with RadarScout`;
- planner chips;
- suggested day summary behavior;
- recommendation cards;
- CTA: `Check availability`;
- external booking partner handoff;
- CTA `rel` includes `nofollow sponsored noopener noreferrer`;
- product `1232799` excluded.

Confirm rendered visible text does not include:

- `AI booked this`
- `live availability`
- `available now`
- `guaranteed slot`
- `instant confirmation`
- `checkout`
- `payment`
- `reservation complete`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `Bókun supplier products`
- `supplier net rate`
- `partner rate`
- `commission`
- `fake reviews`
- `fake ratings`

Docs, tests, and internal guardrail files may contain these terms. The check is for tourist-facing rendered page copy and metadata.

## 7. Sitemap decision

Recommended first opening:

```text
Change robots only.
Do not add /chiang-mai/elephant-camp-finder to sitemap yet.
```

Reason:

- the page already has a homepage entry point;
- robots-only opening is easier to roll back;
- sitemap submission can happen later after Search Console ownership and first-index monitoring are confirmed;
- keeping sitemap unchanged avoids mixing two SEO levers in the same release.

If a later task adds the finder to sitemap, it must still keep excluded:

```text
/tours/{id}
/partners
/suppliers
/destination-partners
```

## 8. Post-deploy Search Console checks

After an approved production deploy changes the finder to `index,follow`, manually inspect:

```text
https://radarscout.io/chiang-mai/elephant-camp-finder
```

Expected after opening:

- page is crawlable;
- `noindex` is no longer detected;
- Google can fetch the page;
- submitted URL or discovered URL can be requested for indexing;
- canonical points to the intended primary URL;
- page content is rendered.

Do not request indexing if the deployed page fails safety checks.

## 9. Monitoring window

Monitor for at least 7 days after opening.

Daily checks:

- indexed status;
- canonical selected by Google;
- query impressions;
- clicks;
- snippet text;
- unsafe snippet language;
- unexpected indexed pages;
- sitemap warnings;
- mobile usability warnings.

Weekly checks:

- whether search queries match Chiang Mai planning intent;
- whether snippets imply availability, booking, checkout, ratings, or confirmation;
- whether B2B pages or tour detail pages appear unexpectedly;
- whether the page needs a content or metadata adjustment before broader SEO work.

## 10. Unsafe snippet triggers

Rollback or pause indexing if snippets imply:

- live availability;
- available now;
- instant confirmation;
- guaranteed slots;
- checkout or payment on RadarScout;
- booking completion on RadarScout;
- fake ratings or reviews;
- supplier net rates;
- partner rates;
- commission terms;
- Bókun backend, database, or powered-by claims.

Also roll back if Google indexes:

- `/partners`;
- `/suppliers`;
- `/destination-partners`;
- `/tours/{id}` because of sitemap or internal-link behavior.

## 11. Rollback path

If rollback is required:

1. Revert finder robots to:

   ```text
   noindex,nofollow
   ```

2. Keep `/tours/{id}` out of sitemap.
3. Remove finder from sitemap if it was added.
4. Deploy from a clean worktree after explicit approval.
5. Confirm production source includes `noindex,nofollow`.
6. Use Search Console URL Inspection to request recrawl.
7. Monitor until the unsafe indexed state clears.

## 12. Manual tracking template

Use a private spreadsheet or manual notes outside the repo.

Suggested fields:

| Field | Example |
| --- | --- |
| Date | `2026-06-28` |
| URL | `/chiang-mai/elephant-camp-finder` |
| Robots state | `index,follow` |
| Sitemap state | `not in sitemap` |
| Inspection result | `URL can be indexed` |
| Canonical selected | `https://radarscout.io/chiang-mai/elephant-camp-finder` |
| Indexed status | `not indexed / indexed` |
| Unsafe snippet? | `no` |
| Notes | `No availability or booking claims shown` |

Do not store Search Console credentials, screenshots with private account data, or exported query files in the repo.

## 13. Recommended next task

If the user explicitly approves SEO opening:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

Recommended first implementation remains:

```text
Robots-only opening for /chiang-mai/elephant-camp-finder.
Do not add the finder to sitemap in the same task.
```

Production deployment remains a separate explicit approval gate.
