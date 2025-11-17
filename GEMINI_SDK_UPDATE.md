# Migration vers @google/genai

## ✅ Migration effectuée

Le projet a été migré de `@google/generative-ai` vers `@google/genai` (le nouveau SDK officiel).

## Changements effectués

### 1. Installation du nouveau package

```bash
pnpm remove @google/generative-ai
pnpm add @google/genai
```

### 2. Mise à jour du code

#### Avant (ancien SDK)

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const result = await model.generateContent([
  "prompt text",
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image,
    },
  },
]);

const response = result.response;
const text = response.text();
```

#### Après (nouveau SDK)

```typescript
import { GoogleGenAI } from "@google/genai";

// Le client récupère automatiquement la clé depuis GEMINI_API_KEY
const ai = new GoogleGenAI({});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [
        { text: "prompt text" },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ],
    },
  ],
});

const text = response.text; // Propriété directe, pas de fonction
```

## Avantages du nouveau SDK

1. **Plus simple** : API plus intuitive
2. **Auto-configuration** : Récupère automatiquement `GEMINI_API_KEY`
3. **Meilleure TypeScript** : Types plus précis
4. **Modèles à jour** : Support natif de `gemini-2.5-flash`

## Modèle utilisé

Le projet utilise maintenant **`gemini-2.5-flash`** qui est :
- ✅ Gratuit
- ✅ Le plus récent et performant
- ✅ Compatible avec le nouveau SDK

## Fichiers modifiés

- `app/api/screenshots/analyze/route.ts` - API d'analyse
- `scripts/list-gemini-models.ts` - Script de test
- `package.json` - Dépendances

## Variables d'environnement

Aucun changement, toujours :

```bash
GEMINI_API_KEY="AIzaSy..."
```

## Tests

Tout fonctionne correctement ✅
- Build réussi
- TypeScript sans erreurs
- Tests du modèle passés

## Documentation

Voir :
- `GEMINI_SETUP.md` - Guide de configuration
- `QUICK_START_AI.md` - Démarrage rapide
