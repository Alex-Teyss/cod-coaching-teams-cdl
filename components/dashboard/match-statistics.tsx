"use client";

import { Trophy, TrendingUp, Target, Award } from "lucide-react";

interface MatchStatisticsProps {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  averageKD?: number;
  topPlayer?: {
    name: string;
    kdRatio: number;
  };
}

export function MatchStatistics({
  totalMatches,
  wins,
  losses,
  draws,
  averageKD,
  topPlayer
}: MatchStatisticsProps) {
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Matches */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Matchs
          </h3>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{totalMatches}</p>
          <p className="text-xs text-muted-foreground">
            {wins}V - {losses}D - {draws}N
          </p>
        </div>
      </div>

      {/* Win Rate */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Taux de victoire
          </h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{winRate}%</p>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Average K/D */}
      {averageKD !== undefined && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              K/D Moyen
            </h3>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{averageKD.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              Sur tous les matchs
            </p>
          </div>
        </div>
      )}

      {/* Top Player */}
      {topPlayer && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Meilleur joueur
            </h3>
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold truncate">{topPlayer.name}</p>
            <p className="text-sm text-muted-foreground">
              K/D: {topPlayer.kdRatio.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
