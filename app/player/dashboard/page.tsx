import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
              name: true,
              email: true,
            },
          },
          players: {
            select: {
              id: true,
              name: true,
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
        <div className="space-y-6">
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
                  Coach: {user.team.coach.name}
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
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
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
        </div>
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
