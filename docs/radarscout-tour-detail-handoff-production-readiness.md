# RadarScout tour detail handoff production readiness

Task: `TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-PRODUCTION-READINESS-0`

## 1. Current state

The verified tour detail handoff UI has been merged into:

```text
Branch: codex/travel-mvp-launch
Merge SHA: 9dc156448d4b5ebbf418359ef234af97f478a57e
PR: #114 Add verified tour detail handoff CTA
```

The merged feature:

- extends public Thailand product detail with optional `bookingPartnerHandoff`;
- resolves the first safe handoff source from `BokunProduct.bokunActivityId` to `ownerManagedBokunProfiles[].bookingHandoffUrl`;
- validates the public handoff URL through `resolveOwnerManagedProfileHandoff`;
- renders `Check availability` on `/tours/{id}` only when a verified handoff exists;
- keeps products without a verified handoff on product-detail/planning copy only;
- keeps `/tours/{id}` out of `sitemap.xml`;
- keeps tour detail pages `noindex,nofollow`;
- does not call Bókun API;
- does not add checkout, payment, booking submission, inventory, or live availability behavior.

## 2. Validation already completed

Post-merge preview validation passed from a clean worktree:

```text
Worktree: /private/tmp/radarscout-tour-detail-handoff-ui-1-postmerge-preview
Preview deployment: dpl_HGC8XidKTmnZNH7hnRoVMDxUJ3JT
Preview URL: https://reddit-monitor-leosz4ywk-ouyowus-projects.vercel.app
Vercel project: ouyowus-projects / reddit-monitor
Target: preview / null
Deployment commit: 9dc156448d4b5ebbf418359ef234af97f478a57e
```

Checks passed:

- Prisma generate;
- focused public product tests;
- focused tour page tests;
- full Vitest suite;
- Playwright E2E suite;
- TypeScript;
- Next build;
- `git diff --check`;
- preview `/tours/1232729` loads a safe unavailable state;
- preview `sitemap.xml` still contains only safe non-tour URLs.

## 3. Known preview smoke limitation

The Vercel Preview environment currently has no usable public product data for DB-backed product smoke.

Observed preview behavior:

```text
/api/products -> products: []
/api/products -> PRODUCTS_UNAVAILABLE
```

Because preview has no public products, the verified handoff CTA cannot be proven through live preview data.

The verified CTA behavior is instead covered by unit/render tests:

- `getPublicThailandProduct` includes a verified owner-managed handoff only when `bokunActivityId` matches an owner-managed profile;
- unmatched products omit `bookingPartnerHandoff`;
- `/tours/{id}` renders `Check availability` only when the mocked product response includes a verified handoff;
- `/tours/{id}` without verified handoff does not render product-specific `Check availability`.

This preview limitation should not be bypassed by copying production secrets into preview or by deploying to production merely to test data access.

## 4. Production deploy gate

Production deploy is still blocked until explicitly approved by the user.

Required approval phrase:

```text
Approve TD-DEPLOY-TOUR-DETAIL-HANDOFF-UI-1-PRODUCTION for merge SHA 9dc156448d4b5ebbf418359ef234af97f478a57e
```

Do not run:

```bash
npx vercel --prod --yes
```

unless that explicit approval is present.

## 5. Production deploy preflight

Before production deploy, use a fresh clean worktree from the approved merge SHA.

Required checks:

```bash
git fetch origin codex/travel-mvp-launch
git worktree add /private/tmp/radarscout-tour-detail-handoff-ui-1-prod origin/codex/travel-mvp-launch
cd /private/tmp/radarscout-tour-detail-handoff-ui-1-prod
git rev-parse HEAD
git status --short
```

Expected:

```text
HEAD = 9dc156448d4b5ebbf418359ef234af97f478a57e
git status --short = empty
```

Run validation before deploy:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- publicProducts
pnpm --filter @reddit-monitor/web test -- tours
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

Stop if any validation fails.

## 6. Production smoke plan

After an explicitly approved production deploy, verify:

```text
https://radarscout.io
https://www.radarscout.io
https://radarscout.io/tours
https://radarscout.io/tours/{verified-owner-managed-product-id}
https://radarscout.io/tours/{unverified-or-unavailable-product-id}
https://radarscout.io/sitemap.xml
```

Use a current product ID discovered from the production public API only:

```text
GET https://radarscout.io/api/products
```

Do not read `.env.production`.
Do not print secrets.
Do not run DB writes.

For a verified owner-managed product detail page, expect:

- page loads `200`;
- meta robots remains `noindex,nofollow`;
- visible CTA text is `Check availability`;
- CTA `href` is an external public booking partner widget URL;
- CTA `target="_blank"`;
- CTA `rel="nofollow sponsored noopener noreferrer"`;
- helper copy says travelers continue with a booking partner to review current details;
- no live availability, available now, guaranteed slot, instant confirmation, checkout, payment, booking complete, or reservation complete claims.

For an unverified product detail page, expect:

- page loads safely or shows a safe unavailable state;
- product-specific `Check availability` is absent;
- planning/detail copy remains safe;
- no booking, checkout, payment, live availability, or inventory claims.

For `sitemap.xml`, expect:

- `/tours/{id}` remains excluded;
- `/chiang-mai/elephant-camp-finder` remains excluded while `noindex,nofollow`;
- B2B pages remain excluded while `noindex,nofollow`;
- only currently intended safe non-tour URLs are emitted.

## 7. Forbidden production smoke conclusions

Do not conclude:

```text
booking is supported
checkout is supported
payment is supported
live availability is supported
instant confirmation is supported
RadarScout is a booking engine
Bókun API is integrated
```

The correct conclusion, if smoke passes, is:

```text
RadarScout renders a verified external booking partner handoff CTA for matched owner-managed tour detail pages only.
```

## 8. Safety boundaries

This feature must keep:

- no SEO `index,follow` opening;
- no `/tours/{id}` sitemap re-entry;
- no Bókun API/edit/sync;
- no Bókun backend/database/powered-by wording in visible UI;
- no checkout/payment/cart/booking submission;
- no live availability/inventory behavior;
- no DB/schema/env changes;
- no LLM/OpenAI integration;
- no ThaiEleHub/Shopify changes.

## 9. Recommended next tasks

Recommended sequence:

```text
1. TD-DEPLOY-TOUR-DETAIL-HANDOFF-UI-1-PRODUCTION
   Only after explicit user approval for merge SHA 9dc156448d4b5ebbf418359ef234af97f478a57e.

2. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-PRODUCTION-OBSERVATION
   Observation/report only after production deploy.

3. TD-RADARSCOUT-PREVIEW-ENV-DATABASE-URL-CHECK-1
   Optional: configure or verify a dedicated non-production Preview DB so future preview data smoke can verify real product behavior before production.

4. TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2
   Optional docs-first task for future manually verified operator public links.
```

Do not start broader booking, checkout, payment, availability, inventory, Bókun API, or supplier backend work from this milestone.
