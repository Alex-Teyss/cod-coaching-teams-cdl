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

  // Récupérer le nom de notre équipe depuis la base de données
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });

  if (!team) {
    throw new Error("Équipe introuvable");
  }

  // Trouver notre équipe dans l'analyse en comparant les noms
  const ourTeam = teams.find(
    (t) => t.teamName?.toLowerCase() === team.name.toLowerCase()
  );

  // Trouver l'équipe adverse
  const opponentTeam = teams.find((t) => t !== ourTeam);

  // Déterminer le résultat du match SEULEMENT si notre équipe est trouvée
  let result: string | null = null;
  let ourScore = 0;
  let opponentScore = opponentTeam?.score || 0;

  if (ourTeam) {
    // Notre équipe a été trouvée dans le screenshot
    ourScore = ourTeam.score;

    if (ourTeam.winner === true) {
      result = "WIN";
    } else if (ourTeam.winner === false) {
      result = "LOSS";
    } else if (ourScore > opponentScore) {
      result = "WIN";
    } else if (ourScore < opponentScore) {
      result = "LOSS";
    } else {
      result = "DRAW";
    }
  }
  // Si ourTeam n'est pas trouvé, result reste null

  // Créer le match avec ses stats
  const match = await prisma.match.create({
    data: {
      opponentTeamName: opponentTeam?.teamName || "Équipe inconnue",
      game: game || null,
      gameMode: mode,
      map,
      ...(result !== null && { result }),
      teamScore: ourScore,
      opponentScore,
      season: metadata.season,
      event: metadata.event,
      matchDuration: metadata.matchDuration,
      mapNumber: metadata.mapNumber,
      matchStatus: metadata.matchStatus || "completed",
      screenshotQuality: metadata.screenshotQuality,
      team: {
        connect: { id: teamId },
      },
    },
  });

  // Récupérer les joueurs de l'équipe pour le matching
  const teamPlayers = await prisma.user.findMany({
    where: { teamId },
    select: { id: true, username: true },
  });

  // Sauvegarder les stats de TOUS les joueurs de TOUTES les équipes
  console.log("📊 [SAVE] Saving player stats for", teams.length, "teams");

  for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
    const team = teams[teamIndex];
    // Fallback si le teamName est vide ou undefined
    const teamName = team.teamName || `Équipe ${teamIndex + 1}`;

    console.log("👥 [SAVE] Processing team:", teamName, "- Players:", team.players?.length || 0);

    if (!team.players || team.players.length === 0) {
      console.log("⚠️  [SAVE] Skipping team with no players:", teamName);
      continue;
    }

    for (const player of team.players) {
      console.log("  👤 [SAVE] Saving stats for player:", player.name, "from team:", teamName);

      // Essayer de matcher le joueur avec un utilisateur de l'équipe
      const matchedPlayer = teamPlayers.find(
        (tp) => tp.username.toLowerCase() === player.name.toLowerCase()
      );

      // Sauvegarder les stats même si le joueur n'est pas matché
      await prisma.playerStats.create({
        data: {
          playerName: player.name,
          teamName: teamName,
          kills: player.kills || 0,
          deaths: player.deaths || 0,
          assists: player.assists || 0,
          kdRatio: player.ratio || 0,
          damage: player.damage || null,
          hillTime: player.hillTime || null,
          captures: player.captures || null,
          defuses: player.defuses || null,
          plants: player.plants || null,
          zoneTime: player.zoneTime || null,
          confidence: player.confidence || "medium",
          match: {
            connect: { id: match.id },
          },
          ...(matchedPlayer && {
            player: {
              connect: { id: matchedPlayer.id },
            },
          }),
        },
      });

      console.log("  ✅ [SAVE] Stats saved for:", player.name);
    }
  }

  console.log("✅ [SAVE] All player stats saved successfully");

  return match;
}
