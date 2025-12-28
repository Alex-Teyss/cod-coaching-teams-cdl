// Types for COD scoreboard analysis

export type GameMode = "Hardpoint" | "Search & Destroy" | "Control";
export type GameVersion = "Modern Warfare 3" | "Modern Warfare 2" | "Black Ops 6" | "Black Ops 7";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ScreenshotQuality = "good" | "medium" | "poor";
export type MatchStatus = "completed" | "in-progress";
export type ScoreboardType = "end-of-match" | "mid-game";

export interface PlayerScoreboardData {
  name: string;
  kills: number;
  deaths: number;
  assists: number;
  damage?: number;
  hillTime?: string;          // Hardpoint: temps sur la colline (MM:SS)
  objectiveKills?: number;    // Hardpoint: kills sur l'objectif
  contestedHillTime?: string; // Hardpoint: temps contesté (MM:SS)
  captures?: number;          // Control
  defuses?: number;           // Search & Destroy
  plants?: number;            // Search & Destroy
  zoneTime?: string;          // Control: temps de zone (MM:SS)
  ratio: number;
  confidence: ConfidenceLevel;
}

export interface TeamScoreboardData {
  teamName: string;
  score: number;
  winner?: boolean;
  visible?: boolean;
  players: PlayerScoreboardData[];
}

export interface DebugInfo {
  difficultAreas?: string[];
  suggestions?: string;
  ocrCorrections?: string[];
}

export interface ScoreboardMetadata {
  timestampDetected?: string;
  screenshotQuality: ScreenshotQuality;
  rawExtractedText?: string;
  matchStatus?: MatchStatus;
  scoreboardType?: ScoreboardType;
  season?: string;
  event?: string;
  matchDuration?: string;
  mapNumber?: number;
  detectedUI?: string;
  timeRemaining?: string;
  partial?: boolean;
  notes?: string;
  language?: string;
  debug?: DebugInfo;
}

export interface ScoreboardAnalysisResult {
  game?: GameVersion;
  mode: GameMode;
  map: string;
  teams: TeamScoreboardData[];
  metadata: ScoreboardMetadata;
}

export interface ScoreboardAnalysisError {
  error: string;
  details?: string;
}
