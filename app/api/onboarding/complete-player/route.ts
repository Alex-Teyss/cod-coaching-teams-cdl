import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { hash } from "@node-rs/argon2"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { name, password } = body

    if (!name || !password) {
      return NextResponse.json(
        { error: "Le nom et le mot de passe sont requis" },
        { status: 400 }
      )
    }

    // Hash the password using argon2
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    // Update user with new name, password, and mark onboarding as completed
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name,
        onboardingCompleted: true,
      },
    })

    // Also update the password in the Account table
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (account) {
      await prisma.account.update({
        where: {
          id: account.id,
        },
        data: {
          password: hashedPassword,
        },
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
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
