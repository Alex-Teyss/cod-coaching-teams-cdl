"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ScoreboardAnalysisResult } from "@/lib/types/scoreboard";
import { AnalysisResults } from "./analysis-results";

export function ScreenshotAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreboardAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

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
                  onClick={handleAnalyze}
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
                      Analyser le screenshot
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

      {/* Results Display */}
      {result && <AnalysisResults result={result} />}
    </div>
  );
}
