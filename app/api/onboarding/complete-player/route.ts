import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { hashPassword } from "better-auth/crypto"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur et le mot de passe sont requis" },
        { status: 400 }
      )
    }

    // Hash the password using Better Auth's hashPassword function
    // Cela garantit la compatibilité avec le système d'authentification de Better Auth
    const hashedPassword = await hashPassword(password)

    // Update user with new username and mark onboarding as completed
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: username,
        onboardingCompleted: true,
      },
    })

    // Chercher ou créer un compte email pour cet utilisateur
    let emailAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "email",
      },
    })

    if (emailAccount) {
      // Mettre à jour le mot de passe du compte email existant
      await prisma.account.update({
        where: {
          id: emailAccount.id,
        },
        data: {
          password: hashedPassword,
        },
      })
    } else {
      // Créer un nouveau compte email si l'utilisateur n'en a pas (par exemple, s'il s'est inscrit avec Google)
      emailAccount = await prisma.account.create({
        data: {
          accountId: session.user.email!,
          providerId: "email",
          userId: session.user.id,
          password: hashedPassword,
        },
      })
    }

    // Note: On ne supprime pas les sessions car l'utilisateur est déjà connecté
    // Le mot de passe est maintenant disponible pour les futures connexions
    // Si l'utilisateur était connecté via OAuth, il reste connecté
    // S'il se déconnecte et se reconnecte plus tard, il pourra utiliser email/password

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Error completing player onboarding:", error)
    return NextResponse.json(
      { error: "Erreur lors de la finalisation de l'onboarding" },
      { status: 500 }
    )
  }
}

