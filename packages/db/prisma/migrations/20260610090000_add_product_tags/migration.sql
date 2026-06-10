CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductTag_productId_tagName_key" ON "ProductTag"("productId", "tagName");
CREATE INDEX "ProductTag_productId_idx" ON "ProductTag"("productId");
CREATE INDEX "ProductTag_tagName_idx" ON "ProductTag"("tagName");
CREATE INDEX "ProductTag_active_idx" ON "ProductTag"("active");

ALTER TABLE "ProductTag"
ADD CONSTRAINT "ProductTag_productId_fkey"
FOREIGN KEY ("productId")
REFERENCES "BokunProduct"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
