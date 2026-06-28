# RadarScout SEO readiness 2 preview spec

Task: `TD-RADARSCOUT-SEO-READINESS-2-PREVIEW-SPEC`

## 1. Purpose

This document defines the exact implementation and verification plan for a future controlled SEO opening of:

```text
/chiang-mai/elephant-camp-finder
```

This task does not open indexing.

Current intended state remains:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
```

The purpose is to make the next implementation task small, testable, reversible, and clearly separated from broad site-wide SEO work.

## 2. Current baseline

The current production and branch baseline is:

- Homepage links to `/chiang-mai/elephant-camp-finder`.
- The Chiang Mai finder is live and returns 200.
- The Chiang Mai finder remains `noindex,nofollow`.
- B2B pages remain `noindex,nofollow`.
- `/tours/{id}` URLs are excluded from sitemap.
- The sitemap contains only the currently intended safe static URLs.
- The finder keeps deterministic planning, recommendation cards, and external booking partner handoff.

Related documents:

- `docs/radarscout-seo-readiness-audit.md`
- `docs/radarscout-seo-controlled-opening-prep.md`
- `docs/radarscout-sitemap-safety-audit.md`
- `docs/radarscout-seo-readiness-2-controlled-opening-decision.md`

## 3. Future implementation task

Recommended future implementation task:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

That task must require explicit approval before changing robots from:

```text
noindex,nofollow
```

to:

```text
index,follow
```

The approval should name the exact merge SHA being deployed.

## 4. Allowed implementation scope

The future implementation task may change only:

```text
apps/web/app/chiang-mai/elephant-camp-finder/page.tsx
apps/web/app/sitemap.ts
apps/web/app/__tests__/sitemap.test.ts
apps/web/app/chiang-mai/elephant-camp-finder/__tests__/metadata.test.ts
```

Allowed changes:

- Change only the Chiang Mai finder robots metadata to `index,follow`.
- Add the Chiang Mai finder to sitemap only if the implementation task explicitly includes sitemap inclusion.
- Add or update tests that prove the opening is limited to the Chiang Mai finder.
- Preserve existing title and description unless a separately scoped copy change is approved.

If sitemap inclusion is not explicitly approved, the future task should change robots only and leave sitemap unchanged.

## 5. Out of scope

The future implementation task must not:

- open site-wide indexing;
- make `/partners`, `/suppliers`, or `/destination-partners` indexable;
- add B2B pages to sitemap;
- re-add `/tours/{id}` to sitemap;
- delete or change `/tours/{id}` routes;
- change recommendation scoring;
- change product/profile data;
- change Bókun widget URLs;
- call Bókun API;
- add checkout, payment, cart, booking submission, booking confirmation, inventory, or live availability behavior;
- add LLM/OpenAI integration;
- write DB;
- change Prisma schema;
- change environment variables;
- touch ThaiEleHub files;
- run Shopify commands.

## 6. Exact code checklist for future opening

### Step 1: Metadata change

Inspect:

```text
apps/web/app/chiang-mai/elephant-camp-finder/page.tsx
```

Expected current metadata:

```ts
robots: {
  index: false,
  follow: false,
}
```

Future controlled opening change:

```ts
robots: {
  index: true,
  follow: true,
}
```

Do not change B2B page metadata.

### Step 2: Sitemap decision

Inspect:

```text
apps/web/app/sitemap.ts
```

If sitemap inclusion is approved, add exactly:

```text
https://www.radarscout.io/chiang-mai/elephant-camp-finder
```

Keep excluded:

```text
/tours/{id}
/partners
/suppliers
/destination-partners
```

If sitemap inclusion is not approved, leave `sitemap.ts` unchanged.

### Step 3: Tests

Update tests so they prove the opening is narrow.

Required tests:

- Chiang Mai finder metadata is `index,follow`.
- Homepage still links to `/chiang-mai/elephant-camp-finder`.
- B2B pages remain `noindex,nofollow`.
- `/tours/{id}` remains excluded from sitemap.
- B2B pages remain excluded from sitemap.
- Chiang Mai finder sitemap inclusion matches the approved implementation scope.
- Finder visible copy has no forbidden booking, availability, payment, rating, rate, or Bókun-backend wording.
- CTA remains `Check availability`.
- CTA handoff remains external booking partner URL.
- CTA `rel` remains `nofollow sponsored noopener noreferrer`.
- Product `1232799` remains excluded from Chiang Mai recommendations.

## 7. Preview validation checklist

After opening implementation is merged to a preview branch, run:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- elephant
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

Preview smoke must check:

- `/chiang-mai/elephant-camp-finder` returns 200.
- Browser title remains `Find the right Chiang Mai experience | RadarScout`.
- Robots is `index,follow` only if that task explicitly approved opening.
- Homepage still returns 200 and links to the finder.
- B2B pages remain `noindex,nofollow`.
- `/sitemap.xml` returns 200.
- `/tours/{id}` entries remain absent from sitemap.
- B2B pages remain absent from sitemap.
- Finder recommendation cards render.
- CTA remains `Check availability`.
- CTA handoff remains external booking partner URL.
- No `/api/bokun`, OpenAI/LLM, checkout/payment/booking, or DB-write behavior appears in network checks.

## 8. Production deployment checklist

Production deployment must be a separate task.

Required approval format:

```text
Approve TD-DEPLOY-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING-PRODUCTION for merge SHA <sha>
```

Production deploy requirements:

- fresh clean worktree under `/private/tmp`;
- HEAD exactly equals the approved merge SHA;
- full validation passes before deploy;
- deploy only to `ouyowus-projects / reddit-monitor`;
- use `npx vercel --prod --yes`;
- verify production aliases are `radarscout.io` and `www.radarscout.io`;
- smoke both primary domains after deploy.

Do not deploy from:

```text
/Users/ouyowu/reddit-monitor
```

## 9. Post-production observation

After production deploy, observe:

- `https://radarscout.io/chiang-mai/elephant-camp-finder`
- `https://www.radarscout.io/chiang-mai/elephant-camp-finder`
- `https://radarscout.io/sitemap.xml`
- `https://www.radarscout.io/sitemap.xml`

Check:

- page returns 200;
- robots state matches the approved opening;
- sitemap state matches the approved opening;
- homepage entry remains visible;
- CTA/handoff remains safe;
- no unsafe copy appears;
- no unsafe network/API behavior appears.

Search Console follow-up is manual unless a later task explicitly scopes it.

## 10. Forbidden visible wording

The future opening task must confirm the finder does not show:

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

These terms may exist in docs, tests, or internal implementation guardrails, but they must not appear as tourist-facing visible finder copy.

## 11. Rollback checklist

Rollback trigger examples:

- incorrect page indexed;
- B2B page indexed;
- `/tours/{id}` reappears in sitemap;
- unsafe snippet appears;
- finder exposes unsafe booking, payment, availability, rating, rate, or Bókun-backend wording;
- unexpected API, DB, Bókun, or LLM behavior appears.

Rollback steps:

1. Revert the finder robots metadata to `noindex,nofollow`.
2. Remove finder from sitemap if it was added.
3. Deploy rollback from a fresh clean worktree.
4. Confirm production source contains `noindex,nofollow`.
5. Confirm sitemap is back to safe state.
6. Request recrawl in Search Console manually.

## 12. Recommended next task

If the user wants to proceed with implementation:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING
```

Recommended first implementation choice:

```text
Change robots for /chiang-mai/elephant-camp-finder only.
Do not add it to sitemap until Search Console ownership and post-index monitoring are confirmed.
```

This keeps the first SEO opening reversible and avoids combining robots changes with sitemap submission in one step.
