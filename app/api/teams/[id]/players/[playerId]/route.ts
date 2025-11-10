import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotificationLink } from "@/lib/notification-links";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { id: teamId, playerId } = await params;

    // Vérifier que l'équipe existe
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que le joueur existe
    const player = await prisma.user.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Joueur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que le joueur appartient à l'équipe
    if (player.teamId !== teamId) {
      return NextResponse.json(
        { error: "Le joueur n'appartient pas à cette équipe" },
        { status: 400 }
      );
    }

    // Vérifier les permissions - seul le coach de l'équipe ou un admin peut retirer un joueur
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

    if (user.role !== "ADMIN" && team.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à retirer des joueurs de cette équipe" },
        { status: 403 }
      );
    }

    // Retirer le joueur de l'équipe
    await prisma.user.update({
      where: { id: playerId },
      data: { teamId: null },
    });

    // Si l'équipe était validée et a 4 joueurs, la rendre non validée
    if (team.isValidated) {
      const playerCount = await prisma.user.count({
        where: { teamId: teamId },
      });

      if (playerCount < 4) {
        await prisma.team.update({
          where: { id: teamId },
          data: { isValidated: false },
        });
      }
    }

    // Créer une notification pour le joueur retiré (asynchrone, non bloquant)
    const playerRemovedMetadata = {
      teamId: teamId,
      teamName: team.name,
      coachId: team.coachId,
    };

    prisma.notification.create({
      data: {
        userId: playerId,
        type: "PLAYER_REMOVED",
        title: "Vous avez été retiré de l'équipe",
        message: `Vous avez été retiré de l'équipe ${team.name} par le coach`,
        metadata: {
          ...playerRemovedMetadata,
          link: getNotificationLink({ type: "PLAYER_REMOVED", metadata: playerRemovedMetadata }),
        },
      },
    }).catch((error) => {
      console.error("Erreur lors de la création de la notification:", error);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du retrait du joueur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
