"use client";

import { ImageIcon, Sparkles, Save, Info } from "lucide-react";

export function AnalysisTutorial() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start gap-3 mb-6">
        <Info className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold">Comment ça fonctionne ?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analysez vos screenshots de scoreboards Call of Duty avec l&apos;IA
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              1
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Choisissez votre screenshot</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Uploadez un screenshot de fin de partie ou de scoreboard en jeu. Les formats supportés :
              <span className="font-medium"> PNG, JPG, JPEG</span>. Plus l&apos;image est nette, meilleure sera l&apos;analyse.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-xs text-muted-foreground">
                <strong>Astuce :</strong> Prenez vos screenshots en plein écran pour une meilleure qualité d&apos;extraction.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              2
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Analysez avec l&apos;IA</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Cliquez sur <strong>&quot;Analyser&quot;</strong> pour lancer l&apos;analyse IA.
              L&apos;intelligence artificielle va extraire automatiquement :
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Informations du match :</strong> Jeu, mode, carte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Scores des équipes :</strong> Votre équipe vs adversaires</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Statistiques des joueurs :</strong> Kills, deaths, assists, damage, temps sur colline, captures, etc.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong>Métadonnées :</strong> Saison, événement, durée du match (si visible)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              3
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Save className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Sauvegardez le match (optionnel)</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Une fois l&apos;analyse terminée, vous pouvez consulter les résultats et décider de sauvegarder
              ou non le match en base de données. Cliquez sur <strong>&quot;Sauvegarder le match&quot;</strong> pour
              conserver les statistiques dans votre historique.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Note :</strong> Les matchs sauvegardés sont accessibles dans <strong>&quot;Mes matchs&quot;</strong> pour
                suivre vos performances au fil du temps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Games */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold mb-3">Jeux et modes supportés</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium mb-1">Jeux</p>
            <p className="text-xs text-muted-foreground">
              Black Ops 7, Black Ops 6, Modern Warfare 3, Modern Warfare 2
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-sm font-medium mb-1">Modes</p>
            <p className="text-xs text-muted-foreground">
              Hardpoint, Search & Destroy, Control, Domination, Team Deathmatch, Kill Confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
