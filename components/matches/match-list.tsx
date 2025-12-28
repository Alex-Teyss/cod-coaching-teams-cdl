"use client";

import { Trophy, Calendar, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  image: string | null;
}

interface PlayerStat {
  id: string;
  playerName: string;
  teamName: string | null;
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
  game: string | null;
  gameMode: string;
  map: string;
  result: string | null;
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
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

  const getResultBadge = (result: string | null) => {
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
      case null:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-700 dark:text-gray-400">
            <Minus className="h-4 w-4" />
            <span className="text-sm font-medium">Inconnu</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDeleteMatch = async () => {
    if (!matchToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/matches/${matchToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      // Fermer le dialogue et rafraîchir la page
      setMatchToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression du match:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression du match");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const isExpanded = expandedMatch === match.id;

        return (
          <div
            key={match.id}
            className={`relative rounded-lg border bg-card transition-all ${
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

            {/* Delete Button */}
            <div className="absolute top-4 right-14">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setMatchToDelete(match.id);
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Match Details */}
            {isExpanded && (
              <div className="border-t p-6 bg-muted/20">
                {/* Metadata */}
                {(match.event || match.matchDuration) && (
                  <div className="flex items-center gap-6 mb-6 text-sm">
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
                {match.playerStats.length > 0 && (() => {
                  // Group stats by team
                  const teams = match.playerStats.reduce((acc, stat) => {
                    const teamName = stat.teamName || "Équipe inconnue";
                    if (!acc[teamName]) {
                      acc[teamName] = [];
                    }
                    acc[teamName].push(stat);
                    return acc;
                  }, {} as Record<string, typeof match.playerStats>);

                  const teamEntries = Object.entries(teams);

                  return (
                    <div className="space-y-8">
                      {teamEntries.map(([teamName, teamStats], index) => (
                        <div key={teamName} className="rounded-lg border bg-card p-4">
                          <h4 className="font-semibold mb-4 text-lg">{teamName}</h4>
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
                                {teamStats.map((stat) => (
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
                      ))}
                    </div>
                  );
                })()}

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

      {/* Confirmation Dialog */}
      <AlertDialog open={!!matchToDelete} onOpenChange={() => setMatchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce match ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le match et toutes ses statistiques seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMatch}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
