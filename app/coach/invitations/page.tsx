"use client";

import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  isValidated: boolean;
  _count: {
    players: number;
  };
}

interface Invitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  team: {
    name: string;
  };
}

export default function InvitationsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Erreur lors du chargement des équipes");
      const data = await response.json();
      setTeams(data);
      if (data.length > 0) {
        setSelectedTeamId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les équipes");
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/invitations?type=sent");
      if (!response.ok) throw new Error("Erreur lors du chargement des invitations");
      const data = await response.json();
      setInvitations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          teamId: selectedTeamId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi de l'invitation");
      }

      setSuccess("Invitation envoyée avec succès !");
      setEmail("");
      fetchInvitations();
      fetchTeams();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette invitation ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation");
      }

      setSuccess("Invitation annulée");
      fetchInvitations();
      fetchTeams();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Inviter des joueurs
        </h2>
        <p className="text-muted-foreground">
          Invitez des joueurs à rejoindre vos équipes
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

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Envoyer une invitation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="team" className="block text-sm font-medium mb-2">
              Équipe
            </label>
            <select
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
              required
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team._count.players}/4 joueurs)
                  {team.isValidated ? " ✓ Validée" : ""}
                </option>
              ))}
            </select>
            {selectedTeam && selectedTeam.isValidated && (
              <p className="text-sm text-muted-foreground mt-2">
                Cette équipe est déjà complète et validée
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email du joueur
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="joueur@example.com"
              required
              disabled={selectedTeam?.isValidated}
            />
          </div>

          <button
            type="submit"
            disabled={loading || selectedTeam?.isValidated || !selectedTeamId}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Envoi en cours..." : "Envoyer l'invitation"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Invitations envoyées</h3>
        </div>
        <div className="p-6">
          {invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune invitation envoyée
            </p>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.team.name} •{" "}
                      {invitation.status === "PENDING" && "En attente"}
                      {invitation.status === "ACCEPTED" && "Acceptée"}
                      {invitation.status === "DECLINED" && "Refusée"}
                      {invitation.status === "EXPIRED" && "Expirée"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expire le{" "}
                      {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {invitation.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
