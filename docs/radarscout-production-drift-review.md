# RadarScout production drift review

Task: `TD-RADARSCOUT-PRODUCTION-DRIFT-REVIEW-0`

Date: 2026-06-28

## 1. Purpose

This document records the current deployment drift between RadarScout production and the latest `codex/travel-mvp-launch` branch.

It is an audit-only document. It does not deploy production, change app code, open SEO indexing, touch Bókun, change database/schema/env state, or touch ThaiEleHub/Shopify files.

## 2. Current production baseline

Current production deployment observed:

```text
Deployment ID: dpl_7WhcRDAR5xAbNbppsi7tZdKrgkhs
Deployment URL: https://reddit-monitor-8s1tub2un-ouyowus-projects.vercel.app
Project: ouyowus-projects / reddit-monitor
Target: production
Primary domains:
- https://radarscout.io
- https://www.radarscout.io
```

Production was intentionally deployed from the explicitly approved merge SHA:

```text
938b1cc368f1dbd75cdbc37d6a175d3746b1df6a
```

That commit is:

```text
Merge pull request #85 from ouyowu/codex/td-homepage-finder-link-0
```

Production smoke after deployment confirmed:

- homepage loads on both primary domains;
- homepage links to `/chiang-mai/elephant-camp-finder`;
- CTA text `Plan with RadarScout` is visible;
- Chiang Mai finder loads;
- finder remains `noindex,nofollow`;
- sitemap has 4 URLs;
- `/tours/{id}` remains excluded from sitemap;
- `/chiang-mai/elephant-camp-finder` remains excluded from sitemap;
- B2B pages remain excluded from sitemap;
- no unsafe tourist-facing copy was observed;
- no Bókun API, OpenAI/LLM, checkout, payment, booking submission, DB write, schema, or env behavior was observed.

## 3. Latest branch state

Latest audited branch:

```text
origin/codex/travel-mvp-launch
```

Current branch HEAD:

```text
a1ecc8600158f71cc871ea6ac3953cc26079845d
```

That commit is:

```text
Merge pull request #97 from ouyowu/codex/td-seo-readiness-2-search-console-checklist
```

The production SHA is an ancestor of the latest branch HEAD:

```text
938b1cc368f1dbd75cdbc37d6a175d3746b1df6a -> a1ecc8600158f71cc871ea6ac3953cc26079845d
```

## 4. Drift summary

The latest branch is 24 commits ahead of the currently deployed production SHA.

Commits ahead:

```text
470e1a2 Add RadarScout analytics funnel plan
014c59b Merge pull request #86 from ouyowu/codex/td-analytics-funnel-0
ed1a51d Add RadarScout analytics instrumentation spec
c2fbbf8 Merge pull request #87 from ouyowu/codex/td-analytics-funnel-1-instrumentation-spec
550b2fc Add RadarScout partner conversion plan
1da8c36 Merge pull request #88 from ouyowu/codex/td-partner-conversion-0
1b4444c Add partner interest mailto prefill
592204a Merge pull request #89 from ouyowu/codex/td-partner-conversion-1-mailto-prefill
8cf8cac Document partner conversion next steps
5c391a1 Merge pull request #90 from ouyowu/codex/td-partner-conversion-2-docs
67a289e Document partner lead triage playbook
befbcf3 Merge pull request #91 from ouyowu/codex/td-partner-lead-triage-0
690096d Document B2B analytics plan
651dc1d Merge pull request #92 from ouyowu/codex/td-b2b-analytics-plan-0
6a46c0e Document partner static intake design
ac5238b Merge pull request #93 from ouyowu/codex/td-partner-static-intake-design-0
acf0b2d Add manual B2B inquiry expectation copy
8a13481 Merge pull request #94 from ouyowu/codex/td-partner-conversion-3-response-copy
db31ba2 Document Chiang Mai SEO controlled opening decision
8ca32a6 Merge pull request #95 from ouyowu/codex/td-seo-readiness-2-controlled-opening-decision
593374f Document Chiang Mai SEO opening preview spec
433eaa7 Merge pull request #96 from ouyowu/codex/td-seo-readiness-2-preview-spec
4df130c Document Search Console SEO opening checklist
a1ecc86 Merge pull request #97 from ouyowu/codex/td-seo-readiness-2-search-console-checklist
```

Files changed between production SHA and latest branch HEAD:

```text
apps/web/app/_components/PartnerInterestPage.tsx
apps/web/app/_components/partnerInterestContent.ts
apps/web/app/partners/__tests__/partnerPages.test.tsx
docs/radarscout-analytics-funnel-plan.md
docs/radarscout-analytics-instrumentation-spec.md
docs/radarscout-b2b-analytics-plan.md
docs/radarscout-partner-conversion-next-steps.md
docs/radarscout-partner-conversion-plan.md
docs/radarscout-partner-lead-triage-playbook.md
docs/radarscout-partner-static-intake-design.md
docs/radarscout-search-console-controlled-opening-checklist.md
docs/radarscout-seo-readiness-2-controlled-opening-decision.md
docs/radarscout-seo-readiness-2-preview-spec.md
```

## 5. Runtime impact assessment

Most drift is documentation-only and does not affect production runtime.

Runtime-affecting drift appears limited to B2B partner-page copy and tests:

- `apps/web/app/_components/PartnerInterestPage.tsx`
- `apps/web/app/_components/partnerInterestContent.ts`
- `apps/web/app/partners/__tests__/partnerPages.test.tsx`

The B2B runtime drift is expected to add safer manual inquiry expectation copy and mailto-oriented partner conversion framing.

No drift in this range appears to:

- open SEO indexing;
- add `/tours/{id}` to sitemap;
- add `/chiang-mai/elephant-camp-finder` to sitemap;
- add checkout/payment/cart/booking submission;
- add live availability/inventory behavior;
- call Bókun API;
- add LLM/OpenAI behavior;
- write DB or change schema/env;
- touch ThaiEleHub or Shopify.

This is an audit classification based on the changed file list and commit subjects. A catch-up deploy still requires a fresh clean worktree validation, preview smoke, and explicit production approval for the exact candidate SHA.

## 6. SEO boundary status

Current production remains conservative:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
/partners: noindex,nofollow
/suppliers: noindex,nofollow
/destination-partners: noindex,nofollow
/tours/{id}: excluded from sitemap
```

The branch drift includes SEO readiness and Search Console planning documents only. It does not implement a controlled SEO opening.

Do not change `/chiang-mai/elephant-camp-finder` to `index,follow` until the future controlled opening task is explicitly approved.

## 7. Recommended next gate

Recommended next task:

```text
TD-RADARSCOUT-PRODUCTION-DRIFT-CATCHUP-PREVIEW-0
```

Goal:

```text
Validate latest origin/codex/travel-mvp-launch at a1ecc8600158f71cc871ea6ac3953cc26079845d from a fresh clean worktree, create a preview deployment only, smoke-test homepage, Chiang Mai finder, B2B pages, sitemap, robots, and safety copy, then stop and report.
```

This should not production deploy.

If the preview passes, a separate production approval gate can decide whether to deploy:

```text
a1ecc8600158f71cc871ea6ac3953cc26079845d
```

## 8. Required catch-up preview checks

For the future catch-up preview task, run:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- homepageCopy
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test -- partners
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

Preview smoke should verify:

- homepage loads;
- homepage finder CTA remains visible;
- Chiang Mai finder loads;
- finder remains `noindex,nofollow`;
- B2B pages remain `noindex,nofollow`;
- sitemap remains 4 safe URLs unless a later approved task changes that;
- `/tours/{id}` remains absent from sitemap;
- `/chiang-mai/elephant-camp-finder` remains absent from sitemap;
- B2B pages remain absent from sitemap;
- partner pages show safe manual inquiry expectation copy;
- CTA and mailto behavior remain static;
- no login, portal, dashboard, backend form, CRM, checkout, payment, booking submission, live availability, inventory, Bókun API, DB write, schema, env, LLM/OpenAI, ThaiEleHub, or Shopify behavior is introduced.

## 9. Production deploy gate

Do not production deploy this drift catch-up automatically.

Production deployment should require an explicit approval such as:

```text
Approve TD-DEPLOY-PRODUCTION-DRIFT-CATCHUP for merge SHA a1ecc8600158f71cc871ea6ac3953cc26079845d
```

If the branch moves again before approval, repeat this drift review or update the approved SHA.

## 10. Current blocker status

No implementation blocker is present.

The only gate is approval sequencing:

- preview validation is recommended next;
- production deploy must remain explicitly approved by SHA.
