-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Match_keywordId_postId_key" ON "Match"("keywordId", "postId");
