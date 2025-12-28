import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      team: {
        select: {
          name: true,
        },
      },
      coachedTeams: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    coaches: users.filter((u) => u.role === "COACH").length,
    players: users.filter((u) => u.role === "PLAYER").length,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "COACH":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "PLAYER":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Gestion des utilisateurs
        </h2>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de tous les utilisateurs de la plateforme
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total utilisateurs
            </h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Administrateurs
            </h3>
            <p className="text-3xl font-bold">{stats.admins}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Coachs
            </h3>
            <p className="text-3xl font-bold">{stats.coaches}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              Joueurs
            </h3>
            <p className="text-3xl font-bold">{stats.players}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tous les utilisateurs</h3>

        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Équipe/Détails
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Inscrit le
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-semibold text-primary">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          {user.emailVerified && (
                            <p className="text-xs text-green-600">
                              ✓ Email vérifié
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.role === "COACH" ? (
                        user.coachedTeams.length > 0 ? (
                          <div className="text-muted-foreground">
                            {user.coachedTeams.length} équipe
                            {user.coachedTeams.length > 1 ? "s" : ""}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            Aucune équipe
                          </div>
                        )
                      ) : user.role === "PLAYER" ? (
                        user.team ? (
                          <div className="text-muted-foreground">
                            {user.team.name}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            Sans équipe
                          </div>
                        )
                      ) : (
                        <div className="text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
