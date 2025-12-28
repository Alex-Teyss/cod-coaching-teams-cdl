-- DropIndex
DROP INDEX "public"."player_stats_matchId_playerId_key";

-- AlterTable
ALTER TABLE "player_stats" ADD COLUMN     "teamName" TEXT,
ALTER COLUMN "playerId" DROP NOT NULL;
