"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle, Database, Info, ImageIcon, Sparkles, Save } from "lucide-react";
import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";
import { AnalysisResults } from "./analysis-results";

interface AnalysisResponse extends ScoreboardAnalysisResult {
  matchId?: string;
  saved?: boolean;
  saveError?: string;
}

export function ScreenshotAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async (saveToDb = false) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("saveToDatabase", saveToDb.toString());

      const response = await fetch("/api/screenshots/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'analyse");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMatch = async () => {
    console.log("🔍 [SAVE] Starting save process...");
    console.log("🔍 [SAVE] result:", result);
    console.log("🔍 [SAVE] result.saved:", result?.saved);
    console.log("🔍 [SAVE] file:", file);

    if (!result || result.saved || !file) {
      console.error("❌ [SAVE] Cannot save - Missing requirements");
      if (!file) {
        setError("Le fichier n'est plus disponible. Veuillez réanalyser le screenshot.");
      }
      return;
    }

    console.log("✅ [SAVE] All checks passed, starting save...");
    setSaving(true);
    setError(null);

    try {
      console.log("📤 [SAVE] Creating FormData...");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("saveToDatabase", "true");
      console.log("📤 [SAVE] FormData created, file size:", file.size);

      console.log("📤 [SAVE] Sending request to /api/screenshots/analyze...");
      const response = await fetch("/api/screenshots/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("📥 [SAVE] Response received, status:", response.status);

      if (!response.ok) {
        console.error("❌ [SAVE] Response not OK");
        const errorData = await response.json();
        console.error("❌ [SAVE] Error data:", errorData);
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      const data = await response.json();
      console.log("✅ [SAVE] Save successful! Data:", data);
      setResult(data);
    } catch (err) {
      console.error("❌ [SAVE] Exception caught:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la sauvegarde");
    } finally {
      console.log("🏁 [SAVE] Save process finished");
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="screenshot-upload"
              className="block text-sm font-medium mb-2"
            >
              Screenshot de scoreboard
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="screenshot-upload"
                className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Upload className="h-4 w-4" />
                Choisir un fichier
              </label>
              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
            </div>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-lg border"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAnalyze(false)}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Analyser
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive">
                Erreur d&apos;analyse
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Status and Button */}
      {result && result.saved !== undefined && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Database
                className={`h-5 w-5 mt-0.5 ${
                  result.saved
                    ? "text-green-600 dark:text-green-500"
                    : result.saveError
                      ? "text-yellow-600 dark:text-yellow-500"
                      : "text-muted-foreground"
                }`}
              />
              <div>
                {result.saved ? (
                  <>
                    <h3 className="font-medium text-green-800 dark:text-green-300">
                      Match sauvegardé
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Le match a été sauvegardé en base de données avec succès.
                      {result.matchId && (
                        <span className="block mt-1 font-mono text-xs">
                          ID: {result.matchId}
                        </span>
                      )}
                    </p>
                  </>
                ) : result.saveError ? (
                  <>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                      Erreur de sauvegarde
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      {result.saveError}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-medium">Statut de sauvegarde</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le match n&apos;est pas encore sauvegardé en base de données.
                    </p>
                  </>
                )}
              </div>
            </div>

            {!result.saved && (
              <button
                onClick={handleSaveMatch}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4" />
                    Sauvegarder le match
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && <AnalysisResults result={result} />}
    </div>
  );
}
