# RadarScout supplier public link CTA production readiness

Task: `TD-RADARSCOUT-SUPPLIER-PUBLIC-LINK-REQUEST-CTA-PRODUCTION-READINESS`

## 1. Purpose

Record the production readiness checklist for the supplier public link request CTA added to the RadarScout supplier interest page.

This document is docs-only. It does not change app code, route behavior, sitemap output, robots metadata, product data, database schema, environment variables, Bókun behavior, checkout behavior, deployment state, or ThaiEleHub/Shopify files.

## 2. Current merged candidate

Merged candidate:

```text
PR #121
Title: Add supplier public link request CTA
Merge SHA: ed9990f9716e4d429b2c44852dc5807497ab1227
Preview deployment: dpl_6Ph2BMfhTnidEJbvHTcKh2Gp3cQp
Preview URL: https://reddit-monitor-bhd1pgk3u-ouyowus-projects.vercel.app
Preview target: null
Production deploy: not approved
```

Feature scope:

- add a supplier-only public link check section on `/suppliers`;
- collect interest through `mailto:hello@radarscout.io`;
- ask for a public traveler-facing URL;
- keep the link collection manual;
- keep Source 2 implementation blocked until a URL is manually approved.

## 3. Expected visible copy

The `/suppliers` page should show:

```text
Public link check
Send the traveler-facing page you want RadarScout to check.
Operators can share a public product page or booking partner page for a manual handoff check. RadarScout checks the link before using it in any recommendation.
Submit public link for check
```

Expected requested fields in the mailto body:

```text
Public traveler-facing URL:
Experience name and destination:
Operator public name:
Contact person for link check:
```

## 4. Required safety behavior

The supplier public link request CTA must remain:

- mailto-only;
- manual-intake only;
- no backend form;
- no `/api/` call;
- no DB write;
- no CRM or email service dependency;
- no automatic URL approval;
- no product-specific public handoff rendering;
- no Bókun API, edit, or sync behavior;
- no checkout, payment, cart, booking submission, or confirmation behavior;
- no live availability or inventory behavior.

## 5. SEO and routing constraints

The production deploy must not change these SEO and routing gates:

```text
/suppliers robots: noindex,nofollow
/partners robots: noindex,nofollow
/destination-partners robots: noindex,nofollow
/chiang-mai/elephant-camp-finder robots: noindex,nofollow
/tours/{id}: excluded from sitemap
SEO index/follow: not opened
```

Do not add the supplier page CTA to sitemap logic. Do not re-add unsafe tour detail URLs to sitemap.

## 6. Forbidden public copy audit

Search `/suppliers` visible UI and rendered HTML for these terms before and after production deploy:

```text
live availability
available now
instant confirmation
guaranteed slot
checkout
payment
booking complete
reservation complete
Bókun backend
Bókun database
Bókun-powered
partner rate
supplier net rate
commission
reviews
ratings
```

Expected result:

```text
0 unsafe matches in public supplier CTA copy
```

The word `check` is intentional. Do not replace it with `review` in this public UI because existing tests intentionally block `review` / `reviews` style wording on B2B pages.

## 7. Pre-production validation

Before production deploy, run from a fresh clean worktree at:

```text
ed9990f9716e4d429b2c44852dc5807497ab1227
```

Required commands:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- partners
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

Expected:

- Prisma generate passes;
- partner page tests pass;
- sitemap tests pass;
- SEO tests pass;
- full Vitest passes;
- Playwright passes;
- TypeScript passes;
- Next build passes;
- worktree remains clean.

## 8. Production deploy command

Only run this after explicit human approval:

```bash
npx vercel --prod --yes
```

Do not use production deploy as a substitute for:

- Source 2 URL review;
- Preview database configuration;
- SEO index/follow opening;
- Bókun API integration;
- checkout/payment behavior.

## 9. Post-production smoke checklist

After production deploy, check:

```text
https://radarscout.io/suppliers
https://www.radarscout.io/suppliers
```

Required smoke:

- page returns 200;
- title is `Suppliers | RadarScout`;
- robots remains `noindex,nofollow`;
- `Public link check` is visible;
- `Send the traveler-facing page you want RadarScout to check.` is visible;
- `Submit public link for check` is visible;
- CTA is `mailto:hello@radarscout.io`;
- mailto body includes `Public traveler-facing URL:`;
- no `<form>` tag is introduced;
- no `/api/` action is introduced;
- no forbidden public copy appears;
- `/partners` and `/destination-partners` still load and remain noindex/nofollow;
- `/sitemap.xml` still excludes `/tours/{id}`;
- no production page claims live availability, checkout, payment, booking completion, or confirmation.

## 10. Source 2 gate remains separate

This feature only makes it easier for suppliers to send a candidate public URL.

It does not approve any URL and does not implement:

```text
operator_verified_public_link
```

Source 2 implementation remains blocked until at least one real public URL passes the intake checklist in:

```text
docs/radarscout-operator-handoff-intake-form.md
docs/radarscout-operator-handoff-url-collection.md
```

## 11. Recommended next action

If production deployment is desired, use this explicit approval format:

```text
Approve TD-DEPLOY-SUPPLIER-PUBLIC-LINK-REQUEST-CTA-PRODUCTION for merge SHA ed9990f9716e4d429b2c44852dc5807497ab1227
```

If production deployment is not desired yet, continue with another non-production RadarScout task.
