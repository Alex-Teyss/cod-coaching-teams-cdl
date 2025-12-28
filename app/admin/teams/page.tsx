import { prisma } from "@/lib/prisma";

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({
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
      _count: {
        select: {
          players: true,
          invitations: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const validatedTeams = teams.filter((team) => team.isValidated).length;
  const pendingTeams = teams.filter((team) => !team.isValidated).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Gestion des équipes
        </h2>
        <p className="text-muted-foreground">
          Gérez et validez les équipes de la plateforme
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total équipes
            </h3>
            <p className="text-3xl font-bold">{teams.length}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Équipes validées
            </h3>
            <p className="text-3xl font-bold">{validatedTeams}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              En attente de validation
            </h3>
            <p className="text-3xl font-bold">{pendingTeams}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Toutes les équipes</h3>
        </div>

        {teams.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Aucune équipe pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="rounded-lg border bg-card">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{team.name}</h4>
                        {team.isValidated ? (
                          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                            ✓ Validée
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                            En attente
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Coach:</span>{" "}
                          {team.coach.username} ({team.coach.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Joueurs:</span>{" "}
                          {team._count.players} / 4
                        </p>
                        {team._count.invitations > 0 && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Invitations:</span>{" "}
                            {team._count.invitations} en attente
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(team.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  {team.players.length > 0 && (
                    <div className="pt-4 border-t">
                      <h5 className="text-sm font-medium mb-3">Joueurs</h5>
                      <div className="grid gap-2 md:grid-cols-2">
                        {team.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-2 rounded-lg border p-3"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-xs font-semibold text-primary">
                                {player.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {player.username}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {player.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
