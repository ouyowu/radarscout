# RadarScout preview DB seed plan

Task: `TD-RADARSCOUT-PREVIEW-DB-SEED-PLAN-0`

## 1. Purpose

The RadarScout preview database now has the Prisma schema applied, but it still needs a minimal safe dataset before PR #171 can complete DB-backed preview smoke.

This document is the review gate before any seed write.

No seed data has been inserted by this task.

## 2. Current blocker

PR #171 must not be merged until preview smoke proves both product-detail paths:

- a product with a verified booking partner handoff renders `Check availability`;
- a product without a verified handoff renders the planning-only fallback;
- `/api/products/[id]` returns product detail data;
- no `/api/bokun` call occurs;
- no OpenAI/LLM call occurs;
- no checkout, payment, cart, reservation, or booking submission occurs;
- no production deploy occurs.

The schema gate is resolved. The seed/data gate is still pending.

## 3. Source behavior this seed must support

PR #171 resolves public product detail behavior from stored `BokunProduct` rows.

Required row properties:

- `BokunProduct.id` must match the `/tours/{id}` and `/api/products/{id}` smoke URL.
- `active` must be `true`.
- `supplierId` must be non-null.
- title/city/location must pass Thailand eligibility.
- `bokunActivityId` determines whether an owner-managed handoff is available.

Known owner-managed handoff mapping:

- `bokunActivityId: "1232729"` maps to a public booking partner widget and should render `Check availability`.
- `bokunActivityId: "999999999"` has no owner-managed profile and should render the planning-only fallback.

## 4. Proposed minimal preview records

Use exactly one preview supplier and two preview products.

### Supplier

```json
{
  "id": "preview-supplier-living-green",
  "bokunVendorId": "preview-vendor-living-green",
  "title": "Preview Living Green Local Operator",
  "status": "preview",
  "rawJson": {
    "previewOnly": true,
    "purpose": "RadarScout PR 171 smoke"
  }
}
```

### Product A: handoff path

This product should verify the `Check availability` path.

```json
{
  "id": "preview-tour-handoff-1232729",
  "bokunActivityId": "1232729",
  "supplierId": "preview-supplier-living-green",
  "title": "Preview Chiang Mai Elephant Care Morning",
  "description": "A preview-only Chiang Mai elephant care experience for RadarScout smoke testing. Travelers can compare details before continuing with a booking partner.",
  "excerpt": "Preview-only Chiang Mai elephant care experience for comparing details.",
  "city": "Chiang Mai",
  "location": "Chiang Mai, Thailand",
  "retailPrice": null,
  "netSettlementPrice": null,
  "currency": null,
  "commissionPercent": null,
  "active": true,
  "rawJson": {
    "previewOnly": true,
    "summary": "Preview-only Chiang Mai elephant care experience for comparing details.",
    "duration": "Half day",
    "meetingPoint": "Chiang Mai area details are reviewed on the booking partner page.",
    "pickupAvailable": true,
    "cancellationPolicy": "Review current terms on the booking partner page."
  }
}
```

Expected smoke behavior:

- `/api/products/preview-tour-handoff-1232729` returns 200.
- `/tours/preview-tour-handoff-1232729` renders product detail.
- `bookingPartnerHandoff` exists.
- CTA label is `Check availability`.
- CTA `rel` is `nofollow sponsored noopener noreferrer`.
- CTA href is the owner-managed public widget URL resolved from `bokunActivityId: "1232729"`.
- No internal Bókun backend wording or transaction flow appears.

### Product B: no-handoff fallback path

This product should verify planning-only behavior.

```json
{
  "id": "preview-tour-no-handoff-999999999",
  "bokunActivityId": "999999999",
  "supplierId": "preview-supplier-living-green",
  "title": "Preview Chiang Mai Local Nature Experience",
  "description": "A preview-only Chiang Mai local nature experience for validating planning-only product detail behavior.",
  "excerpt": "Preview-only Chiang Mai nature experience for planning-only detail smoke.",
  "city": "Chiang Mai",
  "location": "Chiang Mai, Thailand",
  "retailPrice": null,
  "netSettlementPrice": null,
  "currency": null,
  "commissionPercent": null,
  "active": true,
  "rawJson": {
    "previewOnly": true,
    "summary": "Preview-only Chiang Mai nature experience for planning-only detail smoke.",
    "duration": "Flexible",
    "meetingPoint": "Details are reviewed with a booking partner when a verified handoff exists.",
    "pickupAvailable": null,
    "cancellationPolicy": "Not listed in this preview record."
  }
}
```

Expected smoke behavior:

- `/api/products/preview-tour-no-handoff-999999999` returns 200.
- `/tours/preview-tour-no-handoff-999999999` renders product detail.
- `bookingPartnerHandoff` is absent.
- The page renders planning-only fallback copy.
- `Check availability` is not shown for this product.
- No fallback product, invented booking URL, or fabricated handoff appears.

## 5. Proposed SQL for later approval

This SQL is for review only. Do not run it until explicitly approved.

```sql
INSERT INTO "BokunSupplier" (
  "id",
  "bokunVendorId",
  "title",
  "status",
  "rawJson",
  "updatedAt"
) VALUES (
  'preview-supplier-living-green',
  'preview-vendor-living-green',
  'Preview Living Green Local Operator',
  'preview',
  '{"previewOnly":true,"purpose":"RadarScout PR 171 smoke"}'::jsonb,
  NOW()
)
ON CONFLICT ("bokunVendorId") DO UPDATE SET
  "title" = EXCLUDED."title",
  "status" = EXCLUDED."status",
  "rawJson" = EXCLUDED."rawJson",
  "updatedAt" = NOW();

INSERT INTO "BokunProduct" (
  "id",
  "bokunActivityId",
  "supplierId",
  "title",
  "description",
  "excerpt",
  "city",
  "location",
  "retailPrice",
  "netSettlementPrice",
  "currency",
  "commissionPercent",
  "active",
  "rawJson",
  "updatedAt"
) VALUES
(
  'preview-tour-handoff-1232729',
  '1232729',
  'preview-supplier-living-green',
  'Preview Chiang Mai Elephant Care Morning',
  'A preview-only Chiang Mai elephant care experience for RadarScout smoke testing. Travelers can compare details before continuing with a booking partner.',
  'Preview-only Chiang Mai elephant care experience for comparing details.',
  'Chiang Mai',
  'Chiang Mai, Thailand',
  NULL,
  NULL,
  NULL,
  NULL,
  TRUE,
  '{"previewOnly":true,"summary":"Preview-only Chiang Mai elephant care experience for comparing details.","duration":"Half day","meetingPoint":"Chiang Mai area details are reviewed on the booking partner page.","pickupAvailable":true,"cancellationPolicy":"Review current terms on the booking partner page."}'::jsonb,
  NOW()
),
(
  'preview-tour-no-handoff-999999999',
  '999999999',
  'preview-supplier-living-green',
  'Preview Chiang Mai Local Nature Experience',
  'A preview-only Chiang Mai local nature experience for validating planning-only product detail behavior.',
  'Preview-only Chiang Mai nature experience for planning-only detail smoke.',
  'Chiang Mai',
  'Chiang Mai, Thailand',
  NULL,
  NULL,
  NULL,
  NULL,
  TRUE,
  '{"previewOnly":true,"summary":"Preview-only Chiang Mai nature experience for planning-only detail smoke.","duration":"Flexible","meetingPoint":"Details are reviewed with a booking partner when a verified handoff exists.","pickupAvailable":null,"cancellationPolicy":"Not listed in this preview record."}'::jsonb,
  NOW()
)
ON CONFLICT ("bokunActivityId") DO UPDATE SET
  "supplierId" = EXCLUDED."supplierId",
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "excerpt" = EXCLUDED."excerpt",
  "city" = EXCLUDED."city",
  "location" = EXCLUDED."location",
  "retailPrice" = EXCLUDED."retailPrice",
  "netSettlementPrice" = EXCLUDED."netSettlementPrice",
  "currency" = EXCLUDED."currency",
  "commissionPercent" = EXCLUDED."commissionPercent",
  "active" = EXCLUDED."active",
  "rawJson" = EXCLUDED."rawJson",
  "updatedAt" = NOW();
```

## 6. Approval-gated seed apply command

Do not run this command until explicitly approved.

Recommended seed apply should use the migration-capable preview database URL:

```bash
DATABASE_URL="$(security find-generic-password -a ouyowu -s radarscout-preview-migration-database-url -w)" \
  pnpm --filter @reddit-monitor/db exec prisma db execute --stdin < /path/to/reviewed-preview-seed.sql
```

The SQL file must be created outside committed source or as a reviewed temporary artifact. It must not contain secrets.

## 7. Required post-seed checks

After explicit seed approval and execution, verify:

```text
/api/products/preview-tour-handoff-1232729
/api/products/preview-tour-no-handoff-999999999
/tours/preview-tour-handoff-1232729
/tours/preview-tour-no-handoff-999999999
```

Expected:

- both API detail endpoints return product detail data;
- handoff product includes `bookingPartnerHandoff`;
- no-handoff product omits `bookingPartnerHandoff`;
- handoff page shows `Check availability`;
- no-handoff page shows planning-only fallback;
- no API response exposes `rawJson`;
- no API response exposes `netSettlementPrice` or `commissionPercent`;
- no booking inquiry rows are created;
- no checkout, payment, cart, reservation, or booking submission occurs;
- no `/api/bokun` request occurs;
- no OpenAI/LLM request occurs.

## 8. Forbidden seed content

Seeded public fields must not contain:

- live availability
- available now
- guaranteed slot
- instant confirmation
- checkout
- payment
- reservation complete
- booking complete
- Bókun backend
- Bókun database
- Bókun-powered
- partner rate
- supplier net rate
- commission
- fake reviews
- fake ratings

## 9. What this task does not approve

This plan does not approve:

- running the SQL;
- inserting seed data;
- updating production data;
- copying production catalog data;
- calling Bókun API;
- syncing or editing Bókun products;
- creating booking inquiries;
- enabling checkout, payment, cart, booking submission, or availability behavior;
- changing app code;
- deploying to production;
- merging PR #171.

## 10. Recommended next approval phrase

If this seed plan is accepted, the next approval should be explicit:

```text
Approve TD-RADARSCOUT-PREVIEW-DB-SEED-APPLY-1 to insert the reviewed preview seed records into the preview DB only.
```

After seed apply succeeds, the next task should be:

```text
TD-RADARSCOUT-PR171-PREVIEW-SMOKE-RETRY
```

PR #171 should remain unmerged until that smoke passes.
