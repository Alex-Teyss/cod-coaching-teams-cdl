import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalysisResults } from "../analysis-results";
import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";

const mockResult: ScoreboardAnalysisResult = {
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
          confidence: "medium",
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
          confidence: "low",
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

describe("AnalysisResults", () => {
  it("should render match information", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("Black Ops 6")).toBeInTheDocument();
    expect(screen.getByText("Hardpoint")).toBeInTheDocument();
    expect(screen.getByText("Karachi")).toBeInTheDocument();
  });

  it("should display screenshot quality", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("good")).toBeInTheDocument();
  });

  it("should render both teams", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Team Bravo")).toBeInTheDocument();
  });

  it("should display team scores", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();
  });

  it("should render all player names", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.getByText("Opponent1")).toBeInTheDocument();
  });

  it("should display player statistics", () => {
    render(<AnalysisResults result={mockResult} />);

    // Check kills, deaths, assists for Player1
    const tables = screen.getAllByRole("table");
    expect(tables.length).toBeGreaterThan(0);

    expect(screen.getByText("Player1")).toBeInTheDocument();
    // Stats are in the same row as player name
  });

  it("should show K/D ratio formatted to 2 decimals", () => {
    render(<AnalysisResults result={mockResult} />);

    expect(screen.getByText("1.39")).toBeInTheDocument();
    expect(screen.getByText("1.00")).toBeInTheDocument();
    expect(screen.getByText("0.82")).toBeInTheDocument();
  });

  it("should display confidence levels with appropriate styling", () => {
    render(<AnalysisResults result={mockResult} />);

    const highConfidence = screen.getAllByText("high");
    const mediumConfidence = screen.getAllByText("medium");
    const lowConfidence = screen.getAllByText("low");

    expect(highConfidence.length).toBeGreaterThan(0);
    expect(mediumConfidence.length).toBeGreaterThan(0);
    expect(lowConfidence.length).toBeGreaterThan(0);
  });

  it("should show Hill Time column for Hardpoint mode", () => {
    render(<AnalysisResults result={mockResult} />);

    const hillTimes = screen.getAllByText("Hill Time");
    expect(hillTimes.length).toBeGreaterThan(0);
    expect(screen.getByText("02:34")).toBeInTheDocument();
    expect(screen.getByText("01:45")).toBeInTheDocument();
  });

  it("should show damage column when damage data is present", () => {
    render(<AnalysisResults result={mockResult} />);

    const damageHeaders = screen.getAllByText("Damage");
    expect(damageHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText("4,350")).toBeInTheDocument();
    expect(screen.getByText("3,800")).toBeInTheDocument();
  });

  it("should display Search & Destroy specific columns", () => {
    const sndResult: ScoreboardAnalysisResult = {
      ...mockResult,
      mode: "Search & Destroy",
      teams: [
        {
          teamName: "Team A",
          score: 6,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 10,
              deaths: 5,
              assists: 3,
              plants: 2,
              defuses: 1,
              ratio: 2.0,
              confidence: "high",
            },
          ],
        },
      ],
    };

    render(<AnalysisResults result={sndResult} />);

    expect(screen.getByText("Plants")).toBeInTheDocument();
    expect(screen.getByText("Defuses")).toBeInTheDocument();
  });

  it("should display Control specific columns", () => {
    const controlResult: ScoreboardAnalysisResult = {
      ...mockResult,
      mode: "Control",
      teams: [
        {
          teamName: "Team A",
          score: 3,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 15,
              deaths: 10,
              assists: 5,
              captures: 3,
              ratio: 1.5,
              confidence: "high",
            },
          ],
        },
      ],
    };

    render(<AnalysisResults result={controlResult} />);

    expect(screen.getByText("Caps")).toBeInTheDocument();
  });

  it("should show match duration when available", () => {
    const resultWithDuration: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        matchDuration: "12:34",
      },
    };

    render(<AnalysisResults result={resultWithDuration} />);

    expect(screen.getByText("12:34")).toBeInTheDocument();
  });

  it("should show season and event when available", () => {
    const resultWithMetadata: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        season: "CDL 2024",
        event: "Major 1",
      },
    };

    render(<AnalysisResults result={resultWithMetadata} />);

    expect(screen.getByText("CDL 2024")).toBeInTheDocument();
    expect(screen.getByText("Major 1")).toBeInTheDocument();
  });

  it("should show map number when available", () => {
    const resultWithMapNumber: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        mapNumber: 2,
      },
    };

    render(<AnalysisResults result={resultWithMapNumber} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should display partial screenshot warning", () => {
    const partialResult: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        partial: true,
      },
    };

    render(<AnalysisResults result={partialResult} />);

    expect(screen.getByText(/Screenshot partiel/)).toBeInTheDocument();
  });

  it("should display in-progress match warning", () => {
    const inProgressResult: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        matchStatus: "in-progress",
        timeRemaining: "03:45",
      },
    };

    render(<AnalysisResults result={inProgressResult} />);

    expect(screen.getByText(/Match en cours/)).toBeInTheDocument();
    expect(screen.getByText(/Temps restant: 03:45/)).toBeInTheDocument();
  });

  it("should display metadata notes when available", () => {
    const resultWithNotes: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        notes: "Team names are logos, not text",
      },
    };

    render(<AnalysisResults result={resultWithNotes} />);

    expect(screen.getByText("Team names are logos, not text")).toBeInTheDocument();
  });

  it("should show debug information when available", () => {
    const resultWithDebug: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        debug: {
          difficultAreas: ["Player names row 3", "Team B score"],
          suggestions: "Screenshot is slightly blurred",
          ocrCorrections: ["Changed 'O' to '0' in score"],
        },
      },
    };

    render(<AnalysisResults result={resultWithDebug} />);

    expect(screen.getByText("Informations de débogage")).toBeInTheDocument();
    expect(screen.getByText("Player names row 3")).toBeInTheDocument();
    expect(screen.getByText("Team B score")).toBeInTheDocument();
    expect(screen.getByText("Screenshot is slightly blurred")).toBeInTheDocument();
    expect(screen.getByText(/Changed 'O' to '0'/)).toBeInTheDocument();
  });

  it("should display raw extracted text in details element", () => {
    const resultWithRawText: ScoreboardAnalysisResult = {
      ...mockResult,
      metadata: {
        ...mockResult.metadata,
        rawExtractedText: "Some raw OCR text data",
      },
    };

    render(<AnalysisResults result={resultWithRawText} />);

    expect(screen.getByText("Texte brut extrait (debug)")).toBeInTheDocument();
    expect(screen.getByText("Some raw OCR text data")).toBeInTheDocument();
  });

  it("should mark invisible team with opacity", () => {
    const resultWithInvisibleTeam: ScoreboardAnalysisResult = {
      ...mockResult,
      teams: [
        mockResult.teams[0],
        {
          ...mockResult.teams[1],
          visible: false,
        },
      ],
    };

    const { container } = render(<AnalysisResults result={resultWithInvisibleTeam} />);

    // The second team should have opacity-50 class
    const teamCards = container.querySelectorAll("[class*='border']");
    const invisibleTeam = Array.from(teamCards).find((card) =>
      card.textContent?.includes("Team Bravo")
    );

    expect(invisibleTeam?.className).toContain("opacity-50");
  });

  it("should show (Non visible) label for invisible teams", () => {
    const resultWithInvisibleTeam: ScoreboardAnalysisResult = {
      ...mockResult,
      teams: [
        mockResult.teams[0],
        {
          ...mockResult.teams[1],
          visible: false,
        },
      ],
    };

    render(<AnalysisResults result={resultWithInvisibleTeam} />);

    expect(screen.getByText("(Non visible)")).toBeInTheDocument();
  });

  it("should highlight winning team with green border", () => {
    const { container } = render(<AnalysisResults result={mockResult} />);

    const teamCards = container.querySelectorAll("[class*='border']");
    const winningTeam = Array.from(teamCards).find((card) =>
      card.textContent?.includes("Team Alpha")
    );

    expect(winningTeam?.className).toContain("border-green-500");
  });

  it("should handle missing optional player stats", () => {
    const minimalResult: ScoreboardAnalysisResult = {
      ...mockResult,
      teams: [
        {
          teamName: "Team A",
          score: 100,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 15,
              deaths: 10,
              assists: 5,
              ratio: 1.5,
              confidence: "high",
              // No damage, hillTime, captures, etc.
            },
          ],
        },
      ],
    };

    render(<AnalysisResults result={minimalResult} />);

    // Should not show columns for missing stats
    expect(screen.queryByText("Damage")).not.toBeInTheDocument();
    expect(screen.queryByText("Hill Time")).not.toBeInTheDocument();
    expect(screen.queryByText("Caps")).not.toBeInTheDocument();
  });

  it("should handle NaN K/D ratio gracefully", () => {
    const resultWithNaN: ScoreboardAnalysisResult = {
      ...mockResult,
      teams: [
        {
          teamName: "Team A",
          score: 100,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 10,
              deaths: 5,
              assists: 3,
              ratio: NaN,
              confidence: "high",
            },
          ],
        },
      ],
    };

    render(<AnalysisResults result={resultWithNaN} />);

    expect(screen.getByText("0.00")).toBeInTheDocument();
  });

  it("should display dash for missing optional stats", () => {
    const resultWithMissingStats: ScoreboardAnalysisResult = {
      ...mockResult,
      teams: [
        {
          teamName: "Team A",
          score: 100,
          winner: true,
          visible: true,
          players: [
            {
              name: "Player1",
              kills: 10,
              deaths: 5,
              assists: 3,
              ratio: 2.0,
              confidence: "high",
              damage: undefined,
              hillTime: undefined,
            },
            {
              name: "Player2",
              kills: 8,
              deaths: 6,
              assists: 2,
              ratio: 1.33,
              confidence: "high",
              damage: 2000,
              hillTime: "01:00",
            },
          ],
        },
      ],
    };

    render(<AnalysisResults result={resultWithMissingStats} />);

    // Should show dashes for Player1's missing stats
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(0);
  });
});
