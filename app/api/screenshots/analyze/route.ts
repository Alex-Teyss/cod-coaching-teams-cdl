import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { saveMatchFromAnalysis } from "@/lib/services/match-service";
import { TeamScoreboardData, PlayerScoreboardData } from "@/lib/types/scoreboard";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `Tu es un agent spécialisé dans l'analyse d'images de scoreboards Call of Duty League.
Ton rôle est d'extraire, structurer et enrichir les données provenant d'un screenshot de fin de partie CDL, même si l'image n'est pas parfaitement nette ou si certaines informations sont partiellement visibles.

OBJECTIF :
À partir d'un screenshot fourni, tu dois détecter automatiquement :
- Le mode de jeu (Hardpoint, Search & Destroy, Control)
- La carte
- Le score final des équipes et l'équipe gagnante
- La liste complète des joueurs visibles
- Leurs statistiques : kills, deaths, assists, damage, captures, defuses, plants, hill time, temps sur zone, etc.
- L'équipe (Team A / Team B) et l'ordre d'affichage
- L'identification des colonnes même si leur position change selon les saisons ou les skins CDL
- Toute autre statistique contextuelle visible
- Métadonnées du match (statut, durée, événement si visible)

CONTRAINTE :
Ne fais aucune supposition. Ne génère que ce qui est visible sur le screenshot.
Si une donnée est incertaine, marque-la ainsi : "confidence": "low".

DÉTECTION CONTEXTUELLE PAR MODE :
Utilise ces indices visuels pour identifier le mode de jeu :
- Hardpoint : Colonne "Hill Time" (temps sur colline MM:SS), icône de colline, score max 250
- Search & Destroy : Colonnes "Plants" et "Defuses", icône bombe, score max 6
- Control : Colonne "Captures", zones A/B/C visibles, score max 3

CORRECTIONS OCR COMMUNES :
Applique ces corrections automatiquement aux valeurs numériques :
- "O" (lettre) → "0" (chiffre zéro) dans les nombres
- "l" (L minuscule) → "1" dans les nombres
- "I" (i majuscule) → "1" dans les nombres
- "S" → "5" dans les nombres (si contexte approprié)
- "B" → "8" dans les nombres (si contexte approprié)
- Espaces dans les nombres : "1 234" → "1234"
- "." vs "," dans les nombres décimaux

RÈGLES DE VALIDATION :
Vérifie la cohérence des données extraites :
- K/D ratio ne peut pas être négatif
- Kills, Deaths, Assists doivent être >= 0
- Damage doit être un nombre positif (ou 0)
- Hill Time au format MM:SS (ex: "02:34")
- Un joueur ne peut pas avoir plus de 100 kills en mode normal CDL
- Scores d'équipe cohérents : HP max 250, SnD max 6, Control max 3
- Le total des joueurs par équipe ne peut pas dépasser 4 en CDL

GESTION DES CAS PARTICULIERS :
1. Noms d'équipe illisibles (logos uniquement) :
   - Utilise "Équipe 1" et "Équipe 2"
   - IMPORTANT: Le champ teamName est OBLIGATOIRE et ne doit JAMAIS être vide ou null
   - Note dans metadata.notes : "Team names are logos, not text"

2. Screenshot partiel (une seule équipe visible) :
   - Marque visible: true pour l'équipe visible
   - Marque visible: false pour l'équipe manquante
   - Note dans metadata.partial: true

3. Screenshot de mi-match :
   - metadata.matchStatus: "in-progress"
   - metadata.scoreboardType: "mid-game"
   - metadata.timeRemaining: "MM:SS" si visible

4. Screenshots avec overlays (Twitch, YouTube, etc.) :
   - Ignore les overlays visuels (bannières, chat, logos)
   - Focus uniquement sur le scoreboard du jeu

FORMAT DE SORTIE :
Retourne toujours un JSON strictement au format suivant :

{
  "mode": "Hardpoint | Search & Destroy | Control",
  "map": "nom de la carte",
  "teams": [
    {
      "teamName": "Nom détecté ou Équipe 1",
      "score": 250,
      "winner": true,
      "visible": true,
      "players": [
        {
          "name": "Nom du joueur",
          "kills": 25,
          "deaths": 18,
          "assists": 12,
          "damage": 4350,
          "hillTime": "02:34",
          "captures": 5,
          "defuses": 2,
          "plants": 1,
          "ratio": 1.39,
          "confidence": "high"
        }
      ]
    },
    {
      "teamName": "Nom détecté ou Équipe 2",
      "score": 180,
      "winner": false,
      "visible": true,
      "players": [...]
    }
  ],
  "metadata": {
    "timestampDetected": "2024-01-15T14:30:00Z",
    "screenshotQuality": "good | medium | poor",
    "matchStatus": "completed | in-progress",
    "scoreboardType": "end-of-match | mid-game",
    "season": "CDL 2024",
    "event": "Major 1",
    "matchDuration": "12:34",
    "mapNumber": 1,
    "detectedUI": "Black Ops 7",
    "timeRemaining": "03:45",
    "partial": false,
    "notes": "Informations supplémentaires si nécessaire",
    "language": "EN | FR | ES",
    "rawExtractedText": "Texte brut extrait",
    "debug": {
      "difficultAreas": ["Player names row 3", "Team B score"],
      "suggestions": "Screenshot is slightly blurred, recommend higher resolution",
      "ocrCorrections": ["Changed 'O' to '0' in score", "Changed 'l' to '1' in kills"]
    }
  }
}

INSTRUCTIONS :
1. Analyse d'abord la structure visuelle du scoreboard avant de détecter les valeurs.
2. Utilise les indices visuels (colonnes, icônes, UI) pour déduire automatiquement le mode de jeu.
3. Identifie la carte grâce aux visuels de fond, aux textures, ou au texte si présent.
4. Applique les corrections OCR communes automatiquement.
5. Valide la cohérence des données selon les règles de validation.
6. Calcule les valeurs dérivées (ex : K/D) uniquement si tu possèdes K et D.
7. Détermine l'équipe gagnante en comparant les scores (score le plus élevé).
8. Enrichis les métadonnées avec toutes les informations contextuelles visibles.
9. En cas de doute, remplis le champ debug avec les zones problématiques et suggestions.
10. Ne renvoie rien d'autre que le JSON final. Pas d'explications, pas de texte autour.
11. Si un joueur occupe plusieurs lignes ou est partiellement coupé, regroupe intelligemment les informations.
12. Ne détecte PAS le jeu (Black Ops, Modern Warfare, etc.), concentre-toi uniquement sur les données du scoreboard.

Ton analyse doit être résiliente, efficace et cohérente.`;

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Check if user is a coach
    if (session.user.role !== "COACH") {
      return NextResponse.json(
        { error: "Accès réservé aux coaches" },
        { status: 403 }
      );
    }

    // Get image and save option from request
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const saveToDatabase = formData.get("saveToDatabase") === "true";

    if (!image) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Analyze image with OpenAI GPT-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: ANALYSIS_PROMPT,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content;

    if (!text) {
      return NextResponse.json(
        { error: "Aucune réponse de l'IA" },
        { status: 500 }
      );
    }

    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    // Parse JSON
    const analysisResult = JSON.parse(jsonText);

    // Post-process: Calculate K/D ratio for each player if missing
    if (analysisResult.teams) {
      analysisResult.teams.forEach((team: TeamScoreboardData) => {
        if (team.players) {
          team.players.forEach((player: PlayerScoreboardData) => {
            // Calculate ratio if it's missing or undefined
            if (player.ratio === undefined || player.ratio === null || isNaN(player.ratio)) {
              const kills = Number(player.kills) || 0;
              const deaths = Number(player.deaths) || 0;
              // Calculate K/D ratio, avoiding division by zero
              player.ratio = deaths > 0 ? kills / deaths : kills;
            }
          });
        }
      });
    }

    // Save match to database if user has a team AND wants to save
    if (saveToDatabase) {
      // Get user's team (either as player via teamId or as coach via coachedTeams)
      let userTeamId = session.user.teamId;

      if (!userTeamId && session.user.role === "COACH") {
        // For coaches, check if they have any coached teams
        const { prisma } = await import("@/lib/prisma");
        const coach = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { coachedTeams: { take: 1 } },
        });

        if (coach?.coachedTeams.length) {
          userTeamId = coach.coachedTeams[0].id;

          // Update user's teamId for future requests
          await prisma.user.update({
            where: { id: session.user.id },
            data: { teamId: userTeamId },
          });
        }
      }

      if (!userTeamId) {
        console.log("Cannot save: user has no team");
        return NextResponse.json({
          ...analysisResult,
          saved: false,
          saveError: "Vous devez créer une équipe avant de pouvoir sauvegarder des matchs. Rendez-vous sur la page 'Créer une équipe'.",
        });
      }

      try {
        const match = await saveMatchFromAnalysis({
          teamId: userTeamId,
          analysisResult,
          uploadedBy: session.user.id,
        });

        // Add match ID and saved status to response
        return NextResponse.json({
          ...analysisResult,
          matchId: match.id,
          saved: true,
        });
      } catch (saveError) {
        console.error("Error saving match to database:", saveError);
        // Return analysis result even if save fails
        return NextResponse.json({
          ...analysisResult,
          saved: false,
          saveError: saveError instanceof Error ? saveError.message : "Le match n'a pas pu être sauvegardé en base de données",
        });
      }
    }

    return NextResponse.json({
      ...analysisResult,
      saved: false,
    });
  } catch (error) {
    console.error("Error analyzing screenshot:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'analyse",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
