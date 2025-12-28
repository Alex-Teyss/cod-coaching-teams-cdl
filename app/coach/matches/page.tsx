import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { MatchList } from "@/components/matches/match-list";

export const metadata = {
  title: "Mes matchs - Coach",
  description: "Historique des matchs de votre équipe",
};

export default async function MatchesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "COACH") {
    redirect("/login");
  }

  // Récupérer toutes les équipes coachées par l'utilisateur
  const coachedTeams = await prisma.team.findMany({
    where: {
      coachId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const teamIds = coachedTeams.map((team) => team.id);

  // Récupérer tous les matchs des équipes coachées
  const matches = await prisma.match.findMany({
    where: {
      teamId: {
        in: teamIds,
      },
    },
    include: {
      team: {
        select: {
          name: true,
        },
      },
      playerStats: {
        select: {
          id: true,
          playerName: true,
          teamName: true,
          kills: true,
          deaths: true,
          assists: true,
          kdRatio: true,
          damage: true,
          hillTime: true,
          captures: true,
          defuses: true,
          plants: true,
          confidence: true,
          player: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Trouver l'équipe active si elle existe
  const activeTeam = session.user.teamId
    ? coachedTeams.find((team) => team.id === session.user.teamId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes matchs</h1>
        <p className="text-muted-foreground mt-2">
          {activeTeam
            ? `Historique des matchs de ${activeTeam.name}`
            : coachedTeams.length > 0
            ? `Historique de tous vos matchs (${coachedTeams.length} équipe${
                coachedTeams.length > 1 ? "s" : ""
              })`
            : "Aucune équipe trouvée"}
        </p>
      </div>

      <MatchList matches={matches} />
    </div>
  );
}
