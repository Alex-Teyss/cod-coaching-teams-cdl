import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "../[id]/route";
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
  players?: unknown[];
  invitations?: unknown[];
  _count?: { players: number };
};
type UpdateManyMock = { count: number };

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    team: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

describe("Team API - GET by ID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams/team-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 404 if team not found", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-1", email: "test@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams/team-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Équipe non trouvée");
  });

  it("should return 403 if user is not coach or admin", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-1", email: "test@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      name: "Team Alpha",
      coachId: "coach-1",
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      role: "PLAYER",
    } as UserMock);

    const request = new NextRequest("http://localhost/api/teams/team-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Accès non autorisé");
  });

  it("should return team for coach owner", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
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
      players: [],
      invitations: [],
      _count: { players: 0 },
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);

    const request = new NextRequest("http://localhost/api/teams/team-1");
    const response = await GET(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Team Alpha");
  });
});

describe("Team API - PATCH", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Team" }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 400 if name is empty", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "PATCH",
      body: JSON.stringify({ name: "" }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Le nom de l'équipe est requis");
  });

  it("should return 403 if user is not coach owner", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-1", email: "user@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      coachId: "coach-1",
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      role: "COACH",
    } as UserMock);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Team" }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Vous n'êtes pas autorisé à modifier cette équipe");
  });

  it("should update team successfully", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      name: "Team Alpha",
      coachId: "coach-1",
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);
    vi.mocked(prisma.team.update).mockResolvedValue({
      id: "team-1",
      name: "Updated Team",
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

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Team" }),
    });
    const response = await PATCH(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Updated Team");
  });
});

describe("Team API - DELETE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 404 if team not found", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Équipe non trouvée");
  });

  it("should return 403 if user is not coach owner", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user-1", email: "user@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      coachId: "coach-1",
      _count: { players: 0 },
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      role: "COACH",
    } as UserMock);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Vous n'êtes pas autorisé à supprimer cette équipe");
  });

  it("should delete team successfully", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      coachId: "coach-1",
      _count: { players: 0 },
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);
    vi.mocked(prisma.team.delete).mockResolvedValue({
      id: "team-1",
      name: "Team Alpha",
    } as TeamMock);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should remove players before deleting team", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "coach-1", email: "coach@test.com" } as SessionUser,
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
    vi.mocked(prisma.team.findUnique).mockResolvedValue({
      id: "team-1",
      coachId: "coach-1",
      _count: { players: 3 },
    } as TeamMock);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "coach-1",
      role: "COACH",
    } as UserMock);
    vi.mocked(prisma.user.updateMany).mockResolvedValue({ count: 3 } as UpdateManyMock);
    vi.mocked(prisma.team.delete).mockResolvedValue({
      id: "team-1",
      name: "Team Alpha",
    } as TeamMock);

    const request = new NextRequest("http://localhost/api/teams/team-1", {
      method: "DELETE",
    });
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "team-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.user.updateMany).toHaveBeenCalledWith({
      where: { teamId: "team-1" },
      data: { teamId: null },
    });
  });
});
