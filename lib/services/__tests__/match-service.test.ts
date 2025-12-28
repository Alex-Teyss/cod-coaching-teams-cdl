import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveMatchFromAnalysis } from "../match-service";
import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    team: {
      findUnique: vi.fn(),
    },
    match: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
    playerStats: {
      create: vi.fn(),
    },
  },
}));

const { prisma } = await import("@/lib/prisma");

const mockAnalysisResult: ScoreboardAnalysisResult = {
  game: "Black Ops 6",
  mode: "Hardpoint",
  map: "Karachi",
  teams: [
    {
      teamName: "Team Alpha",
      score: 250,
      winner: true,
      visible: true,
      players: [
        {
          name: "Player1",
          kills: 25,
          deaths: 18,
          assists: 12,
          damage: 4350,
          hillTime: "02:34",
          ratio: 1.39,
          confidence: "high",
        },
        {
          name: "Player2",
          kills: 20,
          deaths: 20,
          assists: 10,
          damage: 3800,
          hillTime: "01:45",
          ratio: 1.0,
          confidence: "high",
        },
      ],
    },
    {
      teamName: "Team Bravo",
      score: 180,
      winner: false,
      visible: true,
      players: [
        {
          name: "Opponent1",
          kills: 18,
          deaths: 22,
          assists: 8,
          damage: 3200,
          hillTime: "01:20",
          ratio: 0.82,
          confidence: "medium",
        },
      ],
    },
  ],
  metadata: {
    screenshotQuality: "good",
    matchStatus: "completed",
    scoreboardType: "end-of-match",
    season: "CDL 2024",
    event: "Major 1",
    matchDuration: "12:34",
    mapNumber: 1,
  },
};

describe("saveMatchFromAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a match with correct data", async () => {
    const mockMatch = {
      id: "match-123",
      teamId: "team-1",
      opponentTeamName: "Team Bravo",
      game: "Black Ops 6",
      gameMode: "Hardpoint",
      map: "Karachi",
      result: "WIN",
      teamScore: 250,
      opponentScore: 180,
      season: "CDL 2024",
      event: "Major 1",
      matchDuration: "12:34",
      mapNumber: 1,
      matchStatus: "completed",
      screenshotQuality: "good",
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce(mockMatch as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      { id: "user-1", username: "Player1" },
      { id: "user-2", username: "Player2" },
    ]);
    vi.mocked(prisma.playerStats.create).mockResolvedValue({} as any);

    const result = await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    expect(result).toEqual(mockMatch);
    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        team: { connect: { id: "team-1" } },
        opponentTeamName: "Team Bravo",
        game: "Black Ops 6",
        gameMode: "Hardpoint",
        map: "Karachi",
        result: "WIN",
        teamScore: 250,
        opponentScore: 180,
      }),
    });
  });

  it("should determine WIN result when our team wins", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-1" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        result: "WIN",
      }),
    });
  });

  it("should determine LOSS result when our team loses", async () => {
    const lossResult = {
      ...mockAnalysisResult,
      teams: [
        {
          ...mockAnalysisResult.teams[0],
          score: 150,
          winner: false,
        },
        {
          ...mockAnalysisResult.teams[1],
          score: 250,
          winner: true,
        },
      ],
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-1" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: lossResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        result: "LOSS",
      }),
    });
  });

  it("should determine DRAW result when scores are equal", async () => {
    const drawResult = {
      ...mockAnalysisResult,
      teams: [
        {
          ...mockAnalysisResult.teams[0],
          score: 200,
          winner: undefined,
        },
        {
          ...mockAnalysisResult.teams[1],
          score: 200,
          winner: undefined,
        },
      ],
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-1" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: drawResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        result: "DRAW",
      }),
    });
  });

  it("should create player stats for matched players", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      { id: "user-1", username: "Player1" },
      { id: "user-2", username: "Player2" },
    ]);
    vi.mocked(prisma.playerStats.create).mockResolvedValue({} as any);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    // Should create stats for all 3 players (2 from Team Alpha + 1 from Team Bravo)
    expect(prisma.playerStats.create).toHaveBeenCalledTimes(3);
    expect(prisma.playerStats.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        playerName: "Player1",
        kills: 25,
        deaths: 18,
        assists: 12,
        damage: 4350,
        hillTime: "02:34",
        kdRatio: 1.39,
        confidence: "high",
        player: { connect: { id: "user-1" } },
      }),
    });
  });

  it("should match players case-insensitively", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      { id: "user-1", username: "PLAYER1" },
      { id: "user-2", username: "player2" },
    ]);
    vi.mocked(prisma.playerStats.create).mockResolvedValue({} as any);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    // Should create stats for all 3 players (2 from Team Alpha + 1 from Team Bravo)
    expect(prisma.playerStats.create).toHaveBeenCalledTimes(3);
  });

  it("should save player stats for all players from all teams", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      { id: "user-1", username: "Player1" },
      // Player2 is not in the team
    ]);
    vi.mocked(prisma.playerStats.create).mockResolvedValue({} as any);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    // Should create stats for all 3 players (2 from Team Alpha, 1 from Team Bravo)
    expect(prisma.playerStats.create).toHaveBeenCalledTimes(3);
  });

  it("should handle missing opponent team", async () => {
    const singleTeamResult = {
      ...mockAnalysisResult,
      teams: [mockAnalysisResult.teams[0]],
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: singleTeamResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        opponentTeamName: "Équipe inconnue",
        opponentScore: 0,
      }),
    });
  });

  it("should set result to undefined when team name is not found", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "My Team" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-1" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    const createCall = vi.mocked(prisma.match.create).mock.calls[0][0];
    expect(createCall.data).toMatchObject({
      teamScore: 0,
      result: undefined,
    });
  });

  it("should save all player stats fields", async () => {
    const detailedResult: ScoreboardAnalysisResult = {
      ...mockAnalysisResult,
      teams: [
        {
          teamName: "Team Alpha",
          score: 6,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 10,
              deaths: 5,
              assists: 3,
              damage: 2000,
              plants: 2,
              defuses: 1,
              ratio: 2.0,
              confidence: "high",
            },
          ],
        },
      ],
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([
      { id: "user-1", username: "Player1" },
    ]);
    vi.mocked(prisma.playerStats.create).mockResolvedValue({} as any);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: detailedResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.playerStats.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        plants: 2,
        defuses: 1,
        damage: 2000,
      }),
    });
  });

  it("should handle metadata with all optional fields", async () => {
    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: mockAnalysisResult,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        season: "CDL 2024",
        event: "Major 1",
        matchDuration: "12:34",
        mapNumber: 1,
        matchStatus: "completed",
        screenshotQuality: "good",
      }),
    });
  });

  it("should default matchStatus to completed if not provided", async () => {
    const resultWithoutStatus = {
      ...mockAnalysisResult,
      metadata: {
        ...mockAnalysisResult.metadata,
        matchStatus: undefined,
      },
    };

    vi.mocked(prisma.team.findUnique).mockResolvedValueOnce({ name: "Team Alpha" } as any);
    vi.mocked(prisma.match.create).mockResolvedValueOnce({ id: "match-123" } as any);
    vi.mocked(prisma.user.findMany).mockResolvedValueOnce([]);

    await saveMatchFromAnalysis({
      teamId: "team-1",
      analysisResult: resultWithoutStatus,
      uploadedBy: "coach-1",
    });

    expect(prisma.match.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        matchStatus: "completed",
      }),
    });
  });
});
