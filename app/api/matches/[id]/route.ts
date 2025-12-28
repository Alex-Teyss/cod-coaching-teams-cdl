import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// DELETE - Supprimer un match
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Vérifier que le match existe et récupérer l'équipe associée
    const existingMatch = await prisma.match.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            coachId: true,
          },
        },
      },
    });

    if (!existingMatch) {
      return NextResponse.json(
        { error: "Match non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les permissions - seul le coach de l'équipe ou un admin peut supprimer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Seul le coach de l'équipe ou un admin peut supprimer le match
    if (user.role !== "ADMIN" && existingMatch.team.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce match" },
        { status: 403 }
      );
    }

    // Supprimer le match (les screenshots et playerStats seront supprimés en cascade)
    await prisma.match.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du match:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
