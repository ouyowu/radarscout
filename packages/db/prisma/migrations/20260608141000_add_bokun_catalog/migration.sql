-- CreateTable
CREATE TABLE "BokunSupplier" (
    "id" TEXT NOT NULL,
    "bokunVendorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT,
    "rawJson" JSONB NOT NULL DEFAULT '{}',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BokunSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BokunProduct" (
    "id" TEXT NOT NULL,
    "bokunActivityId" TEXT NOT NULL,
    "supplierId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "excerpt" TEXT,
    "city" TEXT,
    "location" TEXT,
    "retailPrice" DECIMAL(10,2),
    "netSettlementPrice" DECIMAL(10,2),
    "currency" TEXT,
    "commissionPercent" DECIMAL(5,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "rawJson" JSONB NOT NULL DEFAULT '{}',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BokunProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BokunSupplier_bokunVendorId_key" ON "BokunSupplier"("bokunVendorId");

-- CreateIndex
CREATE INDEX "BokunSupplier_title_idx" ON "BokunSupplier"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BokunProduct_bokunActivityId_key" ON "BokunProduct"("bokunActivityId");

-- CreateIndex
CREATE INDEX "BokunProduct_supplierId_idx" ON "BokunProduct"("supplierId");

-- CreateIndex
CREATE INDEX "BokunProduct_city_idx" ON "BokunProduct"("city");

-- CreateIndex
CREATE INDEX "BokunProduct_active_idx" ON "BokunProduct"("active");

-- CreateIndex
CREATE INDEX "BokunProduct_title_idx" ON "BokunProduct"("title");

-- AddForeignKey
ALTER TABLE "BokunProduct" ADD CONSTRAINT "BokunProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "BokunSupplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

