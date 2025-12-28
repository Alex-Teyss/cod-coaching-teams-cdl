import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "better-auth/crypto";
import { getNotificationLink } from "@/lib/notification-links";

const MAX_TEAM_SIZE = 4;

// POST - Créer un compte et accepter l'invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, password, email } = body;

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur, l'email et le mot de passe sont requis" },
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

    // Vérifier que l'email correspond
    if (invitation.email !== email) {
      return NextResponse.json(
        { error: "L'email ne correspond pas à l'invitation" },
        { status: 400 }
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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email. Veuillez vous connecter." },
        { status: 400 }
      );
    }

    // Hash le mot de passe en utilisant Better Auth's hashPassword
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur et l'account dans une transaction
    const user = await prisma.user.create({
      data: {
        email,
        username,
        role: "PLAYER",
        teamId: invitation.teamId,
        onboardingCompleted: true, // L'onboarding est complété car ils ont créé leur compte
        accounts: {
          create: {
            accountId: email,
            providerId: "email",
            password: hashedPassword,
          },
        },
      },
    });

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
      playerName: user.username,
    };

    await prisma.notification.create({
      data: {
        userId: updatedInvitation.team.coachId,
        type: "INVITATION_ACCEPTED",
        title: "Invitation acceptée",
        message: `${username} a accepté l'invitation et a rejoint l'équipe ${updatedInvitation.team.name}`,
        metadata: {
          ...acceptedNotificationMetadata,
          link: getNotificationLink({ type: "INVITATION_ACCEPTED", metadata: acceptedNotificationMetadata }),
        },
      },
    }).catch((error) => {
      console.error("Erreur lors de la création de la notification:", error);
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

      // Créer une notification pour le coach
      const teamValidatedMetadata = {
        teamId: invitation.teamId,
        teamName: updatedInvitation.team.name,
      };

      await prisma.notification.create({
        data: {
          userId: updatedInvitation.team.coachId,
          type: "TEAM_VALIDATED",
          title: "Équipe validée",
          message: `Votre équipe ${updatedInvitation.team.name} est maintenant complète et validée !`,
          metadata: {
            ...teamValidatedMetadata,
            link: getNotificationLink({ type: "TEAM_VALIDATED", metadata: teamValidatedMetadata }),
          },
        },
      }).catch((error) => {
        console.error("Erreur lors de la création de la notification:", error);
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      teamValidated: teamPlayersCount === MAX_TEAM_SIZE,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte via invitation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

