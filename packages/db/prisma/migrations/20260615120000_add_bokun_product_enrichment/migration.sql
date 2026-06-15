-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "BokunProductEnrichment_productId_key" ON "BokunProductEnrichment"("productId");

-- AddForeignKey
ALTER TABLE "BokunProductEnrichment" ADD CONSTRAINT "BokunProductEnrichment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BokunProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

