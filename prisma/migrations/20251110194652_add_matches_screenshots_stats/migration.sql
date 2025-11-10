-- CreateEnum
CREATE TYPE "ScreenshotStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'SCREENSHOT_PROCESSED';
ALTER TYPE "NotificationType" ADD VALUE 'MATCH_COMPLETED';

-- CreateTable
CREATE TABLE "match" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "gameMode" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenshot" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" "ScreenshotStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_stats" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "screenshotId" TEXT,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "kdRatio" DOUBLE PRECISION NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "match_teamId_idx" ON "match"("teamId");

-- CreateIndex
CREATE INDEX "match_createdAt_idx" ON "match"("createdAt");

-- CreateIndex
CREATE INDEX "screenshot_matchId_idx" ON "screenshot"("matchId");

-- CreateIndex
CREATE INDEX "screenshot_uploadedBy_idx" ON "screenshot"("uploadedBy");

-- CreateIndex
CREATE INDEX "screenshot_status_idx" ON "screenshot"("status");

-- CreateIndex
CREATE INDEX "player_stats_matchId_idx" ON "player_stats"("matchId");

-- CreateIndex
CREATE INDEX "player_stats_playerId_idx" ON "player_stats"("playerId");

-- CreateIndex
CREATE INDEX "player_stats_screenshotId_idx" ON "player_stats"("screenshotId");

-- CreateIndex
CREATE UNIQUE INDEX "player_stats_matchId_playerId_key" ON "player_stats"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenshot" ADD CONSTRAINT "screenshot_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenshot" ADD CONSTRAINT "screenshot_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_screenshotId_fkey" FOREIGN KEY ("screenshotId") REFERENCES "screenshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
