"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";

export default function NewTeamPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de l'équipe");
      }

      // Rediriger vers le dashboard
      router.push("/coach/dashboard");
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

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Créer une nouvelle équipe
        </h2>
        <p className="text-muted-foreground">
          Créez votre équipe et invitez des joueurs à la rejoindre
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
            <h4 className="font-medium mb-2">À propos des équipes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Une équipe doit avoir exactement 4 joueurs</li>
              <li>• L&apos;équipe sera validée automatiquement à 4 joueurs</li>
              <li>• Vous pourrez inviter des joueurs après la création</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !name.trim() || name.trim().length < 3}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création en cours..." : "Créer l'équipe"}
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
