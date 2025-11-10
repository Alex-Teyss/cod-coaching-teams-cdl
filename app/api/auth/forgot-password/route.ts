import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Ne pas révéler si l'utilisateur existe ou non (sécurité)
    // Toujours retourner un succès pour éviter l'énumération d'emails
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      });
    }

    // Vérifier que l'utilisateur a un compte avec mot de passe (pas seulement OAuth)
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "email",
        password: { not: null },
      },
    });

    if (!account) {
      // L'utilisateur n'a pas de mot de passe (compte OAuth uniquement)
      return NextResponse.json({
        success: true,
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      });
    }

    // Générer un token de réinitialisation
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Supprimer les anciens tokens de réinitialisation pour cet utilisateur
    await prisma.verification.deleteMany({
      where: {
        identifier: `password-reset:${user.id}`,
      },
    });

    // Créer un nouveau token dans la table Verification
    await prisma.verification.create({
      data: {
        identifier: `password-reset:${user.id}`,
        value: token,
        expiresAt,
      },
    });

    // Envoyer l'email de réinitialisation (non bloquant)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    sendPasswordResetEmail({
      to: email,
      userName: user.name,
      resetUrl,
    }).then((result) => {
      if (result.success) {
        console.log(`Email de réinitialisation envoyé à ${email}`);
      } else {
        console.error(`Erreur lors de l'envoi de l'email à ${email}:`, result.error);
      }
    }).catch((error) => {
      console.error(`Exception lors de l'envoi de l'email à ${email}:`, error);
    });

    return NextResponse.json({
      success: true,
      message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

