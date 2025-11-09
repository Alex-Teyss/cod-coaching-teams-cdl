import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
          name: true,
          email: true,
          createdAt: true,
        },
        orderBy: {
          name: "asc",
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

      <div className="space-y-6">
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
                          <p className="font-medium">{player.name}</p>
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
      </div>
    </div>
  );
}
