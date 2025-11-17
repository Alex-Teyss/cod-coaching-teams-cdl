# Composants d'Analyse IA

Ce dossier contient les composants React pour l'analyse de screenshots COD par IA.

## Composants

### `screenshot-analyzer.tsx`

Composant principal d'upload et d'analyse de screenshots.

**Fonctionnalités** :
- Upload de fichier image
- Prévisualisation de l'image
- Envoi à l'API d'analyse
- Gestion des états (loading, error, success)
- Affichage des résultats

**Props** : Aucune

**Usage** :
```tsx
import { ScreenshotAnalyzer } from "@/components/ai/screenshot-analyzer";

export default function Page() {
  return <ScreenshotAnalyzer />;
}
```

### `analysis-results.tsx`

Composant d'affichage des résultats d'analyse.

**Fonctionnalités** :
- Affichage des informations du match (jeu, mode, carte)
- Tableaux de statistiques par équipe
- Colonnes dynamiques selon le mode de jeu
- Badges de confiance colorés
- Section debug avec texte brut extrait

**Props** :
```tsx
interface AnalysisResultsProps {
  result: ScoreboardAnalysisResult;
}
```

**Usage** :
```tsx
import { AnalysisResults } from "@/components/ai/analysis-results";

<AnalysisResults result={analysisData} />
```

## Types

Les types sont définis dans `lib/types/scoreboard.ts` :

```typescript
ScoreboardAnalysisResult
├── game: GameVersion
├── mode: GameMode
├── map: string
├── teams: TeamScoreboardData[]
│   ├── teamName: string
│   ├── score: number
│   └── players: PlayerScoreboardData[]
│       ├── name: string
│       ├── kills: number
│       ├── deaths: number
│       ├── assists: number
│       ├── damage?: number
│       ├── hillTime?: string
│       ├── captures?: number
│       ├── defuses?: number
│       ├── plants?: number
│       ├── kdRatio: number
│       └── confidence: ConfidenceLevel
└── metadata: ScoreboardMetadata
    ├── timestampDetected?: string
    ├── screenshotQuality: ScreenshotQuality
    └── rawExtractedText?: string
```

## États

### ScreenshotAnalyzer

- `file: File | null` - Fichier uploadé
- `preview: string | null` - URL de prévisualisation
- `loading: boolean` - État de chargement
- `result: ScoreboardAnalysisResult | null` - Résultats de l'analyse
- `error: string | null` - Message d'erreur

## API

L'analyse est effectuée via :

```typescript
POST /api/screenshots/analyze
Content-Type: multipart/form-data

{
  image: File
}
```

**Réponse** :
```json
{
  "game": "Modern Warfare 3",
  "mode": "Hardpoint",
  "map": "Karachi",
  "teams": [...],
  "metadata": {...}
}
```

## Styling

Les composants utilisent :
- Tailwind CSS v4
- Classes utilitaires shadcn/ui
- Icônes Lucide React
- Système de design du projet

## Améliorations futures

- [ ] Drag & drop pour l'upload
- [ ] Multi-upload (batch processing)
- [ ] Croppage d'image avant analyse
- [ ] Sauvegarde des analyses en base
- [ ] Export CSV/JSON
- [ ] Édition manuelle des résultats
- [ ] Historique des analyses
