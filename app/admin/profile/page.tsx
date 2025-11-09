import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Informations du profil</h3>
        </div>
        <div className="p-6">
          <ProfileForm user={session.user} />
        </div>
      </div>
    </div>
  )
}
