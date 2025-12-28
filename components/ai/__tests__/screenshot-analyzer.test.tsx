import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ScreenshotAnalyzer } from "../screenshot-analyzer";

// Mock fetch
global.fetch = vi.fn();

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
      ],
    },
    {
      teamName: "Team B",
      score: 180,
      winner: false,
      visible: true,
      players: [
        {
          name: "Player2",
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
  saved: false,
};

describe("ScreenshotAnalyzer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLInputElement).value = "";
    }
  });

  it("should render file upload input", () => {
    render(<ScreenshotAnalyzer />);
    expect(screen.getByLabelText("Screenshot de scoreboard")).toBeInTheDocument();
    expect(screen.getByText("Choisir un fichier")).toBeInTheDocument();
  });

  it("should display file name when file is selected", () => {
    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("scoreboard.png")).toBeInTheDocument();
  });

  it("should show analyze button after file selection", async () => {
    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    // Wait for analyze button to appear after FileReader processes the file
    await waitFor(() => {
      expect(screen.getByText("Analyser")).toBeInTheDocument();
    });
  });

  it("should show analyze and reset buttons after file selection", async () => {
    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Analyser")).toBeInTheDocument();
      expect(screen.getByText("Réinitialiser")).toBeInTheDocument();
    });
  });

  it("should call API and display results on analyze", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysisResult,
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/screenshots/analyze",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Black Ops 6")).toBeInTheDocument();
      expect(screen.getByText("Hardpoint")).toBeInTheDocument();
      expect(screen.getByText("Karachi")).toBeInTheDocument();
    });
  });

  it("should show loading state during analysis", async () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => mockAnalysisResult,
      } as Response), 100))
    );

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    expect(screen.getByText("Analyse en cours...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Analyse en cours...")).not.toBeInTheDocument();
    });
  });

  it("should disable buttons during analysis", async () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => mockAnalysisResult,
      } as Response), 100))
    );

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    expect(analyzeButton).toBeDisabled();
    expect(screen.getByText("Réinitialiser")).toBeDisabled();

    await waitFor(() => {
      expect(analyzeButton).not.toBeDisabled();
    });
  });

  it("should display error message when analysis fails", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Erreur d'authentification" }),
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Erreur d'analyse")).toBeInTheDocument();
      expect(screen.getByText("Erreur d'authentification")).toBeInTheDocument();
    });
  });

  it("should reset form when reset button is clicked", async () => {
    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("scoreboard.png")).toBeInTheDocument();

    const resetButton = await waitFor(() => screen.getByText("Réinitialiser"));
    fireEvent.click(resetButton);

    expect(screen.queryByText("scoreboard.png")).not.toBeInTheDocument();
    expect(screen.queryByText("Analyser")).not.toBeInTheDocument();
  });

  it("should show save match button when analysis is complete and not saved", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysisResult,
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Sauvegarder le match")).toBeInTheDocument();
    });
  });

  it("should show saved status when match is saved", async () => {
    const savedResult = {
      ...mockAnalysisResult,
      saved: true,
      matchId: "match-123",
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => savedResult,
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Match sauvegardé")).toBeInTheDocument();
      expect(screen.getByText(/ID: match-123/)).toBeInTheDocument();
    });
  });

  it("should handle save match action", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysisResult,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockAnalysisResult, saved: true, matchId: "match-456" }),
      } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Sauvegarder le match")).toBeInTheDocument();
    });

    const saveButton = screen.getByText("Sauvegarder le match");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Match sauvegardé")).toBeInTheDocument();
    });
  });

  it("should show save error if saving fails", async () => {
    const resultWithSaveError = {
      ...mockAnalysisResult,
      saved: false,
      saveError: "Le match n'a pas pu être sauvegardé en base de données",
    };

    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => resultWithSaveError,
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Erreur de sauvegarde")).toBeInTheDocument();
      expect(screen.getByText(/Le match n'a pas pu être sauvegardé/)).toBeInTheDocument();
    });
  });

  it("should clear error when new file is selected", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Test error" }),
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file1 = new File(["fake image"], "test1.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file1] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Test error")).toBeInTheDocument();
    });

    // Select new file
    const file2 = new File(["fake image"], "test2.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file2] } });

    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  it("should not call API if no file is selected", () => {
    render(<ScreenshotAnalyzer />);

    // Analyze button should not be visible without file
    expect(screen.queryByText("Analyser")).not.toBeInTheDocument();
  });

  it("should send saveToDatabase=false by default", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalysisResult,
    } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const formData = (global.fetch as any).mock.calls[0][1].body as FormData;
    expect(formData.get("saveToDatabase")).toBe("false");
  });

  it("should send saveToDatabase=true when saving match", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysisResult,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockAnalysisResult, saved: true }),
      } as Response);

    render(<ScreenshotAnalyzer />);

    const file = new File(["fake image"], "scoreboard.png", { type: "image/png" });
    const input = screen.getByLabelText("Screenshot de scoreboard");

    fireEvent.change(input, { target: { files: [file] } });

    const analyzeButton = await waitFor(() => screen.getByText("Analyser"));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText("Sauvegarder le match")).toBeInTheDocument();
    });

    const saveButton = screen.getByText("Sauvegarder le match");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    const formData = (global.fetch as any).mock.calls[1][1].body as FormData;
    expect(formData.get("saveToDatabase")).toBe("true");
  });
});
