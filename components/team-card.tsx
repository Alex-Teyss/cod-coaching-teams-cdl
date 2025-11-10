"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface Player {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface Team {
  id: string;
  name: string;
  image?: string | null;
  isValidated: boolean;
  _count: {
    players: number;
  };
  players: Player[];
  invitations: unknown[];
}

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      // Rafraîchir la page pour voir les changements
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card" data-testid="team-card">
        <div className="border-b p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {team.image && (
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={team.image}
                    alt={team.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{team.name}</h3>
                {team.isValidated && (
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    ✓ Validée
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/coach/teams/${team.id}/edit`}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                title="Modifier l'équipe"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                title="Supprimer l'équipe"
              >
                <Trash2 className="h-4 w-4" />
              </button>
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
                invitation{team.invitations.length > 1 ? "s" : ""} en attente
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                    {player.image ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={player.image}
                          alt={player.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-primary">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    )}
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

      {/* Dialog de confirmation de suppression */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              Supprimer l&apos;équipe
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Êtes-vous sûr de vouloir supprimer l&apos;équipe &quot;{team.name}&quot; ?
              {team._count.players > 0 && (
                <>
                  <br />
                  <br />
                  <span className="font-medium text-destructive">
                    Les {team._count.players} joueur{team._count.players > 1 ? "s" : ""} de
                    cette équipe seront retirés de l&apos;équipe.
                  </span>
                </>
              )}
            </p>

            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-3 mb-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
                className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
