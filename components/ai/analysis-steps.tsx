"use client";

import { useState } from "react";
import { ChevronRight, BookOpen, ImageIcon } from "lucide-react";
import { AnalysisTutorial } from "./analysis-tutorial";
import { ScreenshotAnalyzer } from "./screenshot-analyzer";
import { Button } from "@/components/ui/button";

export function AnalysisSteps() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 1
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-sm font-semibold">
            1
          </div>
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">Tutoriel</span>
        </button>

        <ChevronRight className="h-5 w-5 text-muted-foreground" />

        <button
          onClick={() => setCurrentStep(2)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 2
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-sm font-semibold">
            2
          </div>
          <ImageIcon className="h-4 w-4" />
          <span className="font-medium">Analyser mon match</span>
        </button>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1 - Tutorial */}
        <div
          className={`space-y-6 ${
            currentStep === 1 ? "block animate-in fade-in duration-300" : "hidden"
          }`}
        >
          <AnalysisTutorial />

          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              size="lg"
              className="gap-2"
            >
              Passer à l&apos;analyse
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Step 2 - Analyzer */}
        <div
          className={`${
            currentStep === 2 ? "block animate-in fade-in duration-300" : "hidden"
          }`}
        >
          <ScreenshotAnalyzer />
        </div>
      </div>
    </div>
  );
}
