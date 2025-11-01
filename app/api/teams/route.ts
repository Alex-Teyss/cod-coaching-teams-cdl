import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - Récupérer les équipes
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
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

    // Si admin, retourner toutes les équipes
    if (user.role === "ADMIN") {
      const teams = await prisma.team.findMany({
        include: {
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              players: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(teams);
    }

    // Si coach, retourner uniquement ses équipes
    if (user.role === "COACH") {
      const teams = await prisma.team.findMany({
        where: {
          coachId: session.user.id,
        },
        include: {
          coach: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              players: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(teams);
    }

    return NextResponse.json(
      { error: "Accès non autorisé" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer une équipe
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de l'équipe est requis" },
        { status: 400 }
      );
    }

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

    // Vérifier que l'utilisateur est coach ou admin
    if (user.role !== "COACH" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Vous devez être coach pour créer une équipe" },
        { status: 403 }
      );
    }

    // Créer l'équipe
    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        coachId: session.user.id,
      },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
