import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const ANALYSIS_PROMPT = `Tu es un agent spécialisé dans l'analyse d'images de scoreboards Call of Duty League.
Ton rôle est d'extraire, structurer et enrichir les données provenant d'un screenshot de fin de partie CDL, même si l'image n'est pas parfaitement nette ou si certaines informations sont partiellement visibles.

OBJECTIF :
À partir d'un screenshot fourni, tu dois détecter automatiquement :
- Le jeu (Modern Warfare 3, MW2, ou Black Ops 6 selon UI)
- Le mode de jeu (Hardpoint, Search & Destroy, Control)
- La carte
- Le score final des équipes
- La liste complète des joueurs visibles
- Leurs statistiques : kills, deaths, assists, damage, captures, defuses, plants, hill time, temps sur zone, etc.
- L'équipe (Team A / Team B) et l'ordre d'affichage
- L'identification des colonnes même si leur position change selon les saisons ou les skins CDL
- Toute autre statistique contextuelle visible

CONTRAINTE :
Ne fais aucune supposition. Ne génère que ce qui est visible sur le screenshot.
Si une donnée est incertaine, marque-la ainsi : "confidence": "low".

FORMAT DE SORTIE :
Retourne toujours un JSON strictement au format suivant :

{
  "game": "Modern Warfare 3 | Modern Warfare 2 | Black Ops 6 | Black Ops 7",
  "mode": "Hardpoint | Search & Destroy | Control",
  "map": "nom de la carte",
  "teams": [
    {
      "teamName": "Team A ou nom détecté",
      "score": 0,
      "players": [
        {
          "name": "nom du joueur",
          "kills": 0,
          "deaths": 0,
          "assists": 0,
          "damage": 0,
          "hillTime": "00:00",
          "captures": 0,
          "defuses": 0,
          "plants": 0,
          "ratio": 0.0,
          "confidence": "high | medium | low"
        }
      ]
    }
  ],
  "metadata": {
    "timestampDetected": "",
    "screenshotQuality": "good | medium | poor",
    "rawExtractedText": ""
  }
}

INSTRUCTIONS :
1. Analyse d'abord la structure visuelle du scoreboard avant de détecter les valeurs.
2. Déduis automatiquement le mode grâce à la disposition des colonnes (ex : présence de "Damage" = Hardpoint/Control).
3. Identifie la carte grâce aux visuels de fond, aux textures, ou au texte si présent.
4. Nettoie les valeurs OCR (ex : "1O" devient "10", "l" devient "1", etc.).
5. Calcule les valeurs dérivées (ex : K/D) uniquement si tu possèdes K et D.
6. Ne renvoie rien d'autre que le JSON final. Pas d'explications, pas de texte autour.
7. Si un joueur occupe plusieurs lignes ou est partiellement coupé, regroupe intelligemment les informations.

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

    // Get image from request
    const formData = await req.formData();
    const image = formData.get("image") as File;

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

    // Analyze image with Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: image.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;

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

    return NextResponse.json(analysisResult);
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
