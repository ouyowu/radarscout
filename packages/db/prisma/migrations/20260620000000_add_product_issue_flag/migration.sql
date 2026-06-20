-- CreateTable
CREATE TABLE "ProductIssueFlag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "flaggedBy" TEXT NOT NULL,
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ProductIssueFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductIssueFlag_productId_key" ON "ProductIssueFlag"("productId");

-- CreateIndex
CREATE INDEX "ProductIssueFlag_productId_idx" ON "ProductIssueFlag"("productId");

-- AddForeignKey
ALTER TABLE "ProductIssueFlag" ADD CONSTRAINT "ProductIssueFlag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BokunProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
