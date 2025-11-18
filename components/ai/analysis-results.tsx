"use client";

import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";
import { Trophy, Users, MapPin, Gamepad2, Clock, AlertCircle, Info } from "lucide-react";

interface AnalysisResultsProps {
  result: ScoreboardAnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Metadata Alerts */}
      {(result.metadata.partial || result.metadata.matchStatus === "in-progress" || result.metadata.notes) && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="space-y-1">
              {result.metadata.partial && (
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Screenshot partiel - Une seule équipe visible
                </p>
              )}
              {result.metadata.matchStatus === "in-progress" && (
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Match en cours - Scoreboard de mi-match
                  {result.metadata.timeRemaining && ` (Temps restant: ${result.metadata.timeRemaining})`}
                </p>
              )}
              {result.metadata.notes && (
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {result.metadata.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Match Info */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Informations du match</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jeu</p>
              <p className="font-medium">{result.game}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="font-medium">{result.mode}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carte</p>
              <p className="font-medium">{result.map}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Qualité</p>
              <p className="font-medium capitalize">
                {result.metadata.screenshotQuality}
              </p>
            </div>
          </div>

          {result.metadata.matchDuration && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durée</p>
                <p className="font-medium">{result.metadata.matchDuration}</p>
              </div>
            </div>
          )}

          {result.metadata.event && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Événement</p>
                <p className="font-medium">{result.metadata.event}</p>
              </div>
            </div>
          )}

          {result.metadata.season && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saison</p>
                <p className="font-medium">{result.metadata.season}</p>
              </div>
            </div>
          )}

          {result.metadata.mapNumber && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carte N°</p>
                <p className="font-medium">{result.metadata.mapNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teams */}
      {result.teams.map((team, teamIndex) => (
        <div key={teamIndex} className={`rounded-lg border ${team.winner ? 'border-green-500/50 bg-green-500/5' : 'bg-card'} ${!team.visible ? 'opacity-50' : ''}`}>
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{team.teamName}</h3>
                {!team.visible && (
                  <span className="text-xs text-muted-foreground italic">(Non visible)</span>
                )}
              </div>
              <span className="text-2xl font-bold">{team.score}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="text-left pb-3 font-medium">Joueur</th>
                    <th className="text-center pb-3 font-medium">K</th>
                    <th className="text-center pb-3 font-medium">D</th>
                    <th className="text-center pb-3 font-medium">A</th>
                    <th className="text-center pb-3 font-medium">K/D</th>
                    {team.players.some((p) => p.damage !== undefined) && (
                      <th className="text-center pb-3 font-medium">Damage</th>
                    )}
                    {team.players.some((p) => p.hillTime !== undefined) && (
                      <th className="text-center pb-3 font-medium">
                        Hill Time
                      </th>
                    )}
                    {team.players.some((p) => p.captures !== undefined) && (
                      <th className="text-center pb-3 font-medium">Caps</th>
                    )}
                    {team.players.some((p) => p.defuses !== undefined) && (
                      <th className="text-center pb-3 font-medium">Defuses</th>
                    )}
                    {team.players.some((p) => p.plants !== undefined) && (
                      <th className="text-center pb-3 font-medium">Plants</th>
                    )}
                    <th className="text-center pb-3 font-medium">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player, playerIndex) => (
                    <tr
                      key={playerIndex}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 font-medium">{player.name}</td>
                      <td className="text-center py-3">{player.kills}</td>
                      <td className="text-center py-3">{player.deaths}</td>
                      <td className="text-center py-3">{player.assists}</td>
                      <td className="text-center py-3">
                        {player.ratio.toFixed(2)}
                      </td>
                      {team.players.some((p) => p.damage !== undefined) && (
                        <td className="text-center py-3">
                          {player.damage?.toLocaleString() || "-"}
                        </td>
                      )}
                      {team.players.some((p) => p.hillTime !== undefined) && (
                        <td className="text-center py-3">
                          {player.hillTime || "-"}
                        </td>
                      )}
                      {team.players.some((p) => p.captures !== undefined) && (
                        <td className="text-center py-3">
                          {player.captures ?? "-"}
                        </td>
                      )}
                      {team.players.some((p) => p.defuses !== undefined) && (
                        <td className="text-center py-3">
                          {player.defuses ?? "-"}
                        </td>
                      )}
                      {team.players.some((p) => p.plants !== undefined) && (
                        <td className="text-center py-3">
                          {player.plants ?? "-"}
                        </td>
                      )}
                      <td className="text-center py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            player.confidence === "high"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : player.confidence === "medium"
                                ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                : "bg-red-500/10 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {player.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* Debug Information */}
      {result.metadata.debug && (
        <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Informations de débogage</h3>
          </div>

          {result.metadata.debug.difficultAreas && result.metadata.debug.difficultAreas.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Zones difficiles à lire :</p>
              <ul className="list-disc list-inside space-y-1">
                {result.metadata.debug.difficultAreas.map((area, index) => (
                  <li key={index} className="text-sm text-blue-600 dark:text-blue-500">{area}</li>
                ))}
              </ul>
            </div>
          )}

          {result.metadata.debug.ocrCorrections && result.metadata.debug.ocrCorrections.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Corrections OCR appliquées :</p>
              <ul className="list-disc list-inside space-y-1">
                {result.metadata.debug.ocrCorrections.map((correction, index) => (
                  <li key={index} className="text-sm text-blue-600 dark:text-blue-500">{correction}</li>
                ))}
              </ul>
            </div>
          )}

          {result.metadata.debug.suggestions && (
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Suggestions :</p>
              <p className="text-sm text-blue-600 dark:text-blue-500">{result.metadata.debug.suggestions}</p>
            </div>
          )}
        </div>
      )}

      {/* Raw Text (Debug) */}
      {result.metadata.rawExtractedText && (
        <details className="rounded-lg border bg-card p-6">
          <summary className="cursor-pointer font-medium text-sm text-muted-foreground">
            Texte brut extrait (debug)
          </summary>
          <pre className="mt-4 text-xs bg-muted p-4 rounded overflow-x-auto">
            {result.metadata.rawExtractedText}
          </pre>
        </details>
      )}
    </div>
  );
}
