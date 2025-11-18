import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ScreenshotAnalyzer } from "@/components/ai/screenshot-analyzer";
import { AnalysisTutorial } from "@/components/ai/analysis-tutorial";

export default async function AIAnalysisPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "COACH") {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Analyse IA de Scoreboards
        </h2>
        <p className="text-muted-foreground">
          Uploadez un screenshot de scoreboard COD pour en extraire automatiquement les statistiques
        </p>
      </div>

      <AnalysisTutorial />

      <ScreenshotAnalyzer />
    </div>
  );
}
