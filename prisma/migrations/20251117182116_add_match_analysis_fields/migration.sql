/*
  Warnings:

  - You are about to drop the column `score` on the `player_stats` table. All the data in the column will be lost.
  - Added the required column `game` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opponentScore` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamScore` to the `match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerName` to the `player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match" ADD COLUMN     "event" TEXT,
ADD COLUMN     "game" TEXT NOT NULL,
ADD COLUMN     "mapNumber" INTEGER,
ADD COLUMN     "matchDuration" TEXT,
ADD COLUMN     "matchStatus" TEXT,
ADD COLUMN     "opponentScore" INTEGER NOT NULL,
ADD COLUMN     "opponentTeamName" TEXT,
ADD COLUMN     "screenshotQuality" TEXT,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "teamScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "player_stats" DROP COLUMN "score",
ADD COLUMN     "assists" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "captures" INTEGER,
ADD COLUMN     "confidence" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "damage" INTEGER,
ADD COLUMN     "defuses" INTEGER,
ADD COLUMN     "hillTime" TEXT,
ADD COLUMN     "plants" INTEGER,
ADD COLUMN     "playerName" TEXT NOT NULL,
ADD COLUMN     "zoneTime" TEXT;
