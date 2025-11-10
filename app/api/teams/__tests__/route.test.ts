import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type SessionUser = { id: string; email: string };
type UserMock = { id: string; role: "ADMIN" | "COACH" | "PLAYER" };
type TeamMock = {
  id: string;
  name?: string;
  image?: string | null;
  isValidated?: boolean;
  coachId: string;
  createdAt?: Date;
  updatedAt?: Date;
  coach?: { id: string; name: string; email: string };
  _count?: { players: number };
};

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    team: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Teams API - GET", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-1", email: "test@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Utilisateur non trouvé");
  });

  it("should return all teams for admin", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "admin-1", email: "admin@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "admin-1",
      role: "ADMIN",
    } as UserMock);
    vi.mocked(prisma.team.findMany).mockResolvedValue([
      {
        id: "team-1",
        name: "Team Alpha",
        image: null,
        isValidated: false,
        coachId: "coach-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        coach: {
          id: "coach-1",
          name: "Coach One",
          email: "coach@test.com",
        },
        _count: { players: 2 },
      } as TeamMock,
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Team Alpha");
  });

  it("should return only coach teams for coach", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);
    vi.mocked(prisma.team.findMany).mockResolvedValue([
      {
        id: "team-1",
        name: "Team Alpha",
        image: null,
        isValidated: false,
        coachId: "coach-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        coach: {
          id: "coach-1",
          name: "Coach One",
          email: "coach@test.com",
        },
        _count: { players: 2 },
      } as TeamMock,
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].coachId).toBe("coach-1");
  });

  it("should return 403 for player role", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "player-1", email: "player@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "player-1",
      role: "PLAYER",
    } as UserMock);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Accès non autorisé");
  });
});

describe("Teams API - POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "Test Team" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 400 if name is missing", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);

    const request = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Le nom de l'équipe est requis");
  });

  it("should return 403 if user is not coach or admin", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "player-1", email: "player@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "player-1",
      role: "PLAYER",
    } as UserMock);

    const request = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "Test Team" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Vous devez être coach pour créer une équipe");
  });

  it("should create team successfully for coach", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);
    vi.mocked(prisma.team.create).mockResolvedValue({
      id: "team-1",
      name: "Test Team",
      image: null,
      isValidated: false,
      coachId: "coach-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      coach: {
        id: "coach-1",
        name: "Coach One",
        email: "coach@test.com",
      },
      _count: { players: 0 },
    } as TeamMock);

    const request = new NextRequest("http://localhost/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: "Test Team", image: null }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("Test Team");
    expect(data.coachId).toBe("coach-1");
  });
});
