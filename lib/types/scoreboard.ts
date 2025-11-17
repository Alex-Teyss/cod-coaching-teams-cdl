// Types for COD scoreboard analysis

export type GameMode = "Hardpoint" | "Search & Destroy" | "Control";
export type GameVersion = "Modern Warfare 3" | "Modern Warfare 2" | "Black Ops 6" | "Black Ops 7";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ScreenshotQuality = "good" | "medium" | "poor";

export interface PlayerScoreboardData {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  damage?: number;
  hillTime?: string;
  captures?: number;
  defuses?: number;
  plants?: number;
  zoneTime?: string;
  ratio: number;
  confidence: ConfidenceLevel;
}

export interface TeamScoreboardData {
  teamName: string;
  score: number;
  players: PlayerScoreboardData[];
}

export interface ScoreboardMetadata {
  timestampDetected?: string;
  screenshotQuality: ScreenshotQuality;
  rawExtractedText?: string;
}

export interface ScoreboardAnalysisResult {
  game: GameVersion;
  mode: GameMode;
  map: string;
  teams: TeamScoreboardData[];
  metadata: ScoreboardMetadata;
}

export interface ScoreboardAnalysisError {
  error: string;
  details?: string;
}
