import { prisma } from "@/lib/prisma";
import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";

interface SaveMatchParams {
  teamId: string;
  analysisResult: ScoreboardAnalysisResult;
  uploadedBy: string;
}

export async function saveMatchFromAnalysis({
  teamId,
  analysisResult,
  uploadedBy,
}: SaveMatchParams) {
  const { game, mode, map, teams, metadata } = analysisResult;

  // Trouver l'équipe du coach (notre équipe)
  const ourTeam = teams.find((t) => t.visible !== false);
  const opponentTeam = teams.find((t, index) => index !== teams.indexOf(ourTeam));

  if (!ourTeam) {
    throw new Error("Aucune équipe visible dans l'analyse");
  }

  // Déterminer le résultat du match
  const ourScore = ourTeam.score;
  const opponentScore = opponentTeam?.score || 0;
  let result = "DRAW";

  if (ourTeam.winner === true) {
    result = "WIN";
  } else if (ourTeam.winner === false) {
    result = "LOSS";
  } else if (ourScore > opponentScore) {
    result = "WIN";
  } else if (ourScore < opponentScore) {
    result = "LOSS";
  }

  // Créer le match avec ses stats
  const match = await prisma.match.create({
    data: {
      teamId,
      opponentTeamName: opponentTeam?.teamName || "Équipe inconnue",
      game,
      gameMode: mode,
      map,
      result,
      teamScore: ourScore,
      opponentScore,
      season: metadata.season,
      event: metadata.event,
      matchDuration: metadata.matchDuration,
      mapNumber: metadata.mapNumber,
      matchStatus: metadata.matchStatus || "completed",
      screenshotQuality: metadata.screenshotQuality,
    },
  });

  // Récupérer les joueurs de l'équipe pour le matching
  const teamPlayers = await prisma.user.findMany({
    where: { teamId },
    select: { id: true, name: true },
  });

  // Sauvegarder les stats de chaque joueur
  for (const player of ourTeam.players) {
    // Essayer de matcher le joueur avec un utilisateur de l'équipe
    const matchedPlayer = teamPlayers.find(
      (tp) => tp.name.toLowerCase() === player.name.toLowerCase()
    );

    if (matchedPlayer) {
      await prisma.playerStats.create({
        data: {
          matchId: match.id,
          playerId: matchedPlayer.id,
          playerName: player.name,
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          kdRatio: player.ratio,
          damage: player.damage,
          hillTime: player.hillTime,
          captures: player.captures,
          defuses: player.defuses,
          plants: player.plants,
          zoneTime: player.zoneTime,
          confidence: player.confidence,
        },
      });
    }
  }

  return match;
}
