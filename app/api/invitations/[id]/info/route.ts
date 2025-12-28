import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer les informations d'une invitation (publique, pour les non-connectés)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer l'invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            name: true,
            coach: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    // Retourner les informations de l'invitation (sans données sensibles)
    return NextResponse.json({
      id: invitation.id,
      email: invitation.email,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      team: invitation.team,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

