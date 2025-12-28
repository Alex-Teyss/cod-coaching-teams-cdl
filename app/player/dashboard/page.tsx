import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LatestMatches } from "@/components/dashboard/latest-matches";
import { MatchStatistics } from "@/components/dashboard/match-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, Trophy } from "lucide-react";

export default async function PlayerDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        include: {
          coach: {
            select: {
              username: true,
              email: true,
            },
          },
          players: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const pendingInvitations = await prisma.invitation.count({
    where: {
      email: session.user.email,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
  });

  // Fetch latest 3 matches for the team
  const latestMatches = user?.teamId ? await prisma.match.findMany({
    where: {
      teamId: user.teamId,
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
  }) : [];

  // Calculate match statistics for the team
  const allMatches = user?.teamId ? await prisma.match.findMany({
    where: {
      teamId: user.teamId,
    },
    select: {
      result: true,
      playerStats: {
        where: {
          playerId: session.user.id,
        },
        select: {
          kdRatio: true,
        },
      },
    },
  }) : [];

  const wins = allMatches.filter(m => m.result === "WIN").length;
  const losses = allMatches.filter(m => m.result === "LOSS").length;
  const draws = allMatches.filter(m => m.result === "DRAW").length;

  // Calculate player's average K/D
  const playerStats = allMatches.flatMap(m => m.playerStats);
  const averageKD = playerStats.length > 0
    ? playerStats.reduce((sum, stat) => sum + stat.kdRatio, 0) / playerStats.length
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mon équipe</h2>
        <p className="text-muted-foreground">
          Informations sur votre équipe et vos coéquipiers
        </p>
      </div>

      {pendingInvitations > 0 && (
        <div className="rounded-lg border border-primary bg-primary/10 p-4">
          <p className="text-sm font-medium">
            Vous avez {pendingInvitations} invitation{pendingInvitations > 1 ? "s" : ""} en attente !
          </p>
          <a
            href="/player/invitations"
            className="text-sm text-primary hover:underline"
          >
            Voir les invitations →
          </a>
        </div>
      )}

      {user?.team ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Équipe</span>
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

          {/* Team Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{user.team.name}</h3>
                    {user.team.isValidated && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                        ✓ Équipe validée
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Coach: {user.team.coach.username}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{user.team.players.length}</p>
                  <p className="text-sm text-muted-foreground">sur 4 joueurs</p>
                </div>
              </div>

              {!user.team.isValidated && (
                <div className="rounded-lg bg-muted p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    L&apos;équipe sera validée une fois que les 4 joueurs auront rejoint.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold">Membres de l&apos;équipe</h4>
                {user.team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium">
                          {player.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.email}
                        </p>
                      </div>
                    </div>
                    {player.id === session.user.id && (
                      <span className="text-xs text-muted-foreground">Vous</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
              />
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucune statistique disponible
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les statistiques apparaîtront une fois que votre équipe aura joué des matchs
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
                emptyMessage="Aucun match récent pour votre équipe"
              />
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucun match récent
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Les matchs de votre équipe apparaîtront ici
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-2">
            Vous ne faites pas encore partie d&apos;une équipe
          </p>
          {pendingInvitations === 0 && (
            <p className="text-sm text-muted-foreground">
              Attendez qu&apos;un coach vous invite à rejoindre son équipe
            </p>
          )}
        </div>
      )}
    </div>
  );
}
