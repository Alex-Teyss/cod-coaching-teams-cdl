import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Configuration de la plateforme
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Informations générales</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom de la plateforme</label>
              <input
                type="text"
                className="rounded-md border px-3 py-2 text-sm"
                defaultValue="COD Coaching Teams"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Fonctionnalité à venir
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Email de contact
              </label>
              <input
                type="email"
                className="rounded-md border px-3 py-2 text-sm"
                defaultValue="contact@codcoaching.com"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Fonctionnalité à venir
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Gestion des équipes</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Validation automatique
                </label>
                <p className="text-xs text-muted-foreground">
                  Les équipes sont automatiquement validées à la création
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded"
                disabled
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Nombre maximum de joueurs par équipe
              </label>
              <input
                type="number"
                className="rounded-md border px-3 py-2 text-sm w-24"
                defaultValue="4"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Fonctionnalité à venir
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Notifications par email
                </label>
                <p className="text-xs text-muted-foreground">
                  Envoyer des notifications pour les événements importants
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded"
                defaultChecked
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Notifications d&apos;invitation
                </label>
                <p className="text-xs text-muted-foreground">
                  Notifier les joueurs lors d&apos;une invitation à une équipe
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded"
                defaultChecked
                disabled
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-card">
          <div className="border-b border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-600">Zone dangereuse</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Réinitialiser toutes les équipes
                </label>
                <p className="text-xs text-muted-foreground">
                  Supprimer toutes les équipes et invitations
                </p>
              </div>
              <button
                className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
                disabled
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <span className="font-semibold">Note:</span> Cette page de paramètres
          est actuellement en mode lecture seule. Les fonctionnalités de
          modification seront disponibles dans une prochaine mise à jour.
        </p>
      </div>
    </div>
  );
}
