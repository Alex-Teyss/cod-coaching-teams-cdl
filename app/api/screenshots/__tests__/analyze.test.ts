import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../analyze/route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/services/match-service", () => ({
  saveMatchFromAnalysis: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers()),
}));

vi.mock("openai", () => {
  const mockCreate = vi.fn();
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
    mockCreate,
  };
});

const { auth } = await import("@/lib/auth");
const { saveMatchFromAnalysis } = await import("@/lib/services/match-service");
const { mockCreate } = await import("openai");

// Mock sample analysis result
const mockAnalysisResult = {
  game: "Black Ops 6",
  mode: "Hardpoint",
  map: "Karachi",
  teams: [
    {
      teamName: "Team A",
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
      teamName: "Team B",
      score: 180,
      winner: false,
      visible: true,
      players: [
        {
          name: "Player3",
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
  },
};

describe("POST /api/screenshots/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Non authentifié");
  });

  it("should return 403 if user is not a coach", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "user-1",
        email: "player@test.com",
        name: "Player",
        role: "PLAYER",
      },
      session: {} as any,
    });

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Accès réservé aux coaches");
  });

  it("should return 400 if no image is provided", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
      },
      session: {} as any,
    });

    const formData = new FormData();
    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Aucune image fournie");
  });

  it("should analyze image successfully without saving to database", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
        teamId: "team-1",
      },
      session: {} as any,
    });

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockAnalysisResult),
          },
        },
      ],
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");
    formData.append("saveToDatabase", "false");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.game).toBe("Black Ops 6");
    expect(data.mode).toBe("Hardpoint");
    expect(data.map).toBe("Karachi");
    expect(data.saved).toBe(false);
    expect(saveMatchFromAnalysis).not.toHaveBeenCalled();
  });

  it("should analyze image and save to database when requested", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
        teamId: "team-1",
      },
      session: {} as any,
    });

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockAnalysisResult),
          },
        },
      ],
    } as any);

    vi.mocked(saveMatchFromAnalysis).mockResolvedValueOnce({
      id: "match-123",
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");
    formData.append("saveToDatabase", "true");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.saved).toBe(true);
    expect(data.matchId).toBe("match-123");
    expect(saveMatchFromAnalysis).toHaveBeenCalledWith({
      teamId: "team-1",
      analysisResult: expect.objectContaining({
        game: "Black Ops 6",
        mode: "Hardpoint",
      }),
      uploadedBy: "coach-1",
    });
  });

  it("should handle JSON wrapped in markdown code blocks", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
      },
      session: {} as any,
    });

    const wrappedJSON = "```json\n" + JSON.stringify(mockAnalysisResult) + "\n```";
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: wrappedJSON,
          },
        },
      ],
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.game).toBe("Black Ops 6");
  });

  it("should calculate K/D ratio for players if missing", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
      },
      session: {} as any,
    });

    const resultWithoutRatio = {
      ...mockAnalysisResult,
      teams: [
        {
          ...mockAnalysisResult.teams[0],
          players: [
            {
              name: "Player1",
              kills: 20,
              deaths: 10,
              assists: 5,
              // ratio is missing
            },
          ],
        },
      ],
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(resultWithoutRatio),
          },
        },
      ],
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.teams[0].players[0].ratio).toBe(2.0); // 20/10
  });

  it("should handle division by zero in K/D ratio calculation", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
      },
      session: {} as any,
    });

    const resultWithZeroDeaths = {
      ...mockAnalysisResult,
      teams: [
        {
          ...mockAnalysisResult.teams[0],
          players: [
            {
              name: "Player1",
              kills: 15,
              deaths: 0,
              assists: 5,
            },
          ],
        },
      ],
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(resultWithZeroDeaths),
          },
        },
      ],
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.teams[0].players[0].ratio).toBe(15); // kills when deaths = 0
  });

  it("should return analysis even if saving to database fails", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
        teamId: "team-1",
      },
      session: {} as any,
    });

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockAnalysisResult),
          },
        },
      ],
    } as any);

    vi.mocked(saveMatchFromAnalysis).mockRejectedValueOnce(
      new Error("Database error")
    );

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");
    formData.append("saveToDatabase", "true");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.saved).toBe(false);
    expect(data.saveError).toBeDefined();
    expect(data.game).toBe("Black Ops 6");
  });

  it("should return 500 if AI analysis fails", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
      },
      session: {} as any,
    });

    mockCreate.mockRejectedValueOnce(
      new Error("AI service error")
    );

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erreur lors de l'analyse");
  });

  it("should not save to database if user has no team", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValueOnce({
      user: {
        id: "coach-1",
        email: "coach@test.com",
        name: "Coach",
        role: "COACH",
        teamId: null,
      },
      session: {} as any,
    });

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockAnalysisResult),
          },
        },
      ],
    } as any);

    const formData = new FormData();
    const blob = new Blob(["fake image"], { type: "image/png" });
    formData.append("image", blob, "test.png");
    formData.append("saveToDatabase", "true");

    const request = new NextRequest("http://localhost:3000/api/screenshots/analyze", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.saved).toBe(false);
    expect(saveMatchFromAnalysis).not.toHaveBeenCalled();
  });
});
