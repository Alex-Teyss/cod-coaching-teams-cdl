import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getNotificationLink } from "@/lib/notification-links";

const MAX_TEAM_SIZE = 4;

// PATCH - Accepter ou refuser une invitation
export async function PATCH(
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
    const body = await request.json();
    const { action } = body; // 'accept' ou 'decline'

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json(
        { error: "Action invalide" },
        { status: 400 }
      );
    }

    // Récupérer l'invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            players: true,
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

    // Vérifier que l'invitation est pour l'utilisateur connecté
    if (invitation.email !== session.user.email) {
      return NextResponse.json(
        { error: "Cette invitation ne vous est pas destinée" },
        { status: 403 }
      );
    }

    // Vérifier que l'invitation est toujours valide
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cette invitation n'est plus valide" },
        { status: 400 }
      );
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "Cette invitation a expiré" },
        { status: 400 }
      );
    }

    if (action === "decline") {
      // Refuser l'invitation
      const updatedInvitation = await prisma.invitation.update({
        where: { id },
        data: { status: "DECLINED" },
        include: {
          team: {
            select: {
              name: true,
              coachId: true,
            },
          },
        },
      });

      // Créer une notification pour le coach
      const notificationMetadata = {
        invitationId: updatedInvitation.id,
        teamId: updatedInvitation.teamId,
        teamName: updatedInvitation.team.name,
        playerEmail: session.user.email,
      };

      await prisma.notification.create({
        data: {
          userId: updatedInvitation.team.coachId,
          type: "INVITATION_DECLINED",
          title: "Invitation refusée",
          message: `${session.user.email} a refusé l'invitation à rejoindre l'équipe ${updatedInvitation.team.name}`,
          metadata: {
            ...notificationMetadata,
            link: getNotificationLink({ type: "INVITATION_DECLINED", metadata: notificationMetadata }),
          },
        },
      });

      return NextResponse.json(updatedInvitation);
    }

    // Accepter l'invitation
    // Vérifier que l'équipe n'est pas pleine
    if (invitation.team.players.length >= MAX_TEAM_SIZE) {
      await prisma.invitation.update({
        where: { id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "L'équipe est déjà complète" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Vérifier si l'utilisateur a déjà un mot de passe configuré
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
      },
    });
    const hasPassword = account?.password ? true : false;

    if (!user) {
      // Créer l'utilisateur s'il n'existe pas encore
      // Cela peut arriver si l'invitation a été envoyée avant que l'utilisateur ne s'inscrive
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split("@")[0],
          role: "PLAYER",
          teamId: invitation.teamId,
          onboardingCompleted: hasPassword, // Skip onboarding if already has password
        },
      });
    } else {
      // Vérifier que l'utilisateur n'est pas déjà dans une autre équipe
      if (user.teamId && user.teamId !== invitation.teamId) {
        return NextResponse.json(
          { error: "Vous faites déjà partie d'une autre équipe" },
          { status: 400 }
        );
      }

      // Mettre à jour l'utilisateur pour l'ajouter à l'équipe
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          teamId: invitation.teamId,
          role: "PLAYER",
          // Only require onboarding if user doesn't have a password yet
          onboardingCompleted: hasPassword,
        },
      });
    }

    // Marquer l'invitation comme acceptée
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { status: "ACCEPTED" },
      include: {
        team: {
          select: {
            name: true,
            coachId: true,
          },
        },
      },
    });

    // Créer une notification pour le coach
    const acceptedNotificationMetadata = {
      invitationId: updatedInvitation.id,
      teamId: updatedInvitation.teamId,
      teamName: updatedInvitation.team.name,
      playerId: user.id,
      playerName: user.name,
    };

    await prisma.notification.create({
      data: {
        userId: updatedInvitation.team.coachId,
        type: "INVITATION_ACCEPTED",
        title: "Invitation acceptée",
        message: `${session.user.name || session.user.email} a accepté l'invitation et a rejoint l'équipe ${updatedInvitation.team.name}`,
        metadata: {
          ...acceptedNotificationMetadata,
          link: getNotificationLink({ type: "INVITATION_ACCEPTED", metadata: acceptedNotificationMetadata }),
        },
      },
    });

    // Vérifier si l'équipe atteint maintenant 4 joueurs pour la valider
    const teamPlayersCount = await prisma.user.count({
      where: { teamId: invitation.teamId },
    });

    if (teamPlayersCount === MAX_TEAM_SIZE) {
      await prisma.team.update({
        where: { id: invitation.teamId },
        data: { isValidated: true },
      });
    }

    return NextResponse.json({
      invitation: updatedInvitation,
      user,
      teamValidated: teamPlayersCount === MAX_TEAM_SIZE,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Annuler une invitation (par le coach)
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

    // Récupérer l'invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        team: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le coach de l'équipe
    if (invitation.team.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Supprimer l'invitation
    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
