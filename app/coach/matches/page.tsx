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

  if (!session.user.teamId) {
    redirect("/coach/teams/new");
  }

  // Récupérer les matchs de l'équipe du coach
  const matches = await prisma.match.findMany({
    where: {
      teamId: session.user.teamId,
    },
    include: {
      playerStats: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
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

  const team = await prisma.team.findUnique({
    where: { id: session.user.teamId },
    select: {
      name: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes matchs</h1>
        <p className="text-muted-foreground mt-2">
          Historique des matchs de {team?.name}
        </p>
      </div>

      <MatchList matches={matches} />
    </div>
  );
}
