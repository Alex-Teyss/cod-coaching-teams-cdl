import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [usersCount, teamsCount, coachesCount, playersCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.user.count({ where: { role: "COACH" } }),
      prisma.user.count({ where: { role: "PLAYER" } }),
    ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const teams = await prisma.team.findMany({
    include: {
      coach: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          players: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Vue d&apos;ensemble
        </h2>
        <p className="text-muted-foreground">
          Statistiques et gestion de la plateforme
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Utilisateurs
            </h3>
            <p className="text-3xl font-bold">{usersCount}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Équipes
            </h3>
            <p className="text-3xl font-bold">{teamsCount}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Coachs
            </h3>
            <p className="text-3xl font-bold">{coachesCount}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Joueurs
            </h3>
            <p className="text-3xl font-bold">{playersCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Utilisateurs récents</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Équipes</h3>
              <Link
                href="/admin/teams/new"
                className="text-sm text-primary hover:underline"
              >
                Créer une équipe
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune équipe pour le moment
                </p>
              ) : (
                teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Coach: {team.coach.name}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {team._count.players} joueur
                      {team._count.players > 1 ? "s" : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
