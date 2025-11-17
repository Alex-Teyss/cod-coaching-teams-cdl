# Améliorations du Prompt AI

Ce document contient des idées pour améliorer le prompt AI et la précision de l'analyse.

## Prompt actuel

Le prompt actuel (`app/api/screenshots/analyze/route.ts:11`) demande à l'IA d'extraire :
- Jeu, mode, carte
- Score des équipes
- Stats des joueurs
- Niveau de confiance

## Améliorations possibles

### 1. Détection contextuelle améliorée

**Problème** : L'IA peut confondre certains modes
**Solution** : Ajouter des indices visuels spécifiques

```
Indices visuels par mode :
- Hardpoint : Colonne "Time" (temps sur colline), icône de colline
- Search & Destroy : Colonnes "Plants" et "Defuses", icône bombe
- Control : Colonne "Captures", zones A/B/C visibles
```

### 2. Nettoyage OCR amélioré

**Ajouts au prompt** :
```
Corrections OCR communes :
- "O" (lettre) → "0" (chiffre) si c'est un nombre
- "l" (L minuscule) → "1" si c'est un nombre
- "I" (i majuscule) → "1" si c'est un nombre
- "S" → "5" dans les nombres
- "B" → "8" dans les nombres
- Espaces dans les nombres : "1 234" → "1234"
```

### 3. Validation des données

**Ajouts au prompt** :
```
Règles de validation :
- K/D ratio ne peut pas être négatif
- Kills, Deaths, Assists >= 0
- Damage doit être un nombre positif
- Hill Time au format MM:SS
- Un joueur ne peut pas avoir plus de 100 kills en mode normal
- Score d'équipe cohérent avec le mode (HP max 250, SnD max 6, Control max 3)
```

### 4. Détection du gagnant

**Ajout** :
```json
{
  "teams": [
    {
      "teamName": "Team A",
      "score": 250,
      "winner": true,  // NOUVEAU
      "players": [...]
    }
  ]
}
```

### 5. Extraction de métadonnées supplémentaires

**Ajouts possibles** :
```json
{
  "metadata": {
    "timestamp": "2024-01-15T14:30:00Z",
    "season": "CDL 2024",
    "event": "Major 1",
    "matchDuration": "12:34",
    "mapNumber": 1,  // Map 1 of 5
    "detectedUI": "MW3",  // Version du jeu détectée par l'UI
    "scoreboardType": "End of match"  // ou "Mid-game"
  }
}
```

### 6. Gestion des noms d'équipe

**Problème** : Les noms d'équipe peuvent être des logos
**Solution** :
```
Si le nom d'équipe n'est pas lisible :
- Utiliser "Team A" et "Team B"
- Ou "Équipe 1" et "Équipe 2"
- Indiquer dans metadata.notes : "Team names are logos, not text"
```

### 7. Multi-langue

**Ajout** :
```
Détecter la langue de l'interface :
- EN : English
- FR : Français
- ES : Español
- Etc.

Adapter la sortie en conséquence.
```

### 8. Détection des modes alternatifs

**Ajouts** :
```
Modes additionnels :
- Domination
- Team Deathmatch
- Kill Confirmed
- Etc.

Adapter les colonnes en fonction.
```

## Prompts de test

### Prompt pour debugging

Ajouter au prompt :
```
En cas de doute ou de difficulté de lecture :
1. Indique les zones problématiques
2. Mentionne pourquoi la confiance est basse
3. Suggère des améliorations pour le screenshot

Ajoute un champ debug :
{
  "debug": {
    "difficultAreas": ["Player names row 3", "Team B score"],
    "suggestions": "Screenshot is slightly blurred, recommend higher resolution"
  }
}
```

### Prompt pour plusieurs screenshots

Pour comparer plusieurs parties :
```
Analyse comparative de N screenshots :
- Extraire les stats de chaque match
- Calculer les moyennes par joueur
- Identifier les tendances
- Détecter les performances exceptionnelles
```

## Exemples de cas limites

### Cas 1 : Screenshot partiel
**Problème** : Seulement une équipe visible
**Solution** :
```json
{
  "teams": [
    {
      "teamName": "Team A",
      "score": 250,
      "visible": true,
      "players": [...]
    },
    {
      "teamName": "Unknown",
      "score": null,
      "visible": false,
      "players": []
    }
  ],
  "metadata": {
    "partial": true,
    "notes": "Only one team visible in screenshot"
  }
}
```

### Cas 2 : Screenshot de mi-match
**Solution** :
```json
{
  "metadata": {
    "matchStatus": "in-progress",
    "timeRemaining": "03:45"
  }
}
```

### Cas 3 : Screenshot avec overlay
**Problème** : UI de stream, overlay Twitch, etc.
**Solution** :
```
Ignorer les overlays visuels :
- Bannières Twitch
- Logos de chaîne
- Chat visible
- Etc.

Focus uniquement sur le scoreboard du jeu.
```

## Métriques de qualité

Pour mesurer la performance du prompt :

1. **Précision** : % de données correctement extraites
2. **Rappel** : % de données présentes et détectées
3. **Confiance moyenne** : Moyenne des scores de confiance
4. **Taux d'erreur** : % d'analyses nécessitant correction manuelle

## Tests A/B

Pour tester différentes versions du prompt :

```typescript
const PROMPT_VERSIONS = {
  v1: "Prompt actuel",
  v2: "Prompt avec validation renforcée",
  v3: "Prompt avec détection UI améliorée"
};

// Tester et comparer les résultats
```

## Feedback utilisateur

Ajouter un système de feedback :
```
- "Cette analyse est-elle correcte ?" ✅ / ❌
- "Quelles données sont incorrectes ?"
- Permettre la correction manuelle
- Utiliser le feedback pour améliorer le prompt
```

## Prompt modulaire

Structure le prompt en sections :
```typescript
const PROMPT = {
  role: "Tu es un expert...",
  task: "Extraire les données...",
  constraints: "Ne pas inventer...",
  format: "JSON structuré...",
  examples: "Voici des exemples...",
  edgeCases: "Cas particuliers..."
};
```

## Ressources

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Best Practices](https://ai.google.dev/docs/prompting_intro)
- [Anthropic Claude Prompting](https://docs.anthropic.com/claude/docs/prompt-engineering)

---

**Note** : Ces améliorations sont des suggestions. Testez-les une par une pour mesurer leur impact sur la précision.
