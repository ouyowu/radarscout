-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "aiReplyDraft" TEXT,
ADD COLUMN     "aiSummary" VARCHAR(200),
ADD COLUMN     "intentScore" INTEGER;
