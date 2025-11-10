import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendInvitationEmail } from "@/lib/email";

const MAX_TEAM_SIZE = 4;

// GET - Récupérer les invitations
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'sent' ou 'received'

  try {
    if (type === "sent") {
      // Pour les coachs : invitations envoyées
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { coachedTeams: true },
      });

      if (!user || (user.role !== "COACH" && user.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Accès non autorisé" },
          { status: 403 }
        );
      }

      const teamIds = user.coachedTeams.map((team) => team.id);

      if (teamIds.length === 0) {
        return NextResponse.json([]);
      }

      const invitations = await prisma.invitation.findMany({
        where: {
          teamId: { in: teamIds },
        },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(invitations);
    } else {
      // Pour les joueurs : invitations reçues
      const invitations = await prisma.invitation.findMany({
        where: {
          email: session.user.email,
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
        include: {
          team: {
            select: {
              name: true,
              coach: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(invitations);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des invitations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer une invitation
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, teamId } = body;

    if (!email || !teamId) {
      return NextResponse.json(
        { error: "Email et équipe requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est coach de cette équipe
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: true,
        invitations: {
          where: {
            status: "PENDING",
          },
        },
      },
    });

    if (!team || team.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Équipe non trouvée ou accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que l'équipe n'a pas déjà 4 joueurs
    const totalPlayers = team.players.length + team.invitations.length;
    if (totalPlayers >= MAX_TEAM_SIZE) {
      return NextResponse.json(
        { error: `L'équipe a déjà atteint le nombre maximum de ${MAX_TEAM_SIZE} joueurs (incluant les invitations en attente)` },
        { status: 400 }
      );
    }

    // Vérifier si une invitation existe déjà pour cet email et cette équipe
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        email_teamId: {
          email,
          teamId,
        },
      },
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      return NextResponse.json(
        { error: "Une invitation est déjà en attente pour cet email" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est déjà dans l'équipe
    const existingPlayer = team.players.find((player) => player.email === email);
    if (existingPlayer) {
      return NextResponse.json(
        { error: "Ce joueur fait déjà partie de l'équipe" },
        { status: 400 }
      );
    }

    // Créer l'invitation (expire dans 7 jours)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.upsert({
      where: {
        email_teamId: {
          email,
          teamId,
        },
      },
      update: {
        status: "PENDING",
        expiresAt,
        updatedAt: new Date(),
      },
      create: {
        email,
        teamId,
        expiresAt,
      },
      include: {
        team: {
          select: {
            name: true,
            coach: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Vérifier si l'utilisateur invité existe déjà
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    let emailSent = false;

    if (invitedUser) {
      // L'utilisateur existe : créer une notification au lieu d'envoyer un email
      await prisma.notification.create({
        data: {
          userId: invitedUser.id,
          type: "INVITATION_RECEIVED",
          title: "Nouvelle invitation",
          message: `Vous avez été invité à rejoindre l'équipe ${invitation.team.name} par ${invitation.team.coach.name}`,
          metadata: {
            invitationId: invitation.id,
            teamId: invitation.teamId,
            teamName: invitation.team.name,
          },
        },
      });
      console.log(`Notification créée pour l'utilisateur existant: ${email}`);
    } else {
      // L'utilisateur n'existe pas : envoyer un email d'invitation
      const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/player/invitations`;

      const emailResult = await sendInvitationEmail({
        to: email,
        teamName: invitation.team.name,
        coachName: invitation.team.coach.name,
        invitationUrl,
      });

      emailSent = emailResult.success;

      if (!emailResult.success) {
        console.warn("L'invitation a été créée mais l'email n'a pas pu être envoyé:", emailResult.error);
      }
    }

    return NextResponse.json({
      ...invitation,
      emailSent,
      notificationSent: !!invitedUser,
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'invitation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
