import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { TeamCard } from "@/components/team-card";

export default async function CoachTeamsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Récupérer toutes les équipes du coach
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
      _count: {
        select: {
          players: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mes équipes</h2>
          <p className="text-muted-foreground">
            Gérez toutes vos équipes et leurs joueurs
          </p>
        </div>
        <Link
          href="/coach/teams/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          Créer une équipe
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <PlusCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune équipe</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Vous n&apos;avez pas encore créé d&apos;équipe. Commencez par créer
            votre première équipe pour inviter des joueurs.
          </p>
          <Link
            href="/coach/teams/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Créer ma première équipe
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <div key={team.id} className="rounded-lg border bg-card">
              <div className="border-b p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    {team.isValidated && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                        ✓ Validée
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">
                      {team._count.players}
                    </span>{" "}
                    / 4 joueurs
                  </div>
                  {team.invitations.length > 0 && (
                    <div>
                      <span className="font-medium text-foreground">
                        {team.invitations.length}
                      </span>{" "}
                      invitation{team.invitations.length > 1 ? "s" : ""} en
                      attente
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                {team.players.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun joueur dans cette équipe
                  </p>
                ) : (
                  <div className="space-y-3">
                    {team.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-semibold text-primary">
                            {player.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{player.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {player.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
