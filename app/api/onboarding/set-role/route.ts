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

    // Mettre à jour le rôle de l'utilisateur et marquer l'onboarding comme complété
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        role,
        onboardingCompleted: true,
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
