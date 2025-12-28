"use client";

import { Trophy, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";

interface PlayerStat {
  id: string;
  playerName: string;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
}

interface Match {
  id: string;
  game: string | null;
  gameMode: string;
  map: string;
  result: string | null;
  teamScore: number;
  opponentScore: number;
  opponentTeamName: string | null;
  createdAt: Date;
  playerStats: PlayerStat[];
}

interface LatestMatchesProps {
  matches: Match[];
  teamName?: string;
  showAllLink?: string;
  emptyMessage?: string;
}

export function LatestMatches({
  matches,
  teamName,
  showAllLink,
  emptyMessage = "Aucun match récent"
}: LatestMatchesProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Trophy className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const getResultBadge = (result: string | null) => {
    switch (result) {
      case "WIN":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-700 dark:text-green-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">V</span>
          </div>
        );
      case "LOSS":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">D</span>
          </div>
        );
      case "DRAW":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            <Minus className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">N</span>
          </div>
        );
      case null:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-700 dark:text-gray-400">
            <Minus className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">?</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {teamName && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{teamName}</h3>
          {showAllLink && (
            <Link
              href={showAllLink}
              className="text-sm text-primary hover:underline"
            >
              Voir tous les matchs →
            </Link>
          )}
        </div>
      )}

      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className={`rounded-lg border bg-card p-4 transition-all ${
              match.result === "WIN"
                ? "border-green-500/30"
                : match.result === "LOSS"
                  ? "border-red-500/30"
                  : ""
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {/* Result Badge */}
                {getResultBadge(match.result)}

                {/* Score */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-lg font-bold ${
                      match.result === "WIN"
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    {match.teamScore}
                  </span>
                  <span className="text-muted-foreground text-sm">-</span>
                  <span
                    className={`text-lg font-bold ${
                      match.result === "LOSS"
                        ? "text-red-600 dark:text-red-400"
                        : ""
                    }`}
                  >
                    {match.opponentScore}
                  </span>
                </div>

                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">
                      {match.gameMode} • {match.map}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {match.opponentTeamName && (
                      <span>vs {match.opponentTeamName}</span>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(match.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
