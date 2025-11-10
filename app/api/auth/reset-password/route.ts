import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "better-auth/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Le token et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Trouver le token de réinitialisation
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        identifier: { startsWith: "password-reset:" },
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Extraire l'ID de l'utilisateur depuis l'identifier
    const userId = verification.identifier.replace("password-reset:", "");

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Hash le nouveau mot de passe en utilisant Better Auth's hashPassword
    const hashedPassword = await hashPassword(password);

    // Mettre à jour le mot de passe dans l'account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "email",
      },
    });

    if (!account) {
      // Créer un account si il n'existe pas (peu probable)
      await prisma.account.create({
        data: {
          accountId: user.email,
          providerId: "email",
          userId: user.id,
          password: hashedPassword,
        },
      });
    } else {
      // Mettre à jour le mot de passe existant
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedPassword },
      });
    }

    // Supprimer le token de réinitialisation (utilisé une seule fois)
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    // Invalider toutes les sessions existantes pour forcer une nouvelle connexion
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

