"use client";

import { Trophy, MapPin, Calendar, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
  image: string | null;
}

interface PlayerStat {
  id: string;
  playerName: string;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  damage: number | null;
  hillTime: string | null;
  captures: number | null;
  defuses: number | null;
  plants: number | null;
  confidence: string;
  player: Player;
}

interface Match {
  id: string;
  game: string;
  gameMode: string;
  map: string;
  result: string;
  teamScore: number;
  opponentScore: number;
  opponentTeamName: string | null;
  season: string | null;
  event: string | null;
  matchDuration: string | null;
  screenshotQuality: string | null;
  createdAt: Date;
  playerStats: PlayerStat[];
}

interface MatchListProps {
  matches: Match[];
}

export function MatchList({ matches }: MatchListProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun match</h3>
        <p className="text-muted-foreground">
          Les matchs analysés apparaîtront ici.
        </p>
      </div>
    );
  }

  const toggleMatch = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "WIN":
        return "text-green-600 dark:text-green-400";
      case "LOSS":
        return "text-red-600 dark:text-red-400";
      case "DRAW":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "WIN":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Victoire</span>
          </div>
        );
      case "LOSS":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 text-red-700 dark:text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">Défaite</span>
          </div>
        );
      case "DRAW":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            <Minus className="h-4 w-4" />
            <span className="text-sm font-medium">Égalité</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const isExpanded = expandedMatch === match.id;

        return (
          <div
            key={match.id}
            className={`rounded-lg border bg-card transition-all ${
              match.result === "WIN"
                ? "border-green-500/30"
                : match.result === "LOSS"
                  ? "border-red-500/30"
                  : ""
            }`}
          >
            {/* Match Header */}
            <button
              onClick={() => toggleMatch(match.id)}
              className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Result Badge */}
                  {getResultBadge(match.result)}

                  {/* Score */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${
                        match.result === "WIN"
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }`}
                    >
                      {match.teamScore}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span
                      className={`text-2xl font-bold ${
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
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {match.gameMode} sur {match.map}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{match.game}</span>
                      {match.opponentTeamName && (
                        <span>vs {match.opponentTeamName}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(match.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Match Details */}
            {isExpanded && (
              <div className="border-t p-6 bg-muted/20">
                {/* Metadata */}
                {(match.season || match.event || match.matchDuration) && (
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    {match.season && (
                      <div>
                        <span className="text-muted-foreground">Saison: </span>
                        <span className="font-medium">{match.season}</span>
                      </div>
                    )}
                    {match.event && (
                      <div>
                        <span className="text-muted-foreground">Événement: </span>
                        <span className="font-medium">{match.event}</span>
                      </div>
                    )}
                    {match.matchDuration && (
                      <div>
                        <span className="text-muted-foreground">Durée: </span>
                        <span className="font-medium">{match.matchDuration}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Player Stats */}
                {match.playerStats.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Statistiques des joueurs</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-sm text-muted-foreground">
                            <th className="text-left pb-3 font-medium">Joueur</th>
                            <th className="text-center pb-3 font-medium">K</th>
                            <th className="text-center pb-3 font-medium">D</th>
                            <th className="text-center pb-3 font-medium">A</th>
                            <th className="text-center pb-3 font-medium">K/D</th>
                            {match.playerStats.some((s) => s.damage) && (
                              <th className="text-center pb-3 font-medium">Damage</th>
                            )}
                            {match.playerStats.some((s) => s.hillTime) && (
                              <th className="text-center pb-3 font-medium">Hill Time</th>
                            )}
                            {match.playerStats.some((s) => s.captures) && (
                              <th className="text-center pb-3 font-medium">Caps</th>
                            )}
                            {match.playerStats.some((s) => s.defuses) && (
                              <th className="text-center pb-3 font-medium">Defuses</th>
                            )}
                            {match.playerStats.some((s) => s.plants) && (
                              <th className="text-center pb-3 font-medium">Plants</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {match.playerStats.map((stat) => (
                            <tr
                              key={stat.id}
                              className="border-b last:border-0 hover:bg-muted/50"
                            >
                              <td className="py-3 font-medium">{stat.playerName}</td>
                              <td className="text-center py-3">{stat.kills}</td>
                              <td className="text-center py-3">{stat.deaths}</td>
                              <td className="text-center py-3">{stat.assists}</td>
                              <td className="text-center py-3">
                                {stat.kdRatio.toFixed(2)}
                              </td>
                              {match.playerStats.some((s) => s.damage) && (
                                <td className="text-center py-3">
                                  {stat.damage?.toLocaleString() || "-"}
                                </td>
                              )}
                              {match.playerStats.some((s) => s.hillTime) && (
                                <td className="text-center py-3">
                                  {stat.hillTime || "-"}
                                </td>
                              )}
                              {match.playerStats.some((s) => s.captures) && (
                                <td className="text-center py-3">
                                  {stat.captures ?? "-"}
                                </td>
                              )}
                              {match.playerStats.some((s) => s.defuses) && (
                                <td className="text-center py-3">
                                  {stat.defuses ?? "-"}
                                </td>
                              )}
                              {match.playerStats.some((s) => s.plants) && (
                                <td className="text-center py-3">
                                  {stat.plants ?? "-"}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {match.playerStats.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune statistique de joueur disponible
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
