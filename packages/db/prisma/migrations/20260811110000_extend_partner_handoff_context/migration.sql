-- Extend the existing anonymous handoff log without storing raw prompts or identity data.
ALTER TABLE "PartnerHandoffLog"
ADD COLUMN "sessionId" TEXT,
ADD COLUMN "clickResult" TEXT NOT NULL DEFAULT 'clicked';

CREATE INDEX "PartnerHandoffLog_sessionId_clickedAt_idx"
ON "PartnerHandoffLog"("sessionId", "clickedAt");
