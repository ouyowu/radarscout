# TD-LOCAL-AI-4 Preview Plan: Reviewed Product Enrichment Storage

## Problem Statement

RadarScout now has a safe local AI candidate pipeline for Bókun product enrichment, but AI output must not become a public fact automatically.

The current safe chain is:

- Bókun products sync into the local catalog.
- Public product responses use the read-only Bókun catalog adapter.
- Local AI can generate candidate enrichment text.
- The internal preview endpoint can show candidates for manual inspection.

The missing layer is reviewed enrichment storage: a place to save only the text a human has explicitly approved. This keeps the distinction clear:

- AI generated text is a candidate.
- Human approved text is reviewed enrichment.
- Public product responses may only read reviewed enrichment in the future.

This layer protects public product pages from invented facts, unsafe claims, fake pricing, fake availability, fake booking links, and unreviewed AI wording.

## Proposed Prisma Model Draft

Suggested model name:

```prisma
model BokunProductEnrichment {
  id             String       @id @default(cuid())
  productId      String       @unique
  cleanedTitle   String?
  shortSummary   String?
  suggestedTags  Json?
  seoTitle       String?
  seoDescription String?
  reviewedBy     String?
  reviewedAt     DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  product        BokunProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

This is a draft only. This PR must not edit `packages/db/prisma/schema.prisma`.

Recommended notes for the implementation PR:

- `productId` should be unique so each Bókun product has at most one reviewed enrichment row.
- `suggestedTags` should be JSON to avoid introducing a tag taxonomy before the product/category model is ready.
- `reviewedBy` may store a human identifier, admin email, or internal reviewer name, but should not become public API data by default.
- `reviewedAt` should be required by the write endpoint before content is considered reviewed, even if the database field stays nullable for migration safety.

## Forbidden Fields

The reviewed enrichment model must not store:

- `price`
- `availability`
- `supplier`
- `rating`
- `reviewCount`
- `bookingUrl`
- `bookingStatus`
- `openingHours`
- `rawJson`
- raw Bókun payloads
- checkout fields
- payment fields

Supplier identity, prices, booking state, and availability must continue to come only from trusted stored product data or future verified integrations, not AI-generated or human-entered enrichment text.

## SQL Migration Draft

This SQL is a draft for human review only. Do not create a Prisma migration folder in this PR.

```sql
CREATE TABLE "BokunProductEnrichment" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "cleanedTitle" TEXT,
  "shortSummary" TEXT,
  "suggestedTags" JSONB,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BokunProductEnrichment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BokunProductEnrichment_productId_key"
  ON "BokunProductEnrichment"("productId");

ALTER TABLE "BokunProductEnrichment"
  ADD CONSTRAINT "BokunProductEnrichment_productId_fkey"
  FOREIGN KEY ("productId")
  REFERENCES "BokunProduct"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
```

Implementation note: Prisma will generate exact SQL based on the final schema. The implementation PR should show the generated migration SQL before any database command is run.

## Write Boundary Design

Future route, not implemented in this PR:

```text
POST /api/internal/product-enrichment/reviewed
```

Required behavior:

- Require an internal secret.
- Accept `productId` and manually reviewed enrichment fields only.
- Reject unknown or forbidden fields.
- Reject `rawJson`.
- Reject `price`, `availability`, `supplier`, `rating`, and `bookingUrl`.
- Reject checkout and payment fields.
- Sanitize `suggestedTags` by trimming, deduplicating, and limiting count.
- Write reviewed enrichment only after explicit human submission.
- Do not call local AI directly.
- Do not auto-save AI candidate output.
- Do not modify Bókun product source fields.

Allowed write fields:

- `cleanedTitle`
- `shortSummary`
- `suggestedTags`
- `seoTitle`
- `seoDescription`
- `reviewedBy`
- `reviewedAt`

The write endpoint should treat all fields as reviewed text metadata, not operational data. It must not create booking state, availability state, prices, suppliers, ratings, or product inventory claims.

## Read Boundary Design

Future read behavior, not implemented in this PR:

- Public product APIs may optionally include reviewed enrichment fields only.
- Public product APIs must never include AI candidate fields directly.
- Public product APIs must never expose `rawJson`.
- If no reviewed enrichment exists, public APIs should fall back to existing safe product fields.
- Public APIs should continue returning `bookingEnabled: false` and `availabilityEnabled: false` until real booking and availability behavior is explicitly implemented.

Possible future merge behavior:

- `title` may prefer `cleanedTitle` only if reviewed.
- `summary` may prefer `shortSummary` only if reviewed.
- SEO metadata may use reviewed `seoTitle` and `seoDescription`.
- Tags may use reviewed `suggestedTags`, sanitized and capped.

No public response should imply that enrichment text is a verified operational fact. It is reviewed editorial metadata only.

## Test Plan

Future implementation tests should cover:

- Can save reviewed enrichment with allowed fields.
- Rejects forbidden fields.
- Rejects `rawJson`.
- Rejects `price`.
- Rejects `availability`.
- Rejects `supplier`.
- Rejects `rating`.
- Rejects `bookingUrl`.
- Requires internal secret.
- Does not call local AI during save.
- Does not write AI candidates automatically.
- Public product response only reads reviewed enrichment, not candidate output.
- Public product response still hides `rawJson`.
- Public product response still avoids fake booking capability.
- Cascade delete behavior is expected when a `BokunProduct` is deleted.
- `suggestedTags` are sanitized, deduplicated, and limited.

## Rollout Plan

1. Review this preview plan.
2. Human approves the model and SQL direction.
3. Implement Prisma schema and migration in a separate PR.
4. Show generated migration SQL and wait for explicit human approval before any database migration command.
5. Add the protected reviewed enrichment write endpoint in another PR.
6. Add public read integration only after reviewed data exists.
7. Add admin UI much later, not now.

## Current PR Restrictions

This preview PR must not:

- Modify `packages/db/prisma/schema.prisma`.
- Create Prisma migration files.
- Run `prisma migrate`.
- Modify API routes.
- Modify frontend pages.
- Modify AI Trip Planner files.
- Modify Bókun sync.
- Modify public product APIs.
- Add database writes.
- Add booking, checkout, payment, or availability behavior.
- Commit secrets.
- Add package dependencies.
- Modify `package.json` or lockfiles.
