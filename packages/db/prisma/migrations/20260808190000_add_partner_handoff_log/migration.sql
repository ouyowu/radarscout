-- CreateTable
CREATE TABLE "PartnerHandoffLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "placement" TEXT,
    "city" TEXT,
    "productId" TEXT,
    "attributionSource" TEXT,
    "targetHost" TEXT,
    "recommendationSource" TEXT,
    "reasonCode" TEXT,
    "durationDays" INTEGER,
    "pace" TEXT,
    "intent" JSONB NOT NULL DEFAULT '{}',
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revenueAmount" DECIMAL(10,2),
    "revenueCurrency" TEXT,
    "revenueRecordedAt" TIMESTAMP(3),

    CONSTRAINT "PartnerHandoffLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartnerHandoffLog_provider_clickedAt_idx" ON "PartnerHandoffLog"("provider", "clickedAt");

-- CreateIndex
CREATE INDEX "PartnerHandoffLog_productId_clickedAt_idx" ON "PartnerHandoffLog"("productId", "clickedAt");

-- CreateIndex
CREATE INDEX "PartnerHandoffLog_clickedAt_idx" ON "PartnerHandoffLog"("clickedAt");
