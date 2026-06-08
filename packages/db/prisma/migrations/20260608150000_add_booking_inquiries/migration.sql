-- CreateTable
CREATE TABLE "BookingInquiry" (
    "id" TEXT NOT NULL,
    "bokunProductId" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "pickupArea" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "whatsapp" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingInquiry_bokunProductId_idx" ON "BookingInquiry"("bokunProductId");

-- CreateIndex
CREATE INDEX "BookingInquiry_customerEmail_idx" ON "BookingInquiry"("customerEmail");

-- CreateIndex
CREATE INDEX "BookingInquiry_status_idx" ON "BookingInquiry"("status");

-- CreateIndex
CREATE INDEX "BookingInquiry_createdAt_idx" ON "BookingInquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "BookingInquiry" ADD CONSTRAINT "BookingInquiry_bokunProductId_fkey" FOREIGN KEY ("bokunProductId") REFERENCES "BokunProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

