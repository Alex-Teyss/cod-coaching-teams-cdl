import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - Récupérer une équipe spécifique
export async function GET(
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

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        coach: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        players: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true,
          },
          orderBy: {
            username: "asc",
          },
        },
        invitations: {
          where: {
            status: "PENDING",
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
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

    // Admin peut tout voir, coach ne peut voir que ses équipes
    if (user.role !== "ADMIN" && team.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour une équipe
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
    const { name, image } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de l'équipe est requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'équipe existe
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
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

    // Seul le coach de l'équipe ou un admin peut la modifier
    if (user.role !== "ADMIN" && existingTeam.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier cette équipe" },
        { status: 403 }
      );
    }

    // Mettre à jour l'équipe
    const team = await prisma.team.update({
      where: { id },
      data: {
        name: name.trim(),
        image: image || null,
      },
      include: {
        coach: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une équipe
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

    // Vérifier que l'équipe existe
    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
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

    // Seul le coach de l'équipe ou un admin peut la supprimer
    if (user.role !== "ADMIN" && existingTeam.coachId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer cette équipe" },
        { status: 403 }
      );
    }

    // Si l'équipe a des joueurs, les retirer de l'équipe
    if (existingTeam._count.players > 0) {
      await prisma.user.updateMany({
        where: { teamId: id },
        data: { teamId: null },
      });
    }

    // Supprimer l'équipe (les invitations seront supprimées en cascade grâce à onDelete: Cascade)
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
