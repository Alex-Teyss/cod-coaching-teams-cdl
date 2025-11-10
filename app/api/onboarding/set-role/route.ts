import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { role } = await request.json()

    if (!role || !["COACH", "PLAYER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
    }

    // Mettre à jour le rôle de l'utilisateur
    // Pour les coachs, onboardingCompleted reste false jusqu'à ce qu'ils complètent /coach/onboarding
    // Pour les joueurs, onboardingCompleted peut être true (ils n'ont pas besoin d'onboarding spécifique)
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role,
        // Seuls les joueurs peuvent avoir onboardingCompleted: true après la sélection de rôle
        // Les coachs doivent compléter /coach/onboarding
        onboardingCompleted: role === "PLAYER",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting role:", error)
    return NextResponse.json(
      { error: "Erreur lors de la définition du rôle" },
      { status: 500 }
    )
  }
}
