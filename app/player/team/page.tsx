import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

export default async function PlayerTeamPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Récupérer l'utilisateur avec son équipe
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
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
              createdAt: true,
            },
            orderBy: {
              username: "asc",
            },
          },
        },
      },
    },
  });

  const team = user?.team;

  if (!team) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mon équipe</h2>
          <p className="text-muted-foreground">
            Consultez les détails de votre équipe
          </p>
        </div>

        <div className="rounded-lg border bg-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Vous n&apos;avez pas encore d&apos;équipe
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Attendez qu&apos;un coach vous invite à rejoindre une équipe ou
            vérifiez vos invitations en attente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mon équipe</h2>
        <p className="text-muted-foreground">
          Consultez les détails de votre équipe
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-semibold">{team.name}</h3>
                {team.isValidated && (
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    ✓ Validée
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {team.players.length} joueur{team.players.length > 1 ? "s" : ""}{" "}
                sur 4
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Coach
            </h4>
            <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-semibold text-primary-foreground">
                  {team.coach.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{team.coach.username}</p>
                <p className="text-sm text-muted-foreground">
                  {team.coach.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Joueurs ({team.players.length}/4)
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 rounded-lg border p-4 ${
                    player.id === session.user.id
                      ? "bg-primary/5 border-primary/20"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {player.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{player.username}</p>
                      {player.id === session.user.id && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Vous
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {player.email}
                    </p>
                  </div>
                </div>
              ))}

              {/* Afficher les slots vides */}
              {Array.from({ length: 4 - team.players.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-3 rounded-lg border border-dashed p-4 bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Place disponible
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!team.isValidated && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <span className="font-semibold">Note:</span> Votre équipe
                n&apos;est pas encore validée par un administrateur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
