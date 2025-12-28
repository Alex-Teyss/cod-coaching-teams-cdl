import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE } from "../[id]/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    match: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
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

describe("DELETE /api/matches/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete a match successfully when user is the coach", async () => {
    // Mock authentication
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        role: "COACH",
        email: "coach@test.com",
        username: "Coach",
        emailVerified: true,
        image: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId: "coach-1",
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
      },
    });

    // Mock user lookup
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "coach-1",
      role: "COACH",
      username: "Coach",
      email: "coach@test.com",
      emailVerified: true,
      image: null,
      teamId: "team-1",
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mock match lookup
    vi.mocked(prisma.match.findUnique).mockResolvedValueOnce({
      id: "match-1",
      teamId: "team-1",
      opponentTeamName: "Opponent Team",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 200,
      season: null,
      event: null,
      matchDuration: null,
      mapNumber: null,
      matchStatus: "completed",
      screenshotQuality: "good",
      createdAt: new Date(),
      updatedAt: new Date(),
      team: {
        coachId: "coach-1",
      },
    });

    // Mock delete
    vi.mocked(prisma.match.delete).mockResolvedValueOnce({
      id: "match-1",
      teamId: "team-1",
      opponentTeamName: "Opponent Team",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 200,
      season: null,
      event: null,
      matchDuration: null,
      mapNumber: null,
      matchStatus: "completed",
      screenshotQuality: "good",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest("http://localhost:3000/api/matches/match-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "match-1" }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(prisma.match.delete).toHaveBeenCalledWith({
      where: { id: "match-1" },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost:3000/api/matches/match-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "match-1" }),
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: "Non authentifié" });
  });

  it("should return 404 if match does not exist", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        role: "COACH",
        email: "coach@test.com",
        username: "Coach",
        emailVerified: true,
        image: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId: "coach-1",
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
      },
    });

    vi.mocked(prisma.match.findUnique).mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost:3000/api/matches/match-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "match-1" }),
    });

    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Match non trouvé" });
  });

  it("should return 403 if user is not the coach of the team", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-2",
        role: "COACH",
        email: "coach2@test.com",
        username: "Coach 2",
        emailVerified: true,
        image: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId: "coach-2",
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
      },
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "coach-2",
      role: "COACH",
      username: "Coach 2",
      email: "coach2@test.com",
      emailVerified: true,
      image: null,
      teamId: "team-2",
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.match.findUnique).mockResolvedValueOnce({
      id: "match-1",
      teamId: "team-1",
      opponentTeamName: "Opponent Team",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 200,
      season: null,
      event: null,
      matchDuration: null,
      mapNumber: null,
      matchStatus: "completed",
      screenshotQuality: "good",
      createdAt: new Date(),
      updatedAt: new Date(),
      team: {
        coachId: "coach-1",
      },
    });

    const request = new NextRequest("http://localhost:3000/api/matches/match-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "match-1" }),
    });

    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toEqual({ error: "Vous n'êtes pas autorisé à supprimer ce match" });
  });

  it("should allow admin to delete any match", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "admin-1",
        role: "ADMIN",
        email: "admin@test.com",
        username: "Admin",
        emailVerified: true,
        image: null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId: "admin-1",
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: null,
        userAgent: null,
      },
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "admin-1",
      role: "ADMIN",
      username: "Admin",
      email: "admin@test.com",
      emailVerified: true,
      image: null,
      teamId: null,
      onboardingCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(prisma.match.findUnique).mockResolvedValueOnce({
      id: "match-1",
      teamId: "team-1",
      opponentTeamName: "Opponent Team",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 200,
      season: null,
      event: null,
      matchDuration: null,
      mapNumber: null,
      matchStatus: "completed",
      screenshotQuality: "good",
      createdAt: new Date(),
      updatedAt: new Date(),
      team: {
        coachId: "coach-1",
      },
    });

    vi.mocked(prisma.match.delete).mockResolvedValueOnce({
      id: "match-1",
      teamId: "team-1",
      opponentTeamName: "Opponent Team",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 200,
      season: null,
      event: null,
      matchDuration: null,
      mapNumber: null,
      matchStatus: "completed",
      screenshotQuality: "good",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = new NextRequest("http://localhost:3000/api/matches/match-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "match-1" }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });
});
