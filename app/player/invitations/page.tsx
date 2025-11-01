"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Invitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  team: {
    name: string;
    coach: {
      name: string;
    };
  };
}

export default function PlayerInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/invitations?type=received");
      if (!response.ok) throw new Error("Erreur lors du chargement des invitations");
      const data = await response.json();
      setInvitations(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les invitations");
    }
  };

  const handleInvitation = async (invitationId: string, action: "accept" | "decline") => {
    setError(null);
    setSuccess(null);
    setLoading(invitationId);

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du traitement de l'invitation");
      }

      if (action === "accept") {
        setSuccess("Invitation acceptée ! Vous faites maintenant partie de l'équipe.");
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push("/player/dashboard");
        }, 2000);
      } else {
        setSuccess("Invitation refusée.");
      }

      fetchInvitations();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mes invitations</h2>
        <p className="text-muted-foreground">
          Gérez vos invitations à rejoindre des équipes
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Invitations en attente</h3>
        </div>
        <div className="p-6">
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Vous n&apos;avez aucune invitation en attente
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Les invitations que vous recevrez apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="rounded-lg border bg-card p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">
                        {invitation.team.name}
                      </h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Coach:</span>{" "}
                          {invitation.team.coach.name}
                        </p>
                        <p>
                          <span className="font-medium">Invité le:</span>{" "}
                          {new Date(invitation.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Expire le:</span>{" "}
                          {new Date(invitation.expiresAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleInvitation(invitation.id, "accept")}
                        disabled={loading === invitation.id}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading === invitation.id ? "Traitement..." : "Accepter"}
                      </button>
                      <button
                        onClick={() => handleInvitation(invitation.id, "decline")}
                        disabled={loading === invitation.id}
                        className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
