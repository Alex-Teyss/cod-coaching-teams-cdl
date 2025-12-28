import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LatestMatches } from "@/components/dashboard/latest-matches";
import { MatchStatistics } from "@/components/dashboard/match-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, Trophy } from "lucide-react";

export default async function CoachDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Vérifier si l'utilisateur a complété l'onboarding (uniquement pour les coachs)
  if (session.user.role === "COACH") {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        onboardingCompleted: true,
      },
    });

    if (user && !user.onboardingCompleted) {
      redirect("/coach/onboarding");
    }
  }

  // Récupérer les équipes du coach
  const teams = await prisma.team.findMany({
    where: {
      coachId: session.user.id,
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          username: "asc",
        },
      },
      invitations: {
        where: {
          status: "PENDING",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPlayers = teams.reduce((acc, team) => acc + team.players.length, 0);

  // Fetch latest 3 matches for all coached teams
  const teamIds = teams.map((team) => team.id);
  const latestMatches = await prisma.match.findMany({
    where: {
      teamId: {
        in: teamIds,
      },
    },
    include: {
      playerStats: {
        select: {
          id: true,
          playerName: true,
          kills: true,
          deaths: true,
          assists: true,
          kdRatio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  // Calculate match statistics for all teams
  const allMatches = await prisma.match.findMany({
    where: {
      teamId: {
        in: teamIds,
      },
    },
    select: {
      result: true,
      playerStats: {
        select: {
          playerName: true,
          kdRatio: true,
        },
      },
    },
  });

  const wins = allMatches.filter((m) => m.result === "WIN").length;
  const losses = allMatches.filter((m) => m.result === "LOSS").length;
  const draws = allMatches.filter((m) => m.result === "DRAW").length;

  // Calculate average K/D and find top player
  const allPlayerStats = allMatches.flatMap((m) => m.playerStats);
  const averageKD =
    allPlayerStats.length > 0
      ? allPlayerStats.reduce((sum, stat) => sum + stat.kdRatio, 0) /
        allPlayerStats.length
      : 0;

  // Find top player by K/D ratio
  const playerKDs = allPlayerStats.reduce((acc, stat) => {
    if (!acc[stat.playerName]) {
      acc[stat.playerName] = { total: 0, count: 0 };
    }
    acc[stat.playerName].total += stat.kdRatio;
    acc[stat.playerName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const topPlayer = Object.entries(playerKDs).reduce(
    (top, [name, stats]) => {
      const avgKD = stats.total / stats.count;
      if (!top || avgKD > top.kdRatio) {
        return { name, kdRatio: avgKD };
      }
      return top;
    },
    null as { name: string; kdRatio: number } | null
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Mes équipes
        </h2>
        <p className="text-muted-foreground">
          Gérez vos équipes et vos joueurs
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Mes équipes
            </h3>
            <p className="text-3xl font-bold">{teams.length}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total joueurs
            </h3>
            <p className="text-3xl font-bold">{totalPlayers}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Moyenne par équipe
            </h3>
            <p className="text-3xl font-bold">
              {teams.length > 0 ? Math.round(totalPlayers / teams.length) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Équipes</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Matchs</span>
          </TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          {teams.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Vous n&apos;avez pas encore d&apos;équipe.
              </p>
              <Link
                href="/coach/teams/new"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Créer ma première équipe
              </Link>
            </div>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="rounded-lg border bg-card">
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        {team.isValidated && (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                            ✓ Validée
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {team.players.length} joueur
                        {team.players.length > 1 ? "s" : ""} sur 4
                        {team.invitations.length > 0 &&
                          ` • ${team.invitations.length} invitation${team.invitations.length > 1 ? "s" : ""} en attente`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {team.players.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun joueur dans cette équipe
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {team.players.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{player.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {player.email}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Inscrit le{" "}
                            {new Date(player.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          {allMatches.length > 0 ? (
            <MatchStatistics
              totalMatches={allMatches.length}
              wins={wins}
              losses={losses}
              draws={draws}
              averageKD={averageKD}
              topPlayer={topPlayer || undefined}
            />
          ) : (
            <div className="rounded-lg border bg-card p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune statistique disponible
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Les statistiques apparaîtront une fois que vos équipes auront joué des matchs
              </p>
            </div>
          )}
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-6">
          {latestMatches.length > 0 ? (
            <LatestMatches
              matches={latestMatches}
              teamName="Derniers matchs"
              showAllLink="/coach/matches"
              emptyMessage="Aucun match récent"
            />
          ) : (
            <div className="rounded-lg border bg-card p-12 text-center">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucun match récent
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Les matchs de vos équipes apparaîtront ici
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
