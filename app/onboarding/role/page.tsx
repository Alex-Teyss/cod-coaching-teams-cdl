"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, User } from "lucide-react"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"COACH" | "PLAYER">("COACH")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/onboarding/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Une erreur est survenue")
        setIsLoading(false)
        return
      }

      // Rediriger vers l'onboarding spécifique au rôle
      if (selectedRole === "COACH") {
        router.push("/coach/onboarding")
      } else if (selectedRole === "PLAYER") {
        router.push("/player/dashboard")
      } else {
        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la sélection du rôle")
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Bienvenue !</CardTitle>
          <CardDescription className="text-lg mt-2">
            Choisissez votre rôle pour commencer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedRole("COACH")}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 relative ${
                selectedRole === "COACH"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg scale-105"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`rounded-full p-4 ${selectedRole === "COACH" ? "bg-blue-500/20" : "bg-muted"}`}>
                  <Users className={`w-12 h-12 ${selectedRole === "COACH" ? "text-blue-600" : "text-muted-foreground"}`} />
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${selectedRole === "COACH" ? "text-blue-600" : ""}`}>Coach</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Créez et gérez des équipes, invitez des joueurs
                  </p>
                </div>
                {selectedRole === "COACH" && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div
              onClick={() => setSelectedRole("PLAYER")}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 relative ${
                selectedRole === "PLAYER"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-lg scale-105"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`rounded-full p-4 ${selectedRole === "PLAYER" ? "bg-purple-500/20" : "bg-muted"}`}>
                  <User className={`w-12 h-12 ${selectedRole === "PLAYER" ? "text-purple-600" : "text-muted-foreground"}`} />
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold ${selectedRole === "PLAYER" ? "text-purple-600" : ""}`}>Joueur</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Rejoignez une équipe et participez aux entraînements
                  </p>
                </div>
                {selectedRole === "PLAYER" && (
                  <div className="absolute top-3 right-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Continuer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
