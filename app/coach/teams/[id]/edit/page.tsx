"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

export default function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => setTeamId(p.id));
  }, [params]);

  // Charger les données de l'équipe
  useEffect(() => {
    if (!teamId) return;

    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du chargement de l'équipe");
        }

        setName(data.name);
        setImage(data.image || "");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur est survenue");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour de l'équipe");
      }

      // Rediriger vers la liste des équipes
      router.push("/coach/teams");
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

  if (fetchLoading) {
    return (
      <div className="max-w-2xl space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Modifier l&apos;équipe
        </h2>
        <p className="text-muted-foreground">
          Modifiez le nom et le logo de votre équipe
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="rounded-lg border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            value={image}
            onChange={setImage}
            onRemove={() => setImage("")}
            endpoint="teamImage"
            label="Logo de l'équipe"
            disabled={loading}
          />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom de l&apos;équipe <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Ex: Team Alpha"
              required
              minLength={3}
              maxLength={50}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Le nom doit contenir entre 3 et 50 caractères
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">Note importante</h4>
            <p className="text-sm text-muted-foreground">
              La modification du nom ou du logo n&apos;affectera pas les joueurs
              déjà présents dans l&apos;équipe.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !name.trim() || name.trim().length < 3}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mise à jour en cours..." : "Enregistrer les modifications"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
